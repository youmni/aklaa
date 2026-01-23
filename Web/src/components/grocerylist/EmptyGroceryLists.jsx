import { Button, Container, Flex, Heading, Text, VStack, Box } from '@chakra-ui/react';
import { FaListUl, FaShoppingCart } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const EmptyGroceryLists = ({ onGoToCart }) => {
    const { t } = useTranslation('grocerylist');
    
    return (
        <Box bg="gray.50" minH="100vh" py={12}>
            <Container maxW="100%" px={8}>
                <VStack align="stretch" gap={8}>
                    <Flex align="center" gap={3}>
                        <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="#083951">
                            {t('common.groceryList')}
                        </Text>
                    </Flex>

                    <Flex justify="center" align="center" minH="50vh">
                        <Box
                            bg="white"
                            borderRadius="xl"
                            p={12}
                            boxShadow="sm"
                            border="1px solid"
                            borderColor="gray.200"
                            textAlign="center"
                            maxW="600px"
                            w="100%"
                        >
                            <Flex justify="center" mb={6}>
                                <Box
                                    bg="gray.100"
                                    borderRadius="full"
                                    p={6}
                                >
                                    <FaListUl size={48} color="#083951" />
                                </Box>
                            </Flex>
                            <Heading size="md" mb={3} color="#083951">
                                {t('empty.title')}
                            </Heading>
                            <Text fontSize="md" color="gray.600" mb={8}>
                                {t('empty.description')}
                            </Text>
                            <Button
                                bg="#083951"
                                color="white"
                                size="lg"
                                onClick={onGoToCart}
                                _hover={{ bg: "#0a4a63" }}
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