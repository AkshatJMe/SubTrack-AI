package com.subtrack.api_gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

/**
 * Adds X-User-Id header from JWT subject so downstream services stay auth-agnostic.
 */
@Component
public class UserIdHeaderFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return ReactiveSecurityContextHolder.getContext()
                .map(ctx -> ctx.getAuthentication() != null ? ctx.getAuthentication().getPrincipal() : null)
                .cast(Object.class)
                .defaultIfEmpty(null)
                .flatMap(principal -> {
                    if (principal instanceof Jwt jwt) {
                        String userId = jwt.getSubject();
                        if (userId != null && !userId.isBlank()) {
                            ServerHttpRequest mutated = exchange.getRequest().mutate()
                                    .header("X-User-Id", userId)
                                    .build();
                            return chain.filter(exchange.mutate().request(mutated).build());
                        }
                    }
                    return chain.filter(exchange);
                });
    }

    @Override
    public int getOrder() {
        return -1;
    }
}

