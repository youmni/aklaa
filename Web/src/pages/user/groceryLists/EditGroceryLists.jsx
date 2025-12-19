import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import api from '../../../api/axiosConfig';

const categoryLabels = {
    VEGETABLES: { name: 'Vegetables', color: 'green' },
    FRUITS: { name: 'Fruits', color: 'red' },
    DAIRY: { name: 'Dairy', color: 'blue' },
    MEAT: { name: 'Meat', color: 'red' },
    FISH: { name: 'Fish', color: 'cyan' },
    GRAINS: { name: 'Grains', color: 'orange' },
    SPICES: { name: 'Spices', color: 'red' },
    BAKING: { name: 'Baking', color: 'yellow' },
    DRINKS: { name: 'Drinks', color: 'purple' },
    HOUSEHOLD: { name: 'Household', color: 'teal' },
    OTHER: { name: 'Other', color: 'gray' },
};

const unitLabels = {
    G: 'g',
    KG: 'kg',
    ML: 'ml',
    L: 'L',
    PCS: 'pcs',
    TBSP: 'tbsp',
    TSP: 'tsp',
    CUP: 'cup',
    PINCH: 'pinch',
};

const EditGroceryLists = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [groceryData, setGroceryData] = useState(null);
    const [ingredients, setIngredients] = useState({});
    const [allIngredients, setAllIngredients] = useState([]);
    const [showAddIngredient, setShowAddIngredient] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [newQuantity, setNewQuantity] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        fetchGroceryListDetails();
        fetchAllIngredients();
    }, [id]);

    const fetchGroceryListDetails = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/grocerylists/${id}/ingredients`, {
                params: {
                    page: 0,
                    size: 1000
                }
            });
            setGroceryData(response.data);

            const ingredientsMap = {};
            response.data.ingredients.forEach(item => {
                ingredientsMap[item.ingredient.id] = item.quantity;
            });
            setIngredients(ingredientsMap);
        } catch (error) {
            console.error('Error fetching grocery list details:', error);
            enqueueSnackbar('Failed to load grocery list details', { variant: 'error' });
            navigate('/groceries');
        } finally {
            setLoading(false);
        }
    };

    const fetchAllIngredients = async () => {
        try {
            const response = await api.get('/ingredients/all');
            setAllIngredients(response.data);
        } catch (error) {
            console.error('Error fetching ingredients:', error);
            enqueueSnackbar('Failed to load ingredients', { variant: 'error' });
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
            enqueueSnackbar('Quantity must be a positive number', { variant: 'error' });
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
        enqueueSnackbar('Ingredient removed', { variant: 'info' });
    };

    const handleAddIngredient = () => {
        if (!selectedIngredient || !newQuantity) {
            enqueueSnackbar('Please select an ingredient and enter a quantity', { variant: 'warning' });
            return;
        }

        const numQuantity = parseFloat(newQuantity);
        if (isNaN(numQuantity) || numQuantity <= 0) {
            enqueueSnackbar('Quantity must be a positive number', { variant: 'error' });
            return;
        }

        if (ingredients[selectedIngredient]) {
            enqueueSnackbar('This ingredient is already in the list', { variant: 'warning' });
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
        enqueueSnackbar('Ingredient added', { variant: 'success' });
    };

    const handleSave = async () => {
        const hasInvalidQuantity = Object.entries(ingredients).some(([_, qty]) => {
            const numQty = parseFloat(qty);
            return isNaN(numQty) || numQty <= 0;
        });

        if (hasInvalidQuantity) {
            enqueueSnackbar('All quantities must be positive numbers', { variant: 'error' });
            return;
        }

        setSaving(true);
        try {
            const cleanedIngredients = {};
            Object.entries(ingredients).forEach(([id, qty]) => {
                cleanedIngredients[id] = parseFloat(qty);
            });

            await api.put(`/grocerylists/${id}`, {
                ingredientsWithQuantity: cleanedIngredients
            });
            enqueueSnackbar('Grocery list updated successfully', { variant: 'success' });
            navigate(`/grocerylists/${id}/ingredients`);
        } catch (error) {
            console.error('Error updating grocery list:', error);
            enqueueSnackbar('Failed to update grocery list', { variant: 'error' });
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

    const getFilteredIngredients = () => {
        return getAvailableIngredients()
            .filter(ing =>
                ing.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => a.name.localeCompare(b.name));
    };

    const getSelectedIngredientName = () => {
        if (!selectedIngredient) return '';
        const ingredient = allIngredients.find(ing => ing.id === selectedIngredient);
        return ingredient ? `${ingredient.name} (${unitLabels[ingredient.unit] || ingredient.unit})` : '';
    };

    if (loading) {
        return (
            <Box bg="gray.50" minH="100vh" py={12}>
                <Flex justify="center" align="center" minH="60vh" direction="column" gap={4}>
                    <Spinner size="xl" color="#083951" thickness="4px" />
                    <Text fontSize="lg" color="gray.600">Loading grocery list...</Text>
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
        <Box bg="gray.50" minH="100vh" py={8}>
            <Container maxW="1200px" px={8}>
                <VStack align="stretch" gap={6}>
                    <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
                        <Button
                            variant="ghost"
                            color="#083951"
                            onClick={() => navigate(`/grocerylists/${id}/ingredients`)}
                            aria-label="Back to grocery lists"
                        >
                            <FiArrowLeft />
                        </Button>
                        <HStack gap={3}>
                            <Button
                                variant="outline"
                                colorScheme="gray"
                                onClick={() => navigate(`/grocerylists/${id}/ingredients`)}
                                leftIcon={<FaTimes />}
                                px={6}
                                py={6}
                                fontSize="md"
                            >
                                Cancel
                            </Button>
                            <Button
                                bg="#083951"
                                color="white"
                                onClick={handleSave}
                                isLoading={saving}
                                loadingText="Saving..."
                                _hover={{ bg: '#0a4a63' }}
                                leftIcon={<FaSave />}
                                px={6}
                                py={6}
                                fontSize="md"
                            >
                                Save Changes
                            </Button>
                        </HStack>
                    </Flex>

                    <Box
                        bg="white"
                        borderRadius="xl"
                        p={6}
                        boxShadow="sm"
                        border="1px solid"
                        borderColor="gray.200"
                    >
                        <Flex align="center" gap={3} mb={2}>
                            <Heading size="lg" color="#083951" fontWeight="600">
                                Edit Grocery List
                            </Heading>
                        </Flex>
                        <Text color="gray.600">
                            Modify quantities, add or remove ingredients
                        </Text>
                    </Box>

                    <Box
                        bg="white"
                        borderRadius="xl"
                        p={6}
                        boxShadow="sm"
                        border="1px solid"
                        borderColor="gray.200"
                    >
                        {!showAddIngredient ? (
                            <Button
                                leftIcon={<FaPlus />}
                                onClick={() => setShowAddIngredient(true)}
                                colorScheme="blue"
                                variant="outline"
                                w="100%"
                            >
                                Add Ingredient
                            </Button>
                        ) : (
                            <VStack align="stretch" gap={4}>
                                <Heading size="sm" color="#083951">
                                    Add New Ingredient
                                </Heading>
                                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr auto' }} gap={4}>
                                    <Box>
                                        <Text fontSize="sm" fontWeight="500" mb={2} color="gray.700">
                                            Select Ingredient
                                        </Text>
                                        <VStack align="stretch" gap={2}>
                                            <Input
                                                placeholder={selectedIngredient ? getSelectedIngredientName() : "Search ingredients..."}
                                                value={searchTerm}
                                                onChange={(e) => {
                                                    setSearchTerm(e.target.value);
                                                    setIsDropdownOpen(true);
                                                }}
                                                onFocus={() => setIsDropdownOpen(true)}
                                            />
                                            {isDropdownOpen && (
                                                <Box
                                                    position="relative"
                                                    maxH="250px"
                                                    overflowY="auto"
                                                    border="1px solid"
                                                    borderColor="gray.200"
                                                    borderRadius="md"
                                                    bg="white"
                                                    boxShadow="md"
                                                    css={{
                                                        '&::-webkit-scrollbar': {
                                                            width: '8px',
                                                        },
                                                        '&::-webkit-scrollbar-track': {
                                                            background: '#f1f1f1',
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
                                                    {getFilteredIngredients().length > 0 ? (
                                                        getFilteredIngredients().map(ing => (
                                                            <Box
                                                                key={ing.id}
                                                                p={3}
                                                                cursor="pointer"
                                                                bg={selectedIngredient === ing.id ? 'blue.50' : 'white'}
                                                                borderBottom="1px solid"
                                                                borderColor="gray.100"
                                                                _hover={{ bg: 'gray.50' }}
                                                                onClick={() => {
                                                                    setSelectedIngredient(ing.id);
                                                                    setSearchTerm('');
                                                                    setIsDropdownOpen(false);
                                                                }}
                                                                fontSize="sm"
                                                                transition="all 0.2s"
                                                            >
                                                                <Text fontWeight="500">{ing.name}</Text>
                                                                <Text fontSize="xs" color="gray.600">
                                                                    Unit: {unitLabels[ing.unit] || ing.unit} • Category: {categoryLabels[ing.category]?.name || ing.category}
                                                                </Text>
                                                            </Box>
                                                        ))
                                                    ) : (
                                                        <Box p={4} textAlign="center">
                                                            <Text color="gray.500" fontSize="sm">
                                                                No ingredients found
                                                            </Text>
                                                        </Box>
                                                    )}
                                                </Box>
                                            )}
                                        </VStack>
                                    </Box>
                                    <Box>
                                        <Text fontSize="sm" fontWeight="500" mb={2} color="gray.700">
                                            Quantity
                                        </Text>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={newQuantity}
                                            onChange={(e) => setNewQuantity(e.target.value)}
                                            placeholder="0.00"
                                        />
                                    </Box>
                                    <Flex align="flex-end" gap={2}>
                                        <Button
                                            colorScheme="blue"
                                            onClick={handleAddIngredient}
                                            px={6}
                                            py={5}
                                        >
                                            Add
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setShowAddIngredient(false);
                                                setSelectedIngredient('');
                                                setNewQuantity('');
                                                setSearchTerm('');
                                                setIsDropdownOpen(false);
                                            }}
                                            px={6}
                                            py={5}
                                        >
                                            Cancel
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
                                const categoryInfo = categoryLabels[category] || categoryLabels.OTHER;
                                return (
                                    <Box
                                        key={category}
                                        bg="white"
                                        borderRadius="xl"
                                        p={6}
                                        boxShadow="sm"
                                        border="1px solid"
                                        borderColor="gray.200"
                                    >
                                        <Flex align="center" gap={3} mb={4}>
                                            <Heading size="md" color="#083951" fontWeight="600">
                                                {categoryInfo.name}
                                            </Heading>
                                            <Badge
                                                colorScheme={categoryInfo.color}
                                                px={3}
                                                py={1}
                                                borderRadius="full"
                                                fontSize="xs"
                                            >
                                                {items.length} {items.length === 1 ? 'item' : 'items'}
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
                                                    borderColor="gray.200"
                                                    bg="gray.50"
                                                >
                                                    <Text
                                                        flex={1}
                                                        fontSize="md"
                                                        color="gray.800"
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
                                                            bg="white"
                                                        />
                                                        <Badge
                                                            colorScheme="blue"
                                                            px={3}
                                                            py={2}
                                                            borderRadius="md"
                                                            fontSize="sm"
                                                        >
                                                            {unitLabels[item.ingredient.unit] || item.ingredient.unit}
                                                        </Badge>
                                                        <IconButton
                                                            colorScheme="red"
                                                            variant="outline"
                                                            onClick={() => handleDeleteIngredient(item.ingredient.id)}
                                                            aria-label="Delete ingredient"
                                                            size="md"
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