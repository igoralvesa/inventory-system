package com.igoralmeida.resource;

import com.igoralmeida.dto.ProductMaterialRequest;
import com.igoralmeida.dto.ProductMaterialResponse;
import com.igoralmeida.service.BillOfMaterialsService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.UUID;

@Path("/api/products/{productId}/materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductMaterialResource {

    @Inject
    BillOfMaterialsService billOfMaterialsService;

    @GET
    public Response getMaterials(@PathParam("productId") String productIdParam) {
        try {
            UUID productId = UUID.fromString(productIdParam);
            List<ProductMaterialResponse> materials = billOfMaterialsService.getMaterialsByProduct(productId);
            return Response.ok(materials).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Invalid UUID format").build();
        } catch (NotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
        }
    }

    @POST
    public Response addMaterial(@PathParam("productId") String productIdParam, @Valid ProductMaterialRequest request) {
        try {
            UUID productId = UUID.fromString(productIdParam);
            ProductMaterialResponse material = billOfMaterialsService.addMaterial(productId, request);
            return Response.status(Response.Status.CREATED).entity(material).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        } catch (NotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
        }
    }

    @PUT
    @Path("/{rawMaterialId}")
    public Response updateMaterial(
            @PathParam("productId") String productIdParam,
            @PathParam("rawMaterialId") String rawMaterialIdParam,
            @Valid ProductMaterialRequest request) {
        try {
            UUID productId = UUID.fromString(productIdParam);
            UUID rawMaterialId = UUID.fromString(rawMaterialIdParam);
            ProductMaterialResponse material = billOfMaterialsService.updateMaterial(productId, rawMaterialId, request);
            return Response.ok(material).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Invalid UUID format").build();
        } catch (NotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
        }
    }

    @DELETE
    @Path("/{rawMaterialId}")
    public Response removeMaterial(
            @PathParam("productId") String productIdParam,
            @PathParam("rawMaterialId") String rawMaterialIdParam) {
        try {
            UUID productId = UUID.fromString(productIdParam);
            UUID rawMaterialId = UUID.fromString(rawMaterialIdParam);
            billOfMaterialsService.removeMaterial(productId, rawMaterialId);
            return Response.noContent().build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Invalid UUID format").build();
        } catch (NotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
        }
    }
}
