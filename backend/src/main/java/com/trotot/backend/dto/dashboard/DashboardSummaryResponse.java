package com.trotot.backend.dto.dashboard;

import java.util.List;

public record DashboardSummaryResponse(
        long totalRooms,
        long availableRooms,
        long totalUsers,
        long pendingRequests,
        long totalContactRequests,
        List<RecentRoomResponse> recentRooms,
        List<RecentContactRequestResponse> recentRequests) {
}
