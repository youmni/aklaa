import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Input, Stack, Spinner } from "@chakra-ui/react";
import { Fieldset } from "@chakra-ui/react";
import { Field } from '../../../components/ui/field';
import { useSnackbar } from 'notistack';
import authService from "../../../services/authService";
const PasswordReset = () => {
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
            newErrors.oldPassword = "Old Password is required";
        }

        const pwd = form.newPassword || "";
        const pwdPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/;
        if (!pwd || !pwdPattern.test(pwd)) {
            newErrors.newPassword = "Password must be at least 8 characters, include upper and lower case letters, a number, and a special character";
        }

        if (!form.confirmNewPassword || form.confirmNewPassword.trim() === "") {
            newErrors.confirmNewPassword = "Confirm Password is required";
        } else if (form.confirmNewPassword !== form.newPassword) {
            newErrors.confirmNewPassword = "Confirm Password does not match new password";
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

            const successMsg = 'Password was updated successfully.';
            setSuccessMessage(successMsg);
            enqueueSnackbar(successMsg, { variant: 'success' });
            setForm({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
        } catch (error) {
            const errMsg = 'The current password is incorrect. Please try again.';
            setErrors({ submit: errMsg });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box p={8} maxW="1200px" mx="auto" bg="white" minH="calc(100vh - 73px)">
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

            <form onSubmit={handleSubmit}>
                <Fieldset.Root size="lg">
                    <Stack>
                        <Fieldset.Legend fontSize="3xl" fontWeight="bold" color={'#083951'}>
                            Reset Password
                        </Fieldset.Legend>
                        <Fieldset.HelperText>
                            Enter your current password and choose a new secure password.
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

                        <Field label="Old Password" required invalid={!!errors.oldPassword} errorText={errors.oldPassword}>
                            <Input
                                name="oldPassword"
                                type="password"
                                value={form.oldPassword}
                                onChange={handleChange}
                                focusBorderColor="#083951"
                            />
                        </Field>

                        <Field label="New Password" required invalid={!!errors.newPassword} errorText={errors.newPassword}>
                            <Input
                                name="newPassword"
                                type="password"
                                value={form.newPassword}
                                onChange={handleChange}
                                focusBorderColor="#083951"
                            />
                        </Field>

                        <Field label="Confirm New Password" required invalid={!!errors.confirmNewPassword} errorText={errors.confirmNewPassword}>
                            <Input
                                name="confirmNewPassword"
                                type="password"
                                value={form.confirmNewPassword}
                                onChange={handleChange}
                                focusBorderColor="#083951"
                            />
                        </Field>
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
                        _hover={{ bg: "#0a4a63" }}
                    >
                        Reset Password
                    </Button>
                </Fieldset.Root>
            </form>
        </Box>
    );
};

export default PasswordReset;