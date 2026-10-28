package com.jobtrack.application;

import com.jobtrack.user.User;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "job_applications", indexes = @Index(name = "idx_application_user", columnList = "user_id"))
public class JobApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String company;

    @Column(nullable = false, length = 160)
    private String position;

    @Column(length = 160)
    private String location;

    @Column(name = "employment_type", length = 40)
    private String employmentType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    private LocalDate appliedDate;

    @Column(length = 100)
    private String salary;

    @Column(length = 500)
    private String jobUrl;

    @Column(length = 120)
    private String recruiterName;

    @Column(length = 160)
    private String recruiterEmail;

    @Column(length = 40)
    private String recruiterPhone;

    @Column(length = 120)
    private String resumeVersion;

    @Column(length = 120)
    private String referralName;

    @Column(length = 200)
    private String referralContact;

    @Column(length = 2000)
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    protected JobApplication() {}

    public JobApplication(String company, String position, String location, String employmentType,
                          ApplicationStatus status, LocalDate appliedDate, String salary,
                          String jobUrl, String recruiterName, String recruiterEmail,
                          String recruiterPhone, String resumeVersion, String referralName,
                          String referralContact, String notes, User user) {
        this.company = company;
        this.position = position;
        this.location = location;
        this.employmentType = employmentType;
        this.status = status == null ? ApplicationStatus.APPLIED : status;
        this.appliedDate = appliedDate;
        this.salary = salary;
        this.jobUrl = jobUrl;
        this.recruiterName = recruiterName;
        this.recruiterEmail = recruiterEmail;
        this.recruiterPhone = recruiterPhone;
        this.resumeVersion = resumeVersion;
        this.referralName = referralName;
        this.referralContact = referralContact;
        this.notes = notes;
        this.user = user;
    }

    public void update(String company, String position, String location, String employmentType,
                       ApplicationStatus status, LocalDate appliedDate, String salary,
                       String jobUrl, String recruiterName, String recruiterEmail,
                       String recruiterPhone, String resumeVersion, String referralName,
                       String referralContact, String notes) {
        this.company = company;
        this.position = position;
        this.location = location;
        this.employmentType = employmentType;
        this.status = status == null ? ApplicationStatus.APPLIED : status;
        this.appliedDate = appliedDate;
        this.salary = salary;
        this.jobUrl = jobUrl;
        this.recruiterName = recruiterName;
        this.recruiterEmail = recruiterEmail;
        this.recruiterPhone = recruiterPhone;
        this.resumeVersion = resumeVersion;
        this.referralName = referralName;
        this.referralContact = referralContact;
        this.notes = notes;
    }

    public Long getId() { return id; }
    public String getCompany() { return company; }
    public String getPosition() { return position; }
    public String getLocation() { return location; }
    public String getEmploymentType() { return employmentType; }
    public ApplicationStatus getStatus() { return status; }
    public LocalDate getAppliedDate() { return appliedDate; }
    public String getSalary() { return salary; }
    public String getJobUrl() { return jobUrl; }
    public String getRecruiterName() { return recruiterName; }
    public String getRecruiterEmail() { return recruiterEmail; }
    public String getRecruiterPhone() { return recruiterPhone; }
    public String getResumeVersion() { return resumeVersion; }
    public String getReferralName() { return referralName; }
    public String getReferralContact() { return referralContact; }
    public String getNotes() { return notes; }
}
