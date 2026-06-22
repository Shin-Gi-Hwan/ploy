package com.prod.ploy.service;

import com.prod.ploy.dto.ConsoleReviewListItem;
import com.prod.ploy.model.Review;
import com.prod.ploy.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ConsoleReviewService {

    private final ReviewRepository reviewRepository;

    @Transactional(readOnly = true)
    public Page<ConsoleReviewListItem> listReviews(int page, int size, String visibleStr, String q) {
        Boolean visible = null;
        if ("true".equalsIgnoreCase(visibleStr)) visible = true;
        else if ("false".equalsIgnoreCase(visibleStr)) visible = false;
        String search = (q != null && !q.isBlank()) ? q.trim() : null;
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return reviewRepository.searchReviews(visible, search, pageable).map(ConsoleReviewListItem::from);
    }

    @Transactional
    public ConsoleReviewListItem updateVisibility(Long id, Boolean visible) {
        Review r = findById(id);
        r.setVisible(visible);
        return ConsoleReviewListItem.from(reviewRepository.save(r));
    }

    @Transactional
    public void delete(Long id) {
        Review r = findById(id);
        r.setDeleted(true);
        r.setVisible(false);
        reviewRepository.save(r);
    }

    private Review findById(Long id) {
        return reviewRepository.findById(id)
                .filter(r -> !r.getDeleted())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "리뷰를 찾을 수 없습니다."));
    }
}
