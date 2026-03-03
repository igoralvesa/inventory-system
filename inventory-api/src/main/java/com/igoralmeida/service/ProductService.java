package com.igoralmeida.service;

import com.igoralmeida.dto.ProductCreateRequest;
import com.igoralmeida.dto.ProductResponse;
import com.igoralmeida.entity.Product;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@ApplicationScoped
public class ProductService {

    @Transactional
    public List<ProductResponse> listAll() {
        return Product.listAll().stream()
                .map(p -> toResponse((Product) p))
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductResponse findById(UUID id) {
        Product product = Product.findById(id);
        if (product == null) {
            throw new NotFoundException("Product not found: " + id);
        }
        return toResponse(product);
    }

    @Transactional
    public ProductResponse create(ProductCreateRequest request) {
        Product product = new Product(request.name(), request.price());
        product.id = UUID.randomUUID();
        product.persist();
        return toResponse(product);
    }

    @Transactional
    public ProductResponse update(UUID id, ProductCreateRequest request) {
        Product product = Product.findById(id);
        if (product == null) {
            throw new NotFoundException("Product not found: " + id);
        }
        product.name = request.name();
        product.price = request.price();
        return toResponse(product);
    }

    @Transactional
    public void delete(UUID id) {
        Product product = Product.findById(id);
        if (product == null) {
            throw new NotFoundException("Product not found: " + id);
        }
        product.delete();
    }

    @Transactional
    public Product getEntity(UUID id) {
        Product product = Product.findById(id);
        if (product == null) {
            throw new NotFoundException("Product not found: " + id);
        }
        return product;
    }

    private ProductResponse toResponse(Product product) {
        return new ProductResponse(product.id, product.name, product.price);
    }
}
