package com.trotot.backend.dto.dashboard;

import java.util.List;

public record DashboardChartResponse(
        List<ChartItem> roomsByDistrict,
        List<ChartItem> requestsByStatus,
        List<ChartItem> roomsByStatus) {
}
