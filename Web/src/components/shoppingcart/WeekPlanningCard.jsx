import { Box, HStack, Heading, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useThemeColors';
import DatePicker from '../ui/DatePicker';
import { dateToISO, isoToDate } from '../../utils/dateUtils';

const WeekPlanningCard = ({ startOfWeek, endOfWeek, onStartChange, onEndChange }) => {
    const { t } = useTranslation('cart');
    const colors = useThemeColors();

    const handleStartDateChange = (date) => {
        onStartChange(dateToISO(date));
    };

    const handleEndDateChange = (date) => {
        onEndChange(dateToISO(date));
    };

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
                    <DatePicker
                        value={isoToDate(startOfWeek)}
                        onChange={handleStartDateChange}
                        placeholder="DD/MM/YYYY"
                    />
                </VStack>
                <VStack align="stretch" flex={1} gap={2}>
                    <Text fontSize="sm" fontWeight="600" color={colors.text.primary}>
                        {t('weekPlanning.endDate')}
                    </Text>
                    <DatePicker
                        value={isoToDate(endOfWeek)}
                        onChange={handleEndDateChange}
                        placeholder="DD/MM/YYYY"
                    />
                </VStack>
            </HStack>
        </Box>
    );
};

export default WeekPlanningCard;