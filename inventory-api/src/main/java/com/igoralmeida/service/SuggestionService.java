package com.igoralmeida.service;

import com.igoralmeida.dto.ProductionSuggestionResponse;
import com.igoralmeida.entity.Product;
import com.igoralmeida.entity.ProductMaterial;
import com.igoralmeida.entity.RawMaterial;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@ApplicationScoped
public class SuggestionService {

    @Transactional
    public ProductionSuggestionResponse getProductionSuggestion() {
        List<Product> products = Product.listAll().stream()
                .map(p -> (Product) p)
                .sorted(Comparator.comparing((Product p) -> p.price).reversed())
                .toList();

        Map<UUID, BigDecimal> stock = new HashMap<>();
        for (Object o : RawMaterial.listAll()) {
            RawMaterial rm = (RawMaterial) o;
            stock.put(rm.id, rm.stockQuantity);
        }

        List<ProductionSuggestionResponse.ProductQuantity> suggested = new ArrayList<>();
        BigDecimal totalRevenue = BigDecimal.ZERO;

        for (Product product : products) {
            int maxQuantity = computeMaxProducible(product, stock);
            if (maxQuantity > 0) {
                suggested.add(new ProductionSuggestionResponse.ProductQuantity(
                        product.id,
                        product.name,
                        maxQuantity,
                        product.price
                ));
                totalRevenue = totalRevenue.add(product.price.multiply(BigDecimal.valueOf(maxQuantity)));
                deductMaterials(product, maxQuantity, stock);
            }
        }

        return new ProductionSuggestionResponse(suggested, totalRevenue);
    }

    private int computeMaxProducible(Product product, Map<UUID, BigDecimal> stock) {
        int max = Integer.MAX_VALUE;
        for (ProductMaterial pm : product.materials) {
            BigDecimal available = stock.getOrDefault(pm.rawMaterial.id, BigDecimal.ZERO);
            int maxForMaterial = available.divide(pm.requiredQuantity, 0, java.math.RoundingMode.DOWN).intValue();
            max = Math.min(max, maxForMaterial);
        }
        return max == Integer.MAX_VALUE ? 0 : max;
    }

    private void deductMaterials(Product product, int quantity, Map<UUID, BigDecimal> stock) {
        for (ProductMaterial pm : product.materials) {
            BigDecimal used = pm.requiredQuantity.multiply(BigDecimal.valueOf(quantity));
            stock.merge(pm.rawMaterial.id, used.negate(), BigDecimal::add);
        }
    }
}
