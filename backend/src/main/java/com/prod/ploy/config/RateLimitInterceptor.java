package com.prod.ploy.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/*
 * Per-IP token bucket rate limiter for POST /api/projects.
 * Limit: 5 submissions per IP per hour.
 *
 * Simple in-process implementation — no external dependencies. Each IP gets a
 * counter that resets after 1 hour. If the app scales horizontally in v2,
 * replace with a Redis-backed store (e.g. Redisson or Spring Data Redis).
 *
 * Registered via WebMvcConfig, applied to POST /api/projects only.
 */
@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private static final int MAX_REQUESTS = 5;
    private static final long WINDOW_MILLIS = 60 * 60 * 1000L; // 1 hour

    private record WindowedCounter(AtomicInteger count, long windowStart) {}

    private final ConcurrentHashMap<String, WindowedCounter> counters = new ConcurrentHashMap<>();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {

        // Only rate-limit POST; GET on the same path (if any) passes through
        if (!"POST".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String ip = resolveClientIp(request);
        long now = System.currentTimeMillis();

        WindowedCounter counter = counters.compute(ip, (k, existing) -> {
            if (existing == null || now - existing.windowStart() >= WINDOW_MILLIS) {
                return new WindowedCounter(new AtomicInteger(0), now);
            }
            return existing;
        });

        if (counter.count().incrementAndGet() > MAX_REQUESTS) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write(
                    "{\"error\":\"Too many requests. Please wait before submitting again.\"}");
            return false;
        }

        return true;
    }

    private String resolveClientIp(HttpServletRequest request) {
        // Respect X-Forwarded-For set by Railway/Render/Nginx reverse proxies
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
