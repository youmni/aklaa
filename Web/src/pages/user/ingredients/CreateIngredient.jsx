import { use, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Input, Stack, Spinner } from "@chakra-ui/react";
import { Field, Fieldset } from "@chakra-ui/react";
import { useSnackbar } from 'notistack';
import api from "../../../api/axiosConfig";

const CreateIngredient = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
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
            newErrors.name = "Name is required";
        } else if (form.name.trim().length < 1 || form.name.trim().length > 100) {
            newErrors.name = "Name must be between 1 and 100 characters";
        }

        if (form.description && form.description.length > 250) {
            newErrors.description = "Description must be maximum 250 characters";
        }

        if (!form.category || form.category === "") {
            newErrors.category = "Category is required";
        }

        if (!form.unit || form.unit === "") {
            newErrors.unit = "Unit is required";
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

            const response = await api.post('/ingredients', sanitizedData);

            const successMsg = response?.data?.message
                ? response.data.message
                : `Ingredient created successfully.`;

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
            const errMsg =
                error?.response?.data?.message ||
                error?.message ||
                'Ingredient creation failed. Please check your input and try again.';

            setErrors({
                submit: errMsg
            });
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
                            Create Ingredient
                        </Fieldset.Legend>
                        <Fieldset.HelperText>
                            Please fill in the ingredient details below.
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

                        <Field.Root invalid={!!errors.name}>
                            <Field.Label>Name</Field.Label>
                            <Input
                                name="name"
                                type="text"
                                value={form.name}
                                onChange={handleChange}
                                maxLength={100}
                                focusBorderColor="#083951"
                            />
                            {errors.name && (
                                <Field.ErrorText>{errors.name}</Field.ErrorText>
                            )}
                        </Field.Root>

                        <Field.Root invalid={!!errors.description}>
                            <Field.Label>Description (optional)</Field.Label>
                            <Input
                                name="description"
                                type="text"
                                value={form.description}
                                onChange={handleChange}
                                maxLength={250}
                                focusBorderColor="#083951"
                            />
                            {errors.description && (
                                <Field.ErrorText>{errors.description}</Field.ErrorText>
                            )}
                        </Field.Root>

                        <Field.Root invalid={!!errors.category}>
                            <Field.Label>Category</Field.Label>
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #E2E8F0',
                                    fontSize: '1rem'
                                }}
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat.toLowerCase()}
                                    </option>
                                ))}
                            </select>
                            {errors.category && (
                                <Field.ErrorText>{errors.category}</Field.ErrorText>
                            )}
                        </Field.Root>

                        <Field.Root invalid={!!errors.unit}>
                            <Field.Label>Unit</Field.Label>
                            <select
                                name="unit"
                                value={form.unit}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #E2E8F0',
                                    fontSize: '1rem'
                                }}
                            >
                                <option value="">Select a unit</option>
                                {units.map((unit) => (
                                    <option key={unit} value={unit}>
                                        {unit.toLowerCase()}
                                    </option>
                                ))}
                            </select>
                            {errors.unit && (
                                <Field.ErrorText>{errors.unit}</Field.ErrorText>
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
                        Create Ingredient
                    </Button>
                </Fieldset.Root>
            </form>
        </Box>
    )
};

export default CreateIngredient;