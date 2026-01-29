package com.subtrack.subscription_service.repository;

import com.subtrack.subscription_service.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BillRepository extends JpaRepository<Bill, UUID> {
}

