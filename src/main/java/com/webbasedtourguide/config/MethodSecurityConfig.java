package com.webbasedtourguide.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

/**
 * Makes @PreAuthorize work. Without this, the annotations are silently ignored.
 * Not active in "dev" profile (dev has no login, so every @PreAuthorize would fail).
 */
@Configuration
@Profile("!dev")
@EnableMethodSecurity
public class MethodSecurityConfig {
}
