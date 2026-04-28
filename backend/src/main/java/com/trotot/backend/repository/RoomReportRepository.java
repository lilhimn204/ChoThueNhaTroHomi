package com.trotot.backend.repository;

import java.util.Collection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.trotot.backend.entity.RoomReport;
import com.trotot.backend.entity.RoomReportStatus;

public interface RoomReportRepository extends JpaRepository<RoomReport, Long>, JpaSpecificationExecutor<RoomReport> {

    boolean existsByRoomIdAndReporterIdAndStatusIn(
            Long roomId,
            Long reporterId,
            Collection<RoomReportStatus> statuses);

    long countByRoomId(Long roomId);

    void deleteByRoomId(Long roomId);
}
