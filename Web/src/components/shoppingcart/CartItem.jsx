import { useState } from 'react';
import { Box, Flex, Heading, HStack, IconButton, Input, Text, Badge, VStack } from '@chakra-ui/react';
import { FaTrash, FaEdit, FaSave, FaTimes, FaUsers, FaCalendarAlt } from 'react-icons/fa';
import { useSnackbar } from 'notistack';
import cartService from '../../services/cartService';

const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const CartItem = ({ item, dish, onRefresh }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        people: item.people,
        dayOfWeek: item.dayOfWeek
    });
    const { enqueueSnackbar } = useSnackbar();

    const getDayBadgeColor = (day) => {
        const colors = {
            MONDAY: 'blue',
            TUESDAY: 'green',
            WEDNESDAY: 'purple',
            THURSDAY: 'orange',
            FRIDAY: 'red',
            SATURDAY: 'teal',
            SUNDAY: 'pink'
        };
        return colors[day] || 'gray';
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditForm({
            people: item.people,
            dayOfWeek: item.dayOfWeek
        });
    };

    const handleSave = async () => {
        try {
            await cartService.updateCartItem(item.id, {
                dishId: item.dishId,
                people: editForm.people,
                dayOfWeek: editForm.dayOfWeek
            });
            
            enqueueSnackbar('Cart item updated successfully', { variant: 'success' });
            setIsEditing(false);
            onRefresh();
        } catch (error) {
            enqueueSnackbar('Failed to update cart item', { variant: 'error' });
        }
    };

    const handleDelete = async () => {
        try {
            await cartService.deleteCartItem(item.id);
            enqueueSnackbar('Item removed from cart', { variant: 'success' });
            onRefresh();
        } catch (error) {
            enqueueSnackbar('Failed to remove item', { variant: 'error' });
        }
    };

    if (!dish) {
        return null;
    }

    return (
        <Box
            bg="white"
            borderRadius="xl"
            p={5}
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.200"
            transition="all 0.2s"
            _hover={{ boxShadow: 'md' }}
        >
            <Flex justify="space-between" align="start" gap={4}>
                <VStack align="stretch" flex={1} gap={3}>
                    <Heading size="md" color="#083951" fontWeight="600">
                        {dish.name}
                    </Heading>
                    
                    {dish.type && (
                        <Badge
                            colorScheme="gray"
                            alignSelf="start"
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontSize="xs"
                            textTransform="capitalize"
                        >
                            {dish.type.toLowerCase()}
                        </Badge>
                    )}

                    {isEditing ? (
                        <HStack gap={4} mt={2}>
                            <VStack align="stretch" flex={1} gap={2}>
                                <HStack gap={2}>
                                    <FaCalendarAlt color="#083951" size={14} />
                                    <Text fontSize="xs" fontWeight="600" color="gray.600">
                                        Day
                                    </Text>
                                </HStack>
                                <select
                                    value={editForm.dayOfWeek}
                                    onChange={(e) => setEditForm({ ...editForm, dayOfWeek: e.target.value })}
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #E2E8F0',
                                        fontSize: '0.875rem',
                                        cursor: 'pointer',
                                        backgroundColor: 'white'
                                    }}
                                >
                                    {daysOfWeek.map(day => (
                                        <option key={day} value={day}>
                                            {day.charAt(0) + day.slice(1).toLowerCase()}
                                        </option>
                                    ))}
                                </select>
                            </VStack>
                            <VStack align="stretch" flex={1} gap={2}>
                                <HStack gap={2}>
                                    <FaUsers color="#083951" size={14} />
                                    <Text fontSize="xs" fontWeight="600" color="gray.600">
                                        People
                                    </Text>
                                </HStack>
                                <Input
                                    type="number"
                                    min="1"
                                    value={editForm.people}
                                    onChange={(e) => setEditForm({ ...editForm, people: parseInt(e.target.value) || 1 })}
                                    focusBorderColor="#083951"
                                    borderRadius="lg"
                                    size="sm"
                                />
                            </VStack>
                        </HStack>
                    ) : (
                        <HStack gap={4} flexWrap="wrap">
                            <HStack gap={2}>
                                <FaCalendarAlt color="#083951" size={14} />
                                <Badge
                                    colorScheme={getDayBadgeColor(item.dayOfWeek)}
                                    px={3}
                                    py={1}
                                    borderRadius="full"
                                    fontSize="xs"
                                >
                                    {item.dayOfWeek.charAt(0) + item.dayOfWeek.slice(1).toLowerCase()}
                                </Badge>
                            </HStack>
                            <HStack gap={2}>
                                <FaUsers color="#083951" size={14} />
                                <Text fontSize="sm" color="gray.700" fontWeight="500">
                                    {item.people} {item.people === 1 ? 'person' : 'people'}
                                </Text>
                            </HStack>
                        </HStack>
                    )}
                </VStack>

                <HStack gap={2}>
                    {isEditing ? (
                        <>
                            <IconButton
                                colorScheme="green"
                                onClick={handleSave}
                                aria-label="Save changes"
                                size="sm"
                                borderRadius="lg"
                            >
                                <FaSave size={14} />
                            </IconButton>
                            <IconButton
                                variant="outline"
                                onClick={() => setIsEditing(false)}
                                aria-label="Cancel editing"
                                size="sm"
                                borderRadius="lg"
                            >
                                <FaTimes size={14} />
                            </IconButton>
                        </>
                    ) : (
                        <>
                            <IconButton
                                bg="#083951"
                                color="white"
                                onClick={handleEdit}
                                aria-label="Edit item"
                                _hover={{ bg: "#0a4a63" }}
                                size="sm"
                                borderRadius="lg"
                            >
                                <FaEdit size={14} />
                            </IconButton>
                            <IconButton
                                colorScheme="red"
                                variant="outline"
                                onClick={handleDelete}
                                aria-label="Delete item"
                                size="sm"
                                borderRadius="lg"
                            >
                                <FaTrash size={14} />
                            </IconButton>
                        </>
                    )}
                </HStack>
            </Flex>
        </Box>
    );
};

export default CartItem;