package com.jobtrack.application;

import com.jobtrack.user.User;
import com.jobtrack.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
public class ApplicationService {
    private final JobApplicationRepository applications;
    private final UserRepository users;

    public ApplicationService(JobApplicationRepository applications, UserRepository users) {
        this.applications = applications;
        this.users = users;
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> list(String email) {
        User user = findUser(email);
        return applications.findAllByUserIdOrderByAppliedDateDesc(user.getId())
                .stream().map(ApplicationResponse::from).toList();
    }

    public ApplicationResponse create(String email, ApplicationRequest request) {
        User user = findUser(email);
        JobApplication application = new JobApplication(
                request.company().trim(), request.position().trim(), request.location(),
                request.employmentType(), request.status(), request.appliedDate(), request.salary(),
                request.jobUrl(), request.notes(), user);
        return ApplicationResponse.from(applications.save(application));
    }

    public ApplicationResponse update(String email, Long id, ApplicationRequest request) {
        JobApplication application = findApplication(id, email);
        application.update(request.company().trim(), request.position().trim(), request.location(),
                request.employmentType(), request.status(), request.appliedDate(), request.salary(),
                request.jobUrl(), request.notes());
        return ApplicationResponse.from(application);
    }

    public void delete(String email, Long id) {
        applications.delete(findApplication(id, email));
    }

    private User findUser(String email) {
        return users.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Account not found."));
    }

    private JobApplication findApplication(Long id, String email) {
        User user = findUser(email);
        return applications.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found."));
    }
}
