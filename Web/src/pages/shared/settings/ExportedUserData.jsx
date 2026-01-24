import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import userService from '../../../services/userService';
import {
  Box,
  Text,
  Button,
  Stack,
} from '@chakra-ui/react';
import { FiDownload } from 'react-icons/fi';
import { useThemeColors } from '../../../hooks/useThemeColors';

function parseFilename(contentDisposition) {
  if (!contentDisposition) return null;
  const match =
    /filename\*=UTF-8''([^;\n]+)/i.exec(contentDisposition) ||
    /filename=\"?([^\";]+)\"?/i.exec(contentDisposition);
  if (match) return decodeURIComponent(match[1]);
  return null;
}

const ExportedUserData = () => {
  const { t } = useTranslation('settings');
  const colors = useThemeColors();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await userService.exportUserData();

      const cd =
        res.headers['content-disposition'] ||
        res.headers['Content-Disposition'];
      const filename = parseFilename(cd) || 'export.json';

      const contentType =
        res.headers['content-type'] || 'application/json';
      const blob = new Blob([res.data], { type: contentType });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(t('exportData.downloadError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      maxW="1200px"
      mx="auto"
      p={6}
      bg={colors.bg.primary}
    >
      <Stack spacing={4} maxW="1200px" mx="auto">
        <Stack spacing={2}>
          <Text fontSize="3xl" color={colors.text.brand} fontWeight="bold">
            {t('exportData.title')}
          </Text>
          <Text fontSize="sm" color={colors.text.secondary}>
            {t('exportData.description')}
          </Text>

          {error && (
            <Text fontSize="sm" color="red.500">
              {String(error)}
            </Text>
          )}
        </Stack>

        <Button
          onClick={handleDownload}
          isLoading={loading}
          leftIcon={<FiDownload />}
          bg={colors.button.primary.bg}
          color="white"
          _hover={{ bg: colors.button.primary.hover }}
          size="md"
          loadingText="Preparing"
          w="100%"
        >
          {t('exportData.downloadButton')}
        </Button>
      </Stack>
    </Box>
  );
};

export default ExportedUserData;