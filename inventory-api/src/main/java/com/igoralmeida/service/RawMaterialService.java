package com.igoralmeida.service;

import com.igoralmeida.dto.RawMaterialCreateRequest;
import com.igoralmeida.dto.RawMaterialResponse;
import com.igoralmeida.entity.RawMaterial;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@ApplicationScoped
public class RawMaterialService {

    @Transactional
    public List<RawMaterialResponse> listAll() {
        return RawMaterial.listAll().stream()
                .map(r -> toResponse((RawMaterial) r))
                .collect(Collectors.toList());
    }

    @Transactional
    public RawMaterialResponse findById(UUID id) {
        RawMaterial rawMaterial = RawMaterial.findById(id);
        if (rawMaterial == null) {
            throw new NotFoundException("Raw material not found: " + id);
        }
        return toResponse(rawMaterial);
    }

    @Transactional
    public RawMaterialResponse create(RawMaterialCreateRequest request) {
        RawMaterial rawMaterial = new RawMaterial(request.name(), request.stockQuantity());
        rawMaterial.id = UUID.randomUUID();
        rawMaterial.persist();
        return toResponse(rawMaterial);
    }

    @Transactional
    public RawMaterialResponse update(UUID id, RawMaterialCreateRequest request) {
        RawMaterial rawMaterial = RawMaterial.findById(id);
        if (rawMaterial == null) {
            throw new NotFoundException("Raw material not found: " + id);
        }
        rawMaterial.name = request.name();
        rawMaterial.stockQuantity = request.stockQuantity();
        return toResponse(rawMaterial);
    }

    @Transactional
    public void delete(UUID id) {
        RawMaterial rawMaterial = RawMaterial.findById(id);
        if (rawMaterial == null) {
            throw new NotFoundException("Raw material not found: " + id);
        }
        rawMaterial.delete();
    }

    @Transactional
    public RawMaterial getEntity(UUID id) {
        RawMaterial rawMaterial = RawMaterial.findById(id);
        if (rawMaterial == null) {
            throw new NotFoundException("Raw material not found: " + id);
        }
        return rawMaterial;
    }

    private RawMaterialResponse toResponse(RawMaterial rawMaterial) {
        return new RawMaterialResponse(rawMaterial.id, rawMaterial.name, rawMaterial.stockQuantity);
    }
}
