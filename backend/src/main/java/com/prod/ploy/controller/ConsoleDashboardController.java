package com.prod.ploy.controller;

import com.prod.ploy.dto.ActivityItem;
import com.prod.ploy.dto.DashboardStatsResponse;
import com.prod.ploy.dto.RevenueDataPoint;
import com.prod.ploy.service.ConsoleDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/console/dashboard")
@RequiredArgsConstructor
public class ConsoleDashboardController {

    private final ConsoleDashboardService service;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> stats() {
        return ResponseEntity.ok(service.getStats());
    }

    @GetMapping("/activity")
    public ResponseEntity<List<ActivityItem>> activity() {
        return ResponseEntity.ok(service.getRecentActivity());
    }

    @GetMapping("/revenue")
    public ResponseEntity<List<RevenueDataPoint>> revenue() {
        return ResponseEntity.ok(service.getRevenueLast7Days());
    }
}
