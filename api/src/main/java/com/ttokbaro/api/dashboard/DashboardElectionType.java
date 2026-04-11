package com.ttokbaro.api.dashboard;

import java.util.Arrays;

public enum DashboardElectionType {
    MAYOR("MAYOR", 3),
    DISTRICT_HEAD("DISTRICT_HEAD", 4),
    CITY_COUNCIL("CITY_COUNCIL", 5),
    DISTRICT_COUNCIL("DISTRICT_COUNCIL", 6);

    private final String value;
    private final Integer sgTypecode;

    DashboardElectionType(String value, Integer sgTypecode) {
        this.value = value;
        this.sgTypecode = sgTypecode;
    }

    public Integer getSgTypecode() {
        return sgTypecode;
    }

    public String getValue() {
        return value;
    }

    public static DashboardElectionType from(String value) {
        return Arrays.stream(values())
                .filter(type -> type.value.equalsIgnoreCase(value))
                .findFirst()
                .orElse(null);
    }
}
