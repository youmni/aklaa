import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Heading, Text, Button, Stack, Spinner } from '@chakra-ui/react';

function AccountActivation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Activating your account...");
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  
  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setMessage("No activation token provided. Please check your email for the activation link.");
      setIsLoading(false);
      setIsSuccess(false);
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/activate?token=${token}`)
      .then(() => {
        setMessage("Your account has been successfully activated! You can now log in.");
        setIsSuccess(true);
        setIsLoading(false);
      })
      .catch(() => {
        setMessage("Activation failed. The token may be invalid or expired. Please try registering again or contact support.");
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
        <Stack spacing={6} align="center">
          {isLoading ? (
            <>
              <Spinner size="xl" color="teal.500" thickness="4px" />
              <Heading size="lg" color="gray.700">
                {message}
              </Heading>
            </>
          ) : (
            <>
              <Box
                w={16}
                h={16}
                borderRadius="full"
                bg={isSuccess ? "green.100" : "red.100"}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="4xl" color={isSuccess ? "green.600" : "red.600"}>
                  {isSuccess ? "✓" : "✕"}
                </Text>
              </Box>

              <Heading size="lg" color={isSuccess ? "green.700" : "red.700"}>
                {isSuccess ? "Activation Successful!" : "Activation Failed"}
              </Heading>

              <Text fontSize="md" color="gray.600" maxW="sm">
                {message}
              </Text>

              <Stack direction={{ base: "column", sm: "row" }} spacing={4} w="full">
                {isSuccess ? (
                  <Button
                    colorScheme="teal"
                    size="lg"
                    width="full"
                    onClick={handleGoToLogin}
                  >
                    Go to Login
                  </Button>
                ) : (
                  <Button
                    colorScheme="teal"
                    size="lg"
                    width="full"
                    onClick={handleGoHome}
                  >
                    Go to Home
                  </Button>
                )}
              </Stack>
            </>
          )}
        </Stack>
      </Box>
    </Box>
  );
}

export default AccountActivation;