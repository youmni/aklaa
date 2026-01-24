import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useThemeColors } from '../../../hooks/useThemeColors';
import { Box, Button, Input, Stack, Spinner, Text, Grid, Badge, HStack, IconButton, VStack, Image } from "@chakra-ui/react";
import { useSnackbar } from 'notistack';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiEye } from 'react-icons/fi';
import dishService from "../../../services/dishService";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import AddToCartModal from "../../../components/shoppingcart/AddToCartModal";
import Pagination from "../../../components/ui/Pagination";

const GetDishes = () => {
    const { t } = useTranslation('dish');
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const colors = useThemeColors();
    const [dishes, setDishes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [confirmPayload, setConfirmPayload] = useState({
        title: "",
        description: "",
        confirmLabel: "Confirm",
        confirmColorScheme: "red",
        onConfirm: () => {}
    });
    const [cartModalOpen, setCartModalOpen] = useState(false);
    const [selectedDish, setSelectedDish] = useState(null);
    const pageSize = 12;
    const defaultImageUrl = import.meta.env.VITE_DEFAULT_IMAGE_URL;

    const cuisineTypes = [
        "ITALIAN",
        "FRENCH",
        "CHINESE",
        "JAPANESE",
        "MEXICAN",
        "INDIAN",
        "AMERICAN",
        "THAI",
        "SPANISH",
        "MEDITERRANEAN",
        "MIDDLE_EASTERN",
        "KOREAN",
        "AFRICAN",
        "GREEK",
        "TURKISH",
        "MOROCCAN"
    ];

    useEffect(() => {
        fetchDishes();
    }, [page, search, selectedCountries]);

    const fetchDishes = async () => {
        setIsLoading(true);
        try {
            const countryParams = selectedCountries.length > 0
                ? selectedCountries.map(country => `${country}`).join(',')
                : '';

            const params = new URLSearchParams({
                page: page,
                size: pageSize
            });

            if (search.trim()) {
                params.append('search', search.trim());
            }

            if (countryParams) {
                params.append('countries', countryParams);
            }

            const response = await dishService.getDishes(Object.fromEntries(params));
            setDishes(response.data.dishes || []);
            setTotalPages(response.data.totalPages || 0);
            setTotalElements(response.data.totalElements || 0);
        } catch (error) {
            enqueueSnackbar(t('list.fetchError'), { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(0);
    };

    const handleCountryChange = (e) => {
        const value = e.target.value;
        if (value === "") {
            setSelectedCountries([]);
        } else {
            setSelectedCountries([value]);
        }
        setPage(0);
    };

    const handleDetails = (dish) => {
        navigate(`/dishes/details/${dish.id}`);
    };

    const handleEdit = (dish) => {
        setConfirmPayload({
            title: t('list.confirmEditTitle'),
            description: t('list.confirmEditDescription', { name: dish.name }),
            confirmLabel: t('common.edit'),
            confirmColorScheme: "blue",
            onConfirm: () => {
                setConfirmOpen(false);
                navigate(`/dishes/edit/${dish.id}`);
            }
        });
        setConfirmOpen(true);
    };

    const handleDelete = (dish) => {
        setConfirmPayload({
            title: t('list.confirmDeleteTitle'),
            description: t('list.confirmDeleteDescription', { name: dish.name }),
            confirmLabel: t('common.delete'),
            confirmColorScheme: "red",
            onConfirm: async () => {
                setConfirmLoading(true);
                try {
                    navigate(`/dishes/delete/${dish.id}`);
                    setConfirmOpen(false);
                    fetchDishes();
                } catch (err) {
                    enqueueSnackbar(t('list.deleteError'), { variant: 'error' });
                } finally {
                    setConfirmLoading(false);
                }
            }
        });
        setConfirmOpen(true);
    };

    const handleAddToCart = (dish) => {
        setSelectedDish(dish);
        setCartModalOpen(true);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    const getTagColor = (tag) => {
        const colors = {
            HEALTHY: { bg: '#E8F5E9', color: '#2E7D32', border: '#66BB6A' },
            GLUTEN_FREE: { bg: '#FFF3E0', color: '#E65100', border: '#FF9800' },
            VEGETARIAN: { bg: '#E3F2FD', color: '#1565C0', border: '#42A5F5' },
            VEGAN: { bg: '#E8F5E9', color: '#388E3C', border: '#66BB6A' },
            MAIN_COURSE: { bg: '#FFEBEE', color: '#C62828', border: '#EF5350' },
            APPETIZER: { bg: '#FFF9C4', color: '#F57F17', border: '#FFEB3B' },
            DESSERT: { bg: '#FCE4EC', color: '#C2185B', border: '#EC407A' },
            DINNER: { bg: '#F3E5F5', color: '#6A1B9A', border: '#AB47BC' },
            LUNCH: { bg: '#E0F7FA', color: '#00838F', border: '#26C6DA' },
            BREAKFAST: { bg: '#FFF3E0', color: '#EF6C00', border: '#FB8C00' },
            COMFORT_FOOD: { bg: '#FFEBEE', color: '#D32F2F', border: '#E57373' }
        };
        return colors[tag] || { bg: '#F5F5F5', color: '#616161', border: '#9E9E9E' };
    };

    const getCuisineColor = (cuisine) => {
        const colors = {
            ITALIAN: { bg: '#E8F5E9', color: '#2E7D32', border: '#66BB6A' },
            FRENCH: { bg: '#E3F2FD', color: '#1565C0', border: '#42A5F5' },
            CHINESE: { bg: '#FFEBEE', color: '#C62828', border: '#EF5350' },
            JAPANESE: { bg: '#FCE4EC', color: '#C2185B', border: '#EC407A' },
            MEXICAN: { bg: '#FFF3E0', color: '#E65100', border: '#FF9800' },
            INDIAN: { bg: '#FFF9C4', color: '#F57F17', border: '#FFEB3B' },
            AMERICAN: { bg: '#E3F2FD', color: '#1976D2', border: '#42A5F5' },
            THAI: { bg: '#F3E5F5', color: '#6A1B9A', border: '#AB47BC' },
            SPANISH: { bg: '#FFEBEE', color: '#D32F2F', border: '#E57373' },
            MEDITERRANEAN: { bg: '#E0F7FA', color: '#00838F', border: '#26C6DA' },
            MIDDLE_EASTERN: { bg: '#FFF9C4', color: '#EF6C00', border: '#FFB74D' },
            KOREAN: { bg: '#FFEBEE', color: '#C62828', border: '#EF5350' },
            AFRICAN: { bg: '#FFF3E0', color: '#E65100', border: '#FF9800' },
            GREEK: { bg: '#E3F2FD', color: '#1565C0', border: '#42A5F5' },
            TURKISH: { bg: '#FFEBEE', color: '#D32F2F', border: '#E57373' },
            MOROCCAN: { bg: '#FFF9C4', color: '#F57F17', border: '#FFEB3B' }
        };
        return colors[cuisine] || { bg: '#F5F5F5', color: '#616161', border: '#9E9E9E' };
    };

    return (
        <Box p={{ base: 4, md: 6, lg: 8 }} maxW="1400px" mx="auto" bg={colors.bg.primary} minH="calc(100vh - 73px)">
            <Stack mb={{ base: 4, md: 6, lg: 8 }} gap={{ base: 4, md: 6 }}>
                <Stack direction={{ base: "column", sm: "row" }} justify="space-between" align={{ base: "stretch", sm: "center" }} gap={3}>
                    <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color={colors.text.brand}>
                        {t('list.title')}
                    </Text>
                    <Button
                        bg={colors.button.primary.bg}
                        color="white"
                        onClick={() => navigate('/dishes/add')}
                        _hover={{ bg: colors.button.primary.hover }}
                        size={{ base: "md", md: "lg" }}
                        px={{ base: 4, md: 6 }}
                        w={{ base: "full", sm: "auto" }}
                    >
                        <FiPlus style={{ marginRight: '8px' }} />
                        {t('list.createButton')}
                    </Button>
                </Stack>

                <Stack direction={{ base: "column", md: "row" }} gap={4}>
                    <Box position="relative" flex={2}>
                        <Box
                            position="absolute"
                            left="3"
                            top="50%"
                            transform="translateY(-50%)"
                            zIndex={1}
                            pointerEvents="none"
                        >
                            <FiSearch color="#718096" size={18} />
                        </Box>
                        <Input
                            placeholder={t('list.searchPlaceholder')}
                            value={search}
                            onChange={handleSearchChange}
                            focusBorderColor={colors.text.brand}
                            bg={colors.input.bg}
                            borderColor={colors.border.default}
                            color={colors.text.primary}
                            pl="2.5rem"
                            size={{ base: "md", md: "lg" }}
                        />
                    </Box>
                    <Box flex={1}>
                        <select
                            value={selectedCountries[0] || ""}
                            onChange={handleCountryChange}
                            style={{
                                width: '100%',
                                padding: window.innerWidth < 768 ? '0.5rem 0.75rem' : '0.75rem 1rem',
                                borderRadius: '0.5rem',
                                border: `1px solid ${colors.border.default}`,
                                fontSize: '1rem',
                                backgroundColor: colors.input.bg,
                                color: colors.text.primary,
                                cursor: 'pointer',
                                height: window.innerWidth < 768 ? '2.5rem' : '3rem'
                            }}
                        >
                            <option value="">{t('list.allCuisines')}</option>
                            {cuisineTypes.map((cuisine) => (
                                <option key={cuisine} value={cuisine}>
                                    {t(`cuisines.${cuisine}`)}
                                </option>
                            ))}
                        </select>
                    </Box>
                </Stack>

                <Text fontSize="sm" color={colors.text.secondary} fontWeight="500">
                    {totalElements} {totalElements !== 1 ? t('list.title').toLowerCase() : t('list.title').toLowerCase().slice(0, -1)} {t('list.noResults').split(' ')[0].toLowerCase()}
                </Text>
            </Stack>

            {isLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
                    <Spinner size="xl" thickness="4px" color={colors.text.brand} />
                </Box>
            ) : (
                <>
                    <Grid
                        templateColumns={{
                            base: "repeat(1, 1fr)",
                            sm: "repeat(2, 1fr)",
                            lg: "repeat(3, 1fr)",
                            xl: "repeat(4, 1fr)"
                        }}
                        gap={{ base: 4, md: 6 }}
                        mb={{ base: 6, md: 8 }}
                    >
                        {dishes.map((dish) => {
                            const cuisineStyle = getCuisineColor(dish.type);
                            return (
                                <Box
                                    key={dish.id}
                                    borderWidth="2px"
                                    borderRadius="xl"
                                    borderColor={colors.border.default}
                                    bg={colors.card.bg}
                                    overflow="hidden"
                                    _hover={{
                                        shadow: "xl",
                                        transform: "translateY(-4px)",
                                        borderColor: colors.text.brand,
                                        bg: colors.card.hover
                                    }}
                                    transition="all 0.3s"
                                    display="flex"
                                    flexDirection="column"
                                >
                                    <Box position="relative" h={{ base: "180px", md: "200px" }} bg="gray.100">
                                        <Image
                                            src={dish.imageUrl || defaultImageUrl}
                                            alt={dish.name}
                                            w="100%"
                                            h="100%"
                                            objectFit="cover"
                                            fallback={
                                                <Box
                                                    w="100%"
                                                    h="100%"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    bg="gray.200"
                                                >
                                                    <Text color="gray.500" fontSize="sm">No image</Text>
                                                </Box>
                                            }
                                        />
                                        
                                        <HStack
                                            position="absolute"
                                            top={2}
                                            right={2}
                                            gap={1}
                                            bg="rgba(255, 255, 255, 0.95)"
                                            borderRadius="md"
                                            p={1}
                                        >
                                            <IconButton
                                                size="sm"
                                                bg="green.500"
                                                color="white"
                                                variant="solid"
                                                onClick={() => handleDetails(dish)}
                                                aria-label="View details"
                                                _hover={{ bg: "green.600" }}
                                            >
                                                <FiEye size={16} />
                                            </IconButton>
                                            <IconButton
                                                size="sm"
                                                bg="blue.500"
                                                color="white"
                                                variant="solid"
                                                onClick={() => handleEdit(dish)}
                                                aria-label="Edit dish"
                                                _hover={{ bg: "blue.600" }}
                                            >
                                                <FiEdit2 size={16} />
                                            </IconButton>
                                            <IconButton
                                                size="sm"
                                                bg="red.500"
                                                color="white"
                                                variant="solid"
                                                onClick={() => handleDelete(dish)}
                                                aria-label="Delete dish"
                                                _hover={{ bg: "red.600" }}
                                            >
                                                <FiTrash2 size={16} />
                                            </IconButton>
                                        </HStack>

                                        <Box
                                            position="absolute"
                                            bottom={2}
                                            left={2}
                                            px={3}
                                            py={1.5}
                                            borderRadius="lg"
                                            bg={cuisineStyle.bg}
                                            color={cuisineStyle.color}
                                            borderWidth="1px"
                                            borderColor={cuisineStyle.border}
                                            fontSize="sm"
                                            fontWeight="700"
                                            backdropFilter="blur(10px)"
                                        >
                                            {t(`cuisines.${dish.type}`)}
                                        </Box>
                                    </Box>

                                    <Stack gap={3} p={{ base: 4, md: 5 }} flex="1" justify="space-between">
                                        <VStack align="stretch" gap={3}>
                                            <Text
                                                fontSize={{ base: "lg", md: "xl" }}
                                                fontWeight="bold"
                                                color={colors.text.brand}
                                                isTruncated
                                                title={dish.name}
                                            >
                                                {dish.name}
                                            </Text>

                                            <VStack align="stretch" gap={2}>
                                                <HStack flexWrap="wrap" gap={2}>
                                                    {dish.tags && dish.tags.length > 0 ? (
                                                        dish.tags.slice(0, 3).map((tag, index) => {
                                                            const tagStyle = getTagColor(tag);
                                                            return (
                                                                <Box
                                                                    key={index}
                                                                    px={{ base: 2, md: 2.5 }}
                                                                    py={{ base: 0.5, md: 1 }}
                                                                    borderRadius="md"
                                                                    bg={tagStyle.bg}
                                                                    color={tagStyle.color}
                                                                    borderWidth="1px"
                                                                    borderColor={tagStyle.border}
                                                                    fontSize="xs"
                                                                    fontWeight="600"
                                                                >
                                                                    {t(`tags.${tag}`)}
                                                                </Box>
                                                            );
                                                        })
                                                    ) : (
                                                        <Text fontSize="xs" color="gray.400">{t('list.noResults')}</Text>
                                                    )}
                                                    {dish.tags && dish.tags.length > 3 && (
                                                        <Text fontSize="xs" color="gray.500" fontWeight="600">
                                                            +{dish.tags.length - 3}
                                                        </Text>
                                                    )}
                                                </HStack>
                                            </VStack>
                                        </VStack>

                                        <Button
                                            bg={colors.button.primary.bg}
                                            color="white"
                                            size="md"
                                            w="full"
                                            onClick={() => handleAddToCart(dish)}
                                            _hover={{ bg: colors.button.primary.hover }}
                                        >
                                            <FiPlus style={{ marginRight: '8px' }} />
                                            {t('common.addToCart')}
                                        </Button>
                                    </Stack>
                                </Box>
                            );
                        })}
                    </Grid>

                    <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
                </>
            )}

            <ConfirmDialog
                isOpen={confirmOpen}
                onClose={() => {
                    setConfirmOpen(false);
                    setConfirmLoading(false);
                }}
                title={confirmPayload.title}
                description={confirmPayload.description}
                onConfirm={confirmPayload.onConfirm}
                confirmLabel={confirmPayload.confirmLabel}
                confirmColorScheme={confirmPayload.confirmColorScheme}
                isLoading={confirmLoading}
            />

            <AddToCartModal
                isOpen={cartModalOpen}
                onClose={() => setCartModalOpen(false)}
                dish={selectedDish}
            />
        </Box>
    );
};

export default GetDishes;