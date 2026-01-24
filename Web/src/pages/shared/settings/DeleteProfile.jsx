import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import userService from '../../../services/userService';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useThemeColors } from '../../../hooks/useThemeColors';
import {
  Box,
  Text,
  Button,
  HStack,
  Heading,
} from '@chakra-ui/react';
import ConfirmDialog from '../../../components/ui/ConfirmDialog.jsx';


const DeleteProfile = () => {
  const { t } = useTranslation('settings');
  const colors = useThemeColors();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => {
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await userService.deleteUser();
      enqueueSnackbar(t('deleteProfile.deleteSuccess'), { variant: 'success' });
      setConfirmOpen(false);
      navigate('/auth/login');
    } catch (err) {
      const message = t('deleteProfile.deleteError');
      setError(message);
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="full" mx="auto" bg={colors.bg.primary} p={6}>
      <Heading as="h2" size="3xl" mb={3} color="red.500" fontWeight="bold">{t('deleteProfile.title')}</Heading>
      <Text fontSize="sm" color={colors.text.secondary} mb={4}>
        {t('deleteProfile.description')}
      </Text>

      {error && (
        <Text fontSize="sm" color="red.500" mb={3}>
          {String(error)}
        </Text>
      )}

      <HStack spacing={3}>
        <Button
          onClick={handleDelete}
          isLoading={loading}
          size="md"
          px={6}
          py={4}
          width="full"
          borderRadius="md"
          boxShadow="md"
          colorPalette="red"
          variant="solid"
        >
          {t('deleteProfile.deleteButton')}
        </Button>
      </HStack>
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={t('deleteProfile.confirmTitle')}
        description={t('deleteProfile.confirmDescription')}
        onConfirm={confirmDelete}
        confirmLabel={t('deleteProfile.confirmButton')}
        cancelLabel={t('deleteProfile.cancelButton')}
        confirmColorScheme="red"
        isLoading={loading}
      />
    </Box>
  );
};

export default DeleteProfile;