import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Field,
  Fieldset,
  Input,
  Stack,
  Box,
  Spinner,
} from "@chakra-ui/react"

const Register = () => {
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
      newErrors.firstName = "First name must be between 1 and 100 characters";
    }

    const sanitizedLastName = sanitizeInput(form.lastName);
    if (sanitizedLastName.length < 1 || sanitizedLastName.length > 100) {
      newErrors.lastName = "Last name must be between 1 and 100 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!form.password || !passwordRegex.test(form.password)) {
      newErrors.password = "Password must be at least 8 characters with uppercase, lowercase, number and special character (@#$%^&+=!)";
    }

    if (!form.confirmPassword || form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        sanitizedData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccessMessage(`Registration successful! An activation email has been sent to ${form.email}. Please check your inbox and follow the instructions to activate your account.`);

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
      });

    } catch (error) {
      setErrors({
        submit: 'Registration failed. This email address may already be in use or there was a problem with the registration. Please try again or contact support if the problem persists.'
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
              <Fieldset.Legend>Registration</Fieldset.Legend>
              <Fieldset.HelperText>
                Please fill in the Registration form below to become a member of aklaa.
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

              <Field.Root invalid={!!errors.firstName}>
                <Field.Label>First Name</Field.Label>
                <Input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <Field.ErrorText>{errors.firstName}</Field.ErrorText>
                )}
              </Field.Root>

              <Field.Root invalid={!!errors.lastName}>
                <Field.Label>Last Name</Field.Label>
                <Input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && (
                  <Field.ErrorText>{errors.lastName}</Field.ErrorText>
                )}
              </Field.Root>

              <Field.Root invalid={!!errors.email}>
                <Field.Label>Email address</Field.Label>
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <Field.ErrorText>{errors.email}</Field.ErrorText>
                )}
              </Field.Root>

              <Field.Root invalid={!!errors.password}>
                <Field.Label>Password</Field.Label>
                <Input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <Field.ErrorText>{errors.password}</Field.ErrorText>
                )}
              </Field.Root>

              <Field.Root invalid={!!errors.confirmPassword}>
                <Field.Label>Confirm Password</Field.Label>
                <Input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && (
                  <Field.ErrorText>{errors.confirmPassword}</Field.ErrorText>
                )}
              </Field.Root>
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
              Submit
            </Button>
            <Box mt={4} textAlign="center" fontSize="sm">
              Already have an account?{' '}
              <RouterLink to="/auth/login" style={{ textDecoration: 'underline', color: '#319795', fontWeight: 600 }}>
                Login
              </RouterLink>
            </Box>
          </Fieldset.Root>
        </form>
      </Box>
    </Box>
  )
};

export default Register;