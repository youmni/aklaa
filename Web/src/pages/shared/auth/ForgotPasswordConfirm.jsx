import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link as RouterLink } from "react-router-dom";
import api from "../../../api/axiosConfig";
import {
    Button,
    Fieldset,
    Input,
    Stack,
    Box,
    Spinner,
} from "@chakra-ui/react"
import StatusCard from "../../../components/ui/StatusMessageCard";
import { Field } from "../../../components/ui/field";

const PasswordResetConfirm = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [form, setForm] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState("");
    const [tokenValid, setTokenValid] = useState(false);

    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/;

    useEffect(() => {
        if (!token) {
            setErrors({ token: "No token provided." });
            setIsLoading(false);
            return;
        }

        const checkToken = async () => {
            try {
                await api.get(`/auth/reset-password?token=${token}`);
                setTokenValid(true);
            } catch (err) {
                const apiMessage = err.response?.data?.message || err.response?.data;
                setErrors({ token: apiMessage || "Token is invalid or expired." });
            } finally {
                setIsLoading(false);
            }
        };

        checkToken();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }

        if (successMessage) setSuccessMessage("");
    };

    const validateForm = () => {
        const newErrors = {};
        if (!form.newPassword || !passwordRegex.test(form.newPassword)) {
            newErrors.newPassword = "Password must be at least 8 characters, include upper and lower case letters, a number and a special character, and contain no spaces.";
        }
        if (form.newPassword !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
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
            const response = await api.post("/auth/reset-password/confirm", {
                token,
                newPassword: form.newPassword
            });
            const msg = response?.data?.message || response?.data || "Password successfully updated!";
            setSuccessMessage(msg);
            setForm({ newPassword: "", confirmPassword: "" });
            navigate("/auth/login");
        } catch (err) {
            const apiMessage = err.response?.data?.message || err.response?.data || "Error updating password.";
            setErrors({ submit: apiMessage });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
                <Spinner size="xl" color="teal.500" />
            </Box>
        );
    }

    if (errors.token) {
        return (
            <StatusCard
                success={false}
                title="Password reset failed"
                message={errors.token}
                onPrimaryClick={() => navigate("/auth/password-reset")}
                primaryText="Request new link"
            />
        );
    }

    if (errors.submit) {
        return (
            <StatusCard
                success={false}
                title="Update failed"
                message={errors.submit}
                onPrimaryClick={() => navigate("/auth/password-reset")}
                primaryText="Request new link"
            />
        );
    }

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
                            <Fieldset.Legend>Reset password</Fieldset.Legend>
                            <Fieldset.HelperText>
                                Enter a new password and confirm it.
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

                            <Stack spacing={4}>
                                <Field label="New password" required invalid={!!errors.newPassword} errorText={errors.newPassword}>
                                    <Input
                                        name="newPassword"
                                        type="password"
                                        value={form.newPassword}
                                        onChange={handleChange}
                                    />
                                </Field>

                                <Field label="Confirm password" required invalid={!!errors.confirmPassword} errorText={errors.confirmPassword}>
                                    <Input
                                        name="confirmPassword"
                                        type="password"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </Field>
                            </Stack>
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
                            Reset password
                        </Button>
                    </Fieldset.Root>
                </form>
            </Box>
        </Box>
    )
};

export default PasswordResetConfirm;