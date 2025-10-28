import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Field,
  Fieldset,
  Input,
  Stack,
  Box,
} from "@chakra-ui/react"

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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

  const validateForm = () => {
    const newErrors = {};
    if (!form.email || form.email.trim() === "") {
      newErrors.email = "Email is verplicht";
    } else if (!/\S+@\S+\.\S+/.test(form.email.trim())) {
      newErrors.email = "Ongeldig e-mailadres";
    }
    if (!form.password || form.password === "") {
      newErrors.password = "Wachtwoord is verplicht";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        email: form.email.trim().toLowerCase(),
        password: form.password,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        sanitizedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const successMsg = response?.data?.message
        ? response.data.message
        : `Login successful for ${form.email}.`;

      setSuccessMessage(successMsg);
      setForm({
        email: "",
        password: ""
      });
      navigate("/");
      
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        error?.message ||
        'Login failed. Please check your email and password and try again.';

      setErrors({
        submit: errMsg
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
      >
        <form onSubmit={handleSubmit}>
          <Fieldset.Root size="lg">
            <Stack>
              <Fieldset.Legend>Login</Fieldset.Legend>
              <Fieldset.HelperText>
                Please fill in the Login form below to access your account.
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
              {isLoading ? null : "Login"}
            </Button>
          </Fieldset.Root>
        </form>
      </Box>
    </Box>
  )
};

export default Login;