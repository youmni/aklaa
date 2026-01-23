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
} from '@chakra-ui/react';
import { FaListUl, FaShoppingBasket, FaCheckCircle, FaEdit } from 'react-icons/fa';
import { FiArrowLeft } from 'react-icons/fi';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import groceryListService from '../../../services/groceryListService';

const categoryColors = {
    VEGETABLES: 'green',
    FRUITS: 'red',
    DAIRY: 'blue',
    MEAT: 'red',
    FISH: 'cyan',
    GRAINS: 'orange',
    SPICES: 'red',
    BAKING: 'yellow',
    DRINKS: 'purple',
    HOUSEHOLD: 'teal',
    OTHER: 'gray',
};

const DetailsGroceryList = () => {
    const { t } = useTranslation('grocerylist');
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(true);
    const [groceryData, setGroceryData] = useState(null);
    const [checkedItems, setCheckedItems] = useState(new Set());

    useEffect(() => {
        const storageKey = `groceryList_${id}_checked`;
        const savedChecked = localStorage.getItem(storageKey);
        if (savedChecked) {
            try {
                const checkedArray = JSON.parse(savedChecked);
                setCheckedItems(new Set(checkedArray));
            } catch (error) {
                console.error('Failed to parse checked items from localStorage:', error);
            }
        }
    }, [id]);

    useEffect(() => {
        fetchGroceryListDetails();
    }, [id]);

    const fetchGroceryListDetails = async () => {
        setLoading(true);
        try {
            const response = await groceryListService.getGroceryListIngredients(id);
            setGroceryData(response.data);
        } catch (error) {
            console.error('Error fetching grocery list details:', error);
            enqueueSnackbar(t('details.fetchError'), { variant: 'error' });
            navigate('/groceries');
        } finally {
            setLoading(false);
        }
    };

    const groupByCategory = (ingredients) => {
        const grouped = {};
        ingredients.forEach(item => {
            const category = item.ingredient.category;
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(item);
        });
        return grouped;
    };

    const toggleCheck = (ingredientId) => {
        const newChecked = new Set(checkedItems);
        if (newChecked.has(ingredientId)) {
            newChecked.delete(ingredientId);
        } else {
            newChecked.add(ingredientId);
        }
        setCheckedItems(newChecked);

        const storageKey = `groceryList_${id}_checked`;
        localStorage.setItem(storageKey, JSON.stringify([...newChecked]));
    };

    const formatQuantity = (quantity, unit) => {
        const formatted = quantity % 1 === 0 ? quantity.toFixed(0) : quantity.toFixed(2);
        return `${formatted} ${t(`units.${unit}`)}`;
    };

    if (loading) {
        return (
            <Box bg="gray.50" minH="100vh" py={12}>
                <Flex justify="center" align="center" minH="60vh" direction="column" gap={4}>
                    <Spinner size="xl" color="#083951" thickness="4px" />
                    <Text fontSize="lg" color="gray.600">{t('common.loading')}</Text>
                </Flex>
            </Box>
        );
    }

    if (!groceryData || !groceryData.ingredients) {
        return null;
    }

    const groupedIngredients = groupByCategory(groceryData.ingredients);
    const totalChecked = checkedItems.size;
    const totalItems = groceryData.totalElements;

    return (
        <Box bg="gray.50" minH="100vh" py={8}>
            <Container maxW="1200px" px={8}>
                <VStack align="stretch" gap={6}>
                    <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
                        <Button
                            variant="ghost"
                            color="#083951"
                            onClick={() => navigate('/grocerylists')}
                            aria-label="Back to grocery lists"
                        >
                            <FiArrowLeft />
                        </Button>
                        <HStack gap={3}>
                            <HStack gap={2}>
                                <Text fontSize="lg" fontWeight="600" color="#083951">
                                    {t('details.checkedItems', { checked: totalChecked, total: totalItems })}
                                </Text>
                            </HStack>
                            <Button
                                bg="#083951"
                                color="white"
                                onClick={() => navigate(`/grocerylists/${id}/edit`)}
                                _hover={{ bg: '#0a4a63' }}
                                leftIcon={<FaEdit />}
                                px={6}
                            >
                                {t('details.edit')}
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
                                {t('common.groceryList')}
                            </Heading>
                        </Flex>
                        <Text color="gray.600">
                            {t('common.total')}: {totalItems === 1 ? t('details.ingredient', { count: totalItems }) : t('details.ingredients', { count: totalItems })}
                        </Text>
                    </Box>

                    {Object.entries(groupedIngredients).map(([category, items]) => {
                        const categoryColor = categoryColors[category] || categoryColors.OTHER;
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
                                        {t(`categories.${category}`)}
                                    </Heading>
                                    <Badge
                                        colorScheme={categoryColor}
                                        px={3}
                                        py={1}
                                        borderRadius="full"
                                        fontSize="xs"
                                    >
                                        {items.length} {items.length === 1 ? t('details.item') : t('details.items')}
                                    </Badge>
                                </Flex>

                                <VStack align="stretch" gap={2}>
                                    {items.map((item) => {
                                        const isChecked = checkedItems.has(item.ingredient.id);
                                        return (
                                            <Flex
                                                key={item.ingredient.id}
                                                align="center"
                                                gap={3}
                                                p={3}
                                                borderRadius="lg"
                                                bg={isChecked ? 'gray.50' : 'transparent'}
                                                transition="all 0.2s"
                                                _hover={{ bg: 'gray.50' }}
                                                cursor="pointer"
                                                onClick={() => toggleCheck(item.ingredient.id)}
                                            >
                                                <Box
                                                    w="24px"
                                                    h="24px"
                                                    borderRadius="md"
                                                    border="2px solid"
                                                    borderColor={isChecked ? '#083951' : 'gray.300'}
                                                    bg={isChecked ? '#083951' : 'white'}
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    transition="all 0.2s"
                                                >
                                                    {isChecked && (
                                                        <FaCheckCircle color="white" size={14} />
                                                    )}
                                                </Box>
                                                <Text
                                                    flex={1}
                                                    fontSize="md"
                                                    color={isChecked ? 'gray.500' : 'gray.800'}
                                                    textDecoration={isChecked ? 'line-through' : 'none'}
                                                    fontWeight="500"
                                                >
                                                    {item.ingredient.name}
                                                </Text>
                                                <Badge
                                                    colorScheme="blue"
                                                    px={3}
                                                    py={1}
                                                    borderRadius="full"
                                                    fontSize="sm"
                                                    fontWeight="600"
                                                >
                                                    {formatQuantity(item.quantity, item.ingredient.unit)}
                                                </Badge>
                                            </Flex>
                                        );
                                    })}
                                </VStack>
                            </Box>
                        );
                    })}
                </VStack>
            </Container>
        </Box>
    );
};

export default DetailsGroceryList;