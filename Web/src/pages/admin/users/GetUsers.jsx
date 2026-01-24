import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import {
    Box, Heading, Input, Stack, Text, HStack, VStack, Table, IconButton, Button, ButtonGroup, NativeSelectRoot, NativeSelectField, Spinner, Badge, Dialog, DataList, CloseButton, Portal
} from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import { useSnackbar } from 'notistack';
import userService from '../../../services/userService';
import UserDetailsModal from '../../../components/users/UserDetailsModal';
import Pagination from '../../../components/ui/Pagination';

const GetUsers = () => {
    const { t } = useTranslation('user');
    const { enqueueSnackbar } = useSnackbar();
    const colors = useThemeColors();
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

            const response = await userService.getUsers(params);
            setUsers(response.data.users || []);
            console.log(response.data);
            setTotalPages(response.data.totalPages || 0);
            setTotalElements(response.data.totalElements || 0);
        } catch (error) {
            enqueueSnackbar(t('management.fetchUsersFailed'), { variant: 'error' });
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
            await userService.updateUserRole(selectedUser.id, newRole);

            setSelectedUser({ ...selectedUser, userType: newRole });
            setUsers(users.map(user => user.id === selectedUser.id ? { ...user, userType: newRole } : user));
            enqueueSnackbar(t('management.roleUpdatedSuccess'), { variant: 'success' });
        } catch (error) {
            enqueueSnackbar(t('management.roleUpdateFailed'), { variant: 'error' });
        } finally {
            setIsUpdatingRole(false);
        }
    };

    const handleEnable = async (id) => {
        try {
            await userService.enableUser(id);

            setUsers(users.map(user => user.id === id ? { ...user, enabled: true } : user));
            if (selectedUser?.id === id) setSelectedUser({ ...selectedUser, enabled: true });

            enqueueSnackbar(t('management.userEnabledSuccess'), { variant: 'success' });
        } catch (error) {
            enqueueSnackbar(t('management.userEnableFailed'), { variant: 'error' });
        }
    };

    const handleDelete = async (id) => {
        try {
            await userService.deleteUser(id);

            setUsers((prev) => prev.filter((user) => user.id !== id));

            if (selectedUser?.id === id) setSelectedUser(null);

            enqueueSnackbar(t('management.userDeletedSuccess'), { variant: 'success' });
        } catch (error) {
            enqueueSnackbar(t('management.userDeleteFailed'), { variant: 'error' });
        }
    };

    return (
        <Box p={8} bg={colors.bg.primary} minH="calc(100vh - 73px)">
            <VStack align="stretch" gap={6} maxW="1400px" mx="auto">
                <Box>
                    <Heading fontSize="3xl" fontWeight="bold" color={colors.text.brand} mb={2}>
                        {t('management.title')}
                    </Heading>
                    <Text color={colors.text.secondary} fontSize="md">
                        {t('management.subtitle')}
                    </Text>
                </Box>

                <Stack direction={{ base: "column", md: "row" }} gap={4}>
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
                            placeholder={t('management.searchPlaceholder')}
                            value={searchTerm}
                            onChange={handleSearchChange}
                            focusBorderColor={colors.text.brand}
                            bg={colors.input.bg}
                            borderColor={colors.border.default}
                            color={colors.text.primary}
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
                                border: `1px solid ${colors.border.default}`,
                                fontSize: '1rem',
                                backgroundColor: colors.input.bg,
                                color: colors.text.primary,
                                cursor: 'pointer',
                                height: window.innerWidth < 768 ? '2.5rem' : '3rem'
                            }}
                        >
                            <option value="">{t('management.allTypes')}</option>
                            <option value="ADMIN">{t('management.roleAdmin')}</option>
                            <option value="BLACKLISTED">{t('management.roleBlacklisted')}</option>
                            <option value="USER">{t('management.roleUser')}</option>
                        </select>
                    </Box>
                </Stack>

                {isLoading ? (
                    <Box display="flex" justifyContent="center" py={20}>
                        <Spinner size="xl" thickness="4px" color={colors.text.brand} />
                    </Box>
                ) : users.length === 0 ? (
                    <Box textAlign="center" py={20} bg={colors.card.bg} borderRadius="xl" border="1px solid" borderColor={colors.border.default} boxShadow="sm">
                        <Text fontSize="xl" color={colors.text.secondary} fontWeight="medium">{t('management.noUsersFound')}</Text>
                        <Text color={colors.text.tertiary} mt={2}>
                            {searchTerm || selectedType ? t('management.adjustFilters') : t('management.noUsersFoundDescription')}
                        </Text>
                    </Box>
                ) : (
                    <Box bg={colors.card.bg} borderRadius="xl" overflow="hidden" border="1px solid" borderColor={colors.border.default} boxShadow="md">
                        <Box p={6} borderBottom="1px solid" borderColor={colors.border.default} bg={colors.bg.tertiary}>
                            <Text fontSize="sm" color={colors.text.secondary} fontWeight="medium">
                                {t('management.showing', { 
                                    start: (page * pageSize) + 1, 
                                    end: Math.min((page + 1) * pageSize, totalElements), 
                                    total: totalElements 
                                })}
                            </Text>
                        </Box>

                        <Table.Root size="lg" variant="plain">
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader style={{ color: colors.text.brand, textAlign: 'left', padding: '12px', fontWeight: '600' }}>{t('management.firstNameColumn')}</Table.ColumnHeader >
                                    <Table.ColumnHeader style={{ color: colors.text.brand, textAlign: 'left', padding: '12px', fontWeight: '600' }}>{t('management.lastNameColumn')}</Table.ColumnHeader >
                                    <Table.ColumnHeader style={{ color: colors.text.brand, textAlign: 'left', padding: '12px', fontWeight: '600' }}>{t('management.roleColumn')}</Table.ColumnHeader >
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {users.map((user) => (
                                    <Table.Row 
                                        key={user.id} 
                                        onClick={() => handleRowClick(user)} 
                                        style={{ cursor: 'pointer' }}
                                        _hover={{ bg: colors.bg.hover }}
                                    >
                                        <Table.Cell style={{ padding: '12px', color: colors.text.primary }}>{user.firstName}</Table.Cell>
                                        <Table.Cell style={{ padding: '12px', color: colors.text.primary }}>{user.lastName}</Table.Cell>
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
                                                    ? t('management.roleAdmin')
                                                    : user.userType === 'BLACKLISTED'
                                                        ? t('management.roleBlacklisted')
                                                        : t('management.roleUser')}                                            
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