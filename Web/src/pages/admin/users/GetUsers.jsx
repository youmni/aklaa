import { useState, useEffect } from 'react';
import { 
    Box, 
    Heading, 
    Input,
    Text,
    HStack,
    VStack,
    Table,
    IconButton,
    ButtonGroup,
    NativeSelectRoot,
    NativeSelectField,
    Spinner,
    Badge,
    Pagination,
    Dialog,
    DataList,
    CloseButton,
    Portal
} from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { useSnackbar } from 'notistack';
import api from '../../../api/axiosConfig';

const NAVY = '#083951';

const USER_TYPES = [
    { value: '', label: 'All Types' },
    { value: 'USER', label: 'User' },
    { value: 'ADMIN', label: 'Admin' }
];

const GetUsers = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const pageSize = 10;

    useEffect(() => {
        fetchUsers();
    }, [page, searchTerm, selectedType]);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const params = {
                page: page - 1,
                size: pageSize
            };

            if (searchTerm) {
                params.search = searchTerm;
            }

            if (selectedType) {
                params.type = selectedType;
            }

            const response = await api.get('/users', { params });
            
            setUsers(response.data.users || []);
            setTotalPages(response.data.totalPages || 0);
            setTotalElements(response.data.totalElements || 0);
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || 'Failed to fetch users', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const handleTypeChange = (e) => {
        setSelectedType(e.target.value);
        setPage(1);
    };

    const handlePageChange = (details) => {
        setPage(details.page);
    };

    const handleRowClick = (user) => {
        setSelectedUser(user);
        setIsDialogOpen(true);
    };

    const getUserTypeBadge = (userType) => {
        const colorPalette = userType === 'ADMIN' ? 'purple' : 'blue';
        return (
            <Badge colorPalette={colorPalette} size="sm">
                {userType}
            </Badge>
        );
    };

    return (
        <Box p={8} bg="gray.50" minH="calc(100vh - 73px)">
            <VStack align="stretch" gap={6} maxW="1400px" mx="auto">
                <Box>
                    <Heading fontSize="3xl" fontWeight="bold" color={NAVY} mb={2}>
                        Users Management
                    </Heading>
                    <Text color="gray.600" fontSize="md">
                        Manage and view all registered users
                    </Text>
                </Box>

                <HStack gap={4}>
                    <Box flex={1}>
                        <Input
                            placeholder=" Search by name or email..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            size="lg"
                            bg="white"
                            borderColor="gray.300"
                            borderWidth="1px"
                            _hover={{ borderColor: NAVY }}
                            _focus={{ borderColor: NAVY, boxShadow: `0 0 0 1px ${NAVY}` }}
                            borderRadius="lg"
                        />
                    </Box>
                    <Box w="200px">
                        <NativeSelectRoot size="lg">
                            <NativeSelectField
                                value={selectedType}
                                onChange={handleTypeChange}
                                bg="white"
                                borderColor="gray.300"
                                borderWidth="1px"
                                _hover={{ borderColor: NAVY }}
                                borderRadius="lg"
                            >
                                <option value=""> All Types</option>
                                <option value="USER"> User</option>
                                <option value="ADMIN"> Admin</option>
                            </NativeSelectField>
                        </NativeSelectRoot>
                    </Box>
                </HStack>

                {isLoading ? (
                    <Box display="flex" justifyContent="center" py={20}>
                        <Spinner size="xl" thickness="4px" color={NAVY} />
                    </Box>
                ) : users.length === 0 ? (
                    <Box textAlign="center" py={20} bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200" boxShadow="sm">
                        <Text fontSize="xl" color="gray.500" fontWeight="medium">
                            No users found
                        </Text>
                        <Text color="gray.400" mt={2}>
                            {searchTerm || selectedType 
                                ? 'Try adjusting your search filters'
                                : 'There are no users registered yet'}
                        </Text>
                    </Box>
                ) : (
                    <>
                        <Box bg="white" borderRadius="xl" overflow="hidden" border="1px solid" borderColor="gray.200" boxShadow="md">
                            <Box p={6} borderBottom="1px solid" borderColor="gray.200" bg="gray.50">
                                <Text fontSize="sm" color="gray.600" fontWeight="medium">
                                    Showing {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, totalElements)} of {totalElements} users
                                </Text>
                            </Box>

                            <Table.Root size="lg" variant="plain">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeader 
                                            fontWeight="bold" 
                                            color={NAVY} 
                                            fontSize="sm"
                                            textTransform="uppercase"
                                            letterSpacing="wide"
                                            py={4}
                                            px={6}
                                        >
                                            First Name
                                        </Table.ColumnHeader>
                                        <Table.ColumnHeader 
                                            fontWeight="bold" 
                                            color={NAVY}
                                            fontSize="sm"
                                            textTransform="uppercase"
                                            letterSpacing="wide"
                                            py={4}
                                            px={6}
                                        >
                                            Last Name
                                        </Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {users.map((user, index) => (
                                        <Table.Row 
                                            key={user.id} 
                                            cursor="pointer"
                                            _hover={{ bg: 'blue.50' }}
                                            transition="all 0.2s"
                                            onClick={() => handleRowClick(user)}
                                            borderBottom={index !== users.length - 1 ? "1px solid" : "none"}
                                            borderColor="gray.100"
                                        >
                                            <Table.Cell 
                                                fontWeight="medium" 
                                                fontSize="md"
                                                py={4}
                                                px={6}
                                            >
                                                {user.firstName}
                                            </Table.Cell>
                                            <Table.Cell 
                                                fontWeight="medium"
                                                fontSize="md"
                                                py={4}
                                                px={6}
                                            >
                                                {user.lastName}
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Box>

                        {totalPages > 1 && (
                            <Box display="flex" justifyContent="center" mt={6}>
                                <Pagination.Root 
                                    count={totalElements} 
                                    pageSize={pageSize} 
                                    page={page}
                                    onPageChange={handlePageChange}
                                >
                                    <ButtonGroup variant="ghost" size="sm" wrap="wrap">
                                        <Pagination.PrevTrigger asChild>
                                            <IconButton
                                                _hover={{ bg: 'gray.100' }}
                                            >
                                                <LuChevronLeft />
                                            </IconButton>
                                        </Pagination.PrevTrigger>

                                        <Pagination.Items
                                            render={(pageItem) => (
                                                <IconButton 
                                                    variant={{ base: "ghost", _selected: "solid" }}
                                                    colorScheme={pageItem.type === 'page' && pageItem.value === page ? "blue" : "gray"}
                                                    _hover={{ bg: pageItem.type === 'page' && pageItem.value === page ? NAVY : 'gray.100' }}
                                                >
                                                    {pageItem.value}
                                                </IconButton>
                                            )}
                                        />

                                        <Pagination.NextTrigger asChild>
                                            <IconButton
                                                _hover={{ bg: 'gray.100' }}
                                            >
                                                <LuChevronRight />
                                            </IconButton>
                                        </Pagination.NextTrigger>
                                    </ButtonGroup>
                                </Pagination.Root>
                            </Box>
                        )}
                    </>
                )}
            </VStack>

            {/* User Details Dialog */}
            <Dialog.Root open={isDialogOpen} onOpenChange={(e) => setIsDialogOpen(e.open)} size="lg">
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content borderRadius="xl" maxW="600px">
                            <Dialog.Header pb={2} pt={6} px={6}>
                                <Dialog.Title fontSize="2xl" fontWeight="bold" color={NAVY}>
                                    User Details
                                </Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body px={6} py={6}>
                                {selectedUser && (
                                    <VStack align="stretch" gap={5}>
                                        <Box 
                                            p={4} 
                                            bg="gray.50" 
                                            borderRadius="lg"
                                            borderLeft="4px solid"
                                            borderColor={NAVY}
                                        >
                                            <Text fontSize="xs" color="gray.600" fontWeight="medium" mb={1} textTransform="uppercase" letterSpacing="wide">
                                                User ID
                                            </Text>
                                            <Text fontSize="lg" fontWeight="bold" color={NAVY}>
                                                #{selectedUser.id}
                                            </Text>
                                        </Box>

                                        <HStack gap={4}>
                                            <Box 
                                                flex={1}
                                                p={4} 
                                                bg="gray.50" 
                                                borderRadius="lg"
                                            >
                                                <Text fontSize="xs" color="gray.600" fontWeight="medium" mb={1} textTransform="uppercase" letterSpacing="wide">
                                                    First Name
                                                </Text>
                                                <Text fontSize="md" fontWeight="semibold" color="gray.800">
                                                    {selectedUser.firstName}
                                                </Text>
                                            </Box>

                                            <Box 
                                                flex={1}
                                                p={4} 
                                                bg="gray.50" 
                                                borderRadius="lg"
                                            >
                                                <Text fontSize="xs" color="gray.600" fontWeight="medium" mb={1} textTransform="uppercase" letterSpacing="wide">
                                                    Last Name
                                                </Text>
                                                <Text fontSize="md" fontWeight="semibold" color="gray.800">
                                                    {selectedUser.lastName}
                                                </Text>
                                            </Box>
                                        </HStack>

                                        <Box 
                                            p={4} 
                                            bg="gray.50" 
                                            borderRadius="lg"
                                        >
                                            <Text fontSize="xs" color="gray.600" fontWeight="medium" mb={1} textTransform="uppercase" letterSpacing="wide">
                                                Email Address
                                            </Text>
                                            <Text fontSize="md" fontWeight="medium" color="gray.800">
                                                {selectedUser.email}
                                            </Text>
                                        </Box>

                                        <Box 
                                            p={4} 
                                            bg="gray.50" 
                                            borderRadius="lg"
                                        >
                                            <Text fontSize="xs" color="gray.600" fontWeight="medium" mb={2} textTransform="uppercase" letterSpacing="wide">
                                                Account Type
                                            </Text>
                                            {getUserTypeBadge(selectedUser.userType)}
                                        </Box>
                                    </VStack>
                                )}
                            </Dialog.Body>
                            <Dialog.CloseTrigger asChild top={6} right={6}>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </Box>
    );
};

export default GetUsers;