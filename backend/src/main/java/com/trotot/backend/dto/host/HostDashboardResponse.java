package com.trotot.backend.dto.host;

import java.util.List;

public record HostDashboardResponse(
        Long userId,
        String fullName,
        long totalPosts,
        long availablePosts,
        long closedOrHiddenPosts,
        long hiddenPosts,
        long totalContactRequests,
        List<HostContactRequestResponse> recentContactRequests) {
}
