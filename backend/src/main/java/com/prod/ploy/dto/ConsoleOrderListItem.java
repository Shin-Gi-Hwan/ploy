package com.prod.ploy.dto;

import com.prod.ploy.model.Order;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ConsoleOrderListItem(
        Long id,
        String orderNo,
        String buyerName,    // member name or guest name
        String buyerEmail,   // member email or guest email
        String orderType,
        String status,
        BigDecimal totalPaymentAmount,
        LocalDateTime createdAt
) {
    public static ConsoleOrderListItem from(Order o) {
        String name  = o.getMember() != null ? o.getMember().getName()  : o.getGuestName();
        String email = o.getMember() != null ? o.getMember().getEmail() : o.getGuestEmail();
        return new ConsoleOrderListItem(
                o.getId(), o.getOrderNo(), name, email,
                o.getOrderType().name(), o.getStatus().name(),
                o.getTotalPaymentAmount(), o.getCreatedAt()
        );
    }
}
