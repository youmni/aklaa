import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../../api/axiosConfig';
import { Box, Heading, Spinner, Text } from '@chakra-ui/react';
import StatusCard from '../../../components/ui/StatusMessageCard';

function EmailActivation() {
  const { t } = useTranslation('auth');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState(t('emailActivation.activating'));
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  
  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setMessage(t('emailActivation.noToken'));
      setIsLoading(false);
      setIsSuccess(false);
      return;
    }

    api
      .get(`/users/email-confirm?token=${token}`)
      .then(() => {
        setMessage(t('emailActivation.success'));
        setIsSuccess(true);
        setIsLoading(false);
      })
      .catch(() => {
        setMessage(t('emailActivation.failed'));
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
      title={isSuccess ? t('emailActivation.successTitle') : t('emailActivation.failedTitle')}
      message={message}
      onPrimaryClick={isSuccess ? handleGoToLogin : handleGoHome}
      primaryText={isSuccess ? t('emailActivation.goToLogin') : t('emailActivation.goToHome')}
    />
  );
}

export default EmailActivation;