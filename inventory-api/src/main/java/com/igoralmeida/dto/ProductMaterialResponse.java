package com.igoralmeida.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record ProductMaterialResponse(UUID rawMaterialId, String rawMaterialName, BigDecimal requiredQuantity) {}
