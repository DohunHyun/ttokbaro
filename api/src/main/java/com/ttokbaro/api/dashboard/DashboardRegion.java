package com.ttokbaro.api.dashboard;

import java.util.Arrays;

public enum DashboardRegion {
    SEOUL("seoul");

    private final String value;

    DashboardRegion(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static DashboardRegion from(String value) {
        return Arrays.stream(values())
                .filter(region -> region.value.equalsIgnoreCase(value))
                .findFirst()
                .orElse(null);
    }
}
