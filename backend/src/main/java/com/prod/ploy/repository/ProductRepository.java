package com.prod.ploy.repository;

import com.prod.ploy.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query(
        value = """
            SELECT p FROM Product p
            WHERE p.deleted = false
              AND (:type IS NULL OR p.productType = :type)
              AND (:visible IS NULL OR p.visible = :visible)
              AND (:q IS NULL
                   OR LOWER(p.name) LIKE LOWER(CONCAT('%',:q,'%'))
                   OR LOWER(p.description) LIKE LOWER(CONCAT('%',:q,'%')))
            ORDER BY p.createdAt DESC
        """,
        countQuery = """
            SELECT COUNT(p) FROM Product p
            WHERE p.deleted = false
              AND (:type IS NULL OR p.productType = :type)
              AND (:visible IS NULL OR p.visible = :visible)
              AND (:q IS NULL
                   OR LOWER(p.name) LIKE LOWER(CONCAT('%',:q,'%'))
                   OR LOWER(p.description) LIKE LOWER(CONCAT('%',:q,'%')))
        """
    )
    Page<Product> searchProducts(
            @Param("type") Product.ProductType type,
            @Param("visible") Boolean visible,
            @Param("q") String q,
            Pageable pageable);
}
