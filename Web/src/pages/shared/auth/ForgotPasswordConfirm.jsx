import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link as RouterLink } from "react-router-dom";
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
} from "@chakra-ui/react"
import StatusCard from "../../../components/ui/StatusMessageCard";
import { Field } from "../../../components/ui/field";

const PasswordResetConfirm = () => {
    const { t } = useTranslation('auth');
    const navigate = useNavigate();
    const colors = useThemeColors();
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
            setErrors({ token: t('forgotPasswordConfirm.noToken') });
            setIsLoading(false);
            return;
        }

        const checkToken = async () => {
            try {
                await authService.validateResetToken(token);
                setTokenValid(true);
            } catch (err) {
                const apiMessage = err.response?.data?.message || err.response?.data;
                setErrors({ token: apiMessage || t('forgotPasswordConfirm.tokenInvalid') });
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
            newErrors.newPassword = t('forgotPasswordConfirm.passwordInvalid');
        }
        if (form.newPassword !== form.confirmPassword) {
            newErrors.confirmPassword = t('forgotPasswordConfirm.passwordMismatch');
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
            const response = await authService.confirmPasswordReset({
                token,
                newPassword: form.newPassword
            });
            const msg = response?.data?.message || response?.data || t('forgotPasswordConfirm.resetSuccess');
            setSuccessMessage(msg);
            setForm({ newPassword: "", confirmPassword: "" });
            navigate("/auth/login");
        } catch (err) {
            const apiMessage = err.response?.data?.message || err.response?.data || t('forgotPasswordConfirm.resetFailed');
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
                title={t('forgotPasswordConfirm.resetFailedTitle')}
                message={errors.token}
                onPrimaryClick={() => navigate("/auth/password-reset")}
                primaryText={t('forgotPasswordConfirm.requestNewLink')}
            />
        );
    }

    if (errors.submit) {
        return (
            <StatusCard
                success={false}
                title={t('forgotPasswordConfirm.updateFailedTitle')}
                message={errors.submit}
                onPrimaryClick={() => navigate("/auth/password-reset")}
                primaryText={t('forgotPasswordConfirm.requestNewLink')}
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
                            <Fieldset.Legend>{t('forgotPasswordConfirm.title')}</Fieldset.Legend>
                            <Fieldset.HelperText>
                                {t('forgotPasswordConfirm.subtitle')}
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
                                <Field label={t('forgotPasswordConfirm.newPasswordLabel')} required invalid={!!errors.newPassword} errorText={errors.newPassword}>
                                    <Input
                                        name="newPassword"
                                        type="password"
                                        value={form.newPassword}
                                        onChange={handleChange}
                                    />
                                </Field>

                                <Field label={t('forgotPasswordConfirm.confirmPasswordLabel')} required invalid={!!errors.confirmPassword} errorText={errors.confirmPassword}>
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
                            {t('forgotPasswordConfirm.submitButton')}
                        </Button>
                    </Fieldset.Root>
                </form>
            </Box>
        </Box>
    )
};

export default PasswordResetConfirm;