import { Button, Flex, Text, Box } from '@chakra-ui/react';
import { FaSave } from 'react-icons/fa';

const CartSummary = ({ itemCount, onSave }) => {
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
                    Total: {itemCount} {itemCount === 1 ? 'item' : 'items'}
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
                    Save Grocery List
                </Button>
            </Flex>
        </Box>
    );
};

export default CartSummary;