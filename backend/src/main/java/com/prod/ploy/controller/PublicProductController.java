package com.prod.ploy.controller;

import com.prod.ploy.dto.PublicProductDto;
import com.prod.ploy.model.Product;
import com.prod.ploy.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class PublicProductController {

    private final ProductRepository productRepository;

    /** Public product list — visible=true only, optionally filtered by type */
    @GetMapping
    public List<PublicProductDto> list(@RequestParam(required = false) String type) {
        Product.ProductType productType = null;
        if (type != null && !type.isBlank()) {
            try { productType = Product.ProductType.valueOf(type.toUpperCase()); }
            catch (IllegalArgumentException ignored) {}
        }
        PageRequest pageable = PageRequest.of(0, 200, Sort.by(Sort.Direction.DESC, "createdAt"));
        return productRepository.searchProducts(productType, true, null, pageable)
                .stream().map(PublicProductDto::from).toList();
    }

    /** Single product detail */
    @GetMapping("/{id}")
    public PublicProductDto detail(@PathVariable Long id) {
        return productRepository.findById(id)
                .filter(p -> !p.getDeleted() && p.getVisible())
                .map(PublicProductDto::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }
}
