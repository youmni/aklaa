import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../../hooks/useThemeColors";
import authService from "../../../services/authService";
import {
  Button,
  Fieldset,
  Input,
  Stack,
  Box,
  Spinner,
  Text,
  Link,
  Checkbox,
} from "@chakra-ui/react"
import { Field } from '../../../components/ui/field';

const Register = () => {
  const { t } = useTranslation('auth');
  const colors = useThemeColors();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
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

    if (!form.acceptTerms) {
      newErrors.acceptTerms = t('register.termsRequired');
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
        confirmPassword: "",
        acceptTerms: false
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
    <Box minH="100vh" bg={colors.bg.page} display="flex" alignItems="center" justifyContent="center">
      <Box
        p={8}
        bg={colors.card.bg}
        borderRadius="lg"
        boxShadow={colors.card.shadow}
        border="1px solid"
        borderColor={colors.border.default}
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
            bg={colors.modal.overlay}
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="lg"
            zIndex={10}
          >
            <Spinner size="xl" thickness="4px" color={colors.text.brand} />
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
                  borderColor={colors.border.default}
                  focusBorderColor={colors.text.brand}
                  _hover={{ borderColor: colors.border.hover }}
                />
              </Field>

              <Field label={t('register.lastNameLabel')} required invalid={!!errors.lastName} errorText={errors.lastName}>
                <Input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  borderColor={colors.border.default}
                  focusBorderColor={colors.text.brand}
                  _hover={{ borderColor: colors.border.hover }}
                />
              </Field>

              <Field label={t('register.emailLabel')} required invalid={!!errors.email} errorText={errors.email}>
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  borderColor={colors.border.default}
                  focusBorderColor={colors.text.brand}
                  _hover={{ borderColor: colors.border.hover }}
                />
              </Field>

              <Field label={t('register.passwordLabel')} required invalid={!!errors.password} errorText={errors.password}>
                <Input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  borderColor={colors.border.default}
                  focusBorderColor={colors.text.brand}
                  _hover={{ borderColor: colors.border.hover }}
                />
              </Field>

              <Field label={t('register.confirmPasswordLabel')} required invalid={!!errors.confirmPassword} errorText={errors.confirmPassword}>
                <Input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  borderColor={colors.border.default}
                  focusBorderColor={colors.text.brand}
                  _hover={{ borderColor: colors.border.hover }}
                />
              </Field>

              <Box mt={2}>
                <Checkbox.Root
                  checked={form.acceptTerms}
                  onCheckedChange={(e) => {
                    setForm({ ...form, acceptTerms: e.checked });
                    if (errors.acceptTerms) {
                      setErrors({ ...errors, acceptTerms: "" });
                    }
                  }}
                  colorPalette="cyan"
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label>
                    <Text fontSize="sm" color={colors.text.secondary}>
                      {t('register.acceptTerms')}{' '}
                      <Link
                        href="/privacy-policy-en.html"
                        target="_blank"
                        color={colors.text.brand}
                        textDecoration="underline"
                        fontWeight="600"
                      >
                        {t('register.termsOfService')}
                      </Link>
                      {' '}{t('register.and')}{' '}
                      <Link
                        href="/terms-conditions-en.html"
                        target="_blank"
                        color={colors.text.brand}
                        textDecoration="underline"
                        fontWeight="600"
                      >
                        {t('register.privacyPolicy')}
                      </Link>
                    </Text>
                  </Checkbox.Label>
                </Checkbox.Root>
                {errors.acceptTerms && (
                  <Text fontSize="sm" color="red.500" mt={1}>
                    {errors.acceptTerms}
                  </Text>
                )}
              </Box>
            </Fieldset.Content>
            <Button
              type="submit"
              bg={colors.button.primary.bg}
              color="white"
              _hover={{ bg: colors.button.primary.hover }}
              width="full"
              mt={4}
              isLoading={isLoading}
              spinnerPlacement="center"
              isDisabled={isLoading}
            >
              {t('register.submitButton')}
            </Button>
            <Box mt={4} textAlign="center" fontSize="sm" color={colors.text.secondary}>
              {t('register.alreadyHaveAccount')}{' '}
              <RouterLink to="/auth/login" style={{ textDecoration: 'underline', color: colors.text.brand, fontWeight: 600 }}>
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