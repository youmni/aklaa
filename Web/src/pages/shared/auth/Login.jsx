import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import authService from "../../../services/authService";
import RedirectToPath from "../../../components/navigation/Redirect";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useThemeColors } from "../../../hooks/useThemeColors";
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
    const { t } = useTranslation('auth');
    const navigate = useNavigate();
    const colors = useThemeColors();
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
            newErrors.email = t('login.emailRequired');
        } else if (!/\S+@\S+\.\S+/.test(form.email.trim())) {
            newErrors.email = t('login.emailInvalid');
        }
        if (!form.password || form.password === "") {
            newErrors.password = t('login.passwordRequired');
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

            const response = await authService.login(sanitizedData);

            const me = await authService.getMe();
            setUser(me.data || null);

            const successMsg = response?.data?.message
                ? response.data.message
                : t('login.loginSuccess', { email: form.email });

            setSuccessMessage(successMsg);
            setForm({
                email: "",
                password: ""
            });

        } catch (error) {
            const errMsg =
                error?.response?.data?.message ||
                error?.message ||
                t('login.loginFailed');

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
                    <Box position="absolute" top={4} right={4} fontSize="sm">
                        <RouterLink to="/auth/password-reset" style={{ textDecoration: 'underline', color: colors.text.brand, fontWeight: 600 }}>
                            {t('login.forgotPassword')}
                        </RouterLink>
                    </Box>
                    <Fieldset.Root size="lg">
                        <Stack>
                            <Fieldset.Legend>{t('login.title')}</Fieldset.Legend>
                            <Fieldset.HelperText>
                                {t('login.subtitle')}
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

                            <Field label={t('login.emailLabel')} required invalid={!!errors.email} errorText={errors.email}>
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

                            <Field label={t('login.passwordLabel')} required invalid={!!errors.password} errorText={errors.password}>
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
                            {t('login.submitButton')}
                        </Button>
                        <Box mt={4} textAlign="center" fontSize="sm" color={colors.text.secondary}>
                            {t('login.notRegistered')}{' '}
                            <RouterLink to="/auth/register" style={{ textDecoration: 'underline', color: colors.text.brand, fontWeight: 600 }}>
                                {t('login.registerLink')}
                            </RouterLink>
                        </Box>
                    </Fieldset.Root>
                </form>
            </Box>
        </Box>
    )
};

export default Login;