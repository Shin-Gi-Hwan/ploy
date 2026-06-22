package com.prod.ploy.service;

import com.prod.ploy.dto.ConsoleProductListItem;
import com.prod.ploy.dto.ProductUpsertRequest;
import com.prod.ploy.model.Product;
import com.prod.ploy.repository.ProductRepository;
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
public class ConsoleProductService {

    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public Page<ConsoleProductListItem> listProducts(int page, int size, String typeStr, String visibleStr, String q) {
        Product.ProductType type = null;
        if (typeStr != null && !typeStr.isBlank()) {
            try { type = Product.ProductType.valueOf(typeStr.toUpperCase()); } catch (IllegalArgumentException ignored) {}
        }
        Boolean visible = null;
        if ("true".equalsIgnoreCase(visibleStr)) visible = true;
        else if ("false".equalsIgnoreCase(visibleStr)) visible = false;

        String search = (q != null && !q.isBlank()) ? q.trim() : null;
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return productRepository.searchProducts(type, visible, search, pageable)
                .map(ConsoleProductListItem::from);
    }

    @Transactional(readOnly = true)
    public ConsoleProductListItem getProduct(Long id) {
        return ConsoleProductListItem.from(findById(id));
    }

    @Transactional
    public ConsoleProductListItem create(ProductUpsertRequest req) {
        Product p = new Product();
        applyRequest(p, req);
        return ConsoleProductListItem.from(productRepository.save(p));
    }

    @Transactional
    public ConsoleProductListItem update(Long id, ProductUpsertRequest req) {
        Product p = findById(id);
        applyRequest(p, req);
        return ConsoleProductListItem.from(productRepository.save(p));
    }

    @Transactional
    public ConsoleProductListItem updateVisibility(Long id, Boolean visible) {
        Product p = findById(id);
        p.setVisible(visible);
        return ConsoleProductListItem.from(productRepository.save(p));
    }

    @Transactional
    public void delete(Long id) {
        Product p = findById(id);
        p.setDeleted(true);
        productRepository.save(p);
    }

    private void applyRequest(Product p, ProductUpsertRequest req) {
        if (req.name() == null || req.name().isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "상품명은 필수입니다.");
        try { p.setProductType(Product.ProductType.valueOf(req.productType().toUpperCase())); }
        catch (Exception e) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "유효하지 않은 상품 유형입니다."); }
        p.setName(req.name().trim());
        p.setDescription(req.description());
        p.setPrice(req.price() != null ? req.price() : java.math.BigDecimal.ZERO);
        p.setStock(req.stock() != null ? req.stock() : 0);
        p.setImageUrl(req.imageUrl());
        p.setVisible(req.visible() != null ? req.visible() : true);
    }

    private Product findById(Long id) {
        return productRepository.findById(id)
                .filter(p -> !p.getDeleted())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "상품을 찾을 수 없습니다."));
    }
}
