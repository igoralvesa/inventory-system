package com.igoralmeida.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "RAW_MATERIAL")
public class RawMaterial extends PanacheEntityBase {

    @Id
    @Column(name = "ID", length = 36)
    public UUID id;

    @Column(name = "NAME", nullable = false, length = 255)
    public String name;

    @Column(name = "STOCK_QUANTITY", nullable = false, precision = 19, scale = 4)
    public BigDecimal stockQuantity;

    @OneToMany(mappedBy = "rawMaterial")
    public List<ProductMaterial> productMaterials = new ArrayList<>();

    public RawMaterial() {
    }

    public RawMaterial(String name, BigDecimal stockQuantity) {
        this.name = name;
        this.stockQuantity = stockQuantity;
    }
}
