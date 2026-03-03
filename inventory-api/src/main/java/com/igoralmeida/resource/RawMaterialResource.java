package com.igoralmeida.resource;

import com.igoralmeida.dto.RawMaterialCreateRequest;
import com.igoralmeida.dto.RawMaterialResponse;
import com.igoralmeida.service.RawMaterialService;
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

@Path("/api/raw-materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RawMaterialResource {

    @Inject
    RawMaterialService rawMaterialService;

    @GET
    public List<RawMaterialResponse> listAll() {
        return rawMaterialService.listAll();
    }

    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") String idParam) {
        try {
            UUID id = UUID.fromString(idParam);
            RawMaterialResponse rawMaterial = rawMaterialService.findById(id);
            return Response.ok(rawMaterial).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Invalid UUID format").build();
        } catch (NotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
        }
    }

    @POST
    public Response create(@Valid RawMaterialCreateRequest request) {
        try {
            RawMaterialResponse rawMaterial = rawMaterialService.create(request);
            return Response.status(Response.Status.CREATED).entity(rawMaterial).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") String idParam, @Valid RawMaterialCreateRequest request) {
        try {
            UUID id = UUID.fromString(idParam);
            RawMaterialResponse rawMaterial = rawMaterialService.update(id, request);
            return Response.ok(rawMaterial).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Invalid UUID format").build();
        } catch (NotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
        }
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") String idParam) {
        try {
            UUID id = UUID.fromString(idParam);
            rawMaterialService.delete(id);
            return Response.noContent().build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Invalid UUID format").build();
        } catch (NotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
        }
    }
}
