import { useEffect, useState } from 'react';
import { Container, Flex, Text, VStack, Spinner, Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import api from '../../api/axiosConfig';
import CartHeader from '../../components/shoppingcart/CartHeader';
import WeekPlanningCard from '../../components/shoppingcart/WeekPlanningCard';
import CartItemsList from '../../components/shoppingcart/CartItemsList';
import CartSummary from '../../components/shoppingcart/CartSummary';
import EmptyCart from '../../components/shoppingcart/EmptyCart';

const ShoppingCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [dishes, setDishes] = useState({});
    const [startOfWeek, setStartOfWeek] = useState('');
    const [endOfWeek, setEndOfWeek] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        fetchCartItems();
        initializeWeekDates();
    }, []);

    const initializeWeekDates = () => {
        const today = new Date();
        const monday = new Date(today);
        monday.setDate(today.getDate() - today.getDay() + 1);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        
        setStartOfWeek(monday.toISOString().split('T')[0]);
        setEndOfWeek(sunday.toISOString().split('T')[0]);
    };

    const fetchCartItems = async () => {
        setLoading(true);
        try {
            const response = await api.get('/cart');
            setCartItems(response.data);
            
            if (response.data.length > 0) {
                const dishIds = [...new Set(response.data.map(item => item.dishId))];
                
                const dishPromises = dishIds.map(id => 
                    api.get(`/dishes/${id}`)
                        .catch(error => {
                            console.error(`Failed to fetch dish with id ${id}:`, error);
                            return null;
                        })
                );
                
                const dishResponses = await Promise.all(dishPromises);
                
                const dishMap = {};
                dishResponses.forEach(res => {
                    if (res && res.data) {
                        dishMap[res.data.id] = res.data;
                    }
                });
                
                setDishes(dishMap);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            enqueueSnackbar('Failed to load cart items', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleClearCart = async () => {
        if (!window.confirm('Are you sure you want to clear your cart?')) return;
        
        try {
            await api.delete('/cart/clear');
            enqueueSnackbar('Cart cleared successfully', { variant: 'success' });
            setCartItems([]);
            setDishes({});
        } catch (error) {
            enqueueSnackbar('Failed to clear cart', { variant: 'error' });
        }
    };

    const handleSaveCart = async () => {
        if (!startOfWeek || !endOfWeek) {
            enqueueSnackbar('Please select start and end dates', { variant: 'error' });
            return;
        }

        if (cartItems.length === 0) {
            enqueueSnackbar('Your cart is empty', { variant: 'error' });
            return;
        }

        try {
            await api.post('/grocerylists/save', null, {
                params: {
                    startOfWeek: `${startOfWeek}T00:00:00`,
                    endOfWeek: `${endOfWeek}T23:59:59`
                }
            });
            
            enqueueSnackbar('Grocery list saved successfully', { variant: 'success' });
            setCartItems([]);
            setDishes({});
            navigate('/dishes');
        } catch (error) {
            enqueueSnackbar('Failed to save grocery list', { variant: 'error' });
        }
    };

    if (loading) {
        return (
            <Box bg="gray.50" minH="100vh" py={12}>
                <Flex justify="center" align="center" minH="60vh" direction="column" gap={4}>
                    <Spinner size="xl" color="#083951" thickness="4px" />
                    <Text fontSize="lg" color="gray.600">Loading your cart...</Text>
                </Flex>
            </Box>
        );
    }

    if (cartItems.length === 0) {
        return <EmptyCart onBrowseDishes={() => navigate('/dishes')} />;
    }

    return (
        <Box bg="gray.50" minH="100vh" py={8}>
            <Container maxW="100%" px={8}>
                <VStack align="stretch" gap={6}>
                    <CartHeader 
                        itemCount={cartItems.length}
                        onClearCart={handleClearCart}
                    />

                    <WeekPlanningCard
                        startOfWeek={startOfWeek}
                        endOfWeek={endOfWeek}
                        onStartChange={setStartOfWeek}
                        onEndChange={setEndOfWeek}
                    />

                    <CartItemsList
                        cartItems={cartItems}
                        dishes={dishes}
                        onRefresh={fetchCartItems}
                    />

                    <CartSummary
                        itemCount={cartItems.length}
                        onSave={handleSaveCart}
                    />
                </VStack>
            </Container>
        </Box>
    );
};

export default ShoppingCart;