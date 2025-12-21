import { useState, useEffect } from 'react';
import {
    Box, Heading, Input, Stack, Text, HStack, VStack, Table, IconButton, Button, ButtonGroup, NativeSelectRoot, NativeSelectField, Spinner, Badge, Dialog, DataList, CloseButton, Portal
} from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import { useSnackbar } from 'notistack';
import api from '../../../api/axiosConfig';
import UserDetailsModal from '../../../components/users/UserDetailsModal';
import Pagination from '../../../components/ui/Pagination';

const GetUsers = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdatingRole, setIsUpdatingRole] = useState(false);

    const pageSize = 10;

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(0);
    };

    const handleTypeChange = (e) => {
        const value = e.target.value;
        setSelectedType(value === '' ? '' : value);
        setPage(0);
    };

    useEffect(() => {
        fetchUsers();
    }, [page, searchTerm, selectedType]);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const params = { page: page, size: pageSize };
            if (searchTerm) params.search = searchTerm;
            if (selectedType) params.type = selectedType;

            const response = await api.get('/users', { params });
            setUsers(response.data.users || []);
            console.log(response.data);
            setTotalPages(response.data.totalPages || 0);
            setTotalElements(response.data.totalElements || 0);
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || 'Failed to fetch users', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRowClick = (user) => {
        setSelectedUser(user);
        setIsDialogOpen(true);
    };

    const handleRoleChange = async (e) => {
        const newRole = e.target.value;
        if (!selectedUser || !newRole) return;

        try {
            setIsUpdatingRole(true);
            await api.put(`/users/${selectedUser.id}`, null, { params: { type: newRole } });

            setSelectedUser({ ...selectedUser, userType: newRole });
            setUsers(users.map(user => user.id === selectedUser.id ? { ...user, userType: newRole } : user));
            enqueueSnackbar('User role updated successfully', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || 'Failed to update user role', { variant: 'error' });
        } finally {
            setIsUpdatingRole(false);
        }
    };

    const handleEnable = async (id) => {
        try {
            await api.put(`/users/enable/${id}`);

            setUsers(users.map(user => user.id === id ? { ...user, enabled: true } : user));
            if (selectedUser?.id === id) setSelectedUser({ ...selectedUser, enabled: true });

            enqueueSnackbar('User enabled successfully', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || 'Failed to enable user', { variant: 'error' });
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/users/${id}`);

            setUsers((prev) => prev.filter((user) => user.id !== id));

            if (selectedUser?.id === id) setSelectedUser(null);

            enqueueSnackbar('Deleted successfully', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || 'Failed to delete user', { variant: 'error' });
        }
    };

    return (
        <Box p={8} bg="white" minH="calc(100vh - 73px)">
            <VStack align="stretch" gap={6} maxW="1400px" mx="auto">
                <Box>
                    <Heading fontSize="3xl" fontWeight="bold" color="#083951" mb={2}>
                        Users Management
                    </Heading>
                    <Text color="gray.600" fontSize="md">
                        Manage and view all registered users
                    </Text>
                </Box>

                <Stack direction={{ base: "column", md: "row" }} gap={4} align="center">
                    <Box position="relative" flex={2}>
                        <Box
                            position="absolute"
                            left="3"
                            top="50%"
                            transform="translateY(-50%)"
                            zIndex={1}
                            pointerEvents="none"
                        >
                            <FiSearch color="#718096" size={18} />
                        </Box>
                        <Input
                            placeholder="Search by first name, last name or email..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            focusBorderColor="#083951"
                            pl="2.5rem"
                            size={{ base: "md", md: "lg" }}
                        />
                    </Box>

                    <Box flex={1}>
                        <select
                            value={selectedType}
                            onChange={handleTypeChange}
                            style={{
                                width: '100%',
                                padding: window.innerWidth < 768 ? '0.5rem 0.75rem' : '0.75rem 1rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #E2E8F0',
                                fontSize: '1rem',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                                height: window.innerWidth < 768 ? '2.5rem' : '3rem'
                            }}
                        >
                            <option value="">All types</option>
                            <option value="ADMIN">Admin</option>
                            <option value="BLACKLISTED">Blacklisted</option>
                            <option value="USER">User</option>
                        </select>
                    </Box>
                </Stack>

                {isLoading ? (
                    <Box display="flex" justifyContent="center" py={20}>
                        <Spinner size="xl" thickness="4px" color="#083951" />
                    </Box>
                ) : users.length === 0 ? (
                    <Box textAlign="center" py={20} bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200" boxShadow="sm">
                        <Text fontSize="xl" color="gray.500" fontWeight="medium">No users found</Text>
                        <Text color="gray.400" mt={2}>
                            {searchTerm || selectedType ? 'Try adjusting your search filters' : 'There are no users registered yet'}
                        </Text>
                    </Box>
                ) : (
                    <Box bg="white" borderRadius="xl" overflow="hidden" border="1px solid" borderColor="gray.200" boxShadow="md">
                        <Box p={6} borderBottom="1px solid" borderColor="gray.200" bg="gray.50">
                            <Text fontSize="sm" color="gray.600" fontWeight="medium">
                                Showing {(page * pageSize) + 1} - {Math.min((page + 1) * pageSize, totalElements)} of {totalElements} users
                            </Text>
                        </Box>

                        <Table.Root size="lg" variant="plain">
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader style={{ color: "#083951", textAlign: 'left', padding: '12px' }}>First Name</Table.ColumnHeader >
                                    <Table.ColumnHeader style={{ color: "#083951", textAlign: 'left', padding: '12px' }}>Last Name</Table.ColumnHeader >
                                    <Table.ColumnHeader style={{ color: "#083951", textAlign: 'left', padding: '12px' }}>Role</Table.ColumnHeader >
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {users.map((user) => (
                                    <Table.Row key={user.id} onClick={() => handleRowClick(user)} style={{ cursor: 'pointer' }}>
                                        <Table.Cell style={{ padding: '12px' }}>{user.firstName}</Table.Cell>
                                        <Table.Cell style={{ padding: '12px' }}>{user.lastName}</Table.Cell>
                                        <Table.Cell style={{ padding: '12px' }}>
                                            <Badge
                                                colorPalette={user.userType === 'ADMIN' ? 'green' : (user.userType === 'BLACKLISTED' ? 'purple' : 'blue')}
                                                fontSize="sm"
                                                px={3}
                                                py={1}
                                                borderRadius="full"
                                                fontWeight="semibold"
                                                display="inline-flex"
                                                alignItems="center"
                                            >
                                                {user.userType === 'ADMIN'
                                                    ? 'Admin'
                                                    : user.userType === 'BLACKLISTED'
                                                        ? 'Blacklisted'
                                                        : 'User'}                                            
                                            </Badge>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>

                        <Pagination page={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
                    </Box>
                )}

                <UserDetailsModal
                    isOpen={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    selectedUser={selectedUser}
                    handleRoleChange={handleRoleChange}
                    handleDelete={handleDelete}
                    isUpdatingRole={isUpdatingRole}
                    handleEnable={handleEnable}
                />
            </VStack>
        </Box>
    );
};

export default GetUsers;