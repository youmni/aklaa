import React from "react";
import {
  Box,
  Text,
  HStack,
  VStack,
  Spinner,
  Badge,
  Button,
  NativeSelectRoot,
  NativeSelectField,
  CloseButton,
  Portal,
  Dialog,
} from "@chakra-ui/react";

const UserDetailsModal = ({
  isOpen,
  onOpenChange,
  selectedUser,
  handleRoleChange,
  isUpdatingRole,
  handleEnable,
  enablingId,
  NAVY,
}) => {
  if (!selectedUser) return null;

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(e) => onOpenChange(e.open)} // Fix: e.open geeft true/false
      size="lg"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            borderRadius="xl"
            maxW="600px"
            position="relative" // Voor de absolute CloseButton
          >
            {/* Close button rechtsboven */}
            <Dialog.CloseTrigger asChild>
              <CloseButton
                size="sm"
                position="absolute"
                top="1rem"
                right="1rem"
                aria-label="Close modal"
              />
            </Dialog.CloseTrigger>

            <Dialog.Header pb={2} pt={6} px={6}>
              <Dialog.Title fontSize="2xl" fontWeight="bold" color={NAVY}>
                User Details
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body px={6} py={6}>
              <VStack align="stretch" gap={5}>
                {/* User ID */}
                <Box
                  p={4}
                  bg="gray.50"
                  borderRadius="lg"
                  borderLeft="4px solid"
                  borderColor={NAVY}
                >
                  <Text
                    fontSize="xs"
                    color="gray.600"
                    fontWeight="medium"
                    mb={1}
                    textTransform="uppercase"
                    letterSpacing="wide"
                  >
                    User ID
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color={NAVY}>
                    #{selectedUser.id}
                  </Text>
                </Box>

                {/* First & Last Name */}
                <HStack gap={4}>
                  <Box flex={1} p={4} bg="gray.50" borderRadius="lg">
                    <Text
                      fontSize="xs"
                      color="gray.600"
                      fontWeight="medium"
                      mb={1}
                      textTransform="uppercase"
                      letterSpacing="wide"
                    >
                      First Name
                    </Text>
                    <Text fontSize="md" fontWeight="semibold" color="gray.800">
                      {selectedUser.firstName}
                    </Text>
                  </Box>

                  <Box flex={1} p={4} bg="gray.50" borderRadius="lg">
                    <Text
                      fontSize="xs"
                      color="gray.600"
                      fontWeight="medium"
                      mb={1}
                      textTransform="uppercase"
                      letterSpacing="wide"
                    >
                      Last Name
                    </Text>
                    <Text fontSize="md" fontWeight="semibold" color="gray.800">
                      {selectedUser.lastName}
                    </Text>
                  </Box>
                </HStack>

                {/* Email */}
                <Box p={4} bg="gray.50" borderRadius="lg">
                  <Text
                    fontSize="xs"
                    color="gray.600"
                    fontWeight="medium"
                    mb={1}
                    textTransform="uppercase"
                    letterSpacing="wide"
                  >
                    Email Address
                  </Text>
                  <Text fontSize="md" fontWeight="medium" color="gray.800">
                    {selectedUser.email}
                  </Text>
                </Box>

                {/* Account Type */}
                <Box p={4} bg="gray.50" borderRadius="lg">
                  <Text
                    fontSize="xs"
                    color="gray.600"
                    fontWeight="medium"
                    mb={2}
                    textTransform="uppercase"
                    letterSpacing="wide"
                  >
                    Account Type
                  </Text>
                  <NativeSelectRoot size="md" disabled={isUpdatingRole}>
                    <NativeSelectField
                      value={selectedUser.userType}
                      onChange={handleRoleChange}
                      bg="white"
                      borderColor="gray.300"
                      borderWidth="1px"
                      _hover={{ borderColor: NAVY }}
                      borderRadius="md"
                      cursor="pointer"
                    >
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                      <option value="BLACKLISTED">Blacklisted</option>
                    </NativeSelectField>
                  </NativeSelectRoot>
                  {isUpdatingRole && (
                    <HStack mt={2}>
                      <Spinner size="sm" color={NAVY} />
                      <Text fontSize="xs" color="gray.600">
                        Updating...
                      </Text>
                    </HStack>
                  )}
                </Box>

                {/* Account Status */}
                <Box p={4} bg="gray.50" borderRadius="lg">
                  <Text
                    fontSize="xs"
                    color="gray.600"
                    fontWeight="medium"
                    mb={2}
                    textTransform="uppercase"
                    letterSpacing="wide"
                  >
                    Account Status
                  </Text>
                  <HStack justify="flex-start" align="center" spacing={4}>
                    {!selectedUser.enabled ? (
                      <Button
                        size="md"
                        onClick={() => handleEnable(selectedUser.id)}
                        isLoading={enablingId === selectedUser.id}
                      >
                        Enable Account
                      </Button>
                    ) : (
                      <Badge size="md" fontWeight="semibold">
                        Enabled
                      </Badge>
                    )}
                  </HStack>
                </Box>
              </VStack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default UserDetailsModal;