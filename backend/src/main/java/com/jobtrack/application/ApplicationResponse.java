package com.jobtrack.application;

import java.time.LocalDate;

public record ApplicationResponse(
        Long id,
        String company,
        String position,
        String location,
        String employmentType,
        String status,
        LocalDate appliedDate,
        String salary,
        String jobUrl,
        String recruiterName,
        String recruiterEmail,
        String recruiterPhone,
        String resumeVersion,
        String referralName,
        String referralContact,
        String notes
) {
    public static ApplicationResponse from(JobApplication application) {
        return new ApplicationResponse(
                application.getId(),
                application.getCompany(),
                application.getPosition(),
                application.getLocation(),
                application.getEmploymentType(),
                statusLabel(application.getStatus()),
                application.getAppliedDate(),
                application.getSalary(),
                application.getJobUrl(),
                application.getRecruiterName(),
                application.getRecruiterEmail(),
                application.getRecruiterPhone(),
                application.getResumeVersion(),
                application.getReferralName(),
                application.getReferralContact(),
                application.getNotes()
        );
    }

    private static String statusLabel(ApplicationStatus status) {
        return switch (status) {
            case INTERVIEW, INTERVIEWED -> "Interviewed";
            case OFFER, OFFERED -> "Offered";
            default -> status.name().substring(0, 1) + status.name().substring(1).toLowerCase();
        };
    }
}
