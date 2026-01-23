import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import authService from "../../../services/authService";
import {
  Button,
  Fieldset,
  Input,
  Stack,
  Box,
  Spinner,
} from "@chakra-ui/react"
import { Field } from '../../../components/ui/field';

const Register = () => {
  const { t } = useTranslation('auth');
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/;

  const sanitizeInput = (input) => {
    return input.trim().replace(/[<>]/g, '');
  };

  const validateForm = () => {
    const newErrors = {};

    const sanitizedFirstName = sanitizeInput(form.firstName);
    if (sanitizedFirstName.length < 1 || sanitizedFirstName.length > 100) {
      newErrors.firstName = t('register.firstNameRequired');
    }

    const sanitizedLastName = sanitizeInput(form.lastName);
    if (sanitizedLastName.length < 1 || sanitizedLastName.length > 100) {
      newErrors.lastName = t('register.lastNameRequired');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !emailRegex.test(form.email)) {
      newErrors.email = t('register.emailInvalid');
    }

    if (!form.password || !passwordRegex.test(form.password)) {
      newErrors.password = t('register.passwordInvalid');
    }

    if (!form.confirmPassword || form.password !== form.confirmPassword) {
      newErrors.confirmPassword = t('register.passwordMismatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }

    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage("");
    setErrors({});

    try {
      const sanitizedData = {
        firstName: sanitizeInput(form.firstName),
        lastName: sanitizeInput(form.lastName),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      };

      await authService.register(sanitizedData);

      setSuccessMessage(t('register.registerSuccess', { email: form.email }));

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
      });

    } catch (error) {
      setErrors({
        submit: t('register.registerFailed')
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
      <Box
        p={8}
        bg="white"
        borderRadius="lg"
        boxShadow="lg"
        w="full"
        maxW="md"
        position="relative"
      >
        {isLoading && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="rgba(255,255,255,0.6)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="lg"
            zIndex={10}
          >
            <Spinner size="xl" thickness="4px" color="teal.500" />
          </Box>
        )}
        <form onSubmit={handleSubmit}>
          <Fieldset.Root size="lg">
            <Stack>
              <Fieldset.Legend>{t('register.title')}</Fieldset.Legend>
              <Fieldset.HelperText>
                {t('register.subtitle')}
              </Fieldset.HelperText>
            </Stack>

            <Fieldset.Content>
              {successMessage && (
                <Box
                  p={4}
                  bg="green.50"
                  color="green.800"
                  borderRadius="md"
                  mb={4}
                  fontSize="sm"
                >
                  {successMessage}
                </Box>
              )}

              {errors.submit && (
                <Box
                  p={4}
                  bg="red.50"
                  color="red.800"
                  borderRadius="md"
                  mb={4}
                  fontSize="sm"
                >
                  {errors.submit}
                </Box>
              )}

              <Field label={t('register.firstNameLabel')} required invalid={!!errors.firstName} errorText={errors.firstName}>
                <Input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                />
              </Field>

              <Field label={t('register.lastNameLabel')} required invalid={!!errors.lastName} errorText={errors.lastName}>
                <Input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                />
              </Field>

              <Field label={t('register.emailLabel')} required invalid={!!errors.email} errorText={errors.email}>
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </Field>

              <Field label={t('register.passwordLabel')} required invalid={!!errors.password} errorText={errors.password}>
                <Input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                />
              </Field>

              <Field label={t('register.confirmPasswordLabel')} required invalid={!!errors.confirmPassword} errorText={errors.confirmPassword}>
                <Input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
              </Field>
            </Fieldset.Content>
            <Button
              type="submit"
              colorScheme="teal"
              width="full"
              mt={4}
              isLoading={isLoading}
              spinnerPlacement="center"
              isDisabled={isLoading}
            >
              {t('register.submitButton')}
            </Button>
            <Box mt={4} textAlign="center" fontSize="sm">
              {t('register.alreadyHaveAccount')}{' '}
              <RouterLink to="/auth/login" style={{ textDecoration: 'underline', color: '#319795', fontWeight: 600 }}>
                {t('register.loginLink')}
              </RouterLink>
            </Box>
          </Fieldset.Root>
        </form>
      </Box>
    </Box>
  )
};

export default Register;