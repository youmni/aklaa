import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
import { useThemeColors } from '../../hooks/useThemeColors';

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
    const { t } = useTranslation('user');
    const colors = useThemeColors();
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
                            bg={colors.modal.bg}
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
                                <Dialog.Title fontSize="2xl" fontWeight="bold" color={colors.text.brand}>
                                    {t('details.title')}
                                </Dialog.Title>
                            </Dialog.Header>

                            <Dialog.Body px={6} py={6}>
                                <VStack align="stretch" gap={5}>
                                    <Box
                                        p={4}
                                        bg={colors.bg.tertiary}
                                        borderRadius="lg"
                                        borderLeft="4px solid"
                                        borderColor={colors.text.brand}
                                    >
                                        <Text
                                            fontSize="xs"
                                            color={colors.text.secondary}
                                            fontWeight="medium"
                                            mb={1}
                                            textTransform="uppercase"
                                            letterSpacing="wide"
                                        >
                                            {t('details.userId')}
                                        </Text>
                                        <Text fontSize="lg" fontWeight="bold" color={colors.text.brand}>
                                            #{selectedUser.id}
                                        </Text>
                                    </Box>

                                    <HStack gap={4}>
                                        <Box flex={1} p={4} bg={colors.bg.tertiary} borderRadius="lg">
                                            <Text
                                                fontSize="xs"
                                                color={colors.text.secondary}
                                                fontWeight="medium"
                                                mb={1}
                                                textTransform="uppercase"
                                                letterSpacing="wide"
                                            >
                                                {t('details.firstName')}
                                            </Text>
                                            <Text fontSize="md" fontWeight="semibold" color={colors.text.primary}>
                                                {selectedUser.firstName}
                                            </Text>
                                        </Box>

                                        <Box flex={1} p={4} bg={colors.bg.tertiary} borderRadius="lg">
                                            <Text
                                                fontSize="xs"
                                                color={colors.text.secondary}
                                                fontWeight="medium"
                                                mb={1}
                                                textTransform="uppercase"
                                                letterSpacing="wide"
                                            >
                                                {t('details.lastName')}
                                            </Text>
                                            <Text fontSize="md" fontWeight="semibold" color={colors.text.primary}>
                                                {selectedUser.lastName}
                                            </Text>
                                        </Box>
                                    </HStack>

                                    <Box p={4} bg={colors.bg.tertiary} borderRadius="lg">
                                        <Text
                                            fontSize="xs"
                                            color={colors.text.secondary}
                                            fontWeight="medium"
                                            mb={1}
                                            textTransform="uppercase"
                                            letterSpacing="wide"
                                        >
                                            {t('details.emailAddress')}
                                        </Text>
                                        <Text fontSize="md" fontWeight="medium" color={colors.text.primary}>
                                            {selectedUser.email}
                                        </Text>
                                    </Box>

                                    <Box p={4} bg={colors.bg.tertiary} borderRadius="lg">
                                        <Text
                                            fontSize="xs"
                                            color={colors.text.secondary}
                                            fontWeight="medium"
                                            mb={2}
                                            textTransform="uppercase"
                                            letterSpacing="wide"
                                        >
                                            {t('details.accountType')}
                                        </Text>
                                        <NativeSelectRoot size="md" disabled={isUpdatingRole}>
                                            <NativeSelectField
                                                value={selectedUser.userType}
                                                onChange={handleRoleChange}
                                                bg={colors.input.bg}
                                                color={colors.text.primary}
                                                borderColor={colors.border.default}
                                                borderWidth="1px"
                                                _hover={{ borderColor: colors.text.brand }}
                                                borderRadius="md"
                                                cursor="pointer"
                                            >
                                                <option value="USER">{t('management.roleUser')}</option>
                                                <option value="ADMIN">{t('management.roleAdmin')}</option>
                                                <option value="BLACKLISTED">{t('management.roleBlacklisted')}</option>
                                            </NativeSelectField>
                                        </NativeSelectRoot>
                                        {isUpdatingRole && (
                                            <HStack mt={2}>
                                                <Spinner size="sm" color={colors.text.brand} />
                                                <Text fontSize="xs" color={colors.text.secondary}>
                                                    {t('details.updating')}
                                                </Text>
                                            </HStack>
                                        )}
                                    </Box>

                                    <Box p={4} bg={colors.bg.tertiary} borderRadius="lg">
                                        <Text
                                            fontSize="xs"
                                            color={colors.text.secondary}
                                            fontWeight="medium"
                                            mb={2}
                                            textTransform="uppercase"
                                            letterSpacing="wide"
                                        >
                                            {t('details.accountStatus')}
                                        </Text>
                                        <HStack justify="flex-start" align="center" spacing={4}>
                                            {!selectedUser.enabled ? (
                                                <Button
                                                    size="md"
                                                    onClick={() => handleEnable(selectedUser.id)}
                                                >
                                                    {t('details.enableAccount')}
                                                </Button>
                                            ) : (
                                                <Badge size="md" fontWeight="semibold">
                                                    {t('details.enabled')}
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
                                        {t('details.deleteUser')}
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
                title={t('details.deleteConfirmTitle')}
                description={t('details.deleteConfirmDescription')}
                confirmLabel={t('details.confirmDelete')}
                cancelLabel={t('details.cancel')}
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