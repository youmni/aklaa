import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import authService from "../../../services/authService";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
    Button,
    Fieldset,
    Input,
    Stack,
    Box,
    Spinner,
    Text,
} from "@chakra-ui/react";
import { Field } from '../../../components/ui/field';

const PasswordReset = () => {
    const { t } = useTranslation('auth');
    const navigate = useNavigate();
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
            newErrors.email = t('forgotPassword.emailRequired');
        } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
            newErrors.email = t('forgotPassword.emailInvalid');
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
            const response = await authService.requestPasswordReset(email.trim().toLowerCase());

            const successMsg = response?.data?.message
                ? response.data.message
                : t('forgotPassword.resetSuccess');

            setSuccessMessage(successMsg);
            setEmail("");
        } catch (error) {
            setErrors({
                submit:
                    error?.response?.data?.message ||
                    error?.message ||
                    t('forgotPassword.resetFailed'),
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
                <Box position="absolute" top={4} right={4} fontSize="sm">
                    <RouterLink to="/auth/login" style={{ textDecoration: 'underline', color: '#000000ff', fontWeight: 600 }}>
                        {t('forgotPassword.backToLogin')}
                    </RouterLink>
                </Box>

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
                            <Fieldset.Legend>{t('forgotPassword.title')}</Fieldset.Legend>
                            <Fieldset.HelperText>
                                {t('forgotPassword.subtitle')}
                            </Fieldset.HelperText>
                        </Stack>

                        <Fieldset.Content>
                            {successMessage && (
                                <Box
                                    p={4}
                                    bg="green.50"
                                    color="green.800"
                                    borderRadius="md"
                                    fontSize="sm"
                                    textAlign="center"
                                    mb={4}
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
                                    mb={4}
                                >
                                    {errors.submit}
                                </Box>
                            )}

                            <Field label={t('forgotPassword.emailLabel')} required invalid={!!errors.email} errorText={errors.email}>
                                <Input
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={handleChange}
                                    placeholder={t('forgotPassword.emailPlaceholder')}
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
                            {t('forgotPassword.submitButton')}
                        </Button>
                        <Box mt={4} textAlign="center" fontSize="sm">
                            {t('forgotPassword.dontHaveAccount')}{' '}
                            <RouterLink to="/auth/register" style={{ color: '#319795', fontWeight: 600 }}>
                                {t('forgotPassword.registerLink')}
                            </RouterLink>
                        </Box>
                    </Fieldset.Root>
                </form>
            </Box>
        </Box>
    );
};

export default PasswordReset;
