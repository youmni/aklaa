import React from 'react';
import { Stack, HStack, IconButton, Button, Text } from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import { useThemeColors } from '../../hooks/useThemeColors';

const Pagination = ({ page = 0, totalPages = 0, onPageChange = () => {} }) => {
    const colors = useThemeColors();
    if (!totalPages || totalPages <= 1) return null;

    const renderPageButtons = () => {
        return [...Array(totalPages)].map((_, index) => {
            if (
                index === 0 ||
                index === totalPages - 1 ||
                (index >= page - 1 && index <= page + 1)
            ) {
                return (
                    <Button
                        key={index}
                        onClick={() => onPageChange(index)}
                        size={{ base: 'sm', md: 'md' }}
                        bg={page === index ? colors.button.primary.bg : colors.card.bg}
                        color={page === index ? 'white' : colors.text.brand}
                        borderWidth="2px"
                        borderColor={colors.border.default}
                        _hover={{
                            bg: page === index ? colors.button.primary.hover : colors.bg.hover
                        }}
                        fontWeight="600"
                        minW={{ base: '36px', md: '40px' }}
                    >
                        {index + 1}
                    </Button>
                );
            } else if (index === page - 2 || index === page + 2) {
                return (
                    <Text key={index} px={1} display={{ base: 'none', sm: 'block' }}>
                        ...
                    </Text>
                );
            }
            return null;
        });
    };

    return (
        <Stack direction={{ base: 'column', sm: 'row' }} justify="center" gap={2} mt={8} flexWrap="wrap">
            <HStack gap={2} justify="center" flexWrap="wrap">
                <IconButton
                    onClick={() => onPageChange(0)}
                    disabled={page === 0}
                    size={{ base: 'sm', md: 'md' }}
                    variant="outline"
                    borderColor={colors.border.default}
                    color={colors.text.brand}
                    bg={colors.card.bg}
                    _hover={{ bg: colors.bg.hover }}
                    display={{ base: 'none', sm: 'inline-flex' }}
                    aria-label="First page"
                >
                    <FiChevronsLeft />
                </IconButton>
                <IconButton
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 0}
                    size={{ base: 'sm', md: 'md' }}
                    variant="outline"
                    borderColor={colors.border.default}
                    color={colors.text.brand}
                    bg={colors.card.bg}
                    _hover={{ bg: colors.bg.hover }}
                    aria-label="Previous page"
                >
                    <FiChevronLeft />
                </IconButton>

                {renderPageButtons()}

                <IconButton
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages - 1}
                    size={{ base: 'sm', md: 'md' }}
                    variant="outline"
                    borderColor={colors.border.default}
                    color={colors.text.brand}
                    bg={colors.card.bg}
                    _hover={{ bg: colors.bg.hover }}
                    aria-label="Next page"
                >
                    <FiChevronRight />
                </IconButton>
                <IconButton
                    onClick={() => onPageChange(totalPages - 1)}
                    disabled={page === totalPages - 1}
                    size={{ base: 'sm', md: 'md' }}
                    variant="outline"
                    borderColor={colors.border.default}
                    color={colors.text.brand}
                    bg={colors.card.bg}
                    _hover={{ bg: colors.bg.hover }}
                    display={{ base: 'none', sm: 'inline-flex' }}
                    aria-label="Last page"
                >
                    <FiChevronsRight />
                </IconButton>
            </HStack>
        </Stack>
    );
};

export default Pagination;
