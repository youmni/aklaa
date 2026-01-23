import { useEffect, useState } from 'react';
import { Box, Container, Heading, Text, VStack, Spinner, Flex, Grid, useTabs } from '@chakra-ui/react';
import { Tabs } from '@chakra-ui/react';
import { FaListUl } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import groceryListService from '../../../services/groceryListService';
import GroceryListCard from '../../../components/grocerylist/GroceryListCard';
import EmptyGroceryLists from '../../../components/grocerylist/EmptyGroceryLists';

const GroceryLists = () => {
    const { t } = useTranslation('grocerylist');
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
            const response = await groceryListService.getGroceryLists();
            setGroceryLists(response.data);
        } catch (error) {
            console.error('Error fetching grocery lists:', error);
            enqueueSnackbar(t('list.fetchError'), { variant: 'error' });
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
                    <Text fontSize="lg" color="gray.600">{t('list.loading')}</Text>
                </Flex>
            </Box>
        );
    }

    if (groceryLists.length === 0) {
        return <EmptyGroceryLists onGoToCart={() => navigate('/cart')} />;
    }

    return (
        <Box bg="white" minH="100vh">
            <Container maxW="100%" px={{ base: 4, md: 0 }}>
                <VStack align="stretch" gap={0}>
                    <Box px={{ base: 4, md: 8 }} py={8} bg="white" borderBottom="none">
                        <Flex align="center" gap={3} mb={6}>
                            <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="#083951">
                                {t('list.title')}
                            </Text>
                        </Flex>

                        <Tabs.RootProvider value={tabs} variant="plain">
                        <Box w="100%">
                            <Tabs.List
                                bg="gray.100"
                                borderRadius="lg"
                                p={1}
                                display="grid"
                                gridTemplateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }}
                                gap={2}
                                w="100%"
                            >
                                <Tabs.Trigger
                                    value="past"
                                    px={{ base: 3, md: 6 }}
                                    py={{ base: 2, md: 2.5 }}
                                    borderRadius="md"
                                    fontWeight="500"
                                    fontSize={{ base: "xs", md: "sm" }}
                                    color="gray.700"
                                    _selected={{
                                        bg: "white",
                                        color: "#083951",
                                        shadow: "sm"
                                    }}
                                    transition="all 0.2s"
                                    justifyContent="center"
                                >
                                    {t('list.pastTab')}
                                </Tabs.Trigger>

                                <Tabs.Trigger
                                    value="present"
                                    px={{ base: 3, md: 6 }}
                                    py={{ base: 2, md: 2.5 }}
                                    borderRadius="md"
                                    fontWeight="500"
                                    fontSize={{ base: "xs", md: "sm" }}
                                    color="gray.700"
                                    _selected={{
                                        bg: "white",
                                        color: "#083951",
                                        shadow: "sm"
                                    }}
                                    transition="all 0.2s"
                                    justifyContent="center"
                                >
                                    {t('list.presentTab')}
                                </Tabs.Trigger>

                                <Tabs.Trigger
                                    value="future"
                                    px={{ base: 3, md: 6 }}
                                    py={{ base: 2, md: 2.5 }}
                                    borderRadius="md"
                                    fontWeight="500"
                                    fontSize={{ base: "xs", md: "sm" }}
                                    color="gray.700"
                                    _selected={{
                                        bg: "white",
                                        color: "#083951",
                                        shadow: "sm"
                                    }}
                                    transition="all 0.2s"
                                    justifyContent="center"
                                >
                                    {t('list.futureTab')}
                                </Tabs.Trigger>
                            </Tabs.List>

                            <Box px={0} py={6}>
                                <Tabs.Content value="past">
                                    <Box bg="gray.50" borderRadius="md" p={3} mx={{ base: 4, md: 8 }} mb={4}>
                                        <Text fontSize="sm" color="gray.600">
                                            {t('list.pastWarning')}
                                        </Text>
                                    </Box>
                                    {past.length === 0 ? (
                                        <Box
                                            bg="white"
                                            borderRadius="xl"
                                            p={12}
                                            textAlign="center"
                                            boxShadow="sm"
                                            border="1px solid"
                                            borderColor="gray.200"
                                            mx={{ base: 4, md: 8 }}
                                        >
                                            <Text color="gray.500" fontSize="lg">
                                                {t('list.noPast')}
                                            </Text>
                                        </Box>
                                    ) : (
                                        <VStack align="stretch" gap={4} px={{ base: 4, md: 8 }}>
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
                                            mx={{ base: 4, md: 8 }}
                                        >
                                            <Text color="gray.500" fontSize="lg">
                                                {t('list.noPresent')}
                                            </Text>
                                            <Text color="gray.400" fontSize="sm" mt={2}>
                                                {t('list.noPresentHint')}
                                            </Text>
                                        </Box>
                                    ) : (
                                        <VStack align="stretch" gap={4} px={{ base: 4, md: 8 }}>
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
                                            mx={{ base: 4, md: 8 }}
                                        >
                                            <Text color="gray.500" fontSize="lg">
                                                {t('list.noFuture')}
                                            </Text>
                                        </Box>
                                    ) : (
                                        <VStack align="stretch" gap={4} px={{ base: 4, md: 8 }}>
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