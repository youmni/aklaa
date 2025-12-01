import {
    Box,
    Text,
    IconButton,
    ButtonGroup,
} from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

const NAVY = '#083951';

const PaginationComponent = ({ page, totalPages, totalElements, pageSize, onPageChange }) => {
    const handlePrevious = () => {
        if (page > 1) {
            onPageChange(page - 1);
        }
    };

    const handleNext = () => {
        if (page < totalPages) {
            onPageChange(page + 1);
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (page <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (page >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(page - 1);
                pages.push(page);
                pages.push(page + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <Box display="flex" justifyContent="center" mt={6}>
    <ButtonGroup variant="ghost" size="sm" wrap="wrap">
    <IconButton
        onClick={handlePrevious}
    disabled={page === 1}
    _hover={{ bg: 'gray.100' }}
    _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
>
    <LuChevronLeft />
    </IconButton>

    {getPageNumbers().map((pageNum, idx) => (
        pageNum === '...' ? (
            <Box key={`ellipsis-${idx}`} px={3} display="flex" alignItems="center">
    <Text color="gray.500">...</Text>
    </Box>
    ) : (
        <IconButton
            key={pageNum}
        onClick={() => onPageChange(pageNum)}
        bg={pageNum === page ? NAVY : 'transparent'}
        color={pageNum === page ? 'white' : 'gray.700'}
        _hover={{ bg: pageNum === page ? NAVY : 'gray.100' }}
    >
        {pageNum}
        </IconButton>
    )
    ))}

    <IconButton
        onClick={handleNext}
    disabled={page === totalPages}
    _hover={{ bg: 'gray.100' }}
    _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
>
    <LuChevronRight />
    </IconButton>
    </ButtonGroup>
    </Box>
);
};

export default PaginationComponent;