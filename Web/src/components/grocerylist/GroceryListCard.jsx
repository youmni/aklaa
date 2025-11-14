import { Box, Flex, Heading, Text, Badge, HStack, VStack, Button } from '@chakra-ui/react';
import { FaCalendarAlt, FaShoppingBasket, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const GroceryListCard = ({ list, status, onRefresh }) => {
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    const getStatusColor = () => {
        switch (status) {
            case 'past':
                return 'gray';
            case 'present':
                return 'green';
            case 'future':
                return 'blue';
            default:
                return 'gray';
        }
    };

    const getStatusLabel = () => {
        switch (status) {
            case 'past':
                return 'Completed';
            case 'present':
                return 'Active';
            case 'future':
                return 'Upcoming';
            default:
                return '';
        }
    };

    const handleViewIngredients = () => {
        navigate(`/grocerylists/${list.id}/ingredients`);
    };

    return (
        <Box
            bg="white"
            borderRadius="xl"
            p={6}
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.200"
            transition="all 0.2s"
            _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
        >
            <Flex justify="space-between" align="start" gap={4}>
                <VStack align="stretch" flex={1} gap={3}>
                    <Flex align="center" gap={3} flexWrap="wrap">
                        <Heading size="md" color="#083951" fontWeight="600">
                            Week {formatDate(list.startOfWeek)} - {formatDate(list.endOfWeek)}
                        </Heading>
                        <Badge
                            colorScheme={getStatusColor()}
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontSize="xs"
                        >
                            {getStatusLabel()}
                        </Badge>
                    </Flex>

                    <HStack gap={4} flexWrap="wrap" color="gray.600">
                        <HStack gap={2}>
                            <FaCalendarAlt size={14} />
                            <Text fontSize="sm">
                                {formatDate(list.startOfWeek)}
                            </Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.400">•</Text>
                        <HStack gap={2}>
                            <FaCalendarAlt size={14} />
                            <Text fontSize="sm">
                                {formatDate(list.endOfWeek)}
                            </Text>
                        </HStack>
                    </HStack>

                    {list.dishes && list.dishes.length > 0 && (
                        <HStack gap={2}>
                            <FaShoppingBasket size={14} color="#083951" />
                            <Text fontSize="sm" color="gray.700" fontWeight="500">
                                {list.dishes.length} {list.dishes.length === 1 ? 'dish' : 'dishes'}
                            </Text>
                        </HStack>
                    )}
                </VStack>

                <Flex align="center">
                    <Button
                        bg="#083951"
                        color="white"
                        size="md"
                        rightIcon={<FaChevronRight />}
                        _hover={{ bg: "#0a4a63" }}
                        borderRadius="lg"
                        onClick={handleViewIngredients}
                        px={6}
                    >
                        View Details
                    </Button>
                </Flex>
            </Flex>
        </Box>
    );
};

export default GroceryListCard;