import { Button, Flex, Text, Box } from '@chakra-ui/react';
import { FaSave } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useThemeColors';

const CartSummary = ({ itemCount, onSave }) => {
    const { t } = useTranslation('cart');
    const colors = useThemeColors();
    return (
        <Box
            bg={colors.card.bg}
            borderRadius="xl"
            p={6}
            boxShadow={colors.card.shadow}
            border="1px solid"
            borderColor={colors.border.default}
            position="sticky"
            bottom={4}
        >
            <Flex justify="space-between" align="center" gap={4} flexWrap="wrap">
                <Text fontSize="lg" fontWeight="600" color={colors.text.brand}>
                    {t('summary.title')}: {itemCount} {itemCount === 1 ? t('common.dish') : t('common.dish') + 's'}
                </Text>
                <Button
                    bg={colors.button.primary.bg}
                    color="white"
                    size="lg"
                    onClick={onSave}
                    leftIcon={<FaSave />}
                    _hover={{ bg: colors.button.primary.hover }}
                    borderRadius="xl"
                    px={8}
                >
                    {t('header.saveButton')}
                </Button>
            </Flex>
        </Box>
    );
};

export default CartSummary;