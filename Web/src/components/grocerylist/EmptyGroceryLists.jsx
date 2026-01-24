import { Button, Container, Flex, Heading, Text, VStack, Box } from '@chakra-ui/react';
import { FaListUl, FaShoppingCart } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useThemeColors';

const EmptyGroceryLists = ({ onGoToCart }) => {
    const { t } = useTranslation('grocerylist');
    const colors = useThemeColors();
    
    return (
        <Box bg={colors.bg.page} minH="100vh" py={12}>
            <Container maxW="100%" px={8}>
                <VStack align="stretch" gap={8}>
                    <Flex align="center" gap={3}>
                        <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color={colors.text.brand}>
                            {t('common.groceryList')}
                        </Text>
                    </Flex>

                    <Flex justify="center" align="center" minH="50vh">
                        <Box
                            bg={colors.card.bg}
                            borderRadius="xl"
                            p={12}
                            boxShadow={colors.card.shadow}
                            border="1px solid"
                            borderColor={colors.border.default}
                            textAlign="center"
                            maxW="600px"
                            w="100%"
                        >
                            <Flex justify="center" mb={6}>
                                <Box
                                    bg={colors.bg.tertiary}
                                    borderRadius="full"
                                    p={6}
                                >
                                    <FaListUl size={48} color={colors.text.brand} />
                                </Box>
                            </Flex>
                            <Heading size="md" mb={3} color={colors.text.brand}>
                                {t('empty.title')}
                            </Heading>
                            <Text fontSize="md" color={colors.text.secondary} mb={8}>
                                {t('empty.description')}
                            </Text>
                            <Button
                                bg={colors.button.primary.bg}
                                color="white"
                                size="lg"
                                onClick={onGoToCart}
                                _hover={{ bg: colors.button.primary.hover }}
                                leftIcon={<FaShoppingCart />}
                                borderRadius="xl"
                                px={8}
                            >
                                {t('empty.goToCartButton')}
                            </Button>
                        </Box>
                    </Flex>
                </VStack>
            </Container>
        </Box>
    );
};

export default EmptyGroceryLists;