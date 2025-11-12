import { VStack } from '@chakra-ui/react';
import CartItem from './CartItem';

const CartItemsList = ({ cartItems, dishes, onRefresh }) => {
    return (
        <VStack align="stretch" gap={4}>
            {cartItems.map((item) => (
                <CartItem
                    key={item.id}
                    item={item}
                    dish={dishes[item.dishId]}
                    onRefresh={onRefresh}
                />
            ))}
        </VStack>
    );
};

export default CartItemsList;