package ar.edu.itba.paw.services;

import java.util.Locale;

import javax.ws.rs.core.Response;

import org.springframework.stereotype.Service;

import ar.edu.itba.paw.interfaces.RequestService;
import ar.edu.itba.paw.models.dto.ErrorDTO;

@Service
public class RequestServiceImpl implements RequestService{

	private static final String SPANISH = "es";
	private static final String ENGLISH = "en";
	
	@Override
    public Locale getLocale(String languaje) {
    	if(languaje.indexOf("es") == 0) {
    		return new Locale(SPANISH);
    	}else {
    		return new Locale(ENGLISH);
    	}
    }
	
	@Override
	public Response ok() {
		return Response.ok().build();
	}
	
	@Override
	public Response ok(Object objectDTO) {
		return Response.ok().entity(objectDTO).build();
	}
	
	@Override
	public Response create() {
		return Response.status(Response.Status.CREATED).build();
	}
	
	@Override
	public Response create(Object objectDTO) {
		return Response.status(Response.Status.CREATED).entity(objectDTO).build();
	}

	@Override
	public Response badRequest() {
		return Response.status(Response.Status.BAD_REQUEST).build();
	}
	
	@Override
	public Response forbidden() {
		return Response.status(Response.Status.FORBIDDEN).build();
	}
	
	@Override
	public Response notFound() {
		return Response.status(Response.Status.NOT_FOUND).build();
	}

	@Override
	public Response conflict() {
		return Response.status(Response.Status.CONFLICT).build();
	}
	
	@Override
	public Response unauthorized() {
		return Response.status(Response.Status.UNAUTHORIZED).build();
	}
	
	@Override
	public Response noContent() {
		return Response.status(Response.Status.NO_CONTENT).build();
	}
	
	@Override
	public Response badGateway() {
		return Response.status(Response.Status.BAD_GATEWAY).build();
	}



}
