package com.prod.ploy.dto;

import com.prod.ploy.model.Order;
import com.prod.ploy.model.OrderItem;
import com.prod.ploy.model.Payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record ConsoleOrderDetail(
        Long id,
        String orderNo,
        String buyerName,
        String buyerEmail,
        String buyerPhone,
        boolean isGuest,
        String orderType,
        String status,
        BigDecimal totalProductAmount,
        BigDecimal deliveryFee,
        BigDecimal discountAmount,
        BigDecimal totalPaymentAmount,
        String receiverName,
        String receiverPhone,
        String postalCode,
        String address1,
        String address2,
        String deliveryMemo,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<OrderItemDto> items,
        List<PaymentDto> payments
) {
    public record OrderItemDto(
            Long id, String itemName, String itemType,
            Integer quantity, BigDecimal unitPrice, BigDecimal totalPrice
    ) {
        public static OrderItemDto from(OrderItem i) {
            return new OrderItemDto(i.getId(), i.getItemName(), i.getItemType().name(),
                    i.getQuantity(), i.getUnitPrice(), i.getTotalPrice());
        }
    }

    public record PaymentDto(
            Long id, String provider, String method, String status,
            BigDecimal requestedAmount, BigDecimal approvedAmount, BigDecimal cancelledAmount,
            LocalDateTime approvedAt
    ) {
        public static PaymentDto from(Payment p) {
            return new PaymentDto(p.getId(),
                    p.getPaymentProvider().name(),
                    p.getMethod() != null ? p.getMethod().name() : null,
                    p.getStatus().name(),
                    p.getRequestedAmount(), p.getApprovedAmount(), p.getCancelledAmount(),
                    p.getApprovedAt());
        }
    }

    public static ConsoleOrderDetail from(Order o) {
        String name  = o.getMember() != null ? o.getMember().getName()  : o.getGuestName();
        String email = o.getMember() != null ? o.getMember().getEmail() : o.getGuestEmail();
        String phone = o.getMember() != null ? null : o.getGuestPhone();

        return new ConsoleOrderDetail(
                o.getId(), o.getOrderNo(), name, email, phone,
                o.getMember() == null,
                o.getOrderType().name(), o.getStatus().name(),
                o.getTotalProductAmount(), o.getDeliveryFee(),
                o.getDiscountAmount(), o.getTotalPaymentAmount(),
                o.getReceiverName(), o.getReceiverPhone(),
                o.getPostalCode(), o.getAddress1(), o.getAddress2(), o.getDeliveryMemo(),
                o.getCreatedAt(), o.getUpdatedAt(),
                o.getItems().stream().map(OrderItemDto::from).toList(),
                o.getPayments().stream().map(PaymentDto::from).toList()
        );
    }
}
