package com.igoralmeida.service;

import com.igoralmeida.dto.ProductMaterialRequest;
import com.igoralmeida.dto.ProductMaterialResponse;
import com.igoralmeida.entity.Product;
import com.igoralmeida.entity.ProductMaterial;
import com.igoralmeida.entity.RawMaterial;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@ApplicationScoped
public class BillOfMaterialsService {

    private final ProductService productService;
    private final RawMaterialService rawMaterialService;

    public BillOfMaterialsService(ProductService productService, RawMaterialService rawMaterialService) {
        this.productService = productService;
        this.rawMaterialService = rawMaterialService;
    }

    @Transactional
    public List<ProductMaterialResponse> getMaterialsByProduct(UUID productId) {
        Product product = productService.getEntity(productId);
        return product.materials.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductMaterialResponse addMaterial(UUID productId, ProductMaterialRequest request) {
        Product product = productService.getEntity(productId);
        RawMaterial rawMaterial = rawMaterialService.getEntity(request.rawMaterialId());

        boolean exists = product.materials.stream()
                .anyMatch(pm -> pm.rawMaterial.id.equals(request.rawMaterialId()));
        if (exists) {
            throw new IllegalArgumentException("Product already has this raw material. Use update instead.");
        }

        ProductMaterial pm = new ProductMaterial(product, rawMaterial, request.requiredQuantity());
        pm.persist();
        return toResponse(pm);
    }

    @Transactional
    public ProductMaterialResponse updateMaterial(UUID productId, UUID rawMaterialId, ProductMaterialRequest request) {
        Product product = productService.getEntity(productId);
        RawMaterial rawMaterial = rawMaterialService.getEntity(request.rawMaterialId());

        ProductMaterial pm = product.materials.stream()
                .filter(m -> m.rawMaterial.id.equals(rawMaterialId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Product material not found: " + productId + " / " + rawMaterialId));

        if (!rawMaterialId.equals(request.rawMaterialId())) {
            boolean exists = product.materials.stream()
                    .anyMatch(m -> m.rawMaterial.id.equals(request.rawMaterialId()));
            if (exists) {
                throw new IllegalArgumentException("Product already has raw material: " + request.rawMaterialId());
            }
            pm.delete();
            pm = new ProductMaterial(product, rawMaterial, request.requiredQuantity());
            pm.persist();
        } else {
            pm.requiredQuantity = request.requiredQuantity();
        }

        return toResponse(pm);
    }

    @Transactional
    public void removeMaterial(UUID productId, UUID rawMaterialId) {
        Product product = productService.getEntity(productId);
        ProductMaterial pm = product.materials.stream()
                .filter(m -> m.rawMaterial.id.equals(rawMaterialId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Product material not found: " + productId + " / " + rawMaterialId));
        pm.delete();
    }

    private ProductMaterialResponse toResponse(ProductMaterial pm) {
        return new ProductMaterialResponse(
                pm.rawMaterial.id,
                pm.rawMaterial.name,
                pm.requiredQuantity
        );
    }
}
