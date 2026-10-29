package com.jobtrack.application;

public enum ApplicationStatus {
    SAVED,
    APPLIED,
    OFFERED,
    ACCEPTED,
    REJECTED,
    // Keep legacy values so existing applications remain readable.
    INTERVIEW,
    OFFER
}
