import {useEffect, useState} from "react";
import api from '../../../api/axiosConfig';
import {useSnackbar} from "notistack";
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
    Dialog,
    CloseButton,
    Portal
} from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import PaginationComponent from "../../../components/ui/Pagination";

const NAVY = '#083951';

type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    userType: string;
}

enum SecurityEventType {
    LOGIN,
    LOGOUT,
    FAILED_LOGIN,
    PASSWORD_RESET,
    PASSWORD_FORGOT,
    UNAUTHORIZED_ACCESS,
}

type SecurityEvent = {
    id: number;
    user: User,
    actingUser: User,
    type: SecurityEventType,
    message: string,
    verified: boolean,
    createdAt: Date,
    updatedAt: Date,
}

const SecurityEvents = () => {
    const lastWeek = new Date();
    lastWeek.setDate(new Date().getDate() - 7);

    const { enqueueSnackbar } = useSnackbar();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [since, setSince] = useState(lastWeek.toISOString().split('T')[0]);
    const [selectedEventType, setSelectedEventType] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const EVENT_TYPES = [
        { value: '', label: 'All Events' },
        { value: 'LOGIN', label: 'Login' },
        { value: 'LOGOUT', label: 'Logout' },
        { value: 'FAILED_LOGIN', label: 'Failed Login' },
        { value: 'PASSWORD_RESET', label: 'Password Reset' },
        { value: 'PASSWORD_FORGOT', label: 'Password Forgot' },
        { value: 'UNAUTHORIZED_ACCESS', label: 'Unauthorized Access' }
    ];

    useEffect(() => {
        getEventsSince();
    }, [since, selectedEventType]);

    const getEventsSince = () => {
        setLoading(true);

        const params = {
            since: since + "T00:00:00",
        }

        api.get('/security', { params })
            .catch(err => enqueueSnackbar(err.response?.data?.message || 'Failed to fetch users', { variant: 'error' }))
            .then(res => {
                if (typeof res === "object") {
                    setEvents(res.data as SecurityEvent[]);
                }

                setLoading(false);
            });
    }

    const getEventTypeBadge = (type) => {
        const config = {
            'LOGIN': { color: 'green', label: 'Login' },
            'LOGOUT': { color: 'blue', label: 'Logout' },
            'FAILED_LOGIN': { color: 'red', label: 'Failed Login' },
            'PASSWORD_RESET': { color: 'orange', label: 'Password Reset' },
            'PASSWORD_FORGOT': { color: 'yellow', label: 'Password Forgot' },
            'UNAUTHORIZED_ACCESS': { color: 'red', label: 'Unauthorized' }
        };

        const { color, label } = config[type] || { color: 'gray', label: type };

        return (
            <Badge colorPalette={color} size="sm">
                {label}
            </Badge>
        );
    };

    const formatDateTime = (date) => {
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const totalPages = Math.ceil(events.length / pageSize);
    const paginatedEvents = events.slice((page - 1) * pageSize, page * pageSize);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    useEffect(() => {
        setPage(1);
    }, [since, selectedEventType]);

    return (
        <Box p={8} bg="gray.50" minH="calc(100vh - 73px)">
            <VStack align="stretch" gap={6} maxW="1400px" mx="auto">
                <Box>
                    <Heading fontSize="3xl" fontWeight="bold" color={NAVY} mb={2}>
                        Security Events
                    </Heading>
                    <Text color="gray.600" fontSize="md">
                        Monitor and review security-related activities
                    </Text>
                </Box>

                <HStack gap={4}>
                    <Box flex={1}>
                        <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                            Events Since
                        </Text>
                        <Input
                            type="date"
                            value={since}
                            onChange={(e) => setSince(e.target.value)}
                            size="lg"
                            bg="white"
                            borderColor="gray.300"
                            borderWidth="1px"
                            _hover={{ borderColor: NAVY }}
                            _focus={{ borderColor: NAVY, boxShadow: `0 0 0 1px ${NAVY}` }}
                            borderRadius="lg"
                        />
                    </Box>
                    <Box w="250px">
                        <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                            Event Type
                        </Text>
                        <NativeSelectRoot size="lg">
                            <NativeSelectField
                                value={selectedEventType}
                                onChange={(e) => setSelectedEventType(e.target.value)}
                                bg="white"
                                borderColor="gray.300"
                                borderWidth="1px"
                                _hover={{ borderColor: NAVY }}
                                borderRadius="lg"
                            >
                                {EVENT_TYPES.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </NativeSelectField>
                        </NativeSelectRoot>
                    </Box>
                </HStack>

                {loading ? (
                    <Box display="flex" justifyContent="center" py={20}>
                        <Spinner size="xl" color={NAVY} />
                    </Box>
                ) : events.length === 0 ? (
                    <Box textAlign="center" py={20} bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200" boxShadow="sm">
                        <Text fontSize="xl" color="gray.500" fontWeight="medium">
                            No security events found
                        </Text>
                        <Text color="gray.400" mt={2}>
                            Try adjusting your date range or filters
                        </Text>
                    </Box>
                ) : (
                    <>
                        <Box bg="white" borderRadius="xl" overflow="hidden" border="1px solid" borderColor="gray.200" boxShadow="md">
                            <Box p={6} borderBottom="1px solid" borderColor="gray.200" bg="gray.50">
                                <Text fontSize="sm" color="gray.600" fontWeight="medium">
                                    Showing {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, events.length)} of {events.length} events
                                </Text>
                            </Box>

                            <Table.Root size="lg">
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
                                            Event Type
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
                                            User
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
                                            Message
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
                                            Date & Time
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
                                            Status
                                        </Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {paginatedEvents.map((event, index) => (
                                        <Table.Row
                                            key={event.id}
                                            cursor="pointer"
                                            _hover={{ bg: 'blue.50' }}
                                            transition="all 0.2s"
                                            borderBottom={index !== paginatedEvents.length - 1 ? "1px solid" : "none"}
                                            borderColor="gray.100"
                                        >
                                            <Table.Cell py={4} px={6}>
                                                {getEventTypeBadge(event.type)}
                                            </Table.Cell>
                                            <Table.Cell
                                                fontWeight="medium"
                                                fontSize="md"
                                                py={4}
                                                px={6}
                                            >
                                                {event.user.firstName} {event.user.lastName}
                                            </Table.Cell>
                                            <Table.Cell
                                                fontSize="sm"
                                                color="gray.600"
                                                py={4}
                                                px={6}
                                            >
                                                {event.message}
                                            </Table.Cell>
                                            <Table.Cell
                                                fontSize="sm"
                                                color="gray.600"
                                                py={4}
                                                px={6}
                                            >
                                                {formatDateTime(event.createdAt)}
                                            </Table.Cell>
                                            <Table.Cell py={4} px={6}>
                                                <Badge colorPalette={event.verified ? 'green' : 'gray'} size="sm">
                                                    {event.verified ? 'Verified' : 'Unverified'}
                                                </Badge>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Box>

                        <PaginationComponent
                            page={page}
                            totalPages={totalPages}
                            totalElements={events.length}
                            pageSize={pageSize}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </VStack>


        </Box>
    );
};

export default SecurityEvents;