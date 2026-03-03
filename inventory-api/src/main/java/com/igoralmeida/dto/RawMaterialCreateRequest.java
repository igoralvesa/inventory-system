package com.igoralmeida.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record RawMaterialCreateRequest(
        @NotBlank(message = "Name is required")
        @Size(max = 255)
        String name,

        @DecimalMin(value = "0", message = "Stock quantity must be >= 0")
        BigDecimal stockQuantity
) {}
