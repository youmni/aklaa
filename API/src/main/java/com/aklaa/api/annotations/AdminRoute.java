package com.aklaa.api.annotations;

import org.springframework.security.access.prepost.PreAuthorize;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@PreAuthorize("hasRole('ROLE_ADMIN')")
@Target({ ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface AdminRoute {
}
