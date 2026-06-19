package com.prod.ploy.service;

import com.prod.ploy.dto.ConsoleOrderDetail;
import com.prod.ploy.dto.ConsoleOrderListItem;
import com.prod.ploy.model.Order;
import com.prod.ploy.repository.OrderRepository;
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
public class ConsoleOrderService {

    private final OrderRepository orderRepository;

    public Page<ConsoleOrderListItem> listOrders(int page, int size, String statusStr, String q) {
        Order.OrderStatus status = null;
        if (statusStr != null && !statusStr.isBlank()) {
            try { status = Order.OrderStatus.valueOf(statusStr.toUpperCase()); }
            catch (IllegalArgumentException ignored) {}
        }

        String search = (q != null && !q.isBlank()) ? q.trim() : null;
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        return orderRepository.searchOrders(status, search, pageable)
                              .map(ConsoleOrderListItem::from);
    }

    @Transactional(readOnly = true)
    public ConsoleOrderDetail getOrder(Long id) {
        Order o = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "주문을 찾을 수 없습니다."));
        return ConsoleOrderDetail.from(o);
    }
}
