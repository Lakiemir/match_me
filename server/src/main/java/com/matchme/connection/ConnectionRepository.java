package com.matchme.connection;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// Gives database access to accepted connections
public interface ConnectionRepository extends JpaRepository<Connection, ConnectionId> {

    boolean existsByIdUserAIdAndIdUserBId(Long userAId, Long userBId);

    List<Connection> findByIdUserAIdOrIdUserBIdOrderByCreatedAtDesc(Long userAId, Long userBId);

    void deleteByIdUserAIdAndIdUserBId(Long userAId, Long userBId);
}
