package com.igoralmeida.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record RawMaterialResponse(UUID id, String name, BigDecimal stockQuantity) {}
