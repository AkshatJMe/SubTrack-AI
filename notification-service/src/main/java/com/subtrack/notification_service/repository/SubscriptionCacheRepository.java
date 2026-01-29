package com.subtrack.notification_service.repository;

import com.subtrack.notification_service.entity.SubscriptionCache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface SubscriptionCacheRepository extends JpaRepository<SubscriptionCache, UUID> {

    @Query("""
            select sc from SubscriptionCache sc
            where sc.renewalDate = :renewalDate
              and sc.status = :status
            """)
    List<SubscriptionCache> findByRenewalDateAndStatus(@Param("renewalDate") LocalDate renewalDate, @Param("status") String status);

    @Query("""
            select sc from SubscriptionCache sc
            where sc.userId = :userId
              and sc.renewalDate between :start and :end
              and sc.status = :status
            """)
    List<SubscriptionCache> findUpcomingForUser(@Param("userId") UUID userId,
                                               @Param("start") LocalDate start,
                                               @Param("end") LocalDate end,
                                               @Param("status") String status);
}

