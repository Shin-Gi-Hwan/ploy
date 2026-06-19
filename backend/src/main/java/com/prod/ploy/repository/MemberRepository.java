package com.prod.ploy.repository;

import com.prod.ploy.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmail(String email);
    boolean existsByEmail(String email);

    long countByRole(Member.UserRole role);
    long countByCreatedAtAfter(LocalDateTime dateTime);
    List<Member> findTop10ByOrderByCreatedAtDesc();
}
