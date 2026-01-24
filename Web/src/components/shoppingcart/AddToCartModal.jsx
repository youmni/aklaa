import { useState } from 'react';
import {
    Dialog,
    Portal,
    Button,
    VStack,
    Text,
    Box,
    CloseButton,
    HStack,
    NativeSelect,
    For,
    Input,
    Icon,
} from '@chakra-ui/react';
import { Field } from "../ui/field";
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { FiCalendar, FiUsers, FiShoppingCart } from 'react-icons/fi';
import cartService from '../../services/cartService';
import { useThemeColors } from '../../hooks/useThemeColors';

const AddToCartModal = ({ isOpen, onClose, dish }) => {
    const { t } = useTranslation('cart');
    const { enqueueSnackbar } = useSnackbar();
    const colors = useThemeColors();
    const [dayOfWeek, setDayOfWeek] = useState('');
    const [people, setPeople] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const daysOfWeek = [
        { value: 'MONDAY', label: t('days.MONDAY') },
        { value: 'TUESDAY', label: t('days.TUESDAY') },
        { value: 'WEDNESDAY', label: t('days.WEDNESDAY') },
        { value: 'THURSDAY', label: t('days.THURSDAY') },
        { value: 'FRIDAY', label: t('days.FRIDAY') },
        { value: 'SATURDAY', label: t('days.SATURDAY') },
        { value: 'SUNDAY', label: t('days.SUNDAY') }
    ];

    const handleSubmit = async () => {
        const newErrors = {};

        if (!dayOfWeek) {
            newErrors.dayOfWeek = t('addToCart.selectDayError');
        }

        if (people < 1 || people > 100) {
            newErrors.people = t('addToCart.peopleRangeError');
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setIsLoading(true);
        try {
            await cartService.addToCart({
                dishId: dish.id,
                dayOfWeek: dayOfWeek,
                people: people
            });
            
            enqueueSnackbar(t('addToCart.addSuccess'), { variant: 'success' });
            handleClose();
        } catch (error) {
            setErrors({ submit: t('addToCart.addError') });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setDayOfWeek('');
        setPeople(1);
        setErrors({});
        onClose();
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && handleClose()}>
            <Portal>
                <Dialog.Backdrop 
                    bg={colors.modal.overlay}
                    backdropFilter="blur(8px)"
                />
                <Dialog.Positioner>
                    <Dialog.Content 
                        borderRadius="2xl" 
                        mx={4}
                        maxW="500px"
                        shadow="2xl"
                        overflow="hidden"
                        bg={colors.modal.bg}
                    >
                        <Box
                            bg={colors.button.primary.bg}
                            px={6}
                            py={5}
                        >
                            <Dialog.Title 
                                color="white" 
                                fontSize="2xl" 
                                fontWeight="bold"
                                display="flex"
                                alignItems="center"
                                gap={3}
                            >
                                <Icon fontSize="2xl">
                                    <FiShoppingCart />
                                </Icon>
                                {t('addToCart.title')}
                            </Dialog.Title>
                        </Box>

                        <Dialog.Body px={6} py={6}>
                            <VStack gap={6} align="stretch">
                                <Box
                                    p={5}
                                    bg={colors.bg.tertiary}
                                    borderRadius="xl"
                                    borderWidth="1px"
                                    borderColor={colors.border.default}
                                    position="relative"
                                    overflow="hidden"
                                >
                                    <Text 
                                        fontSize="xl" 
                                        fontWeight="bold" 
                                        color={colors.text.brand}
                                        mb={1}
                                    >
                                        {dish?.name}
                                    </Text>
                                    <Text 
                                        fontSize="sm" 
                                        color={colors.text.secondary}
                                        fontWeight="500"
                                    >
                                        {dish?.type?.charAt(0) + dish?.type?.slice(1).toLowerCase().replace('_', ' ')}
                                    </Text>
                                </Box>

                                <Field 
                                    label={
                                        <HStack gap={2}>
                                            <Icon color={colors.text.brand}>
                                                <FiCalendar />
                                            </Icon>
                                            <Text fontWeight="600" color={colors.text.brand}>
                                                {t('addToCart.dayLabel')}
                                            </Text>
                                        </HStack>
                                    }
                                    required
                                    invalid={!!errors.dayOfWeek}
                                    errorText={errors.dayOfWeek}
                                >
                                    <NativeSelect.Root 
                                        size="lg"
                                        variant="outline"
                                    >
                                        <NativeSelect.Field
                                            placeholder={t('addToCart.selectDay')}
                                            value={dayOfWeek}
                                            onChange={(e) => {
                                                setDayOfWeek(e.target.value);
                                                setErrors({ ...errors, dayOfWeek: '' });
                                            }}
                                            borderColor={errors.dayOfWeek ? "red.500" : colors.border.default}
                                            _hover={{ borderColor: errors.dayOfWeek ? "red.600" : colors.text.brand }}
                                            _focus={{ 
                                                borderColor: errors.dayOfWeek ? "red.500" : colors.text.brand,
                                                boxShadow: errors.dayOfWeek ? '0 0 0 1px red.500' : `0 0 0 1px ${colors.text.brand}`
                                            }}
                                            borderRadius="lg"
                                            fontWeight="500"
                                            pl={4}
                                        >
                                            <For each={daysOfWeek}>
                                                {(day) => (
                                                    <option key={day.value} value={day.value}>
                                                        {day.label}
                                                    </option>
                                                )}
                                            </For>
                                        </NativeSelect.Field>
                                        <NativeSelect.Indicator color={colors.text.brand} />
                                    </NativeSelect.Root>
                                </Field>

                                <Field 
                                    label={
                                        <HStack gap={2}>
                                            <Icon color={colors.text.brand}>
                                                <FiUsers />
                                            </Icon>
                                            <Text fontWeight="600" color={colors.text.brand}>
                                                {t('addToCart.peopleLabel')}
                                            </Text>
                                        </HStack>
                                    }
                                    required
                                    invalid={!!errors.people}
                                    errorText={errors.people}
                                >
                                    <Input
                                        type="number"
                                        value={people}
                                        onChange={(e) => {
                                            setPeople(parseInt(e.target.value) || 1);
                                            setErrors({ ...errors, people: '' });
                                        }}
                                        min={1}
                                        max={100}
                                        size="lg"
                                        borderColor={errors.people ? "red.500" : colors.border.default}
                                        _hover={{ borderColor: errors.people ? "red.600" : colors.text.brand }}
                                        _focus={{ 
                                            borderColor: errors.people ? "red.500" : colors.text.brand,
                                            boxShadow: errors.people ? '0 0 0 1px red.500' : `0 0 0 1px ${colors.text.brand}`
                                        }}
                                        borderRadius="lg"
                                        fontWeight="500"
                                        pl={4}
                                    />
                                </Field>

                                {errors.submit && (
                                    <Box
                                        p={3}
                                        bg="red.50"
                                        borderRadius="lg"
                                        borderWidth="1px"
                                        borderColor="red.200"
                                    >
                                        <Text color="red.600" fontSize="sm" fontWeight="500">
                                            {errors.submit}
                                        </Text>
                                    </Box>
                                )}
                            </VStack>
                        </Dialog.Body>

                        <Dialog.Footer 
                            px={6} 
                            py={4}
                            bg={colors.bg.tertiary}
                            borderTopWidth="1px"
                            borderColor={colors.border.default}
                        >
                            <HStack gap={3} w="full" justify="flex-end">
                                <Button
                                    variant="outline"
                                    onClick={handleClose}
                                    borderColor={colors.border.default}
                                    color={colors.text.secondary}
                                    fontWeight="600"
                                    size="lg"
                                    px={6}
                                    _hover={{ 
                                        bg: colors.bg.hover,
                                        borderColor: colors.border.hover
                                    }}
                                    borderRadius="lg"
                                >
                                    {t('addToCart.cancelButton')}
                                </Button>
                                <Button
                                    bg={colors.button.primary.bg}
                                    color="white"
                                    onClick={handleSubmit}
                                    loading={isLoading}
                                    fontWeight="600"
                                    size="lg"
                                    px={6}
                                    _hover={{ 
                                        bg: colors.button.primary.hover,
                                        transform: 'translateY(-2px)',
                                        shadow: 'lg'
                                    }}
                                    _active={{
                                        transform: 'translateY(0)',
                                    }}
                                    transition="all 0.2s"
                                    loadingText={t('common.loading')}
                                    borderRadius="lg"
                                >
                                    <Icon mr={2}>
                                        <FiShoppingCart />
                                    </Icon>
                                    {t('addToCart.addButton')}
                                </Button>
                            </HStack>
                        </Dialog.Footer>

                        <Dialog.CloseTrigger asChild position="absolute" top={5} right={5}>
                            <CloseButton 
                                size="md" 
                                color="white"
                                _hover={{ 
                                    bg: 'whiteAlpha.300',
                                    transform: 'rotate(90deg)'
                                }}
                                transition="all 0.2s"
                            />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default AddToCartModal;