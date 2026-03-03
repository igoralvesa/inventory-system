package com.igoralmeida.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class ProductMaterialId implements Serializable {

    @Column(name = "PRODUCT_ID", length = 36)
    public UUID productId;

    @Column(name = "RAW_MATERIAL_ID", length = 36)
    public UUID rawMaterialId;

    public ProductMaterialId() {
    }

    public ProductMaterialId(UUID productId, UUID rawMaterialId) {
        this.productId = productId;
        this.rawMaterialId = rawMaterialId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductMaterialId that = (ProductMaterialId) o;
        return Objects.equals(productId, that.productId) && Objects.equals(rawMaterialId, that.rawMaterialId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(productId, rawMaterialId);
    }
}
