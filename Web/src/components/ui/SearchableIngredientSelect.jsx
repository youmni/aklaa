import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Input, Text, VStack } from '@chakra-ui/react';
import { useThemeColors } from '../../hooks/useThemeColors';

const SearchableIngredientSelect = ({
    availableIngredients = [],
    selectedIngredientId = '',
    onSelect,
    placeholder = 'Search ingredients...',
    invalid = false,
    size = 'lg'
}) => {
    const { t } = useTranslation(['ingredient', 'grocerylist']);
    const colors = useThemeColors();
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const getFilteredIngredients = () => {
        return availableIngredients
            .filter(ing =>
                ing.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => a.name.localeCompare(b.name));
    };

    const getSelectedIngredientName = () => {
        if (!selectedIngredientId) return '';
        const ingredient = availableIngredients.find(
            ing => ing.id === parseInt(selectedIngredientId) || ing.id === selectedIngredientId
        );
        return ingredient ? `${ingredient.name} (${t(`units.${ingredient.unit}`)})` : '';
    };

    const handleSelect = (ingredientId) => {
        onSelect(ingredientId);
        setSearchTerm('');
        setIsDropdownOpen(false);
    };

    return (
        <VStack align="stretch" gap={2}>
            <Input
                placeholder={selectedIngredientId ? getSelectedIngredientName() : placeholder}
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                size={size}
                bg={colors.input.bg}
                color={colors.text.primary}
                borderColor={invalid ? 'red.500' : colors.border.default}
                _hover={{ borderColor: invalid ? 'red.600' : colors.border.hover }}
            />
            {isDropdownOpen && (
                <Box
                    position="relative"
                    maxH="250px"
                    overflowY="auto"
                    border="1px solid"
                    borderColor={colors.border.default}
                    borderRadius="md"
                    bg={colors.card.bg}
                    boxShadow="md"
                    zIndex={10}
                    css={{
                        '&::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: '#f1f1f1',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#888',
                            borderRadius: '10px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            background: '#555',
                        },
                    }}
                >
                    {getFilteredIngredients().length > 0 ? (
                        getFilteredIngredients().map(ing => (
                            <Box
                                key={ing.id}
                                p={3}
                                cursor="pointer"
                                bg={selectedIngredientId === String(ing.id) || selectedIngredientId === ing.id
                                    ? colors.bg.hover
                                    : colors.card.bg}
                                borderBottom="1px solid"
                                borderColor={colors.border.default}
                                _hover={{ bg: colors.bg.hover }}
                                onClick={() => handleSelect(String(ing.id))}
                                fontSize="sm"
                                transition="all 0.2s"
                            >
                                <Text fontWeight="500" color={colors.text.primary}>
                                    {ing.name}
                                </Text>
                                <Text fontSize="xs" color={colors.text.secondary}>
                                    Unit: {t(`units.${ing.unit}`)} • Category: {t(`categories.${ing.category}`)}
                                </Text>
                            </Box>
                        ))
                    ) : (
                        <Box p={4} textAlign="center">
                            <Text color={colors.text.secondary} fontSize="sm">
                                {t('grocerylist:edit.noIngredients')}
                            </Text>
                        </Box>
                    )}
                </Box>
            )}
        </VStack>
    );
};

export default SearchableIngredientSelect;
