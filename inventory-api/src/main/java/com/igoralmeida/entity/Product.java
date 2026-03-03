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
@Table(name = "PRODUCT")
public class Product extends PanacheEntityBase {

    @Id
    @Column(name = "ID", length = 36)
    public UUID id;

    @Column(name = "NAME", nullable = false, length = 255)
    public String name;

    @Column(name = "PRICE", nullable = false, precision = 19, scale = 4)
    public BigDecimal price;

    @OneToMany(mappedBy = "product")
    public List<ProductMaterial> materials = new ArrayList<>();

    public Product() {
    }

    public Product(String name, BigDecimal price) {
        this.name = name;
        this.price = price;
    }
}
