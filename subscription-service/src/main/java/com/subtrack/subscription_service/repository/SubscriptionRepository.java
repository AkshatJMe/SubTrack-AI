package com.subtrack.subscription_service.repository;

import com.subtrack.subscription_service.entity.Subscription;
import com.subtrack.subscription_service.entity.SubscriptionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {

    Page<Subscription> findByUserId(UUID userId, Pageable pageable);

    Optional<Subscription> findByIdAndUserId(UUID id, UUID userId);

    boolean existsByUserIdAndServiceNameIgnoreCaseAndStatus(UUID userId, String serviceName, SubscriptionStatus status);

    @Query("""
            select s from Subscription s
            where s.userId = :userId
              and s.status = :status
              and s.renewalDate between :start and :end
            order by s.renewalDate asc
            """)
    List<Subscription> findUpcomingRenewalsForUser(
            @Param("userId") UUID userId,
            @Param("status") SubscriptionStatus status,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );

    @Query("""
            select s from Subscription s
            where s.status = :status
              and s.renewalDate between :start and :end
            order by s.renewalDate asc
            """)
    List<Subscription> findUpcomingRenewalsAllUsers(
            @Param("status") SubscriptionStatus status,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );
}

