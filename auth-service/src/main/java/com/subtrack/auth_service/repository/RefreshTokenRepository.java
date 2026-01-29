package com.subtrack.auth_service.repository;

import com.subtrack.auth_service.entity.RefreshToken;
import com.subtrack.auth_service.entity.UserAuth;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    Optional<RefreshToken> findByTokenHash(String tokenHash);
    List<RefreshToken> findAllByUser(UserAuth user);
    List<RefreshToken> findAllByUserAndRevokedFalse(UserAuth user);
}
