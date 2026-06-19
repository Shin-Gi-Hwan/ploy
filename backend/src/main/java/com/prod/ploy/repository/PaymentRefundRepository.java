package com.prod.ploy.repository;

import com.prod.ploy.model.PaymentRefund;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRefundRepository extends JpaRepository<PaymentRefund, Long> {
    List<PaymentRefund> findByPaymentId(Long paymentId);
}
