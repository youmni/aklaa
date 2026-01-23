import { Box, HStack, Heading, Input, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const WeekPlanningCard = ({ startOfWeek, endOfWeek, onStartChange, onEndChange }) => {
    const { t } = useTranslation('cart');
    return (
        <Box
            bg="white"
            borderRadius="xl"
            p={6}
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.200"
        >
            <Heading size="sm" mb={4} color="#083951">
                {t('weekPlanning.selectWeek')}
            </Heading>
            <HStack gap={6} align="start">
                <VStack align="stretch" flex={1} gap={2}>
                    <Text fontSize="sm" fontWeight="600" color="gray.700">
                        {t('weekPlanning.selectWeek')}
                    </Text>
                    <Input
                        type="date"
                        value={startOfWeek}
                        onChange={(e) => onStartChange(e.target.value)}
                        focusBorderColor="#083951"
                        size="md"
                        borderRadius="lg"
                    />
                </VStack>
                <VStack align="stretch" flex={1} gap={2}>
                    <Text fontSize="sm" fontWeight="600" color="gray.700">
                        {t('weekPlanning.selectWeek')}
                    </Text>
                    <Input
                        type="date"
                        value={endOfWeek}
                        onChange={(e) => onEndChange(e.target.value)}
                        focusBorderColor="#083951"
                        size="md"
                        borderRadius="lg"
                    />
                </VStack>
            </HStack>
        </Box>
    );
};

export default WeekPlanningCard;