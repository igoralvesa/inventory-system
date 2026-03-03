package com.igoralmeida.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "PRODUCT_MATERIAL")
public class ProductMaterial extends PanacheEntityBase {

    @EmbeddedId
    public ProductMaterialId id;

    @ManyToOne
    @MapsId("productId")
    @JoinColumn(name = "PRODUCT_ID", nullable = false)
    public Product product;

    @ManyToOne
    @MapsId("rawMaterialId")
    @JoinColumn(name = "RAW_MATERIAL_ID", nullable = false)
    public RawMaterial rawMaterial;

    @Column(name = "REQUIRED_QUANTITY", nullable = false, precision = 19, scale = 4)
    public BigDecimal requiredQuantity;

    public ProductMaterial() {
    }

    public ProductMaterial(Product product, RawMaterial rawMaterial, BigDecimal requiredQuantity) {
        this.id = new ProductMaterialId(product.id, rawMaterial.id);
        this.product = product;
        this.rawMaterial = rawMaterial;
        this.requiredQuantity = requiredQuantity;
    }
}
