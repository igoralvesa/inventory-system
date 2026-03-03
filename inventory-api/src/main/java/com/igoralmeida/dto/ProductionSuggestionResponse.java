package com.igoralmeida.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record ProductionSuggestionResponse(
        List<ProductQuantity> suggestedProduction,
        BigDecimal totalRevenue
) {
    public record ProductQuantity(UUID productId, String productName, int quantity, BigDecimal unitPrice) {}
}
