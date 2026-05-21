package com.matchme.connection;

import org.springframework.data.jpa.repository.JpaRepository;

// Gives database access to connection requests.
public interface ConnectionRequestRepository
        extends JpaRepository<ConnectionRequest, ConnectionRequestId> {

    boolean existsByIdRequesterUserIdAndIdReceiverUserIdAndStatus(
            Long requesterUserId,
            Long receiverUserId,
            String status
    );
}
