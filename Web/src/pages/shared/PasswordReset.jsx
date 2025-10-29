import React, { useState } from "react";
import api from "../../api/axiosConfig";
import RedirectToPath from "../../components/Redirect";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
    Button,
    Box,
    Input,
    Spinner,
    Stack,
    Text,
} from "@chakra-ui/react";

const PasswordReset = () => {
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        setEmail(e.target.value);

        if (errors.email) setErrors({ ...errors, email: "" });
        if (successMessage) setSuccessMessage("");
    };

    const validateForm = () => {
        const newErrors = {};
        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
            newErrors.email = "Invalid email address";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});
        setSuccessMessage("");

        try {
            const response = await api.post("/auth/reset-password", { email: email.trim().toLowerCase() });

            const successMsg = response?.data?.message
                ? response.data.message
                : "If an account with that email exists, a password reset link has been sent.";

            setSuccessMessage(successMsg);
            setEmail("");
        } catch (error) {
            setErrors({
                submit:
                    error?.response?.data?.message || 
                    error?.message ||
                    "Password reset failed. Please check your email and try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            minH="100vh"
            bg="gray.50"
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={4}
        >
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
                    <Stack spacing={4}>
                        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
                            Reset Password
                        </Text>
                        <Text fontSize="sm" color="gray.600" textAlign="center">
                            Enter your email address to receive a password reset link.
                        </Text>

                        {successMessage && (
                            <Box
                                p={4}
                                bg="green.50"
                                color="green.800"
                                borderRadius="md"
                                fontSize="sm"
                                textAlign="center"
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
                                fontSize="sm"
                                textAlign="center"
                            >
                                {errors.submit}
                            </Box>
                        )}

                        <Box>
                            <Text mb={1} fontWeight="medium">
                                Email
                            </Text>
                            <Input
                                name="email"
                                type="email"
                                value={email}
                                onChange={handleChange}
                                isInvalid={!!errors.email}
                                placeholder="example@mail.com"
                            />
                            {errors.email && (
                                <Text mt={1} fontSize="sm" color="red.500">
                                    {errors.email}
                                </Text>
                            )}
                        </Box>

                        <Button
                            type="submit"
                            colorScheme="teal"
                            width="full"
                            isLoading={isLoading}
                            spinnerPlacement="center"
                        >
                            Send Reset Link
                        </Button>

                        <Text fontSize="sm" textAlign="center">
                            Don't have an account?{" "}
                            <RouterLink
                                to="/auth/register"
                                style={{ color: "#319795", fontWeight: 600 }}
                            >
                                Register
                            </RouterLink>
                        </Text>
                    </Stack>
                </form>
            </Box>
        </Box>
    );
};

export default PasswordReset;
