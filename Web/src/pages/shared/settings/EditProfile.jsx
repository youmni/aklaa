import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Input, Stack, Spinner } from "@chakra-ui/react";
import { Field, Fieldset } from "@chakra-ui/react";
import { useSnackbar } from 'notistack';
import api from "../../../api/axiosConfig";
import { FiArrowLeft } from 'react-icons/fi';
import { AuthContext } from '../../../context/AuthContext';

const EditProfile = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { user, setUser } = useContext(AuthContext);

    const [form, setForm] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || ""
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
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                email: form.email.trim().toLowerCase(),
            };
            await api.put('/users/email', sanitizedData);
            const successMsg = 'Profile updated successfully. If the mail was changed, please confirm your new email address.';

            setSuccessMessage(successMsg);
            enqueueSnackbar(successMsg, { variant: 'success' });
            setForm({
                firstName: sanitizedData.firstName,
                lastName: sanitizedData.lastName,
                email: sanitizedData.email
            });
            const me = await api.get("/auth/me");
            setUser(me.data || null);
        } catch (error) {
            const errMsg = 'Profile update failed. Please check your input and try again.';
            setErrors({
                submit: errMsg
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box w="100%" maxW="full" mx="auto" bg="white" p={6} boxShadow="sm">

            {isLoading && (
                <Box
                    position="fixed"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="rgba(255,255,255,0.6)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    zIndex={10}
                >
                    <Spinner size="xl" thickness="4px" color="#083951" />
                </Box>
            )}
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <Fieldset.Root size="lg" w="100%">
                    <Stack w="100%">
                        <Fieldset.Legend fontSize="2xl" color={'#083951'}>
                            Edit Profile
                        </Fieldset.Legend>
                        <Fieldset.HelperText>
                            Please fill in the profile details below.
                        </Fieldset.HelperText>
                    </Stack>

                    <Fieldset.Content w="100%">
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
                                type="text"
                                value={form.firstName}
                                onChange={handleChange}
                                maxLength={100}
                                focusBorderColor="#083951"
                                width="100%"
                            />
                            {errors.firstName && (
                                <Field.ErrorText>{errors.firstName}</Field.ErrorText>
                            )}
                        </Field.Root>

                        <Field.Root invalid={!!errors.lastName}>
                            <Field.Label>Last Name</Field.Label>
                            <Input
                                name="lastName"
                                type="text"
                                value={form.lastName}
                                onChange={handleChange}
                                maxLength={250}
                                focusBorderColor="#083951"
                                width="100%"
                            />
                            {errors.lastName && (
                                <Field.ErrorText>{errors.lastName}</Field.ErrorText>
                            )}
                        </Field.Root>

                        <Field.Root invalid={!!errors.email}>
                            <Field.Label>Email</Field.Label>
                            <Input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                maxLength={250}
                                focusBorderColor="#083951"
                                width="100%"
                            />
                            {errors.email && (
                                <Field.ErrorText>{errors.email}</Field.ErrorText>
                            )}
                        </Field.Root>
                    </Fieldset.Content>
                    <Button
                        type="submit"
                        bg="#083951"
                        color="white"
                        width="full"
                        mt={4}
                        isLoading={isLoading}
                        spinnerPlacement="center"
                        isDisabled={isLoading}
                        _hover={{
                            bg: "#0a4a63"
                        }}
                    >
                        Update Profile
                    </Button>
                </Fieldset.Root>
            </form>
        </Box>
    )
};

export default EditProfile;