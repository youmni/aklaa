import { useState, useEffect } from 'react';
import {
    Box,
    Text,
    HStack,
    VStack,
    Spinner,
    Badge,
    Button,
    NativeSelectRoot,
    NativeSelectField,
    CloseButton,
    Portal,
    Dialog,
} from "@chakra-ui/react";
import ConfirmDialog from '../ui/ConfirmDialog.jsx';

const UserDetailsModal = ({
    isOpen,
    onOpenChange,
    selectedUser,
    handleRoleChange,
    isUpdatingRole,
    handleEnable,
    handleDelete,
    enablingId
}) => {

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    if (!selectedUser) return null;

    return (
        <>
            <Dialog.Root
                open={isOpen}
                onOpenChange={(e) => onOpenChange(e.open)}
                size="lg"
            >
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content
                            borderRadius="xl"
                            maxW="600px"
                            position="relative"
                        >
                            <Dialog.CloseTrigger asChild>
                                <CloseButton
                                    size="sm"
                                    position="absolute"
                                    top="1rem"
                                    right="1rem"
                                    aria-label="Close modal"
                                />
                            </Dialog.CloseTrigger>

                            <Dialog.Header pb={2} pt={6} px={6}>
                                <Dialog.Title fontSize="2xl" fontWeight="bold" color="#083951">
                                    User Details
                                </Dialog.Title>
                            </Dialog.Header>

                            <Dialog.Body px={6} py={6}>
                                <VStack align="stretch" gap={5}>
                                    <Box
                                        p={4}
                                        bg="gray.50"
                                        borderRadius="lg"
                                        borderLeft="4px solid"
                                        borderColor="#083951"
                                    >
                                        <Text
                                            fontSize="xs"
                                            color="gray.600"
                                            fontWeight="medium"
                                            mb={1}
                                            textTransform="uppercase"
                                            letterSpacing="wide"
                                        >
                                            User ID
                                        </Text>
                                        <Text fontSize="lg" fontWeight="bold" color="#083951">
                                            #{selectedUser.id}
                                        </Text>
                                    </Box>

                                    <HStack gap={4}>
                                        <Box flex={1} p={4} bg="gray.50" borderRadius="lg">
                                            <Text
                                                fontSize="xs"
                                                color="gray.600"
                                                fontWeight="medium"
                                                mb={1}
                                                textTransform="uppercase"
                                                letterSpacing="wide"
                                            >
                                                First Name
                                            </Text>
                                            <Text fontSize="md" fontWeight="semibold" color="gray.800">
                                                {selectedUser.firstName}
                                            </Text>
                                        </Box>

                                        <Box flex={1} p={4} bg="gray.50" borderRadius="lg">
                                            <Text
                                                fontSize="xs"
                                                color="gray.600"
                                                fontWeight="medium"
                                                mb={1}
                                                textTransform="uppercase"
                                                letterSpacing="wide"
                                            >
                                                Last Name
                                            </Text>
                                            <Text fontSize="md" fontWeight="semibold" color="gray.800">
                                                {selectedUser.lastName}
                                            </Text>
                                        </Box>
                                    </HStack>

                                    <Box p={4} bg="gray.50" borderRadius="lg">
                                        <Text
                                            fontSize="xs"
                                            color="gray.600"
                                            fontWeight="medium"
                                            mb={1}
                                            textTransform="uppercase"
                                            letterSpacing="wide"
                                        >
                                            Email Address
                                        </Text>
                                        <Text fontSize="md" fontWeight="medium" color="gray.800">
                                            {selectedUser.email}
                                        </Text>
                                    </Box>

                                    <Box p={4} bg="gray.50" borderRadius="lg">
                                        <Text
                                            fontSize="xs"
                                            color="gray.600"
                                            fontWeight="medium"
                                            mb={2}
                                            textTransform="uppercase"
                                            letterSpacing="wide"
                                        >
                                            Account Type
                                        </Text>
                                        <NativeSelectRoot size="md" disabled={isUpdatingRole}>
                                            <NativeSelectField
                                                value={selectedUser.userType}
                                                onChange={handleRoleChange}
                                                bg="white"
                                                borderColor="gray.300"
                                                borderWidth="1px"
                                                _hover={{ borderColor: "#083951" }}
                                                borderRadius="md"
                                                cursor="pointer"
                                            >
                                                <option value="USER">User</option>
                                                <option value="ADMIN">Admin</option>
                                                <option value="BLACKLISTED">Blacklisted</option>
                                            </NativeSelectField>
                                        </NativeSelectRoot>
                                        {isUpdatingRole && (
                                            <HStack mt={2}>
                                                <Spinner size="sm" color="#083951" />
                                                <Text fontSize="xs" color="gray.600">
                                                    Updating...
                                                </Text>
                                            </HStack>
                                        )}
                                    </Box>

                                    <Box p={4} bg="gray.50" borderRadius="lg">
                                        <Text
                                            fontSize="xs"
                                            color="gray.600"
                                            fontWeight="medium"
                                            mb={2}
                                            textTransform="uppercase"
                                            letterSpacing="wide"
                                        >
                                            Account Status
                                        </Text>
                                        <HStack justify="flex-start" align="center" spacing={4}>
                                            {!selectedUser.enabled ? (
                                                <Button
                                                    size="md"
                                                    onClick={() => handleEnable(selectedUser.id)}
                                                >
                                                    Enable Account
                                                </Button>
                                            ) : (
                                                <Badge size="md" fontWeight="semibold">
                                                    Enabled
                                                </Badge>
                                            )}
                                        </HStack>
                                    </Box>
                                    <Button
                                        size="md"
                                        colorPalette="red"
                                        width="full"
                                        onClick={() => setIsDeleteOpen(true)}
                                    >
                                        Delete User
                                    </Button>

                                </VStack>
                            </Dialog.Body>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>

            <ConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                title="Delete user"
                description="Are you sure you want to delete this user? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                confirmColorScheme="red"
                onConfirm={() => {
                    handleDelete(selectedUser.id);
                    setIsDeleteOpen(false);
                    onOpenChange(false);
                }}
            />
        </>
    );
};

export default UserDetailsModal;