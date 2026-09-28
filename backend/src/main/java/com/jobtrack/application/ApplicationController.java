package com.jobtrack.application;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {
    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GetMapping
    public List<ApplicationResponse> list(@AuthenticationPrincipal UserDetails user) {
        return applicationService.list(user.getUsername());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApplicationResponse create(@AuthenticationPrincipal UserDetails user,
                                      @Valid @RequestBody ApplicationRequest request) {
        return applicationService.create(user.getUsername(), request);
    }

    @PutMapping("/{id}")
    public ApplicationResponse update(@AuthenticationPrincipal UserDetails user, @PathVariable Long id,
                                      @Valid @RequestBody ApplicationRequest request) {
        return applicationService.update(user.getUsername(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@AuthenticationPrincipal UserDetails user, @PathVariable Long id) {
        applicationService.delete(user.getUsername(), id);
    }
}
