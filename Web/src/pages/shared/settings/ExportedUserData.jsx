import React, { useState } from 'react';
import api from '../../../api/axiosConfig.jsx';
import {
  Box,
  Text,
  Button,
  Stack,
} from '@chakra-ui/react';
import { FiDownload } from 'react-icons/fi';

function parseFilename(contentDisposition) {
  if (!contentDisposition) return null;
  const match =
    /filename\*=UTF-8''([^;\n]+)/i.exec(contentDisposition) ||
    /filename=\"?([^\";]+)\"?/i.exec(contentDisposition);
  if (match) return decodeURIComponent(match[1]);
  return null;
}

const ExportedUserData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/users/data/export', { responseType: 'blob' });

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
      setError(err?.response?.data || err.message || 'Download failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      maxW="1200px"
      mx="auto"
      p={6}
    >
      <Stack spacing={4} maxW="1200px" mx="auto">
        <Stack spacing={2}>
          <Text fontSize="3xl" color="#083951" fontWeight="bold">
            Export your personal data
          </Text>
          <Text fontSize="sm" color="#000000ff">
            In accordance with applicable data protection regulations, including
            the General Data Protection Regulation (GDPR), you have the right to
            access and obtain a copy of the personal data we process about you.
            The export is provided in a commonly used, machine-readable format.
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
          colorPalette="blue"
          size="md"
          loadingText="Preparing"
          w="100%"
        >
          Download data
        </Button>
      </Stack>
    </Box>
  );
};

export default ExportedUserData;