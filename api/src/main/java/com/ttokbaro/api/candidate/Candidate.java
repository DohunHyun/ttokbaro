package com.ttokbaro.api.candidate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;

@Entity
@Table(
        name = "candidates",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_candidate_identity",
                columnNames = {"sg_id", "sg_typecode", "sd_name", "name", "party_name"}
        )
)
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sg_id", nullable = false, length = 32)
    private String sgId;

    @Column(name = "sg_typecode", nullable = false)
    private Integer sgTypecode;

    @Column(name = "sd_name", nullable = false, length = 128)
    private String sdName;

    @Column(name = "sgg_name", length = 128)
    private String sggName;

    @Column(nullable = false, length = 128)
    private String name;

    @Column(name = "party_name", length = 128)
    private String partyName;

    @Column(name = "raw_xml", columnDefinition = "text", nullable = false)
    private String rawXml;

    @Column(nullable = false, length = 64)
    private String source;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Candidate() {
    }

    public Candidate(
            String sgId,
            Integer sgTypecode,
            String sdName,
            String sggName,
            String name,
            String partyName,
            String rawXml,
            String source,
            Instant updatedAt
    ) {
        this.sgId = sgId;
        this.sgTypecode = sgTypecode;
        this.sdName = sdName;
        this.sggName = sggName;
        this.name = name;
        this.partyName = partyName;
        this.rawXml = rawXml;
        this.source = source;
        this.updatedAt = updatedAt;
    }

    public void updateFrom(String sggName, String partyName, String rawXml, String source, Instant updatedAt) {
        this.sggName = sggName;
        this.partyName = partyName;
        this.rawXml = rawXml;
        this.source = source;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public String getSdName() {
        return sdName;
    }

    public String getSgId() {
        return sgId;
    }

    public Integer getSgTypecode() {
        return sgTypecode;
    }

    public String getSggName() {
        return sggName;
    }

    public String getName() {
        return name;
    }

    public String getPartyName() {
        return partyName;
    }

    public String getRawXml() {
        return rawXml;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
