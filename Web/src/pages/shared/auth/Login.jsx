import React, { useState } from "react";
import axios from "axios";
import api from "../../../api/axiosConfig";
import RedirectToPath from "../../../components/Redirect";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
    Button,
    Fieldset,
    Input,
    Stack,
    Box,
    Spinner,
} from "@chakra-ui/react"
import { Field } from '../../../components/ui/field';

const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const { user, setUser } = useAuth();

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

            const response = await api.post('/auth/login', sanitizedData);

            const me = await api.get("/auth/me");
            setUser(me.data || null);

            const successMsg = response?.data?.message
                ? response.data.message
                : `Login successful for ${form.email}.`;

            setSuccessMessage(successMsg);
            setForm({
                email: "",
                password: ""
            });

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

    if (user) {
        return <RedirectToPath />;
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
                    <Box position="absolute" top={4} right={4} fontSize="sm">
                        <RouterLink to="/auth/password-reset" style={{ textDecoration: 'underline', color: '#000000ff', fontWeight: 600 }}>
                            Forgot password?
                        </RouterLink>
                    </Box>
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

                            <Field label="Email address" required invalid={!!errors.email} errorText={errors.email}>
                                <Input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                            </Field>

                            <Field label="Password" required invalid={!!errors.password} errorText={errors.password}>
                                <Input
                                    name="password"
                                    type="password"
                                    value={form.password}
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
                            Login
                        </Button>
                        <Box mt={4} textAlign="center" fontSize="sm">
                            Not registered yet?{' '}
                            <RouterLink to="/auth/register" style={{ textDecoration: 'underline', color: '#319795', fontWeight: 600 }}>
                                Register
                            </RouterLink>
                        </Box>
                    </Fieldset.Root>
                </form>
            </Box>
        </Box>
    )
};

export default Login;