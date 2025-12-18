import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Input, Stack, Spinner, Text, Grid, Badge, HStack, IconButton, VStack } from "@chakra-ui/react";
import { useSnackbar } from 'notistack';
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import api from "../../../api/axiosConfig";
import ConfirmDialog from "../../../components/ConfirmDialog";
import Pagination from "../../../components/Pagination";

const GetIngredients = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [ingredients, setIngredients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
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
    const pageSize = 12;

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

    useEffect(() => {
        fetchIngredients();
    }, [page, search, selectedCategories]);

    const fetchIngredients = async () => {
        setIsLoading(true);
        try {
            const categoryParams = selectedCategories.length > 0
                ? selectedCategories.map(cat => `${cat}`).join(',')
                : '';

            const params = new URLSearchParams({
                page: page,
                size: pageSize
            });

            if (search.trim()) {
                params.append('search', search.trim());
            }

            if (categoryParams) {
                params.append('categories', categoryParams);
            }

            const response = await api.get(`/ingredients?${params.toString()}`);
            setIngredients(response.data.ingredients || []);
            setTotalPages(response.data.totalPages || 0);
            setTotalElements(response.data.totalElements || 0);
        } catch (error) {
            const errMsg = error?.response?.data?.message || 'Failed to get ingredients';
            enqueueSnackbar(errMsg, { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(0);
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        if (value === "") {
            setSelectedCategories([]);
        } else {
            setSelectedCategories([value]);
        }
        setPage(0);
    };

    const handleEdit = (ingredient) => {
        setConfirmPayload({
            title: "Confirm Edit",
            description: `Are you sure you want to edit "${ingredient.name}"? This could have an effect on existing recipes using this ingredient.`,
            confirmLabel: "Edit",
            confirmColorScheme: "blue",
            onConfirm: () => {
                setConfirmOpen(false);
                navigate(`/ingredients/edit/${ingredient.id}`);
            }
        });
        setConfirmOpen(true);
    };

    const handleDelete = (ingredient) => {
        setConfirmPayload({
            title: "Confirm Delete",
            description: `Are you sure you want to delete "${ingredient.name}"? This action cannot be undone.`,
            confirmLabel: "Delete",
            confirmColorScheme: "red",
            onConfirm: async () => {
                setConfirmLoading(true);
                try {
                    await api.delete(`/ingredients/${ingredient.id}`);
                    enqueueSnackbar('Ingredient verwijderd', { variant: 'success' });
                    setConfirmOpen(false);
                    fetchIngredients();
                } catch (err) {
                    enqueueSnackbar(err?.response?.data?.message || 'Verwijderen mislukt', { variant: 'error' });
                } finally {
                    setConfirmLoading(false);
                }
            }
        });
        setConfirmOpen(true);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            VEGETABLES: { bg: '#E8F5E9', color: '#2E7D32', border: '#66BB6A' },
            FRUITS: { bg: '#FFF3E0', color: '#E65100', border: '#FF9800' },
            DAIRY: { bg: '#E3F2FD', color: '#1565C0', border: '#42A5F5' },
            MEAT: { bg: '#FFEBEE', color: '#C62828', border: '#EF5350' },
            FISH: { bg: '#E0F7FA', color: '#00838F', border: '#26C6DA' },
            GRAINS: { bg: '#FFF9C4', color: '#F57F17', border: '#FFEB3B' },
            SPICES: { bg: '#F3E5F5', color: '#6A1B9A', border: '#AB47BC' },
            BAKING: { bg: '#FCE4EC', color: '#C2185B', border: '#EC407A' },
            DRINKS: { bg: '#E0F2F1', color: '#00695C', border: '#26A69A' },
            HOUSEHOLD: { bg: '#F5F5F5', color: '#616161', border: '#9E9E9E' },
            OTHER: { bg: '#FAFAFA', color: '#757575', border: '#BDBDBD' }
        };
        return colors[category] || colors.OTHER;
    };

    return (
        <Box p={{ base: 4, md: 6, lg: 8 }} maxW="1400px" mx="auto" bg="white" minH="calc(100vh - 73px)">
            <Stack mb={{ base: 4, md: 6, lg: 8 }} gap={{ base: 4, md: 6 }}>
                <Stack direction={{ base: "column", sm: "row" }} justify="space-between" align={{ base: "stretch", sm: "center" }} gap={3}>
                    <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="#083951">
                        Ingredients
                    </Text>
                    <Button
                        bg="#083951"
                        color="white"
                        onClick={() => navigate('/ingredients/add')}
                        _hover={{ bg: "#0a4a63" }}
                        size={{ base: "md", md: "lg" }}
                        px={{ base: 4, md: 6 }}
                        w={{ base: "full", sm: "auto" }}
                    >
                        <FiPlus style={{ marginRight: '8px' }} />
                        Add Ingredient
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
                            placeholder="Search by name or description..."
                            value={search}
                            onChange={handleSearchChange}
                            focusBorderColor="#083951"
                            pl="2.5rem"
                            size={{ base: "md", md: "lg" }}
                        />
                    </Box>
                    <Box flex={1}>
                        <select
                            value={selectedCategories[0] || ""}
                            onChange={handleCategoryChange}
                            style={{
                                width: '100%',
                                padding: window.innerWidth < 768 ? '0.5rem 0.75rem' : '0.75rem 1rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #E2E8F0',
                                fontSize: '1rem',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                                height: window.innerWidth < 768 ? '2.5rem' : '3rem'
                            }}
                        >
                            <option value="">All categories</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat.charAt(0) + cat.slice(1).toLowerCase()}
                                </option>
                            ))}
                        </select>
                    </Box>
                </Stack>

                <Text fontSize="sm" color="gray.600" fontWeight="500">
                    {totalElements} ingredient{totalElements !== 1 ? 's' : ''} found
                </Text>
            </Stack>

            {isLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
                    <Spinner size="xl" thickness="4px" color="#083951" />
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
                        {ingredients.map((ingredient) => {
                            const categoryStyle = getCategoryColor(ingredient.category);
                            return (
                                <Box
                                    key={ingredient.id}
                                    p={{ base: 4, md: 5, lg: 6 }}
                                    borderWidth="2px"
                                    borderRadius="xl"
                                    borderColor="gray.200"
                                    bg="white"
                                    _hover={{
                                        shadow: "xl",
                                        transform: "translateY(-4px)",
                                        borderColor: "#083951"
                                    }}
                                    transition="all 0.3s"
                                >
                                    <Stack gap={{ base: 3, md: 4 }}>
                                        <HStack justify="space-between" align="start">
                                            <Text
                                                fontSize={{ base: "lg", md: "xl" }}
                                                fontWeight="bold"
                                                color="#083951"
                                                flex={1}
                                                isTruncated
                                                title={ingredient.name}
                                                sx={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}
                                            >
                                                {ingredient.name}
                                            </Text>

                                            <HStack gap={1} flexShrink={0}>
                                                <IconButton
                                                    size="sm"
                                                    colorPalette="blue"
                                                    variant="ghost"
                                                    onClick={() => handleEdit(ingredient)}
                                                    aria-label="Edit ingredient"
                                                    _hover={{ bg: "blue.50" }}
                                                >
                                                    <FiEdit2 size={16} />
                                                </IconButton>
                                                <IconButton
                                                    size="sm"
                                                    colorPalette="red"
                                                    variant="ghost"
                                                    onClick={() => handleDelete(ingredient)}
                                                    aria-label="Delete ingredient"
                                                    _hover={{ bg: "red.50" }}
                                                >
                                                    <FiTrash2 size={16} />
                                                </IconButton>
                                            </HStack>
                                        </HStack>

                                        <Text
                                            fontSize="sm"
                                            color={ingredient.description && ingredient.description.trim() ? "gray.600" : "gray.400"}
                                            noOfLines={3}
                                            title={ingredient.description && ingredient.description.trim() ? ingredient.description : "no description"}
                                            sx={{ overflowWrap: 'anywhere', wordBreak: 'break-word', whiteSpace: 'normal' }}
                                        >
                                            {ingredient.description && ingredient.description.trim() ? ingredient.description : "no description"}
                                        </Text>

                                        <HStack justify="space-between" pt={2} flexWrap="wrap" gap={2}>
                                            <Box
                                                px={{ base: 2, md: 3 }}
                                                py={{ base: 1, md: 1.5 }}
                                                borderRadius="lg"
                                                bg={categoryStyle.bg}
                                                color={categoryStyle.color}
                                                borderWidth="1px"
                                                borderColor={categoryStyle.border}
                                                fontSize={{ base: "xs", md: "sm" }}
                                                fontWeight="600"
                                            >
                                                {ingredient.category.charAt(0) + ingredient.category.slice(1).toLowerCase()}
                                            </Box>
                                            <Box
                                                px={{ base: 2, md: 3 }}
                                                py={{ base: 1, md: 1.5 }}
                                                borderRadius="lg"
                                                bg="gray.100"
                                                color="gray.700"
                                                borderWidth="1px"
                                                borderColor="gray.300"
                                                fontSize={{ base: "xs", md: "sm" }}
                                                fontWeight="600"
                                            >
                                                {ingredient.unit.toLowerCase()}
                                            </Box>
                                        </HStack>
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
        </Box>
    );
};

export default GetIngredients;