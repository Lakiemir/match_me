package com.matchme.connection;

import com.matchme.auth.UserRepository;
import com.matchme.privacy.ProfileAccessService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

// Handles sending, accepting, rejecting, listing, and removing connections
@Service
public class ConnectionService {

    private final UserRepository userRepository;
    private final ConnectionRequestRepository connectionRequestRepository;
    private final ConnectionRepository connectionRepository;
    private final ProfileAccessService profileAccessService;

    public ConnectionService(
            UserRepository userRepository,
            ConnectionRequestRepository connectionRequestRepository,
            ConnectionRepository connectionRepository,
            ProfileAccessService profileAccessService
    ) {
        this.userRepository = userRepository;
        this.connectionRequestRepository = connectionRequestRepository;
        this.connectionRepository = connectionRepository;
        this.profileAccessService = profileAccessService;
    }

    @Transactional
    public ConnectionRequestResponse sendRequest(Long senderUserId, Long receiverUserId) {
        if (senderUserId.equals(receiverUserId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot connect with yourself");
        }

        if (!userRepository.existsById(receiverUserId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        if (!profileAccessService.canViewProfile(senderUserId, receiverUserId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        if (areConnected(senderUserId, receiverUserId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Users are already connected");
        }

        if (hasPendingRequestBetweenUsers(senderUserId, receiverUserId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Connection request already exists");
        }

        ConnectionRequest request = connectionRequestRepository
                .findByIdRequesterUserIdAndIdReceiverUserId(senderUserId, receiverUserId)
                .orElseGet(() -> new ConnectionRequest(senderUserId, receiverUserId));

        // Reopens a rejected request without creating a duplicate row.
        request.markPending();

        return toResponse(connectionRequestRepository.save(request));
    }

    @Transactional(readOnly = true)
    public List<ConnectionRequestResponse> getIncomingRequests(Long receiverUserId) {
        return connectionRequestRepository
                .findByIdReceiverUserIdAndStatusOrderByCreatedAtDesc(
                        receiverUserId,
                        ConnectionRequest.STATUS_PENDING
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ConnectionIdResponse> getConnections(Long userId) {
        return connectionRepository
                .findByIdUserAIdOrIdUserBIdOrderByCreatedAtDesc(userId, userId)
                .stream()
                .map(connection -> new ConnectionIdResponse(getOtherUserId(connection, userId)))
                .toList();
    }

    @Transactional
    public ConnectionRequestResponse acceptRequest(Long receiverUserId, Long senderUserId) {
        ConnectionRequest request = getPendingIncomingRequest(receiverUserId, senderUserId);

        request.accept();

        if (!areConnected(receiverUserId, senderUserId)) {
            connectionRepository.save(new Connection(receiverUserId, senderUserId));
        }

        return toResponse(connectionRequestRepository.save(request));
    }

    @Transactional
    public ConnectionRequestResponse rejectRequest(Long receiverUserId, Long senderUserId) {
        ConnectionRequest request = getPendingIncomingRequest(receiverUserId, senderUserId);

        request.reject();

        return toResponse(connectionRequestRepository.save(request));
    }

    @Transactional
    public void disconnect(Long currentUserId, Long otherUserId) {
        if (currentUserId.equals(otherUserId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot disconnect from yourself");
        }

        Long userAId = Math.min(currentUserId, otherUserId);
        Long userBId = Math.max(currentUserId, otherUserId);

        if (!connectionRepository.existsByIdUserAIdAndIdUserBId(userAId, userBId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Connection not found");
        }

        connectionRepository.deleteByIdUserAIdAndIdUserBId(userAId, userBId);
    }

    private ConnectionRequest getPendingIncomingRequest(Long receiverUserId, Long senderUserId) {
        return connectionRequestRepository
                .findByIdRequesterUserIdAndIdReceiverUserId(senderUserId, receiverUserId)
                .filter(request -> request.getStatus().equals(ConnectionRequest.STATUS_PENDING))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Connection request not found"));
    }

    private boolean hasPendingRequestBetweenUsers(Long firstUserId, Long secondUserId) {
        return connectionRequestRepository.existsByIdRequesterUserIdAndIdReceiverUserIdAndStatus(
                firstUserId,
                secondUserId,
                ConnectionRequest.STATUS_PENDING
        ) || connectionRequestRepository.existsByIdRequesterUserIdAndIdReceiverUserIdAndStatus(
                secondUserId,
                firstUserId,
                ConnectionRequest.STATUS_PENDING
        );
    }

    private boolean areConnected(Long firstUserId, Long secondUserId) {
        Long userAId = Math.min(firstUserId, secondUserId);
        Long userBId = Math.max(firstUserId, secondUserId);

        return connectionRepository.existsByIdUserAIdAndIdUserBId(userAId, userBId);
    }

    private Long getOtherUserId(Connection connection, Long currentUserId) {
        if (connection.getId().getUserAId().equals(currentUserId)) {
            return connection.getId().getUserBId();
        }

        return connection.getId().getUserAId();
    }

    private ConnectionRequestResponse toResponse(ConnectionRequest request) {
        return new ConnectionRequestResponse(
                request.getId().getRequesterUserId(),
                request.getId().getReceiverUserId(),
                request.getStatus(),
                request.getCreatedAt()
        );
    }
}
