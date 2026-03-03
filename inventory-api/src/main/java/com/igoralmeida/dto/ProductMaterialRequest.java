package com.igoralmeida.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public record ProductMaterialRequest(
        @NotNull(message = "Raw material ID is required")
        UUID rawMaterialId,

        @DecimalMin(value = "0", inclusive = false, message = "Required quantity must be > 0")
        BigDecimal requiredQuantity
) {}
