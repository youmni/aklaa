import React from "react";
import {
    Button,
    Dialog,
    Portal,
    Text,
    VStack,
    HStack,
} from "@chakra-ui/react";

const ConfirmDialog = ({
    open,
    onOpenChange,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    isDanger = false,
}) => {
    return (
        <Dialog.Root
            open={open}
            onOpenChange={(e) => onOpenChange(e.open)}
            role="alertdialog"
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content
                        maxW="400px"
                        borderRadius="xl"
                        p={6}
                        boxShadow="xl"
                    >
                        <VStack align="stretch" spacing={4}>
                            <Text fontSize="xl" fontWeight="bold" color={isDanger ? "red.600" : "gray.800"}>
                                {title}
                            </Text>
                            <Text fontSize="md" color="gray.700">
                                {description}
                            </Text>

                            <HStack justify="flex-end" spacing={3} pt={4}>
                                <Dialog.CloseTrigger asChild>
                                    <Button size="md" variant="surface">
                                        {cancelText}
                                    </Button>
                                </Dialog.CloseTrigger>
                                <Button
                                    colorPalette={isDanger ? "red" : "blue"}
                                    size="md"
                                    width="full"

                                    onClick={onConfirm}
                                >
                                    {confirmText}
                                </Button>
                            </HStack>
                        </VStack>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default ConfirmDialog;