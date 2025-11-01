package com.aklaa.api.validators;

import com.aklaa.api.annotations.ValidEnum;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Arrays;
public class EnumValidator implements ConstraintValidator<ValidEnum, Enum<?>> {
    private String[] acceptedValues;

    @Override
    public void initialize(ValidEnum annotation) {
        acceptedValues = Arrays.stream(annotation.enumClass().getEnumConstants())
                .map(Enum::name)
                .toArray(String[]::new);
    }

    @Override
    public boolean isValid(Enum<?> value, ConstraintValidatorContext context) {
        if (value == null) return true;

        boolean valid = Arrays.stream(acceptedValues)
                .anyMatch(v -> v.equals(value.name()));

        if (!valid) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(
                    "Value '" + value + "' is invalid. Approved values: " +
                            String.join(", ", acceptedValues)
            ).addConstraintViolation();
        }

        return valid;
    }
}
