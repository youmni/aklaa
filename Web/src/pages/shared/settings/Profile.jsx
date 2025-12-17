import React from 'react';
import { useNavigate } from 'react-router-dom';
import EditProfile from './EditProfile';
import DeleteProfile from './DeleteProfile';
import { SimpleGrid, Box, Button } from '@chakra-ui/react';

const Profile = () => {
  const navigate = useNavigate();

  return (
    <Box maxW="1200px" mx="auto" px={4}>
      <SimpleGrid columns={1} spacing={6}>
        <EditProfile />
        <DeleteProfile />
      </SimpleGrid>
    </Box>
  );
};

export default Profile;