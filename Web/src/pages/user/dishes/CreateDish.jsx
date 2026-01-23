import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import dishService from '../../../services/dishService';
import ingredientService from '../../../services/ingredientService';
import imageService from '../../../services/imageService';
import { 
    Box, 
    Button, 
    Heading, 
    Input, 
    Text, 
    Textarea, 
    IconButton, 
    Image,
    HStack,
    VStack,
    SimpleGrid,
    NativeSelectRoot,
    NativeSelectField,
    Flex,
    Portal,
    createListCollection,
    Spinner
} from '@chakra-ui/react';
import { Select } from '@chakra-ui/react';
import { Field } from '../../../components/ui/field';
import StepManager from '../../../components/dishes/StepManager';
import { FaPlus, FaTrash, FaUpload, FaTimes } from 'react-icons/fa';
import { FiArrowLeft } from 'react-icons/fi';
import { useSnackbar } from 'notistack';

const CUISINE_TYPES = [
    { value: 'ITALIAN', label: 'Italian' },
    { value: 'FRENCH', label: 'French' },
    { value: 'CHINESE', label: 'Chinese' },
    { value: 'JAPANESE', label: 'Japanese' },
    { value: 'MEXICAN', label: 'Mexican' },
    { value: 'INDIAN', label: 'Indian' },
    { value: 'AMERICAN', label: 'American' },
    { value: 'THAI', label: 'Thai' },
    { value: 'SPANISH', label: 'Spanish' },
    { value: 'MEDITERRANEAN', label: 'Mediterranean' },
    { value: 'MIDDLE_EASTERN', label: 'Middle Eastern' },
    { value: 'KOREAN', label: 'Korean' },
    { value: 'AFRICAN', label: 'African' },
    { value: 'GREEK', label: 'Greek' },
    { value: 'TURKISH', label: 'Turkish' },
    { value: 'MOROCCAN', label: 'Moroccan' }
];

const DISH_TAGS = [
    { label: 'Breakfast', value: 'BREAKFAST' },
    { label: 'Brunch', value: 'BRUNCH' },
    { label: 'Lunch', value: 'LUNCH' },
    { label: 'Dinner', value: 'DINNER' },
    { label: 'Dessert', value: 'DESSERT' },
    { label: 'Snack', value: 'SNACK' },
    { label: 'Appetizer', value: 'APPETIZER' },
    { label: 'Side Dish', value: 'SIDE_DISH' },
    { label: 'Main Course', value: 'MAIN_COURSE' },
    { label: 'Beverage', value: 'BEVERAGE' },
    { label: 'Vegetarian', value: 'VEGETARIAN' },
    { label: 'Vegan', value: 'VEGAN' },
    { label: 'Gluten Free', value: 'GLUTEN_FREE' },
    { label: 'Healthy', value: 'HEALTHY' },
    { label: 'Quick Meal', value: 'QUICK_MEAL' },
    { label: 'Comfort Food', value: 'COMFORT_FOOD' },
    { label: 'Grilled', value: 'GRILLED' },
    { label: 'Baked', value: 'BAKED' },
    { label: 'Fried', value: 'FRIED' },
    { label: 'Raw', value: 'RAW' }
];

const CreateDish = () => {
    const { t } = useTranslation('dish');
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [availableIngredients, setAvailableIngredients] = useState([]);
    const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        tags: [],
        type: '',
        imageUrl: '',
        people: 1,
        ingredients: [],
        steps: []
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});

    const tagsCollection = createListCollection({ items: DISH_TAGS });

    useEffect(() => {
        fetchIngredients();
    }, []);

    const fetchIngredients = async () => {
        try {
            setIsLoadingIngredients(true);
            const response = await ingredientService.getAllIngredients();
            setAvailableIngredients(response.data || []);
        } catch (error) {
            enqueueSnackbar(t('create.fetchIngredientsError'), { variant: 'error' });
        } finally {
            setIsLoadingIngredients(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleTagsChange = (details) => {
        setFormData(prev => ({ ...prev, tags: details.value }));
        if (errors.tags) {
            setErrors(prev => ({ ...prev, tags: '' }));
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            enqueueSnackbar(t('create.uploadImageTypeError'), { variant: 'error' });
            return;
        }

        try {
            setIsUploadingImage(true);
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);

            const response = await imageService.uploadImage(uploadFormData);

            setFormData(prev => ({ ...prev, imageUrl: response.data }));
            setImagePreview(URL.createObjectURL(file));
            
            if (errors.imageUrl) {
                setErrors(prev => ({ ...prev, imageUrl: '' }));
            }

            enqueueSnackbar(t('create.uploadImageSuccess'), { variant: 'success' });
        } catch (error) {
            enqueueSnackbar(t('create.uploadImageError'), { variant: 'error' });
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, imageUrl: '' }));
        setImagePreview(null);
        if (errors.imageUrl) {
            setErrors(prev => ({ ...prev, imageUrl: '' }));
        }
    };

    const handleAddIngredient = () => {
        setFormData(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, { ingredientId: '', quantity: '' }]
        }));
    };

    const handleRemoveIngredient = (index) => {
        setFormData(prev => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index)
        }));
        const newErrors = { ...errors };
        delete newErrors[`ingredient_${index}`];
        delete newErrors[`quantity_${index}`];
        setErrors(newErrors);
    };

    const handleIngredientChange = (index, field, value) => {
        if (field === 'ingredientId' && value) {
            const isDuplicate = formData.ingredients.some((ing, i) => 
                i !== index && ing.ingredientId === value
            );
            
            if (isDuplicate) {
                enqueueSnackbar(t('create.duplicateIngredientWarning'), { variant: 'warning' });
                return;
            }
        }

        setFormData(prev => ({
            ...prev,
            ingredients: prev.ingredients.map((ing, i) =>
                i === index ? { ...ing, [field]: value } : ing
            )
        }));
        if (errors[`${field === 'ingredientId' ? 'ingredient' : 'quantity'}_${index}`]) {
            const newErrors = { ...errors };
            delete newErrors[`${field === 'ingredientId' ? 'ingredient' : 'quantity'}_${index}`];
            setErrors(newErrors);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name || formData.name.length < 1 || formData.name.length > 100) {
            newErrors.name = t('create.validation.nameRequired');
        }

        if (!formData.description || formData.description.length < 10 || formData.description.length > 500) {
            newErrors.description = t('create.validation.descriptionRequired');
        }

        if (formData.tags.length === 0) {
            newErrors.tags = t('create.validation.tagsRequired');
        }

        if (!formData.type) {
            newErrors.type = t('create.validation.cuisineRequired');
        }

        if (!formData.imageUrl) {
            newErrors.imageUrl = t('create.validation.imageRequired');
        }

        if (formData.people < 1 || formData.people > 100) {
            newErrors.people = t('create.validation.peopleRange');
        }

        if (formData.ingredients.length === 0) {
            newErrors.ingredients = t('create.validation.ingredientsRequired');
        } else {
            formData.ingredients.forEach((ing, index) => {
                if (!ing.ingredientId) {
                    newErrors[`ingredient_${index}`] = t('create.validation.ingredientRequired');
                }
                if (!ing.quantity || parseFloat(ing.quantity) < 0.001 || parseFloat(ing.quantity) > 1000000) {
                    newErrors[`quantity_${index}`] = t('create.validation.quantityRange');
                }
            });
        }

        if (formData.steps.length > 50) {
            newErrors.steps = t('create.validation.stepsMax');
        }

        if (formData.steps.length > 0) {
            formData.steps.forEach((step, index) => {
                if (!step.stepText || step.stepText.trim().length === 0) {
                    newErrors[`step_${index}`] = t('create.validation.stepEmpty');
                } else if (step.stepText.trim().length < 5 || step.stepText.trim().length > 255) {
                    newErrors[`step_${index}`] = t('create.validation.stepRange');
                }
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            enqueueSnackbar(t('create.validationError'), { variant: 'error' });
            return;
        }

        try {
            setIsSubmitting(true);

            const dishData = {
                name: formData.name,
                description: formData.description,
                tags: formData.tags,
                type: formData.type,
                imageUrl: formData.imageUrl,
                people: parseInt(formData.people),
                ingredients: formData.ingredients.map(ing => ({
                    ingredientId: parseInt(ing.ingredientId),
                    quantity: parseFloat(ing.quantity)
                }))
            };

            if (formData.steps.length > 0) {
                dishData.steps = formData.steps.map((step, index) => ({
                    orderIndex: index + 1,
                    stepText: step.stepText.trim()
                }));
            }

            await dishService.createDish(dishData);

            enqueueSnackbar(t('create.createSuccess'), { variant: 'success' });

            navigate('/dishes');
        } catch (error) {
            enqueueSnackbar(t('create.createError'), { variant: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getIngredientDisplay = (ing) => {
        if (!ing) return '';
        const unit = ing.unit ? ` (${ing.unit})` : '';
        return `${ing.name}${unit}`;
    };

    const getAvailableIngredientsForIndex = (currentIndex) => {
        const selectedIds = formData.ingredients
            .map((ing, idx) => idx !== currentIndex ? ing.ingredientId : null)
            .filter(Boolean);
        return availableIngredients.filter(ing => !selectedIds.includes(String(ing.id)));
    };

    const handleStepsChange = (newSteps) => {
        setFormData(prev => ({ ...prev, steps: newSteps }));
        const newErrors = { ...errors };
        Object.keys(newErrors).forEach(key => {
            if (key.startsWith('step_')) {
                delete newErrors[key];
            }
        });
        if (newErrors.steps) {
            delete newErrors.steps;
        }
        setErrors(newErrors);
    };

    return (
        <Box p={8} maxW="1200px" mx="auto" bg="white" minH="calc(100vh - 73px)" fontSize="md">
            <Box mb={4}>
                <Button
                    variant="ghost"
                    color="#083951"
                    onClick={() => navigate('/dishes')}
                    aria-label="Back to dishes"
                >
                    <FiArrowLeft />
                </Button>
            </Box>

            {isSubmitting && (
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

            <VStack align="stretch" gap={8}>
                <Box>
                    <Heading fontSize="3xl" fontWeight="bold" color="#083951" mb={2}>{t('create.title')}</Heading>
                    <Text color="gray.600">{t('create.subtitle')}</Text>
                </Box>

                <form onSubmit={handleSubmit}>
                    <VStack align="stretch" gap={6}>
                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                            <Field label={t('common.name')} required invalid={!!errors.name} errorText={errors.name}>
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder={t('create.namePlaceholder')}
                                    size="lg"
                                />
                            </Field>

                            <Field label={t('common.people')} required invalid={!!errors.people} errorText={errors.people}>
                                <Input
                                    name="people"
                                    type="number"
                                    value={formData.people}
                                    onChange={handleInputChange}
                                    placeholder={t('create.peoplePlaceholder')}
                                    min={1}
                                    max={100}
                                    size="lg"
                                />
                            </Field>
                        </SimpleGrid>

                        <Field label={t('common.description')} required invalid={!!errors.description} errorText={errors.description}>
                            <Textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder={t('create.descriptionPlaceholder')}
                                rows={4}
                                size="lg"
                            />
                            <Text fontSize="sm" color="gray.500" mt={1}>
                                {formData.description.length}/500 characters
                            </Text>
                        </Field>

                        <VStack align="stretch" spacing={4}>
                            <Field label={t('common.cuisine')} required invalid={!!errors.type} errorText={errors.type}>
                                <NativeSelectRoot size="lg">
                                    <NativeSelectField
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        sx={{
                                            color: formData.type ? 'inherit' : '#A0AEC0',
                                            '& option': {
                                                color: 'initial'
                                            }
                                        }}
                                    >
                                        <option value="" disabled>{t('create.cuisinePlaceholder')}</option>
                                        {CUISINE_TYPES.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {t(`cuisines.${type.value}`)}
                                            </option>
                                        ))}
                                    </NativeSelectField>
                                </NativeSelectRoot>
                            </Field>

                            <Field label={t('common.tags')} required invalid={!!errors.tags} errorText={errors.tags}>
                                <Select.Root
                                    multiple
                                    collection={tagsCollection}
                                    size="lg"
                                    value={formData.tags}
                                    onValueChange={handleTagsChange}
                                >
                                    <Select.HiddenSelect />
                                    <Select.Control>
                                        <Select.Trigger
                                            sx={{
                                                minH: '48px',
                                                bg: 'white',
                                                borderColor: errors.tags ? 'red.500' : 'gray.200',
                                                _hover: {
                                                    borderColor: errors.tags ? 'red.600' : 'gray.300'
                                                },
                                                color: formData.tags.length ? 'inherit' : '#A0AEC0'
                                            }}
                                        >
                                            <Select.ValueText placeholder={t('create.tagsPlaceholder')} />
                                        </Select.Trigger>
                                        <Select.IndicatorGroup>
                                            <Select.Indicator />
                                        </Select.IndicatorGroup>
                                    </Select.Control>
                                    <Portal>
                                        <Select.Positioner>
                                            <Select.Content>
                                                {DISH_TAGS.map((tag) => (
                                                    <Select.Item item={tag} key={tag.value}>
                                                        {t(`tags.${tag.value}`)}
                                                        <Select.ItemIndicator />
                                                    </Select.Item>
                                                ))}
                                            </Select.Content>
                                        </Select.Positioner>
                                    </Portal>
                                </Select.Root>
                            </Field>
                        </VStack>
                        <Field
                            label={t('create.imageLabel')}
                            required
                            invalid={!!errors.imageUrl}
                            errorText={errors.imageUrl}
                            mb={4}
                        >
                            {!imagePreview ? (
                                <>
                                    <Button
                                        as="label"
                                        htmlFor="image-upload"
                                        size="lg"
                                        bg="transparent"
                                        color="#083951"
                                        variant="outline"
                                        isLoading={isUploadingImage}
                                        cursor="pointer"
                                        w="full"
                                        h="120px"
                                        border="2px dashed"
                                        borderColor="rgba(8,57,81,0.12)"
                                        _hover={{ bg: 'gray.50' }}
                                    >
                                        <VStack gap={2}>
                                            <FaUpload size={24} color="#083951" />
                                            <Text fontWeight="medium" color="#083951">{t('create.uploadImageButton')}</Text>
                                            <Text fontSize="sm" color="gray.500">PNG, JPG up to 10MB</Text>
                                        </VStack>
                                    </Button>
                                    <Input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        display="none"
                                    />
                                </>
                            ) : (
                                <Box position="relative">
                                    <Image
                                        src={imagePreview}
                                        alt="Dish preview"
                                        maxH="400px"
                                        w="full"
                                        objectFit="cover"
                                        borderRadius="lg"
                                    />
                                    <IconButton
                                        position="absolute"
                                        top={4}
                                        right={4}
                                        colorScheme="red"
                                        onClick={handleRemoveImage}
                                        aria-label="Remove image"
                                        size="lg"
                                        boxShadow="lg"
                                    >
                                        <FaTimes />
                                    </IconButton>
                                </Box>
                            )}
                        </Field>

                        <Field
                            label={t('common.ingredients')}
                            required
                            mb={4}
                            invalid={!!errors.ingredients}
                            errorText={errors.ingredients}
                        >
                            <Flex justify="flex-end" align="center" mb={4}>
                                <Button
                                    size="md"
                                    onClick={handleAddIngredient}
                                    type="button"
                                    bg="#083951"
                                    color="white"
                                    _hover={{ bg: '#0a4960' }}
                                    px={6}
                                >
                                    <FaPlus style={{ marginRight: '8px' }} /> {t('create.addIngredientButton')}
                                </Button>
                            </Flex>

                            <Box 
                                maxH="420px" 
                                overflowY="auto" 
                                p={4}
                                bg="white"
                                borderRadius="lg"
                                border="1px solid"
                                borderColor="gray.200"
                                boxShadow="sm"
                            >
                                <VStack align="stretch" gap={3}>
                                    {formData.ingredients.length === 0 ? (
                                        <Box textAlign="center" py={12}>
                                            <Text color="#083951" fontSize="lg" fontWeight="medium">{t('create.addIngredientButton')}</Text>
                                            <Text color="gray.500" fontSize="sm" mt={2}>{t('steps.noStepsDescription')}</Text>
                                        </Box>
                                    ) : (
                                        formData.ingredients.map((ingredient, index) => (
                                            <Box 
                                                key={index} 
                                                p={4} 
                                                bg="white" 
                                                borderRadius="md" 
                                                border="1px solid" 
                                                borderColor="gray.200" 
                                                display="flex" 
                                                alignItems="center" 
                                                gap={3}
                                            >
                                                <Box flex={2}>
                                                    <Field
                                                        label={<Text color="gray.700">{t('create.ingredientLabel')}</Text>}
                                                        invalid={!!errors[`ingredient_${index}`]}
                                                        errorText={errors[`ingredient_${index}`]}
                                                    >
                                                        <NativeSelectRoot size="lg">
                                                            <NativeSelectField
                                                                value={ingredient.ingredientId}
                                                                onChange={(e) => handleIngredientChange(index, 'ingredientId', e.target.value)}
                                                                bg="white"
                                                                borderColor="gray.200"
                                                                _hover={{ borderColor: 'gray.300' }}
                                                                style={{ paddingLeft: 8 }}
                                                            >
                                                                <option value="" disabled style={{ color: '#A0AEC0' }}>{t('create.selectIngredient')}</option>
                                                                {getAvailableIngredientsForIndex(index).map(ing => (
                                                                    <option key={ing.id} value={ing.id} style={{ color: 'initial' }}>
                                                                        {getIngredientDisplay(ing)}
                                                                    </option>
                                                                ))}
                                                            </NativeSelectField>
                                                        </NativeSelectRoot>
                                                    </Field>
                                                </Box>
                                                <Box flex={1}>
                                                    <Field
                                                        label={<Text color="gray.700">{t('create.quantityLabel')}</Text>}
                                                        invalid={!!errors[`quantity_${index}`]}
                                                        errorText={errors[`quantity_${index}`]}
                                                    >
                                                        <Input
                                                            type="number"
                                                            placeholder=" 0.0"
                                                            value={ingredient.quantity}
                                                            onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                                                            step="0.001"
                                                            min="0.001"
                                                            size="lg"
                                                            bg="white"
                                                            color="inherit"
                                                            borderColor="gray.200"
                                                            _hover={{ borderColor: 'gray.300' }}
                                                            _placeholder={{ color: 'gray.400' }}
                                                        />
                                                    </Field>
                                                </Box>
                                                <Box>
                                                    <IconButton
                                                        colorScheme="red"
                                                        variant="ghost"
                                                        onClick={() => handleRemoveIngredient(index)}
                                                        aria-label="Remove ingredient"
                                                        size="lg"
                                                        color="red.500"
                                                    >
                                                        <FaTrash />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        ))
                                    )}
                                </VStack>
                            </Box>
                        </Field>

                        <StepManager 
                            steps={formData.steps}
                            onChange={handleStepsChange}
                            errors={errors}
                        />

                        <Box pt={4}>
                            <Button
                                type="submit"
                                bg="#083951"
                                color="white"
                                width="full"
                                isLoading={isSubmitting}
                                _hover={{
                                    bg: '#0a4960'
                                }}
                                px={8}
                            >
                                {t('create.submitButton')}
                            </Button>
                        </Box>
                    </VStack>
                </form>
            </VStack>
        </Box>
    );
};

export default CreateDish;