package com.aklaa.api.config.security;


import com.aklaa.api.model.enums.UserType;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

@Component
public class JwtAuthFilter  extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Autowired
    public JwtAuthFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException, ServletException, IOException {
        String path = request.getRequestURI();
        if (path.equals("/api/auth/register") || path.equals("/api/auth/login")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = JwtService.getSubject(jwt);
            } catch (Exception e) {
                logger.error("Cannot get token or token has expired");
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtService.validateToken(jwt)) {
                List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                UserType role = null;
                try {
                    String tokenType = JwtService.getClaim(jwt, "type");
                    if (!"access".equals(tokenType)) {
                        logger.error("Invalid token type: Only access tokens are allowed");
                        filterChain.doFilter(request, response);
                        return;
                    }
                    role = JwtService.getRoleFromToken(jwt);
                } catch (ParseException e) {
                    throw new RuntimeException(e);
                }
                authorities.add(new SimpleGrantedAuthority("ROLE_" + role));

                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, null, authorities);
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}