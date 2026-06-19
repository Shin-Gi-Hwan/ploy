package com.prod.ploy.dto;

/**
 * One day's worth of aggregated chart data.
 * Returned as an ordered list (oldest → newest) by
 * GET /api/console/dashboard/revenue.
 *
 * revenue is 0 until a payment table exists.
 * orders  = projects created on that date (proxy).
 * inquiries = REQUESTED + BRIEF_SUBMITTED projects created on that date.
 */
public record RevenueDataPoint(
        String date,       // ISO date string, e.g. "2026-06-13"
        long revenue,
        long orders,
        long inquiries
) {}
