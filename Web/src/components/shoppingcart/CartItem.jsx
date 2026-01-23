import { useState } from 'react';
import { Box, Flex, Heading, HStack, IconButton, Input, Text, Badge, VStack } from '@chakra-ui/react';
import { FaTrash, FaEdit, FaSave, FaTimes, FaUsers, FaCalendarAlt } from 'react-icons/fa';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import cartService from '../../services/cartService';

const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const CartItem = ({ item, dish, onRefresh }) => {
    const { t } = useTranslation('cart');
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
            
            enqueueSnackbar(t('addToCart.addSuccess'), { variant: 'success' });
            setIsEditing(false);
            onRefresh();
        } catch (error) {
            enqueueSnackbar(t('addToCart.addError'), { variant: 'error' });
        }
    };

    const handleDelete = async () => {
        try {
            await cartService.deleteCartItem(item.id);
            enqueueSnackbar(t('cartItem.removeSuccess'), { variant: 'success' });
            onRefresh();
        } catch (error) {
            enqueueSnackbar(t('cartItem.removeError'), { variant: 'error' });
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
                                        {t('addToCart.dayLabel')}
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
                                            {t(`days.${day}`)}
                                        </option>
                                    ))}
                                </select>
                            </VStack>
                            <VStack align="stretch" flex={1} gap={2}>
                                <HStack gap={2}>
                                    <FaUsers color="#083951" size={14} />
                                    <Text fontSize="xs" fontWeight="600" color="gray.600">
                                        {t('addToCart.peopleLabel')}
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
                                    {t(`days.${item.dayOfWeek}`)}
                                </Badge>
                            </HStack>
                            <HStack gap={2}>
                                <FaUsers color="#083951" size={14} />
                                <Text fontSize="sm" color="gray.700" fontWeight="500">
                                    {item.people} {item.people === 1 ? t('common.people') : t('common.people')}
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