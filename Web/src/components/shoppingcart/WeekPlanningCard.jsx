import { Box, HStack, Heading, Input, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useThemeColors';

const WeekPlanningCard = ({ startOfWeek, endOfWeek, onStartChange, onEndChange }) => {
    const { t } = useTranslation('cart');
    const colors = useThemeColors();
    return (
        <Box
            bg={colors.card.bg}
            borderRadius="xl"
            p={6}
            boxShadow={colors.card.shadow}
            border="1px solid"
            borderColor={colors.border.default}
        >
            <Heading size="sm" mb={4} color={colors.text.brand}>
                {t('weekPlanning.title')}
            </Heading>
            <HStack gap={6} align="start">
                <VStack align="stretch" flex={1} gap={2}>
                    <Text fontSize="sm" fontWeight="600" color={colors.text.primary}>
                        {t('weekPlanning.startDate')}
                    </Text>
                    <Input
                        type="date"
                        value={startOfWeek}
                        onChange={(e) => onStartChange(e.target.value)}
                        focusBorderColor={colors.text.brand}
                        bg={colors.input.bg}
                        borderColor={colors.border.default}
                        color={colors.text.primary}
                        size="md"
                        borderRadius="lg"
                    />
                </VStack>
                <VStack align="stretch" flex={1} gap={2}>
                    <Text fontSize="sm" fontWeight="600" color={colors.text.primary}>
                        {t('weekPlanning.endDate')}
                    </Text>
                    <Input
                        type="date"
                        value={endOfWeek}
                        onChange={(e) => onEndChange(e.target.value)}
                        focusBorderColor={colors.text.brand}
                        bg={colors.input.bg}
                        borderColor={colors.border.default}
                        color={colors.text.primary}
                        size="md"
                        borderRadius="lg"
                    />
                </VStack>
            </HStack>
        </Box>
    );
};

export default WeekPlanningCard;