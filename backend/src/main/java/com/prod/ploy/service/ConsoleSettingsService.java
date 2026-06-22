package com.prod.ploy.service;

import com.prod.ploy.dto.SystemSettingItem;
import com.prod.ploy.dto.SystemSettingUpdateRequest;
import com.prod.ploy.model.SystemSetting;
import com.prod.ploy.repository.SystemSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConsoleSettingsService {

    private final SystemSettingRepository systemSettingRepository;

    public List<SystemSettingItem> getAllSettings() {
        return systemSettingRepository.findAll().stream().map(SystemSettingItem::from).toList();
    }

    @Transactional
    public SystemSettingItem upsert(String key, SystemSettingUpdateRequest req) {
        SystemSetting s = systemSettingRepository.findBySettingKey(key)
                .orElseGet(() -> {
                    SystemSetting n = new SystemSetting();
                    n.setSettingKey(key);
                    return n;
                });
        s.setSettingValue(req.value());
        return SystemSettingItem.from(systemSettingRepository.save(s));
    }
}
