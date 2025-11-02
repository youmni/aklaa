import { Box, Text } from '@chakra-ui/react';

export const Field = ({ label, children, required, invalid, errorText, helperText, ...props }) => {
    return (
        <Box {...props}>
            {label && (
                <Text 
                    as="label" 
                    fontSize="sm" 
                    fontWeight="medium" 
                    mb={2}
                    display="block"
                >
                    {label}
                    {required && (
                        <Text as="span" color="red.500" ml={1}>
                            *
                        </Text>
                    )}
                </Text>
            )}
            {children}
            {helperText && !invalid && (
                <Text fontSize="sm" color="gray.500" mt={1}>
                    {helperText}
                </Text>
            )}
            {invalid && errorText && (
                <Text fontSize="sm" color="red.500" mt={1}>
                    {errorText}
                </Text>
            )}
        </Box>
    );
};