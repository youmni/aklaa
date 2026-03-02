import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import dishService from '../../../services/dishService';
import { exportDishAsJSON, exportDishAsPDF } from '../../../utils/dishExport';
import {
    Box,
    Button,
    Heading,
    Text,
    Image,
    VStack,
    SimpleGrid,
    Flex,
    Badge,
    Spinner,
    HStack,
    Card,
    Accordion,
    createListCollection,
    Portal,
    Select
} from '@chakra-ui/react';
import { FiArrowLeft, FiDownload } from 'react-icons/fi';
import { FaUsers } from 'react-icons/fa';
import { useSnackbar } from 'notistack';

const DetailsDish = () => {
    const { t } = useTranslation('dish');
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const colors = useThemeColors();
    const [dish, setDish] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDish();
    }, [id]);

    const fetchDish = async () => {
        try {
            setIsLoading(true);
            const response = await dishService.getDishById(id);
            setDish(response.data);
        } catch (error) {
            enqueueSnackbar(t('details.fetchError'), { variant: 'error' });
            navigate('/dishes');
        } finally {
            setIsLoading(false);
        }
    };

    const formatCuisineType = (type) => {
        if (!type) return '';
        return type.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    };

    const formatTag = (tag) => {
        if (!tag) return '';
        return tag.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    };

    const handleExport = async (details) => {
        const exportType = details.value[0];
        if (!exportType) return;

        try {
            if (exportType === 'json') {
                exportDishAsJSON(dish);
                enqueueSnackbar(t('details.exportSuccess'), { variant: 'success' });
            } else if (exportType === 'pdf-light') {
                await exportDishAsPDF(dish, t, 'light');
                enqueueSnackbar(t('details.exportSuccess'), { variant: 'success' });
            } else if (exportType === 'pdf-dark') {
                await exportDishAsPDF(dish, t, 'dark');
                enqueueSnackbar(t('details.exportSuccess'), { variant: 'success' });
            }
        } catch (error) {
            enqueueSnackbar(t('details.exportError'), { variant: 'error' });
        }
    };

    if (isLoading) {
        return (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                minH="calc(100vh - 73px)"
            >
                <Spinner size="xl" thickness="4px" color={colors.text.brand} />
            </Box>
        );
    }

    if (!dish) {
        return null;
    }

    return (
        <Box p={8} maxW="1200px" mx="auto" bg={colors.bg.primary} minH="calc(100vh - 73px)" fontSize="md">
            <Flex mb={6} justify="space-between" align="center">
                <Button
                    variant="ghost"
                    color={colors.text.brand}
                    onClick={() => navigate('/dishes')}
                    aria-label="Back to dishes"
                >
                    <FiArrowLeft />
                </Button>

                <HStack gap={4}>
                    <Select.Root
                        collection={createListCollection({
                            items: [
                                { label: t('details.exportJSON'), value: 'json' },
                                { label: 'PDF Light', value: 'pdf-light' },
                                { label: 'PDF Dark', value: 'pdf-dark' }
                            ]
                        })}
                        size="md"
                        width="200px"
                        onValueChange={handleExport}
                    >
                        <Select.HiddenSelect />
                        <Select.Control>
                            <Select.Trigger>
                                <HStack>
                                    <FiDownload />
                                    <Select.ValueText placeholder={t('details.exportLabel')} />
                                </HStack>
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator />
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    <Select.Item item={{ label: t('details.exportJSON'), value: 'json' }}>
                                        {t('details.exportJSON')}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                    <Select.Item item={{ label: 'PDF Light', value: 'pdf-light' }}>
                                        PDF Light
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                    <Select.Item item={{ label: 'PDF Dark', value: 'pdf-dark' }}>
                                        PDF Dark
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>
                </HStack>
            </Flex>

            <VStack align="stretch" gap={8}>
                <Box>
                    <Heading fontSize="3xl" fontWeight="bold" color={colors.text.brand} mb={2}>
                        {dish.name}
                    </Heading>
                    <Flex align="center" gap={4} mt={4}>
                        <HStack>
                            <FaUsers color={colors.text.brand} />
                            <Text color={colors.text.secondary} fontWeight="medium">
                                {dish.people} {dish.people === 1 ? t('details.serving') : t('details.servings')}
                            </Text>
                        </HStack>
                        <Badge colorPalette="blue" fontSize="sm" px={3} py={1}>
                            {t(`cuisines.${dish.type}`)}
                        </Badge>
                    </Flex>
                </Box>

                {dish.imageUrl && (
                    <Box>
                        <Image
                            src={dish.imageUrl}
                            alt={dish.name}
                            w="full"
                            maxH="500px"
                            objectFit="cover"
                            borderRadius="lg"
                            boxShadow="md"
                        />
                    </Box>
                )}

                {dish.tags && dish.tags.length > 0 && (
                    <Box>
                        <Heading size="md" mb={3} color={colors.text.brand}>{t('details.tags')}</Heading>
                        <Flex flexWrap="wrap" gap={2}>
                            {dish.tags.map((tag, index) => (
                                <Badge
                                    key={index}
                                    colorPalette="teal"
                                    fontSize="sm"
                                    px={3}
                                    py={1}
                                    borderRadius="full"
                                >
                                    {t(`tags.${tag}`)}
                                </Badge>
                            ))}
                        </Flex>
                    </Box>
                )}

                <Box>
                    <Heading size="md" mb={3} color={colors.text.brand}>{t('common.description')}</Heading>
                    <Text color={colors.text.primary} lineHeight="1.8" fontSize="lg">
                        {dish.description}
                    </Text>
                </Box>

                <Box>
                    <Heading size="md" mb={4} color={colors.text.brand}>{t('details.ingredients')}</Heading>
                    <Card.Root bg={colors.bg.tertiary} borderRadius="lg" p={6}>
                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                            {dish.ingredients && dish.ingredients.length > 0 ? (
                                dish.ingredients.map((item, index) => (
                                    <Flex
                                        key={index}
                                        p={4}
                                        bg={colors.card.bg}
                                        borderRadius="md"
                                        boxShadow="sm"
                                        justify="space-between"
                                        align="center"
                                    >
                                        <Text fontWeight="medium" color={colors.text.brand}>
                                            {item.ingredient.name}
                                        </Text>
                                        <Text color={colors.text.secondary} fontWeight="semibold">
                                            {item.quantity} {item.ingredient.unit}
                                        </Text>
                                    </Flex>
                                ))
                            ) : (
                                <Text color="gray.500">{t('list.noResults')}</Text>
                            )}
                        </SimpleGrid>
                    </Card.Root>
                </Box>

                {dish.cookingSteps && dish.cookingSteps.length > 0 && (
                    <Box>
                        <Heading size="md" mb={4} color={colors.text.brand}>
                            {t('details.cookingSteps')}
                        </Heading>
                        <Accordion.Root multiple defaultValue={['0']}>
                            {dish.cookingSteps.map((step, index) => {
                                return (
                                    <Accordion.Item key={index} value={String(index)}>
                                        <Accordion.ItemTrigger
                                            bg={colors.card.bg}
                                            borderRadius="md"
                                            border="1px solid"
                                            borderColor={colors.border.default}
                                            p={4}
                                            mb={2}
                                            cursor="pointer"
                                            _hover={{ bg: colors.bg.hover }}
                                        >
                                            <Text fontWeight="medium" color={colors.text.brand}>
                                                {t('details.step')} {step.orderIndex}
                                            </Text>
                                        </Accordion.ItemTrigger>
                                        <Accordion.ItemContent>
                                            <Accordion.ItemBody
                                                bg={colors.card.bg}
                                                p={4}
                                                borderRadius="md"
                                                mb={2}
                                            >
                                                <Text color={colors.text.primary} lineHeight="1.8">
                                                    {step.recipeStep}
                                                </Text>
                                            </Accordion.ItemBody>
                                        </Accordion.ItemContent>
                                    </Accordion.Item>
                                );
                            })}
                        </Accordion.Root>
                    </Box>
                )}

            </VStack>
        </Box>
    );
};

export default DetailsDish;