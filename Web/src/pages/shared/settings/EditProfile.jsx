import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Box, Button, Input, Stack, Spinner, Portal, Select, createListCollection } from "@chakra-ui/react";
import { Field, Fieldset } from "@chakra-ui/react";
import { useSnackbar } from 'notistack';
import authService from "../../../services/authService";
import userService from "../../../services/userService";
import { FiArrowLeft } from 'react-icons/fi';
import { AuthContext } from '../../../context/AuthContext';

const EditProfile = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation('settings');
    const { enqueueSnackbar } = useSnackbar();
    const { user, setUser } = useContext(AuthContext);

    const languages = createListCollection({
        items: [
            { label: t('languages.en'), value: "en" },
            { label: t('languages.fr'), value: "fr" },
            { label: t('languages.nl'), value: "nl" },
            { label: t('languages.sp'), value: "sp" },
        ],
    });

    const [form, setForm] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || ""
    });
    const [selectedLanguage, setSelectedLanguage] = useState([i18n.language || 'en']);
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

    const handleLanguageChange = (details) => {
        const newLanguage = details.value[0];
        setSelectedLanguage(details.value);
        i18n.changeLanguage(newLanguage);
        localStorage.setItem('preferredLanguage', newLanguage);
        enqueueSnackbar(t('editProfile.languageChanged'), { variant: 'success' });
    };

    const sanitizeInput = (input) => {
        return input.trim().replace(/[<>]/g, '');
    };

    const validateForm = () => {
        const newErrors = {};

        const sanitizedFirstName = sanitizeInput(form.firstName);
        if (sanitizedFirstName.length < 1 || sanitizedFirstName.length > 100) {
            newErrors.firstName = t('editProfile.firstNameError');
        }

        const sanitizedLastName = sanitizeInput(form.lastName);
        if (sanitizedLastName.length < 1 || sanitizedLastName.length > 100) {
            newErrors.lastName = t('editProfile.lastNameError');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!form.email || !emailRegex.test(form.email)) {
            newErrors.email = t('editProfile.emailError');
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
            await userService.updateEmail(sanitizedData);
            const successMsg = t('editProfile.updateSuccess');

            setSuccessMessage(successMsg);
            enqueueSnackbar(successMsg, { variant: 'success' });
            setForm({
                firstName: sanitizedData.firstName,
                lastName: sanitizedData.lastName,
                email: sanitizedData.email
            });
            const me = await authService.getMe();
            setUser(me.data || null);
        } catch (error) {
            const errMsg = t('editProfile.updateError');
            setErrors({
                submit: errMsg
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box w="100%" maxW="full" mx="auto" bg="white" p={6}>

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
                        <Fieldset.Legend fontSize="3xl" fontWeight="bold" color={'#083951'}>
                            {t('editProfile.title')}
                        </Fieldset.Legend>
                        <Fieldset.HelperText>
                            {t('editProfile.subtitle')}
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
                            <Field.Label>{t('editProfile.firstName')}</Field.Label>
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
                            <Field.Label>{t('editProfile.lastName')}</Field.Label>
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
                            <Field.Label>{t('editProfile.email')}</Field.Label>
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

                        <Field.Root>
                            <Field.Label>{t('editProfile.language')}</Field.Label>
                            <Field.HelperText>{t('editProfile.selectLanguage')}</Field.HelperText>
                            <Select.Root 
                                collection={languages} 
                                value={selectedLanguage}
                                onValueChange={handleLanguageChange}
                                width="100%"
                            >
                                <Select.HiddenSelect />
                                <Select.Control>
                                    <Select.Trigger>
                                        <Select.ValueText placeholder={t('editProfile.selectLanguage')} />
                                    </Select.Trigger>
                                    <Select.IndicatorGroup>
                                        <Select.Indicator />
                                    </Select.IndicatorGroup>
                                </Select.Control>
                                <Portal>
                                    <Select.Positioner>
                                        <Select.Content>
                                            {languages.items.map((language) => (
                                                <Select.Item item={language} key={language.value}>
                                                    {language.label}
                                                    <Select.ItemIndicator />
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Positioner>
                                </Portal>
                            </Select.Root>
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
                        {t('editProfile.saveButton')}
                    </Button>
                </Fieldset.Root>
            </form>
        </Box>
    )
};

export default EditProfile;