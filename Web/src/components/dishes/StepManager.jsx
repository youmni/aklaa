import { 
    Box, 
    Button, 
    Textarea, 
    IconButton, 
    Text,
    HStack,
    VStack,
    Flex
} from '@chakra-ui/react';
import { Field } from '../ui/field';
import { FaPlus, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const StepManager = ({ steps, onChange, errors = {} }) => {
    const handleAddStep = () => {
        onChange([...steps, { stepText: '' }]);
    };

    const handleRemoveStep = (index) => {
        onChange(steps.filter((_, i) => i !== index));
    };

    const handleStepChange = (index, value) => {
        onChange(steps.map((step, i) =>
            i === index ? { ...step, stepText: value } : step
        ));
    };

    const handleMoveStepUp = (index) => {
        if (index === 0) return;
        const newSteps = [...steps];
        [newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]];
        onChange(newSteps);
    };

    const handleMoveStepDown = (index) => {
        if (index === steps.length - 1) return;
        const newSteps = [...steps];
        [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
        onChange(newSteps);
    };

    return (
        <Field
            label="Cooking Steps"
            mb={4}
            invalid={!!errors.steps}
            errorText={errors.steps}
        >
            <Flex justify="flex-end" align="center" mb={4}>
                <Button
                    size="md"
                    onClick={handleAddStep}
                    type="button"
                    bg="#083951"
                    color="white"
                    _hover={{ bg: '#0a4960' }}
                    px={6}
                    isDisabled={steps.length >= 50}
                >
                    <FaPlus style={{ marginRight: '8px' }} /> Add Step
                </Button>
            </Flex>

            <Box 
                maxH="420px" 
                overflowY="auto" 
                p={4}
                bg="white"
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.200"
                boxShadow="sm"
            >
                <VStack align="stretch" gap={3}>
                    {steps.length === 0 ? (
                        <Box textAlign="center" py={12}>
                            <Text color="#083951" fontSize="lg" fontWeight="medium">No steps added yet</Text>
                            <Text color="gray.500" fontSize="sm" mt={2}>Click "Add Step" to get started</Text>
                        </Box>
                    ) : (
                        steps.map((step, index) => (
                            <Box 
                                key={index} 
                                p={4} 
                                bg="white" 
                                borderRadius="md" 
                                border="1px solid" 
                                borderColor="gray.200"
                            >
                                <HStack align="flex-start" gap={3}>
                                    <VStack gap={2} pt={2}>
                                        <IconButton
                                            variant="ghost"
                                            onClick={() => handleMoveStepUp(index)}
                                            isDisabled={index === 0}
                                            aria-label="Move step up"
                                            size="sm"
                                            color={index === 0 ? 'gray.300' : '#083951'}
                                        >
                                            <FaArrowUp />
                                        </IconButton>
                                        <IconButton
                                            variant="ghost"
                                            onClick={() => handleMoveStepDown(index)}
                                            isDisabled={index === steps.length - 1}
                                            aria-label="Move step down"
                                            size="sm"
                                            color={index === steps.length - 1 ? 'gray.300' : '#083951'}
                                        >
                                            <FaArrowDown />
                                        </IconButton>
                                    </VStack>
                                    <Box flex={1}>
                                        <Field
                                            label={<Text color="gray.700" fontWeight="medium">Step {index + 1}</Text>}
                                            invalid={!!errors[`step_${index}`]}
                                            errorText={errors[`step_${index}`]}
                                        >
                                            <Textarea
                                                placeholder=" Describe this cooking step..."
                                                value={step.stepText}
                                                onChange={(e) => handleStepChange(index, e.target.value)}
                                                rows={3}
                                                size="lg"
                                                bg="white"
                                                borderColor="gray.200"
                                                _hover={{ borderColor: 'gray.300' }}
                                            />
                                            <Text fontSize="sm" color="gray.500" mt={1}>
                                                {step.stepText.length}/255 characters
                                            </Text>
                                        </Field>
                                    </Box>
                                    <Box pt={8}>
                                        <IconButton
                                            colorScheme="red"
                                            variant="ghost"
                                            onClick={() => handleRemoveStep(index)}
                                            aria-label="Remove step"
                                            size="lg"
                                            color="red.500"
                                        >
                                            <FaTrash />
                                        </IconButton>
                                    </Box>
                                </HStack>
                            </Box>
                        ))
                    )}
                </VStack>
            </Box>
        </Field>
    );
};

export default StepManager;