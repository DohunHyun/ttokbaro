package com.ttokbaro.api.evidence;

import com.ttokbaro.api.claim.Claim;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "evidences")
public class Evidence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "claim_id", nullable = false)
    private Claim claim;

    @Column(length = 2048)
    private String url;

    @Column(columnDefinition = "text")
    private String note;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    protected Evidence() {
    }

    private Evidence(Claim claim, String url, String note) {
        this.claim = claim;
        this.url = url;
        this.note = note;
    }

    public static Evidence of(Claim claim, String url, String note) {
        return new Evidence(claim, url, note);
    }

    @PrePersist
    void prePersist() {
        this.createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public Claim getClaim() {
        return claim;
    }

    public String getUrl() {
        return url;
    }

    public String getNote() {
        return note;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
