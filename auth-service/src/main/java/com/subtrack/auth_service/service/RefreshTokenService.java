package com.subtrack.auth_service.service;

import com.subtrack.auth_service.entity.RefreshToken;
import com.subtrack.auth_service.entity.UserAuth;
import com.subtrack.auth_service.exception.AuthException;
import com.subtrack.auth_service.repository.RefreshTokenRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class RefreshTokenService {
    private static final Logger log = LoggerFactory.getLogger(RefreshTokenService.class);

    private final RefreshTokenRepository refreshTokenRepository;
    private final TokenService tokenService;

    private final long refreshTokenTtlDays;

    public record CreatedRefreshToken(String rawToken, RefreshToken entity) {}

    public RefreshTokenService(
            RefreshTokenRepository refreshTokenRepository,
            TokenService tokenService,
            @Value("${security.refresh-token.ttl-days:30}") long refreshTokenTtlDays
    ) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.tokenService = tokenService;
        this.refreshTokenTtlDays = refreshTokenTtlDays;
    }

    @Transactional
    public CreatedRefreshToken createRefreshToken(UserAuth user) {
        String raw = tokenService.generateRefreshToken();
        String hash = tokenService.hash(raw);

        RefreshToken rt = new RefreshToken();
        rt.setUser(user);
        rt.setTokenHash(hash);
        rt.setExpiresAt(Instant.now().plus(refreshTokenTtlDays, ChronoUnit.DAYS));
        rt.setRevoked(false);

        RefreshToken saved = refreshTokenRepository.save(rt);
        return new CreatedRefreshToken(raw, saved);
    }

    /**
     * Validates the presented raw refresh token and returns its DB row.
     * This method also performs reuse detection behavior:
     * - If the token row exists but is revoked, treat it as "token reuse" and revoke all tokens for that user.
     */
    @Transactional
    public RefreshToken validateRefreshToken(String presentedRawToken) {
        String presentedHash = tokenService.hash(presentedRawToken);
        RefreshToken token = refreshTokenRepository.findByTokenHash(presentedHash)
                .orElseThrow(() -> new AuthException(HttpStatus.UNAUTHORIZED, "Invalid refresh token"));

        if (token.isRevoked()) {
            // Token reuse detection: a previously used token was presented again.
            UserAuth user = token.getUser();
            log.warn("Refresh token reuse detected for userId={}", user.getId());
            revokeTokensForUser(user);
            throw new AuthException(HttpStatus.UNAUTHORIZED, "Refresh token reuse detected");
        }

        if (token.getExpiresAt().isBefore(Instant.now())) {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
            throw new AuthException(HttpStatus.UNAUTHORIZED, "Refresh token expired");
        }

        return token;
    }

    /**
     * Rotation flow (transactional):
     * - validate old token
     * - revoke old token
     * - generate/store new token
     * - link old -> new via replaced_by_token
     */
    @Transactional
    public CreatedRefreshToken rotateRefreshToken(String presentedRawToken) {
        RefreshToken oldToken = validateRefreshToken(presentedRawToken);

        oldToken.setRevoked(true);
        refreshTokenRepository.save(oldToken);

        CreatedRefreshToken created = createRefreshToken(oldToken.getUser());
        oldToken.setReplacedByToken(created.entity().getId());
        refreshTokenRepository.save(oldToken);

        return created;
    }

    @Transactional
    public void revokeTokensForUser(UserAuth user) {
        List<RefreshToken> tokens = refreshTokenRepository.findAllByUserAndRevokedFalse(user);
        if (tokens.isEmpty()) return;

        for (RefreshToken t : tokens) {
            t.setRevoked(true);
        }
        refreshTokenRepository.saveAll(tokens);
    }
}

