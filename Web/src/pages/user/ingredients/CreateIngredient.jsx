import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useThemeColors } from '../../../hooks/useThemeColors';
import { Box, Button, Input, Stack, Spinner } from "@chakra-ui/react";
import { Fieldset } from "@chakra-ui/react";
import { Field } from '../../../components/ui/field';
import { useSnackbar } from 'notistack';
import ingredientService from "../../../services/ingredientService";
import { FiArrowLeft } from 'react-icons/fi';

const CreateIngredient = () => {
    const { t } = useTranslation('ingredient');
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const colors = useThemeColors();
    const [form, setForm] = useState({
        name: "",
        description: "",
        category: "",
        unit: ""
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const units = ["G", "KG", "ML", "L", "PCS", "TBSP", "TSP", "CUP", "PINCH"];
    const categories = [
        "VEGETABLES",
        "FRUITS",
        "DAIRY",
        "MEAT",
        "FISH",
        "GRAINS",
        "SPICES",
        "BAKING",
        "DRINKS",
        "HOUSEHOLD",
        "OTHER"
    ];

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
        
        if (!form.name || form.name.trim() === "") {
            newErrors.name = t('create.nameRequired');
        } else if (form.name.trim().length < 1 || form.name.trim().length > 100) {
            newErrors.name = t('create.nameLength');
        }

        if (form.description && form.description.length > 250) {
            newErrors.description = t('create.descriptionLength');
        }

        if (!form.category || form.category === "") {
            newErrors.category = t('create.categoryRequired');
        }

        if (!form.unit || form.unit === "") {
            newErrors.unit = t('create.unitRequired');
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
                name: form.name.trim(),
                description: form.description.trim(),
                category: form.category,
                unit: form.unit
            };

            const response = await ingredientService.createIngredient(sanitizedData);

            const successMsg = t('create.createSuccess');

            setSuccessMessage(successMsg);
            enqueueSnackbar(successMsg, { variant: 'success' });
            setForm({
                name: "",
                description: "",
                category: "",
                unit: ""
            });
            navigate('/ingredients');
        } catch (error) {
            const errMsg = t('create.createFailed');

            setErrors({
                submit: errMsg
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box p={8} maxW="1200px" mx="auto" bg={colors.bg.primary} minH="calc(100vh - 73px)">
            <Box mb={4}>
                <Button
                    variant="ghost"
                    color={colors.text.brand}
                    onClick={() => navigate('/ingredients')}
                    aria-label={t('common.backButton')}
                >
                    <FiArrowLeft />
                </Button>
            </Box>

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
                            {t('create.title')}
                        </Fieldset.Legend>
                        <Fieldset.HelperText>
                            {t('create.subtitle')}
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

                        <Field label={t('create.nameLabel')} required invalid={!!errors.name} errorText={errors.name}>
                            <Input
                                name="name"
                                type="text"
                                value={form.name}
                                onChange={handleChange}
                                maxLength={100}
                                focusBorderColor={colors.text.brand}
                                bg={colors.input.bg}
                                borderColor={colors.border.default}
                                color={colors.text.primary}
                            />
                        </Field>

                        <Field label={t('create.descriptionLabel')} invalid={!!errors.description} errorText={errors.description}>
                            <Input
                                name="description"
                                type="text"
                                value={form.description}
                                onChange={handleChange}
                                maxLength={250}
                                focusBorderColor={colors.text.brand}
                                bg={colors.input.bg}
                                borderColor={colors.border.default}
                                color={colors.text.primary}
                            />
                        </Field>

                        <Field label={t('create.categoryLabel')} required invalid={!!errors.category} errorText={errors.category}>
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    borderRadius: '0.375rem',
                                    border: `1px solid ${colors.border.default}`,
                                    backgroundColor: colors.input.bg,
                                    color: colors.text.primary,
                                    fontSize: '1rem'
                                }}
                            >
                                <option value="">{t('create.selectCategory')}</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {t(`categories.${cat}`)}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label={t('create.unitLabel')} required invalid={!!errors.unit} errorText={errors.unit}>
                            <select
                                name="unit"
                                value={form.unit}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    borderRadius: '0.375rem',
                                    border: `1px solid ${colors.border.default}`,
                                    backgroundColor: colors.input.bg,
                                    color: colors.text.primary,
                                    fontSize: '1rem'
                                }}
                            >
                                <option value="">{t('create.selectUnit')}</option>
                                {units.map((unit) => (
                                    <option key={unit} value={unit}>
                                        {t(`units.${unit}`)}
                                    </option>
                                ))}
                            </select>
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
                        {t('create.submitButton')}
                    </Button>
                </Fieldset.Root>
            </form>
        </Box>
    )
};

export default CreateIngredient;