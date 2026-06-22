package com.prod.ploy.repository;

import com.prod.ploy.model.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    Page<ChatMessage> findByChatRoomIdOrderByCreatedAtAsc(Long roomId, Pageable pageable);

    /** Batch-counts messages per room — avoids N+1 when listing chat rooms */
    @Query("SELECT msg.chatRoom.id, COUNT(msg) FROM ChatMessage msg WHERE msg.chatRoom.id IN :roomIds GROUP BY msg.chatRoom.id")
    List<Object[]> countByRoomIds(@Param("roomIds") List<Long> roomIds);
}
