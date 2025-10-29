import { Box, Heading, Text, Button, Stack } from '@chakra-ui/react';

function StatusCard({ success, title, message, onPrimaryClick, primaryText }) {
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
          <Box
            w={16}
            h={16}
            borderRadius="full"
            bg={success ? "green.100" : "red.100"}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="4xl" color={success ? "green.600" : "red.600"}>
              {success ? "✓" : "✕"}
            </Text>
          </Box>

          <Heading size="lg" color={success ? "green.700" : "red.700"}>
            {title}
          </Heading>

          <Text fontSize="md" color="gray.600" maxW="sm">
            {message}
          </Text>

          {onPrimaryClick && (
            <Button
              colorScheme="teal"
              size="lg"
              width="full"
              onClick={onPrimaryClick}
            >
              {primaryText || "OK"}
            </Button>
          )}
        </Stack>
      </Box>
    </Box>
  );
}

export default StatusCard;