import {
  Box,
  Button,
  Grid,
  IconButton,
  Input,
  Text,
  Popover,
  Portal,
} from "@chakra-ui/react";
import { useState } from "react";
import { formatDateEU, isSameDay } from "../../utils/dateUtils";
import { useThemeColors } from "../../hooks/useThemeColors";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const DatePicker = ({ value, onChange, placeholder = "DD/MM/YYYY" }) => {
  const colors = useThemeColors();
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    value ? new Date(value) : new Date()
  );

  const startOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const startDay = (startOfMonth.getDay() + 6) % 7;

  const days = Array.from({ length: startDay + daysInMonth });

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <Popover.Root
      open={isOpen}
      onOpenChange={(e) => setIsOpen(e.open)}
    >
      <Popover.Trigger asChild>
        <Input
          readOnly
          value={value ? formatDateEU(value) : ""}
          placeholder={placeholder}
          onClick={() => setIsOpen(true)}
          cursor="pointer"
          focusBorderColor={colors.text.brand}
          bg={colors.input.bg}
          borderColor={colors.border.default}
          color={colors.text.primary}
          size="md"
          borderRadius="lg"
        />
      </Popover.Trigger>

      <Portal>
        <Popover.Positioner>
          <Popover.Content width="300px" bg={colors.card.bg} borderColor={colors.border.default}>
            <Popover.Body>
              {/* Header */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <IconButton
                  aria-label="Previous month"
                  size="sm"
                  variant="ghost"
                  color={colors.text.primary}
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() - 1,
                        1
                      )
                    )
                  }
                >
                  <FaChevronLeft />
                </IconButton>
                <Text fontWeight="bold" color={colors.text.primary}>
                  {currentMonth.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
                <IconButton
                  aria-label="Next month"
                  size="sm"
                  variant="ghost"
                  color={colors.text.primary}
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() + 1,
                        1
                      )
                    )
                  }
                >
                  <FaChevronRight />
                </IconButton>
              </Box>

              {/* Weekdays */}
              <Grid templateColumns="repeat(7, 1fr)" mb={2}>
                {weekDays.map((d) => (
                  <Text key={d} fontSize="xs" textAlign="center" fontWeight="semibold" color={colors.text.secondary}>
                    {d}
                  </Text>
                ))}
              </Grid>

              {/* Days */}
              <Grid templateColumns="repeat(7, 1fr)" gap={1}>
                {days.map((_, index) => {
                  const day = index - startDay + 1;
                  if (day < 1 || day > daysInMonth) {
                    return <Box key={index} />;
                  }

                  const date = new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth(),
                    day
                  );

                  const selected = value && isSameDay(date, value);

                  return (
                    <Button
                      key={index}
                      size="sm"
                      variant={selected ? "solid" : "ghost"}
                      bg={selected ? colors.text.brand : "transparent"}
                      color={selected ? "white" : colors.text.primary}
                      _hover={{
                        bg: selected ? colors.text.brand : colors.bg.hover,
                      }}
                      onClick={() => {
                        onChange(date);
                        setIsOpen(false);
                      }}
                    >
                      {day}
                    </Button>
                  );
                })}
              </Grid>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};

export default DatePicker;