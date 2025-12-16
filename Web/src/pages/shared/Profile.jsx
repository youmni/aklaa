import React, { useState } from 'react';
import api from '../../api/axiosConfig.jsx';
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


const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete('/users');
      enqueueSnackbar('Account deleted. Redirecting to login...', { variant: 'success' });
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
    <Box maxW="720px" mx="auto" bg="white" borderRadius="lg" p={6} boxShadow="sm">
      <Heading as="h2" size="md" mb={3} color="red.500">Delete User Account</Heading>
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
          borderRadius="md"
          boxShadow="md"
          colorPalette="red"
          variant="solid"
        >
          Delete my account
        </Button>
      </HStack>
    </Box>
  );
};

export default Profile;