import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Spinner,
    Flex,
    Badge,
    Button,
    Input,
    IconButton,
    Grid,
} from '@chakra-ui/react';
import { FaListUl, FaPlus, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { FiArrowLeft } from 'react-icons/fi';
import { useSnackbar } from 'notistack';
import groceryListService from '../../../services/groceryListService';
import ingredientService from '../../../services/ingredientService';
import SearchableIngredientSelect from '../../../components/ui/SearchableIngredientSelect';
import { useThemeColors } from '../../../hooks/useThemeColors';

const EditGroceryLists = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation('grocerylist');
    const colors = useThemeColors();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [groceryData, setGroceryData] = useState(null);
    const [ingredients, setIngredients] = useState({});
    const [allIngredients, setAllIngredients] = useState([]);
    const [showAddIngredient, setShowAddIngredient] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [newQuantity, setNewQuantity] = useState('');

    useEffect(() => {
        fetchGroceryListDetails();
        fetchAllIngredients();
    }, [id]);

    const fetchGroceryListDetails = async () => {
        setLoading(true);
        try {
            const response = await groceryListService.getGroceryListIngredients(id, {
                page: 0,
                size: 1000
            });
            setGroceryData(response.data);

            const ingredientsMap = {};
            response.data.ingredients.forEach(item => {
                ingredientsMap[item.ingredient.id] = item.quantity;
            });
            setIngredients(ingredientsMap);
        } catch (error) {
            enqueueSnackbar(t('edit.fetchError'), { variant: 'error' });
            navigate('/groceries');
        } finally {
            setLoading(false);
        }
    };

    const fetchAllIngredients = async () => {
        try {
            const response = await ingredientService.getAllIngredients();
            setAllIngredients(response.data);
        } catch (error) {
            enqueueSnackbar(t('edit.fetchIngredientsError'), { variant: 'error' });
        }
    };

    const handleQuantityChange = (ingredientId, value) => {
        const numValue = parseFloat(value);

        if (value === '' || value === '-') {
            setIngredients(prev => ({
                ...prev,
                [ingredientId]: value
            }));
            return;
        }

        if (isNaN(numValue) || numValue < 0) {
            enqueueSnackbar(t('edit.quantityRequired'), { variant: 'error' });
            return;
        }

        setIngredients(prev => ({
            ...prev,
            [ingredientId]: numValue
        }));
    };

    const handleDeleteIngredient = (ingredientId) => {
        const newIngredients = { ...ingredients };
        delete newIngredients[ingredientId];
        setIngredients(newIngredients);
        enqueueSnackbar(t('edit.ingredientRemoved'), { variant: 'info' });
    };

    const handleAddIngredient = () => {
        if (!selectedIngredient || !newQuantity) {
            enqueueSnackbar(t('edit.selectIngredientAndQuantity'), { variant: 'warning' });
            return;
        }

        const numQuantity = parseFloat(newQuantity);
        if (isNaN(numQuantity) || numQuantity <= 0) {
            enqueueSnackbar(t('edit.quantityRequired'), { variant: 'error' });
            return;
        }

        if (ingredients[selectedIngredient]) {
            enqueueSnackbar(t('edit.ingredientAlreadyExists'), { variant: 'warning' });
            return;
        }

        const ingredientObj = allIngredients.find(ing => ing.id === selectedIngredient);

        setIngredients(prev => ({
            ...prev,
            [selectedIngredient]: numQuantity
        }));

        setGroceryData(prev => ({
            ...prev,
            ingredients: prev && prev.ingredients ? [...prev.ingredients, { ingredient: ingredientObj, quantity: numQuantity }] : [{ ingredient: ingredientObj, quantity: numQuantity }]
        }));

        setSelectedIngredient(null);
        setNewQuantity('');
        setShowAddIngredient(false);
        enqueueSnackbar(t('edit.ingredientAdded'), { variant: 'success' });
    };

    const handleSave = async () => {
        const hasInvalidQuantity = Object.entries(ingredients).some(([_, qty]) => {
            const numQty = parseFloat(qty);
            return isNaN(numQty) || numQty <= 0;
        });

        if (hasInvalidQuantity) {
            enqueueSnackbar(t('edit.allQuantitiesPositive'), { variant: 'error' });
            return;
        }

        setSaving(true);
        try {
            const cleanedIngredients = {};
            Object.entries(ingredients).forEach(([id, qty]) => {
                cleanedIngredients[id] = parseFloat(qty);
            });

            await groceryListService.updateGroceryList(id, {
                ingredientsWithQuantity: cleanedIngredients
            });
            enqueueSnackbar(t('edit.updateSuccess'), { variant: 'success' });
            navigate(`/grocerylists/${id}/ingredients`);
        } catch (error) {
            enqueueSnackbar(t('edit.updateError'), { variant: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const groupByCategory = () => {
        if (!groceryData) return {};

        const grouped = {};
        groceryData.ingredients.forEach(item => {
            if (ingredients[item.ingredient.id] !== undefined) {
                const category = item.ingredient.category;
                if (!grouped[category]) {
                    grouped[category] = [];
                }
                grouped[category].push(item);
            }
        });
        return grouped;
    };

    const getAvailableIngredients = () => {
        return allIngredients.filter(ing => !ingredients[ing.id]);
    };

    if (loading) {
        return (
            <Box bg={colors.bg.page} minH="100vh" py={12}>
                <Flex justify="center" align="center" minH="60vh" direction="column" gap={4}>
                    <Spinner size="xl" color={colors.text.brand} thickness="4px" />
                    <Text fontSize="lg" color={colors.text.secondary}>{t('common.loading')}</Text>
                </Flex>
            </Box>
        );
    }

    if (!groceryData) {
        return null;
    }

    const groupedIngredients = groupByCategory();
    const availableIngredients = getAvailableIngredients();

    return (
        <Box bg={colors.bg.page} minH="100vh" py={8}>
            <Container maxW="1200px" px={8}>
                <VStack align="stretch" gap={6}>
                    <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
                        <Button
                            variant="ghost"
                            color={colors.text.brand}
                            onClick={() => navigate(`/grocerylists/${id}/ingredients`)}
                            aria-label="Back to grocery lists"
                        >
                            <FiArrowLeft />
                        </Button>
                        <HStack gap={3}>
                            <Button
                                variant="outline"
                                colorPalette="gray"
                                onClick={() => navigate(`/grocerylists/${id}/ingredients`)}
                                leftIcon={<FaTimes />}
                                px={6}
                                py={6}
                                fontSize="md"
                            >
                                {t('edit.cancelButton')}
                            </Button>
                            <Button
                                bg={colors.button.primary.bg}
                                color="white"
                                onClick={handleSave}
                                isLoading={saving}
                                loadingText={t('common.loading')}
                                _hover={{ bg: colors.button.primary.hover }}
                                leftIcon={<FaSave />}
                                px={6}
                                py={6}
                                fontSize="md"
                            >
                                {t('edit.saveButton')}
                            </Button>
                        </HStack>
                    </Flex>

                    <Box
                        bg={colors.card.bg}
                        borderRadius="xl"
                        p={6}
                        boxShadow={colors.card.shadow}
                        border="1px solid"
                        borderColor={colors.border.default}
                    >
                        <Flex align="center" gap={3} mb={2}>
                            <Heading size="lg" color={colors.text.brand} fontWeight="600">
                                {t('edit.title')}
                            </Heading>
                        </Flex>
                        <Text color={colors.text.secondary}>
                            {t('edit.subtitle')}
                        </Text>
                    </Box>

                    <Box
                        bg={colors.card.bg}
                        borderRadius="xl"
                        p={6}
                        boxShadow="sm"
                        border="1px solid"
                        borderColor={colors.border.default}
                    >
                        {!showAddIngredient ? (
                            <Button
                                leftIcon={<FaPlus />}
                                onClick={() => setShowAddIngredient(true)}
                                colorPalette="grey"
                                variant="outline"
                                w="100%"
                            >
                                {t('edit.addIngredientTitle')}
                            </Button>
                        ) : (
                            <VStack align="stretch" gap={4}>
                                <Heading size="sm" color={colors.text.brand}>
                                    {t('edit.addIngredientTitle')}
                                </Heading>
                                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr auto' }} gap={4}>
                                    <Box>
                                        <Text fontSize="sm" fontWeight="500" mb={2} color={colors.text.primary}>
                                            {t('edit.selectIngredient')}
                                        </Text>
                                        <SearchableIngredientSelect
                                            availableIngredients={getAvailableIngredients()}
                                            selectedIngredientId={selectedIngredient}
                                            onSelect={(id) => setSelectedIngredient(Number(id))}
                                            placeholder={t('edit.selectIngredient')}
                                            size="md"
                                        />
                                    </Box>
                                    <Box>
                                        <Text fontSize="sm" fontWeight="500" mb={2} color={colors.text.primary}>
                                            {t('edit.quantityLabel')}
                                        </Text>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={newQuantity}
                                            onChange={(e) => setNewQuantity(e.target.value)}
                                            placeholder={t('edit.quantityPlaceholder')}
                                        />
                                    </Box>
                                    <Flex align="flex-end" gap={2}>
                                        <Button
                                            bg={colors.button.primary.bg}
                                            color="white"
                                            _hover={{ bg: colors.button.primary.hover }}
                                            onClick={handleAddIngredient}
                                            px={6}
                                            py={5}
                                        >
                                            {t('edit.addButton')}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setShowAddIngredient(false);
                                                setSelectedIngredient(null);
                                                setNewQuantity('');
                                            }}
                                            px={6}
                                            py={5}
                                        >
                                            {t('edit.cancelButton')}
                                        </Button>
                                    </Flex>
                                </Grid>
                            </VStack>
                        )}
                    </Box>

                    <Box
                        maxH="calc(100vh - 400px)"
                        overflowY="auto"
                        css={{
                            '&::-webkit-scrollbar': {
                                width: '8px',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: '#f1f1f1',
                                borderRadius: '10px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: '#888',
                                borderRadius: '10px',
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                                background: '#555',
                            },
                        }}
                    >
                        <VStack align="stretch" gap={4}>
                            {Object.entries(groupedIngredients).map(([category, items]) => {
                                return (
                                    <Box
                                        key={category}
                                        bg={colors.card.bg}
                                        borderRadius="xl"
                                        p={6}
                                        boxShadow={colors.card.shadow}
                                        border="1px solid"
                                        borderColor={colors.border.default}
                                    >
                                        <Flex align="center" gap={3} mb={4}>
                                            <Heading size="md" color={colors.text.brand} fontWeight="600">
                                                {t(`categories.${category}`)}
                                            </Heading>
                                            <Badge
                                                colorPalette="gray"
                                                px={3}
                                                py={1}
                                                borderRadius="full"
                                                fontSize="xs"
                                            >
                                                {t('card.itemsCount', { count: items.length })}
                                            </Badge>
                                        </Flex>

                                        <VStack align="stretch" gap={3}>
                                            {items.map((item) => (
                                                <Flex
                                                    key={item.ingredient.id}
                                                    align="center"
                                                    gap={3}
                                                    p={4}
                                                    borderRadius="lg"
                                                    border="1px solid"
                                                    borderColor={colors.border.default}
                                                    bg={colors.bg.tertiary}
                                                >
                                                    <Text
                                                        flex={1}
                                                        fontSize="md"
                                                        color={colors.text.primary}
                                                        fontWeight="500"
                                                    >
                                                        {item.ingredient.name}
                                                    </Text>
                                                    <HStack gap={2}>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            value={ingredients[item.ingredient.id] || ''}
                                                            onChange={(e) => handleQuantityChange(item.ingredient.id, e.target.value)}
                                                            w="120px"
                                                            bg={colors.input.bg}
                                                            borderColor={colors.border.default}
                                                            color={colors.text.primary}
                                                        />
                                                        <Badge
                                                            colorPalette="blue"
                                                            px={3}
                                                            py={2}
                                                            borderRadius="md"
                                                            fontSize="sm"
                                                        >
                                                            {t(`units.${item.ingredient.unit}`)}
                                                        </Badge>
                                                        <IconButton
                                                            colorPalette="red"
                                                            variant="outline"
                                                            onClick={() => handleDeleteIngredient(item.ingredient.id)}
                                                            aria-label="Delete ingredient"
                                                            size="md"
                                                            color="red.500"
                                                            _hover={{ bg: 'red.50' }}
                                                        >
                                                            <FaTrash />
                                                        </IconButton>
                                                    </HStack>
                                                </Flex>
                                            ))}
                                        </VStack>
                                    </Box>
                                );
                            })}
                        </VStack>
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
};

export default EditGroceryLists;