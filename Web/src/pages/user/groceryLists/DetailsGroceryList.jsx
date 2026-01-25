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
import { useThemeColors } from '../../../hooks/useThemeColors';

const DetailsGroceryList = () => {
    const { t } = useTranslation('grocerylist');
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const colors = useThemeColors();
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
            <Box bg={colors.bg.page} minH="100vh" py={12}>
                <Flex justify="center" align="center" minH="60vh" direction="column" gap={4}>
                    <Spinner size="xl" color={colors.text.brand} thickness="4px" />
                    <Text fontSize="lg" color={colors.text.secondary}>{t('common.loading')}</Text>
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
        <Box bg={colors.bg.page} minH="100vh" py={8}>
            <Container maxW="1200px" px={8}>
                <VStack align="stretch" gap={6}>
                    <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
                        <Button
                            variant="ghost"
                            color={colors.text.brand}
                            onClick={() => navigate('/grocerylists')}
                            aria-label="Back to grocery lists"
                        >
                            <FiArrowLeft />
                        </Button>
                        <HStack gap={3}>
                            <HStack gap={2}>
                                <Text fontSize="lg" fontWeight="600" color={colors.text.brand}>
                                    {t('details.checkedItems', { checked: totalChecked, total: totalItems })}
                                </Text>
                            </HStack>
                            <Button
                                bg={colors.button.primary.bg}
                                color="white"
                                onClick={() => navigate(`/grocerylists/${id}/edit`)}
                                _hover={{ bg: colors.button.primary.hover }}
                                leftIcon={<FaEdit />}
                                px={6}
                            >
                                {t('details.edit')}
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
                                {t('common.groceryList')}
                            </Heading>
                        </Flex>
                        <Text color={colors.text.secondary}>
                            {t('common.total')}: {totalItems === 1 ? t('details.ingredient', { count: totalItems }) : t('details.ingredients', { count: totalItems })}
                        </Text>
                    </Box>

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
                                                bg={isChecked ? colors.bg.tertiary : 'transparent'}
                                                transition="all 0.2s"
                                                _hover={{ bg: colors.bg.tertiary }}
                                                cursor="pointer"
                                                onClick={() => toggleCheck(item.ingredient.id)}
                                            >
                                                <Box
                                                    w="24px"
                                                    h="24px"
                                                    borderRadius="md"
                                                    border="2px solid"
                                                    borderColor={isChecked ? colors.text.brand : colors.border.default}
                                                    bg={isChecked ? colors.text.brand : colors.card.bg}
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
                                                    color={isChecked ? colors.text.tertiary : colors.text.primary}
                                                    textDecoration={isChecked ? 'line-through' : 'none'}
                                                    fontWeight="500"
                                                >
                                                    {item.ingredient.name}
                                                </Text>
                                                <Badge
                                                    colorPalette="black"
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