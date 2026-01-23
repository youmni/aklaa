import { Button, Flex, Text, Box } from '@chakra-ui/react';
import { FaSave } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const CartSummary = ({ itemCount, onSave }) => {
    const { t } = useTranslation('cart');
    return (
        <Box
            bg="white"
            borderRadius="xl"
            p={6}
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.200"
            position="sticky"
            bottom={4}
        >
            <Flex justify="space-between" align="center" gap={4} flexWrap="wrap">
                <Text fontSize="lg" fontWeight="600" color="#083951">
                    {t('common.total')}: {itemCount} {itemCount === 1 ? t('common.dish') : t('common.dish') + 's'}
                </Text>
                <Button
                    bg="#083951"
                    color="white"
                    size="lg"
                    onClick={onSave}
                    leftIcon={<FaSave />}
                    _hover={{ bg: "#0a4a63" }}
                    borderRadius="xl"
                    px={8}
                >
                    {t('header.saveGroceryList')}
                </Button>
            </Flex>
        </Box>
    );
};

export default CartSummary;