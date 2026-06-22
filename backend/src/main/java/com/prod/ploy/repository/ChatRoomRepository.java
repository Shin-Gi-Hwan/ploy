package com.prod.ploy.repository;

import com.prod.ploy.model.ChatRoom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    Optional<ChatRoom> findByProjectId(Long projectId);

    @Query(
        value = """
            SELECT r FROM ChatRoom r
            LEFT JOIN r.project p
            LEFT JOIN p.member m
            LEFT JOIN p.client c
            WHERE (:q IS NULL
                   OR LOWER(p.title) LIKE LOWER(CONCAT('%',:q,'%'))
                   OR LOWER(m.name)  LIKE LOWER(CONCAT('%',:q,'%'))
                   OR LOWER(c.name)  LIKE LOWER(CONCAT('%',:q,'%')))
            ORDER BY r.createdAt DESC
        """,
        countQuery = """
            SELECT COUNT(r) FROM ChatRoom r
            LEFT JOIN r.project p
            LEFT JOIN p.member m
            LEFT JOIN p.client c
            WHERE (:q IS NULL
                   OR LOWER(p.title) LIKE LOWER(CONCAT('%',:q,'%'))
                   OR LOWER(m.name)  LIKE LOWER(CONCAT('%',:q,'%'))
                   OR LOWER(c.name)  LIKE LOWER(CONCAT('%',:q,'%')))
        """
    )
    Page<ChatRoom> searchRooms(@Param("q") String q, Pageable pageable);
}
