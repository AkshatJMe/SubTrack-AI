package com.subtrack.auth_service.service;

import com.subtrack.auth_service.dto.AuthResponse;
import com.subtrack.auth_service.dto.LoginRequest;
import com.subtrack.auth_service.dto.LogoutRequest;
import com.subtrack.auth_service.dto.RefreshRequest;
import com.subtrack.auth_service.dto.SignupRequest;
import com.subtrack.auth_service.entity.RefreshToken;
import com.subtrack.auth_service.entity.UserAuth;
import com.subtrack.auth_service.exception.AuthException;
import com.subtrack.auth_service.kafka.UserCreatedProducer;
import com.subtrack.auth_service.repository.UserAuthRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserAuthRepository userAuthRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final RefreshTokenService refreshTokenService;
    private final UserCreatedProducer userCreatedProducer;

    public AuthService(UserAuthRepository userAuthRepository,
                       PasswordEncoder passwordEncoder,
                       TokenService tokenService,
                       RefreshTokenService refreshTokenService,
                       UserCreatedProducer userCreatedProducer) {
        this.userAuthRepository = userAuthRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
        this.refreshTokenService = refreshTokenService;
        this.userCreatedProducer = userCreatedProducer;
    }

    @Transactional
    public AuthResponse signup(SignupRequest req) {
        String email = req.email().trim().toLowerCase();
        if (userAuthRepository.findByEmail(email).isPresent()) {
            throw new AuthException(HttpStatus.CONFLICT, "Email already exists");
        }

        UserAuth user = new UserAuth();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(req.password()));
        user.setRole("USER");

        UserAuth saved = userAuthRepository.save(user);

        // Publish event after persisted
        userCreatedProducer.publishUserCreated(saved.getId(), saved.getEmail());

        String access = tokenService.generateAccessToken(saved);
        RefreshTokenService.CreatedRefreshToken refresh = refreshTokenService.createRefreshToken(saved);
        return new AuthResponse(access, refresh.rawToken());
    }

    @Transactional
    public AuthResponse login(LoginRequest req) {
        String email = req.email().trim().toLowerCase();
        UserAuth user = userAuthRepository.findByEmail(email)
                .orElseThrow(() -> new AuthException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new AuthException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        String access = tokenService.generateAccessToken(user);
        RefreshTokenService.CreatedRefreshToken refresh = refreshTokenService.createRefreshToken(user);
        return new AuthResponse(access, refresh.rawToken());
    }

    @Transactional
    public AuthResponse refresh(RefreshRequest req) {
        RefreshTokenService.CreatedRefreshToken rotated = refreshTokenService.rotateRefreshToken(req.refreshToken());
        UserAuth user = rotated.entity().getUser();
        String access = tokenService.generateAccessToken(user);
        return new AuthResponse(access, rotated.rawToken());
    }

    @Transactional
    public void logout(LogoutRequest req) {
        // Best-effort: validate token (includes reuse detection) then revoke all active tokens for this user
        RefreshToken token = refreshTokenService.validateRefreshToken(req.refreshToken());
        refreshTokenService.revokeTokensForUser(token.getUser());
        log.info("Logged out userId={}", token.getUser().getId());
    }
}

