package com.ttokbaro.api.dashboard;

import java.util.Arrays;

public enum DashboardElectionType {
    SUPERINTENDENT("SUPERINTENDENT", null),
    MAYOR("MAYOR", 3),
    DISTRICT_HEAD("DISTRICT_HEAD", null),
    CITY_COUNCIL_DISTRICT("CITY_COUNCIL_DISTRICT", null),
    CITY_COUNCIL_PR("CITY_COUNCIL_PR", null),
    DISTRICT_COUNCIL_DISTRICT("DISTRICT_COUNCIL_DISTRICT", null),
    DISTRICT_COUNCIL_PR("DISTRICT_COUNCIL_PR", null);

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
