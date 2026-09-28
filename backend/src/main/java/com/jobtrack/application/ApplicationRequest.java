package com.jobtrack.application;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record ApplicationRequest(
        @NotBlank @Size(max = 120) String company,
        @NotBlank @Size(max = 160) String position,
        @Size(max = 160) String location,
        @Size(max = 40) String employmentType,
        ApplicationStatus status,
        LocalDate appliedDate,
        @Size(max = 100) String salary,
        @Size(max = 500) String jobUrl,
        @Size(max = 2000) String notes
) {}
