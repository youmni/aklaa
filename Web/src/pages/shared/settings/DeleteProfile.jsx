import React, { useState } from 'react';
import api from '../../../api/axiosConfig.jsx';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { FiDownload } from 'react-icons/fi';
import {
  Box,
  Text,
  Button,
  Stack,
  HStack,
  Heading,
  Divider,
} from '@chakra-ui/react';
import ConfirmDialog from '../../../components/ui/ConfirmDialog.jsx';


const DeleteProfile = () => {
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
      await api.delete('/users');
      enqueueSnackbar('Account deleted. Redirecting to login...', { variant: 'success' });
      setConfirmOpen(false);
      navigate('/auth/login');
    } catch (err) {
      const message = err?.response?.data?.message || err?.response?.data || err.message || 'Delete failed';
      setError(message);
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="full" mx="auto" bg="white" p={6}>
      <Heading as="h2" size="3xl" mb={3} color="red.500" fontWeight="bold">Delete Profile</Heading>
      <Text fontSize="sm" color="gray.600" mb={4}>
        Deleting a user account will permanently remove all associated data, including personal information, settings, and uploaded content; access to services and subscriptions will be lost, recovery may not be possible, and some data may be retained for legal or regulatory purposes.
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
          Delete my account
        </Button>
      </HStack>
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete User Account"
        description="Are you sure you want to delete your account? This action cannot be undone."
        onConfirm={confirmDelete}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmColorScheme="red"
        isLoading={loading}
      />
    </Box>
  );
};

export default DeleteProfile;