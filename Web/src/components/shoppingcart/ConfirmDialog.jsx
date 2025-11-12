import React, { useEffect, useRef } from "react";
import {
    Box,
    Button,
    Text,
    Icon,
    Portal,
    HStack,
    Flex
} from "@chakra-ui/react";
import { FiAlertCircle } from "react-icons/fi";

const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm",
    description = "",
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    confirmColorScheme = "red",
    isLoading = false,
    IconComponent = FiAlertCircle
}) => {
    const overlayRef = useRef();
    const confirmRef = useRef();

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "Enter" && !isLoading) onConfirm();
        };
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKey);
        setTimeout(() => confirmRef.current?.focus(), 0);
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [isOpen, onClose, onConfirm, isLoading]);

    if (!isOpen) return null;

    return (
        <Portal>
            <Box
                ref={overlayRef}
                position="fixed"
                inset={0}
                bg="rgba(10, 12, 14, 0.55)"
                zIndex="1400"
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={{ base: 4, md: 6 }}
                onMouseDown={(e) => {
                    if (e.target === overlayRef.current) onClose();
                }}
            >
                <Box
                    role="dialog"
                    aria-modal="true"
                    bg="white"
                    borderRadius="12px"
                    boxShadow="0 10px 30px rgba(2,6,23,0.2)"
                    maxW="560px"
                    w="100%"
                    overflow="hidden"
                    transition="transform 150ms ease"
                    _hover={{ transform: "translateY(-2px)" }}
                >
                    <Flex px={{ base: 5, md: 6 }} py={5} gap={4} align="flex-start" borderBottom="1px" borderColor="gray.100">
                        <Box
                            minW="44px"
                            minH="44px"
                            borderRadius="full"
                            display="grid"
                            placeItems="center"
                            bg={confirmColorScheme === "red" ? "red.50" : "gray.50"}
                            border="1px solid"
                            borderColor={confirmColorScheme === "red" ? "red.100" : "gray.100"}
                            mr={1}
                        >
                            <Icon
                                as={IconComponent}
                                boxSize={5}
                                color={confirmColorScheme === "red" ? "red.600" : "gray.600"}
                                aria-hidden
                            />
                        </Box>

                        <Box flex="1">
                            <Text fontWeight="700" fontSize={{ base: "md", md: "lg" }} color="gray.800" mb={1}>
                                {title}
                            </Text>
                            {description && (
                                <Text color="gray.600" fontSize="sm" lineHeight="1.4">
                                    {description}
                                </Text>
                            )}
                        </Box>
                    </Flex>

                    <Flex px={{ base: 4, md: 6 }} py={4} gap={3} justify="flex-end" align="center" borderTop="1px" borderColor="gray.50">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            isDisabled={isLoading}
                            borderRadius="8px"
                            _hover={{ bg: "gray.100" }}
                            aria-label={cancelLabel}
                        >
                            {cancelLabel}
                        </Button>

                        <Button
                            ref={confirmRef}
                            colorScheme={confirmColorScheme}
                            onClick={onConfirm}
                            isLoading={isLoading}
                            borderRadius="8px"
                            px={5}
                            aria-label={confirmLabel}
                            boxShadow="sm"
                        >
                            {confirmLabel}
                        </Button>
                    </Flex>
                </Box>
            </Box>
        </Portal>
    );
};

export default ConfirmDialog;