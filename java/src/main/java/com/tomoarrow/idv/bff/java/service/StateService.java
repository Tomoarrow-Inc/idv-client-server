package com.tomoarrow.idv.bff.java.service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class StateService {
    private final Map<String, Object> values = new ConcurrentHashMap<>();

    public void set(String key, Object value) {
        values.put(key, value);
    }

    public Object get(String key) {
        return values.get(key);
    }

    public void clear() {
        values.clear();
    }
}
