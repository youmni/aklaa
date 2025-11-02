import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../api/axiosConfig';
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
    Card
} from '@chakra-ui/react';
import { FiArrowLeft, FiEdit } from 'react-icons/fi';
import { FaUsers } from 'react-icons/fa';
import { useSnackbar } from 'notistack';
import MarkdownRenderer from '../../../components/MarkdownRenderer';

const NAVY = '#083951';

const DetailsDish = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [dish, setDish] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDish();
    }, [id]);

    const fetchDish = async () => {
        try {
            setIsLoading(true);
            const response = await api.get(`/dishes/${id}`);
            setDish(response.data);
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || 'Failed to fetch dish', { variant: 'error' });
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

    if (isLoading) {
        return (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                minH="calc(100vh - 73px)"
            >
                <Spinner size="xl" thickness="4px" color={NAVY} />
            </Box>
        );
    }

    if (!dish) {
        return null;
    }

    return (
        <Box p={8} maxW="1200px" mx="auto" bg="white" minH="calc(100vh - 73px)" fontSize="md">
            <Flex mb={6} justify="space-between" align="center">
                <Button
                    variant="ghost"
                    color={NAVY}
                    onClick={() => navigate('/dishes')}
                    aria-label="Back to dishes"
                >
                    <FiArrowLeft />
                </Button>
            </Flex>

            <VStack align="stretch" gap={8}>
                <Box>
                    <Heading fontSize="3xl" fontWeight="bold" color={NAVY} mb={2}>
                        {dish.name}
                    </Heading>
                    <Flex align="center" gap={4} mt={4}>
                        <HStack>
                            <FaUsers color={NAVY} />
                            <Text color="gray.600" fontWeight="medium">
                                {dish.people} {dish.people === 1 ? 'Serving' : 'Servings'}
                            </Text>
                        </HStack>
                        <Badge colorScheme="blue" fontSize="sm" px={3} py={1}>
                            {formatCuisineType(dish.type)}
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
                        <Heading size="md" mb={3} color={NAVY}>Tags</Heading>
                        <Flex flexWrap="wrap" gap={2}>
                            {dish.tags.map((tag, index) => (
                                <Badge
                                    key={index}
                                    colorScheme="teal"
                                    fontSize="sm"
                                    px={3}
                                    py={1}
                                    borderRadius="full"
                                >
                                    {formatTag(tag)}
                                </Badge>
                            ))}
                        </Flex>
                    </Box>
                )}

                <Box>
                    <Heading size="md" mb={3} color={NAVY}>Description</Heading>
                    <Text color="gray.700" lineHeight="1.8" fontSize="lg">
                        {dish.description}
                    </Text>
                </Box>

                <Box>
                    <Heading size="md" mb={4} color={NAVY}>Ingredients</Heading>
                    <Card.Root bg="gray.50" borderRadius="lg" p={6}>
                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                            {dish.ingredients && dish.ingredients.length > 0 ? (
                                dish.ingredients.map((item, index) => (
                                    <Flex
                                        key={index}
                                        p={4}
                                        bg="white"
                                        borderRadius="md"
                                        boxShadow="sm"
                                        justify="space-between"
                                        align="center"
                                    >
                                        <Text fontWeight="medium" color={NAVY}>
                                            {item.ingredient.name}
                                        </Text>
                                        <Text color="gray.600" fontWeight="semibold">
                                            {item.quantity} {item.ingredient.unit}
                                        </Text>
                                    </Flex>
                                ))
                            ) : (
                                <Text color="gray.500">No ingredients listed</Text>
                            )}
                        </SimpleGrid>
                    </Card.Root>
                </Box>

                {dish.cookingSteps && (
                    <Box>
                        <Heading size="md" mb={4} color={NAVY}>
                            Cooking Instructions
                        </Heading>
                        <Box boxShadow="sm" p={6} bg="gray.50" borderRadius="lg">
                            <MarkdownRenderer content={dish.cookingSteps} />
                        </Box>
                    </Box>
                )}

            </VStack>
        </Box>
    );
};

export default DetailsDish;