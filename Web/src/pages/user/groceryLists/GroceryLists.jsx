import { useEffect, useState } from 'react';
import { Box, Container, Heading, Text, VStack, Spinner, Flex, Grid, useTabs } from '@chakra-ui/react';
import { Tabs } from '@chakra-ui/react';
import { FaListUl } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import api from '../../../api/axiosConfig';
import GroceryListCard from '../../../components/grocerylist/GroceryListCard';
import EmptyGroceryLists from '../../../components/grocerylist/EmptyGroceryLists';

const GroceryLists = () => {
    const [groceryLists, setGroceryLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const tabs = useTabs({ defaultValue: 'present' });

    useEffect(() => {
        fetchGroceryLists();
    }, []);

    const fetchGroceryLists = async () => {
        setLoading(true);
        try {
            const response = await api.get('/grocerylists', {});
            setGroceryLists(response.data);
        } catch (error) {
            console.error('Error fetching grocery lists:', error);
            enqueueSnackbar('Failed to load grocery lists', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const categorizeGroceryLists = () => {
        const now = new Date();
        const past = [];
        const present = [];
        const future = [];

        groceryLists.forEach(list => {
            const startDate = new Date(list.startOfWeek);
            const endDate = new Date(list.endOfWeek);

            if (endDate < now) {
                past.push(list);
            } else if (startDate <= now && endDate >= now) {
                present.push(list);
            } else {
                future.push(list);
            }
        });

        return { past, present, future };
    };

    const { past, present, future } = categorizeGroceryLists();

    if (loading) {
        return (
            <Box bg="gray.50" minH="100vh" py={12}>
                <Flex justify="center" align="center" minH="60vh" direction="column" gap={4}>
                    <Spinner size="xl" color="#083951" thickness="4px" />
                    <Text fontSize="lg" color="gray.600">Loading grocery lists...</Text>
                </Flex>
            </Box>
        );
    }

    if (groceryLists.length === 0) {
        return <EmptyGroceryLists onGoToCart={() => navigate('/cart')} />;
    }

    return (
        <Box bg="gray.50" minH="100vh">
            <Container maxW="100%" px={0}>
                <VStack align="stretch" gap={0}>
                    <Box px={8} py={8} bg="white" borderBottom="none">
                        <Flex align="center" gap={3} mb={6}>
                            <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="#083951">
                                Grocery Lists
                            </Text>
                        </Flex>

                        <Tabs.RootProvider value={tabs} variant="plain">
                        <Box w="100%">
                            <Tabs.List
                                bg="gray.100"
                                borderRadius="lg"
                                p={1}
                                display="grid"
                                gridTemplateColumns="1fr 1fr 1fr"
                                w="100%"
                            >
                                <Tabs.Trigger
                                    value="past"
                                    px={6}
                                    py={2.5}
                                    borderRadius="md"
                                    fontWeight="500"
                                    fontSize="sm"
                                    color="gray.700"
                                    _selected={{
                                        bg: "white",
                                        color: "#083951",
                                        shadow: "sm"
                                    }}
                                    transition="all 0.2s"
                                    justifyContent="center"
                                >
                                    Past
                                </Tabs.Trigger>

                                <Tabs.Trigger
                                    value="present"
                                    px={6}
                                    py={2.5}
                                    borderRadius="md"
                                    fontWeight="500"
                                    fontSize="sm"
                                    color="gray.700"
                                    _selected={{
                                        bg: "white",
                                        color: "#083951",
                                        shadow: "sm"
                                    }}
                                    transition="all 0.2s"
                                    justifyContent="center"
                                >
                                    Current
                                </Tabs.Trigger>

                                <Tabs.Trigger
                                    value="future"
                                    px={6}
                                    py={2.5}
                                    borderRadius="md"
                                    fontWeight="500"
                                    fontSize="sm"
                                    color="gray.700"
                                    _selected={{
                                        bg: "white",
                                        color: "#083951",
                                        shadow: "sm"
                                    }}
                                    transition="all 0.2s"
                                    justifyContent="center"
                                >
                                    Upcoming
                                </Tabs.Trigger>
                            </Tabs.List>

                            <Box px={0} py={6}>
                                <Tabs.Content value="past">
                                    {past.length === 0 ? (
                                        <Box
                                            bg="white"
                                            borderRadius="xl"
                                            p={12}
                                            textAlign="center"
                                            boxShadow="sm"
                                            border="1px solid"
                                            borderColor="gray.200"
                                            mx={8}
                                        >
                                            <Text color="gray.500" fontSize="lg">
                                                No past grocery lists
                                            </Text>
                                        </Box>
                                    ) : (
                                        <VStack align="stretch" gap={4} px={8}>
                                            {past.map(list => (
                                                <GroceryListCard
                                                    key={list.id}
                                                    list={list}
                                                    status="past"
                                                    onRefresh={fetchGroceryLists}
                                                />
                                            ))}
                                        </VStack>
                                    )}
                                </Tabs.Content>

                                <Tabs.Content value="present">
                                    {present.length === 0 ? (
                                        <Box
                                            bg="white"
                                            borderRadius="xl"
                                            p={12}
                                            textAlign="center"
                                            boxShadow="sm"
                                            border="1px solid"
                                            borderColor="gray.200"
                                            mx={8}
                                        >
                                            <Text color="gray.500" fontSize="lg">
                                                No current grocery lists
                                            </Text>
                                            <Text color="gray.400" fontSize="sm" mt={2}>
                                                Create one from your shopping cart
                                            </Text>
                                        </Box>
                                    ) : (
                                        <VStack align="stretch" gap={4} px={8}>
                                            {present.map(list => (
                                                <GroceryListCard
                                                    key={list.id}
                                                    list={list}
                                                    status="present"
                                                    onRefresh={fetchGroceryLists}
                                                />
                                            ))}
                                        </VStack>
                                    )}
                                </Tabs.Content>

                                <Tabs.Content value="future">
                                    {future.length === 0 ? (
                                        <Box
                                            bg="white"
                                            borderRadius="xl"
                                            p={12}
                                            textAlign="center"
                                            boxShadow="sm"
                                            border="1px solid"
                                            borderColor="gray.200"
                                            mx={8}
                                        >
                                            <Text color="gray.500" fontSize="lg">
                                                No upcoming grocery lists
                                            </Text>
                                        </Box>
                                    ) : (
                                        <VStack align="stretch" gap={4} px={8}>
                                            {future.map(list => (
                                                <GroceryListCard
                                                    key={list.id}
                                                    list={list}
                                                    status="future"
                                                    onRefresh={fetchGroceryLists}
                                                />
                                            ))}
                                        </VStack>
                                    )}
                                </Tabs.Content>
                            </Box>
                        </Box>
                        </Tabs.RootProvider>
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
};

export default GroceryLists;