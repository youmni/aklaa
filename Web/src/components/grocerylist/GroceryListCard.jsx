import { Box, Flex, Heading, Text, Badge, HStack, VStack, Button } from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react';
import { FaCalendarAlt, FaShoppingBasket, FaChevronRight } from 'react-icons/fa';
import { FiTrash2} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import api from '../../api/axiosConfig';
import ConfirmDialog from '../ui/ConfirmDialog';

const GroceryListCard = ({ list, status, onRefresh }) => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const handleDeleteClick = () => {
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await api.delete(`/grocerylists/${list.id}`);
            enqueueSnackbar('Grocery list deleted', { variant: 'success' });
            setIsConfirmOpen(false);
            if (onRefresh) onRefresh();
        } catch (err) {
            console.error('Error deleting grocery list:', err);
            enqueueSnackbar('Failed to delete grocery list', { variant: 'error' });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Box
            bg="white"
            borderRadius={{ base: 'lg', md: 'xl' }}
            p={{ base: 4, md: 6 }}
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.200"
            transition="all 0.2s"
            _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
        >
            <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="start" gap={4}>
                <VStack align="stretch" flex={1} gap={3}>
                    <Flex align="center" gap={3} flexWrap="wrap">
                        <Heading as="h3" fontSize={{ base: 'md', md: 'lg' }} color="#083951" fontWeight="600">
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

                <Flex
                    align="center"
                    gap={3}
                    mt={{ base: 4, md: 0 }}
                    ml={{ base: 0, md: 2 }}
                    flexShrink={0}
                    direction="row"
                    justify={{ base: 'space-between', md: 'flex-end' }}
                    w={{ base: '100%', md: 'auto' }}
                >
                    <Button
                        bg="#083951"
                        color="white"
                        size={{ base: 'sm', md: 'md' }}
                        rightIcon={<FaChevronRight />}
                        _hover={{ bg: "#0a4a63" }}
                        borderRadius="lg"
                        onClick={handleViewIngredients}
                        px={{ base: 4, md: 6 }}
                        w={{ base: '70%', md: 'auto' }}
                    >
                        View Details
                    </Button>
                    <IconButton
                        size={{ base: 'sm', md: 'sm' }}
                        colorPalette="red"
                        variant="ghost"
                        onClick={handleDeleteClick}
                        aria-label="Delete grocery list"
                        _hover={{ bg: "red.50" }}
                        w={{ base: '28%', md: 'auto' }}
                    >
                        <FiTrash2 size={16} />
                    </IconButton>
                    <ConfirmDialog
                        isOpen={isConfirmOpen}
                        onClose={() => setIsConfirmOpen(false)}
                        onConfirm={handleConfirmDelete}
                        title="Delete grocery list"
                        description="Are you sure you want to delete this grocery list? This action cannot be undone."
                        confirmLabel="Delete"
                        cancelLabel="Cancel"
                        confirmColorScheme="red"
                        isLoading={isDeleting}
                    />
                </Flex>
            </Flex>
        </Box>
    );
};

export default GroceryListCard;