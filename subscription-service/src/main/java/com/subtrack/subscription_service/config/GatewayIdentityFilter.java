package com.subtrack.subscription_service.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Trusts identity established by the API Gateway.
 * - Primary: read userId from header (default: X-User-Id)
 * - Fallback: decode JWT payload (no signature verification) and read "sub" or "userId"
 *
 * This service does NOT authenticate users; it only propagates trusted identity into Spring Security.
 */
@Component
public class GatewayIdentityFilter extends OncePerRequestFilter {
    private static final Logger log = LoggerFactory.getLogger(GatewayIdentityFilter.class);

    private final ObjectMapper objectMapper;
    private final String headerUserId;
    private final String headerAuthorization;

    public GatewayIdentityFilter(
            ObjectMapper objectMapper,
            @Value("${security.identity.header-user-id:X-User-Id}") String headerUserId,
            @Value("${security.identity.header-authorization:Authorization}") String headerAuthorization
    ) {
        this.objectMapper = objectMapper;
        this.headerUserId = headerUserId;
        this.headerAuthorization = headerAuthorization;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            extractUserId(request).ifPresent(userId -> {
                var auth = new UsernamePasswordAuthenticationToken(userId.toString(), null, List.of());
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);
            });
        }

        filterChain.doFilter(request, response);
    }

    private Optional<UUID> extractUserId(HttpServletRequest request) {
        String headerVal = request.getHeader(headerUserId);
        if (headerVal != null && !headerVal.isBlank()) {
            try {
                return Optional.of(UUID.fromString(headerVal.trim()));
            } catch (Exception ex) {
                log.info("Invalid {} header; ignoring", headerUserId);
                return Optional.empty();
            }
        }

        String authz = request.getHeader(headerAuthorization);
        if (authz != null && authz.startsWith("Bearer ")) {
            String token = authz.substring(7);
            return extractUserIdFromJwtWithoutVerification(token);
        }
        return Optional.empty();
    }

    private Optional<UUID> extractUserIdFromJwtWithoutVerification(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length < 2) return Optional.empty();

            byte[] decoded = Base64.getUrlDecoder().decode(parts[1]);
            String json = new String(decoded, StandardCharsets.UTF_8);
            JsonNode node = objectMapper.readTree(json);

            String subject = text(node, "sub").orElse(null);
            String userId = text(node, "userId").orElse(null);
            String candidate = subject != null ? subject : userId;
            if (candidate == null || candidate.isBlank()) return Optional.empty();

            return Optional.of(UUID.fromString(candidate));
        } catch (Exception ex) {
            return Optional.empty();
        }
    }

    private Optional<String> text(JsonNode node, String field) {
        JsonNode v = node.get(field);
        if (v == null || v.isNull()) return Optional.empty();
        String s = v.asText();
        return (s == null || s.isBlank()) ? Optional.empty() : Optional.of(s);
    }
}

