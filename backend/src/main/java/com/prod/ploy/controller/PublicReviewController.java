package com.prod.ploy.controller;

import com.prod.ploy.dto.ProductReviewDto;
import com.prod.ploy.dto.ReviewRequest;
import com.prod.ploy.model.Member;
import com.prod.ploy.model.Order;
import com.prod.ploy.model.Review;
import com.prod.ploy.repository.MemberRepository;
import com.prod.ploy.repository.OrderRepository;
import com.prod.ploy.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews/products")
@RequiredArgsConstructor
public class PublicReviewController {

    private final ReviewRepository    reviewRepository;
    private final OrderRepository     orderRepository;
    private final MemberRepository    memberRepository;

    private static final List<Order.OrderStatus> PAID_STATUSES = List.of(
            Order.OrderStatus.PAID,
            Order.OrderStatus.PREPARING,
            Order.OrderStatus.SHIPPED,
            Order.OrderStatus.DELIVERED
    );

    /** Public: list visible reviews for a product */
    @GetMapping("/{productId}")
    public ResponseEntity<Page<ProductReviewDto>> list(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(
                reviewRepository.findVisibleByProductId(productId, pageable)
                        .map(ProductReviewDto::from));
    }

    /** Auth: can current user review this product? */
    @GetMapping("/{productId}/can-review")
    public ResponseEntity<Map<String, Boolean>> canReview(
            @PathVariable Long productId,
            @AuthenticationPrincipal Member member) {
        if (member == null) return ResponseEntity.ok(Map.of("canReview", false, "hasReviewed", false));
        boolean purchased  = orderRepository.hasPurchasedProduct(member.getId(), productId, PAID_STATUSES);
        boolean hasReviewed = reviewRepository.existsByMemberIdAndProductId(member.getId(), productId);
        return ResponseEntity.ok(Map.of("canReview", purchased && !hasReviewed, "hasReviewed", hasReviewed));
    }

    /** Auth + purchase gate: submit a review */
    @PostMapping("/{productId}")
    public ResponseEntity<ProductReviewDto> create(
            @PathVariable Long productId,
            @RequestBody ReviewRequest req,
            @AuthenticationPrincipal Member member) {

        if (member == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);

        boolean purchased = orderRepository.hasPurchasedProduct(member.getId(), productId, PAID_STATUSES);
        if (!purchased)
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "구매한 상품에만 리뷰를 작성할 수 있습니다.");

        if (reviewRepository.existsByMemberIdAndProductId(member.getId(), productId))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 리뷰를 작성하셨습니다.");

        if (req.rating() < 1 || req.rating() > 5)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "별점은 1~5 사이여야 합니다.");

        Review review = new Review();
        review.setMember(member);
        review.setProductId(productId);
        review.setRating(req.rating());
        review.setContent(req.content());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ProductReviewDto.from(reviewRepository.save(review)));
    }
}
