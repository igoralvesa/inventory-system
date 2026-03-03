package com.igoralmeida.resource;

import com.igoralmeida.dto.ProductionSuggestionResponse;
import com.igoralmeida.service.SuggestionService;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/production/suggestion")
@Produces(MediaType.APPLICATION_JSON)
public class ProductionSuggestionResource {

    @Inject
    SuggestionService suggestionService;

    @GET
    public Response getSuggestion() {
        ProductionSuggestionResponse suggestion = suggestionService.getProductionSuggestion();
        return Response.ok(suggestion).build();
    }
}
