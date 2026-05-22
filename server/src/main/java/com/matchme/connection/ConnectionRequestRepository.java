package com.matchme.connection;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

// Gives database access to connection requests.
public interface ConnectionRequestRepository
        extends JpaRepository<ConnectionRequest, ConnectionRequestId> {

    boolean existsByIdRequesterUserIdAndIdReceiverUserIdAndStatus(
            Long requesterUserId,
            Long receiverUserId,
            String status
    );

    Optional<ConnectionRequest> findByIdRequesterUserIdAndIdReceiverUserId(
            Long requesterUserId,
            Long receiverUserId
    );

    List<ConnectionRequest> findByIdReceiverUserIdAndStatusOrderByCreatedAtDesc(
            Long receiverUserId,
            String status
    );
}
