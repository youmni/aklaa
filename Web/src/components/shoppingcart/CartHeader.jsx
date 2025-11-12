import { Button, Flex, Heading, Text, HStack } from '@chakra-ui/react';
import { FaShoppingCart, FaTrash, FaExclamationTriangle } from 'react-icons/fa';

const CartHeader = ({ itemCount, onClearCart }) => {
    return (
        <Flex justify="space-between" align="center" mb={2} flexWrap="wrap" gap={4}>
            <Flex align="center" gap={3}>
                    <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="#083951">
                        Shopping Cart
                    </Text>
            </Flex>
            {itemCount > 0 && (
                <Button
                    bg="red.500"
                    color="white"
                    onClick={onClearCart}
                    leftIcon={<FaTrash />}
                    size="md"
                    _hover={{ bg: "red.600" }}
                    borderRadius="lg"
                    px={6}
                >
                    <HStack gap={2}>
                        <Text>Clear Cart</Text>
                        <Text fontSize="xs" opacity={0.9}>({itemCount} {itemCount === 1 ? 'item' : 'items'})</Text>
                    </HStack>
                </Button>
            )}
        </Flex>
    );
};

export default CartHeader;