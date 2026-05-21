package com.matchme.connection;

import org.springframework.data.jpa.repository.JpaRepository;

// Gives database access to accepted connections.
public interface ConnectionRepository extends JpaRepository<Connection, ConnectionId> {

    boolean existsByIdUserAIdAndIdUserBId(Long userAId, Long userBId);
}
