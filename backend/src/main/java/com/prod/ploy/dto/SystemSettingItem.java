package com.prod.ploy.dto;

import com.prod.ploy.model.SystemSetting;

import java.time.LocalDateTime;

public record SystemSettingItem(
        Long id,
        String settingKey,
        String settingValue,
        String description,
        LocalDateTime updatedAt
) {
    public static SystemSettingItem from(SystemSetting s) {
        return new SystemSettingItem(s.getId(), s.getSettingKey(), s.getSettingValue(), s.getDescription(), s.getUpdatedAt());
    }
}
