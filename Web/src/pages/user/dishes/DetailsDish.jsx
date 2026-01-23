import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dishService from '../../../services/dishService';
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
    Accordion
} from '@chakra-ui/react';
import { FiArrowLeft, FiEdit } from 'react-icons/fi';
import { FaUsers } from 'react-icons/fa';
import { useSnackbar } from 'notistack';

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
            const response = await dishService.getDishById(id);
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
                <Spinner size="xl" thickness="4px" color="#083951" />
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
                    color="#083951"
                    onClick={() => navigate('/dishes')}
                    aria-label="Back to dishes"
                >
                    <FiArrowLeft />
                </Button>
            </Flex>

            <VStack align="stretch" gap={8}>
                <Box>
                    <Heading fontSize="3xl" fontWeight="bold" color="#083951" mb={2}>
                        {dish.name}
                    </Heading>
                    <Flex align="center" gap={4} mt={4}>
                        <HStack>
                            <FaUsers color="#083951" />
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
                        <Heading size="md" mb={3} color="#083951">Tags</Heading>
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
                    <Heading size="md" mb={3} color="#083951">Description</Heading>
                    <Text color="gray.700" lineHeight="1.8" fontSize="lg">
                        {dish.description}
                    </Text>
                </Box>

                <Box>
                    <Heading size="md" mb={4} color="#083951">Ingredients</Heading>
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
                                        <Text fontWeight="medium" color="#083951">
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

                {dish.cookingSteps && dish.cookingSteps.length > 0 && (
                    <Box>
                        <Heading size="md" mb={4} color="#083951">
                            Cooking Instructions
                        </Heading>
                        <Accordion.Root multiple defaultValue={['0']}>
                            {dish.cookingSteps.map((step, index) => {
                                return (
                                    <Accordion.Item key={index} value={String(index)}>
                                        <Accordion.ItemTrigger
                                            bg="white"
                                            borderRadius="md"
                                            border="1px solid"
                                            borderColor="gray.200"
                                            p={4}
                                            mb={2}
                                            cursor="pointer"
                                            _hover={{ bg: 'gray.50' }}
                                        >
                                            <Text fontWeight="medium" color="#083951">
                                                Step {step.orderIndex}
                                            </Text>
                                        </Accordion.ItemTrigger>
                                        <Accordion.ItemContent>
                                            <Accordion.ItemBody
                                                bg="gray.50"
                                                p={4}
                                                borderRadius="md"
                                                mb={2}
                                            >
                                                <Text color="gray.700" lineHeight="1.8">
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