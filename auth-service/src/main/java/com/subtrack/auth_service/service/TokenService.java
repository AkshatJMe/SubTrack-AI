package com.subtrack.auth_service.service;

import com.subtrack.auth_service.entity.UserAuth;
import com.subtrack.auth_service.utility.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.UUID;

@Service
public class TokenService {

    private final JwtUtil jwtUtil;
    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Server-side secret mixed into refresh token hashing to mitigate offline token-hash attacks
     * if the refresh_tokens table is leaked. Keep this out of source control.
     */
    private final String refreshTokenPepper;

    public TokenService(JwtUtil jwtUtil,
                        @Value("${security.refresh-token.pepper}") String refreshTokenPepper) {
        this.jwtUtil = jwtUtil;
        this.refreshTokenPepper = refreshTokenPepper;
    }

    public String generateAccessToken(UserAuth user) {
        return jwtUtil.generateToken(user.getId(), user.getRole());
    }

    public String generateRefreshToken() {
        byte[] bytes = new byte[64];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    public String hash(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest((token + "." + refreshTokenPepper).getBytes(StandardCharsets.UTF_8));

            StringBuilder hex = new StringBuilder();
            for (byte b : hash) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();

        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not supported", e);
        }
    }
}
