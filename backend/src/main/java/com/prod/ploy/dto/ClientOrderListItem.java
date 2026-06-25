package com.prod.ploy.dto;

import com.prod.ploy.model.Order;
import com.prod.ploy.model.OrderItem;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record ClientOrderListItem(
        Long id,
        String orderNo,
        String orderType,
        String status,
        BigDecimal totalPaymentAmount,
        LocalDateTime createdAt,
        List<ItemView> items
) {
    public record ItemView(Long productId, String productName, Integer quantity, BigDecimal unitPrice) {}

    public static ClientOrderListItem from(Order o) {
        List<ItemView> items = o.getItems().stream()
                .map(i -> new ItemView(i.getProductId(), i.getItemName(), i.getQuantity(), i.getUnitPrice()))
                .toList();
        return new ClientOrderListItem(
                o.getId(), o.getOrderNo(),
                o.getOrderType().name(), o.getStatus().name(),
                o.getTotalPaymentAmount(), o.getCreatedAt(), items
        );
    }
}
