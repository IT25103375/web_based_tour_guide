package com.webbasedtourguide.auth;

import com.webbasedtourguide.entities.AuthEntity;
import com.webbasedtourguide.repositories.AuthEntityRepository;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jspecify.annotations.NullMarked;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
@Profile("!dev")
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthEntityRepository authEntityRepository;

    @Override
    @NullMarked
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        // Clear context
        SecurityContextHolder.clearContext();

        // Get authorization header
        String authHeader = request.getHeader("Authorization");

        // No token, pass through filter
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        // Invalid token
        if (!jwtUtil.validateToken(token)) {
            httpUnauthorize(response);
            return;
        }

        // Email and AuthEntity
        String email = jwtUtil.extractEmail(token);
        Optional<AuthEntity> opAuthEntity = authEntityRepository.findByEmail(email);

        // Email not registered
        if (opAuthEntity.isEmpty()) {
            httpUnauthorize(response);
            return;
        }

        // Authorized
        else {
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            opAuthEntity.get(),
                            null,
                            opAuthEntity.get().getAuthorities()
                    );

            // Generate new context, may not be required now
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);

            chain.doFilter(request, response);
        }
    }

    private void httpUnauthorize(HttpServletResponse response) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("Unauthorized");
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();

        // ONLY KEEP USER AUTH PAGES OPEN TO PUBLIC IN PROD
        return path.equals("/api/user/auth/login") ||
                path.equals("/api/user/auth/register") ||
                path.startsWith("/v3/api-docs/") ||
                path.startsWith("/swagger-ui/") ||
                path.startsWith("/swagger-ui.html");
    }
}
