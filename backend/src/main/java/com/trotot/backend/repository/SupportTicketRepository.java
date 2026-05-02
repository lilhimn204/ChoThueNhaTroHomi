package com.trotot.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.trotot.backend.entity.SupportTicket;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long>, JpaSpecificationExecutor<SupportTicket> {
}
