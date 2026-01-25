package com.ttokbaro.api.claim;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "claims")
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 2048)
    private String sourceUrl;

    @Column(columnDefinition = "text")
    private String text;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    protected Claim() { }

    private Claim(String sourceUrl, String text) {
        this.sourceUrl = sourceUrl;
        this.text = text;
    }

    @PrePersist
    void prePersist() {
        this.createdAt = Instant.now();
    }

    public static Claim of(String sourceUrl, String text) {
        return new Claim(sourceUrl, text);
    }

    public Long getId() { return id; }
    public String getSourceUrl() { return sourceUrl; }
    public String getText() { return text; }
    public Instant getCreatedAt() { return createdAt; }
}