import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../../api/axiosConfig';
import { Box, Heading, Spinner, Text } from '@chakra-ui/react';
import StatusCard from '../../../components/ui/StatusMessageCard';

function EmailActivation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Activating your new email...");
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  
  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setMessage("No email token provided. Please check your email for the activation link.");
      setIsLoading(false);
      setIsSuccess(false);
      return;
    }

    api
      .get(`/users/email-confirm?token=${token}`)
      .then(() => {
        setMessage("Your new email has been successfully activated!");
        setIsSuccess(true);
        setIsLoading(false);
      })
      .catch(() => {
        setMessage("Activation failed. The token may be invalid or expired. Please try again or contact support.");
        setIsSuccess(false);
        setIsLoading(false);
      });
  }, [searchParams]);

  const handleGoToLogin = () => {
    navigate('/auth/login');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <Box
        minH="100vh"
        bg="gray.50"
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={4}
      >
        <Box
          p={8}
          bg="white"
          borderRadius="lg"
          boxShadow="lg"
          w="full"
          maxW="md"
          textAlign="center"
        >
          <Spinner size="xl" color="teal.500" thickness="4px" />
          <Heading size="lg" color="gray.700" mt={4}>
            {message}
          </Heading>
        </Box>
      </Box>
    );
  }

  return (
    <StatusCard
      success={isSuccess}
      title={isSuccess ? "New Email Activation Successful!" : "New Email Activation Failed"}
      message={message}
      onPrimaryClick={isSuccess ? handleGoToLogin : handleGoHome}
      primaryText={isSuccess ? "Go to Login" : "Go to Home"}
    />
  );
}

export default EmailActivation;