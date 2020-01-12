package ar.edu.itba.paw.webapp.auth;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import java.io.IOException;
import java.util.Collection;
import java.util.HashSet;

import ar.edu.itba.paw.interfaces.UserService;
import ar.edu.itba.paw.models.dto.UserLoginDTO;

@Component
public class TokenAuthenticationService {
    private static final String AUTH_HEADER = "Authorization";
    private static final String ACCESS_HEADER = "Authorities";
    private static final String USERNAME_HEADER = "username";

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private UserService us;

    private final TokenHandler tokenHandler;

    public TokenAuthenticationService() {
        this.tokenHandler = new JWTTokenHandler();
    }
    
    public Long getUserIdAuthentication(final HttpServletRequest request) {
    	final String token = request.getHeader(AUTH_HEADER);
    	
    	if (token != null) {
    		final String username = tokenHandler.getUsername(token);
    		if(username != null)
    			return us.findByUsername(username).getUserid();
    	}
    	
    	return null;
    }
    
    
    //Basicamente aca revisa en cada URL si hay un token de autorizacion si lo requiere,
    //Si lo hay devuelve un 200 como que esta autorizado
   //Sino un 401 para mostrar que el usuario no puede acceder ahi
    Authentication getAuthentication(final HttpServletRequest request) {
        final String token = request.getHeader(AUTH_HEADER);
        Authentication authentication = null;
        if (token != null) {
            final String username = tokenHandler.getUsername(token);

            if (username != null) {
                try {
                    final UserDetails user = userDetailsService.loadUserByUsername(username);
                    final Collection<GrantedAuthority> authorities = new HashSet<GrantedAuthority>(user.getAuthorities());
                    authentication = new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword(),
                            authorities);
                } catch (UsernameNotFoundException e) {
                    return null;
                }
            }
        }

        return authentication;
    }
    
    //Aca se agrega el token de la autorizacion
    //Adicionalmente agregamos el header de las autoridades que tiene
    void addAuthentication(final HttpServletResponse response, final UserDetails userDetails) throws IOException, ServletException {
        final String token = tokenHandler.createToken(userDetails.getUsername());
        
        response.setHeader(AUTH_HEADER, "Bearer " + token);
        response.setHeader(ACCESS_HEADER, userDetails.getAuthorities().toString());
        response.setHeader(USERNAME_HEADER, userDetails.getUsername());
    }
    
    
    Authentication getAuthenticationForLogin(final HttpServletRequest request) throws UserNotActiveException {
        try {
            final UserLoginDTO user = new ObjectMapper().readValue(request.getInputStream(), UserLoginDTO.class); // Attempt
            
            final UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
            
            if (userDetails != null) {
                if (userDetails.isEnabled() && user.getEmail().equals(userDetails.getUsername())
                        && passwordEncoder.matches(user.getPassword(), userDetails.getPassword())) {
                    return new UsernamePasswordAuthenticationToken(userDetails.getUsername(), userDetails.getPassword(),
                            userDetails.getAuthorities());
                } else if (!userDetails.isEnabled()
                        && passwordEncoder.matches(user.getPassword(), userDetails.getPassword())) {
                    throw new UserNotActiveException("User is not active");
                }
            }
        } catch (final IOException e) {
            return null;
        }

        return null;
    }
    
    public Response refreshToken(String username)  {
        final UserDetails userDetails = userDetailsService.loadUserByUsername(username);
    	final String token = tokenHandler.createToken(username);
    	return Response.ok().header(AUTH_HEADER, "Bearer " + token)
    			.header(ACCESS_HEADER, userDetails.getAuthorities().toString())
    			.header(USERNAME_HEADER, userDetails.getUsername()).build();
    }
    
    
    
}

