import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Box, Heading, Spinner, Text } from '@chakra-ui/react';
import StatusCard from '../../../components/ui/StatusMessageCard';

function AccountActivation() {
  const { t } = useTranslation('auth');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState(t('accountActivation.activating'));
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  
  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setMessage(t('accountActivation.noToken'));
      setIsLoading(false);
      setIsSuccess(false);
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/activate?token=${token}`)
      .then(() => {
        setMessage(t('accountActivation.success'));
        setIsSuccess(true);
        setIsLoading(false);
      })
      .catch(() => {
        setMessage(t('accountActivation.failed'));
        setIsSuccess(false);
        setIsLoading(false);
      });
  }, [searchParams, t]);

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
      title={isSuccess ? t('accountActivation.successTitle') : t('accountActivation.failedTitle')}
      message={message}
      onPrimaryClick={isSuccess ? handleGoToLogin : handleGoHome}
      primaryText={isSuccess ? t('accountActivation.goToLogin') : t('accountActivation.goToHome')}
    />
  );
}

export default AccountActivation;