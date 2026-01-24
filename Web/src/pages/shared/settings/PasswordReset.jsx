import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Box, Button, Input, Stack, Spinner } from "@chakra-ui/react";
import { Fieldset } from "@chakra-ui/react";
import { Field } from '../../../components/ui/field';
import { useSnackbar } from 'notistack';
import authService from "../../../services/authService";
import { useThemeColors } from '../../../hooks/useThemeColors';
const PasswordReset = () => {
    const { t } = useTranslation('settings');
    const colors = useThemeColors();
    const { enqueueSnackbar } = useSnackbar();
    const [form, setForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: ""
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

        if (!form.oldPassword || form.oldPassword.trim() === "") {
            newErrors.oldPassword = t('passwordReset.oldPasswordRequired');
        }

        const pwd = form.newPassword || "";
        const pwdPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/;
        if (!pwd || !pwdPattern.test(pwd)) {
            newErrors.newPassword = t('passwordReset.newPasswordError');
        }

        if (!form.confirmNewPassword || form.confirmNewPassword.trim() === "") {
            newErrors.confirmNewPassword = t('passwordReset.confirmPasswordRequired');
        } else if (form.confirmNewPassword !== form.newPassword) {
            newErrors.confirmNewPassword = t('passwordReset.confirmPasswordMismatch');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setSuccessMessage("");
        setErrors({});

        try {
            const res = await authService.resetPassword(form);

            const successMsg = t('passwordReset.updateSuccess');
            setSuccessMessage(successMsg);
            enqueueSnackbar(successMsg, { variant: 'success' });
            setForm({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
        } catch (error) {
            const errMsg = t('passwordReset.updateError');
            setErrors({ submit: errMsg });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box p={8} maxW="1200px" mx="auto" bg={colors.bg.primary} minH="calc(100vh - 73px)">
            {isLoading && (
                <Box
                    position="fixed"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg={colors.modal.overlay}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    zIndex={10}
                >
                    <Spinner size="xl" thickness="4px" color={colors.text.brand} />
                </Box>
            )}

            <form onSubmit={handleSubmit}>
                <Fieldset.Root size="lg">
                    <Stack>
                        <Fieldset.Legend fontSize="3xl" fontWeight="bold" color={colors.text.brand}>
                            {t('passwordReset.title')}
                        </Fieldset.Legend>
                        <Fieldset.HelperText>
                            {t('passwordReset.subtitle')}
                        </Fieldset.HelperText>
                    </Stack>

                    <Fieldset.Content>
                        {successMessage && (
                            <Box p={4} bg="green.50" color="green.800" borderRadius="md" mb={4} fontSize="sm">
                                {successMessage}
                            </Box>
                        )}

                        {errors.submit && (
                            <Box p={4} bg="red.50" color="red.800" borderRadius="md" mb={4} fontSize="sm">
                                {errors.submit}
                            </Box>
                        )}

                        <Field label={t('passwordReset.oldPassword')} required invalid={!!errors.oldPassword} errorText={errors.oldPassword}>
                            <Input
                                name="oldPassword"
                                type="password"
                                value={form.oldPassword}
                                onChange={handleChange}
                                focusBorderColor={colors.text.brand}
                            />
                        </Field>

                        <Field label={t('passwordReset.newPassword')} required invalid={!!errors.newPassword} errorText={errors.newPassword}>
                            <Input
                                name="newPassword"
                                type="password"
                                value={form.newPassword}
                                onChange={handleChange}
                                focusBorderColor={colors.text.brand}
                            />
                        </Field>

                        <Field label={t('passwordReset.confirmPassword')} required invalid={!!errors.confirmNewPassword} errorText={errors.confirmNewPassword}>
                            <Input
                                name="confirmNewPassword"
                                type="password"
                                value={form.confirmNewPassword}
                                onChange={handleChange}
                                focusBorderColor={colors.text.brand}
                            />
                        </Field>
                    </Fieldset.Content>

                    <Button
                        type="submit"
                        bg={colors.button.primary.bg}
                        color="white"
                        width="full"
                        mt={4}
                        isLoading={isLoading}
                        spinnerPlacement="center"
                        isDisabled={isLoading}
                        _hover={{ bg: colors.button.primary.hover }}
                    >
                        {t('passwordReset.saveButton')}
                    </Button>
                </Fieldset.Root>
            </form>
        </Box>
    );
};

export default PasswordReset;