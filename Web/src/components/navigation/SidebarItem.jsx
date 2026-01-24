import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Box, Text, Link, VStack } from '@chakra-ui/react';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useThemeColors';
import { ColorModeButton } from '../ui/color-mode';

const SidebarItem = ({ id, labelKey, href, children, level = 0, isFooter = false, isThemeToggle = false }) => {
  const { t } = useTranslation('navigation');
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const colors = useThemeColors();
  const hasChildren = children && children.length > 0;
  const isActive = href && location.pathname === href;

  const paddingLeft = level === 0 ? 3 : 3 + level * 4;

  if (isThemeToggle) {
    return (
      <Box px={paddingLeft} py={2}>
        <ColorModeButton width="full" size="sm" />
      </Box>
    );
  }

  if (hasChildren) {
    return (
      <Box>
        <Box
          px={paddingLeft}
          py={3}
          borderRadius="md"
          cursor="pointer"
          bg={isOpen ? colors.sidebar.item.active : colors.sidebar.item.default}
          borderLeft="3px solid transparent"
          _hover={{
            bg: colors.sidebar.item.hover,
            borderLeftColor: colors.text.brand,
          }}
          _focus={{ boxShadow: 'none', outline: 'none', border: 'none' }}
          _focusVisible={{ boxShadow: 'none', outline: 'none' }}
          _active={{ boxShadow: 'none', outline: 'none', border: 'none' }}
          onClick={() => setIsOpen(!isOpen)}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          transition="all 0.2s"
        >
          <Text fontWeight={level === 0 ? 'semibold' : 'medium'} fontSize="sm" color={colors.text.primary}>
            {t(labelKey)}
          </Text>
          <Box color={colors.text.secondary}>
            {isOpen ? <FiChevronDown size={18} /> : <FiChevronRight size={18} />}
          </Box>
        </Box>
        {isOpen && (
          <VStack align="stretch" spacing={0} mt={1}>
            {children.map((child) => (
              <SidebarItem key={child.id} {...child} level={level + 1} />
            ))}
          </VStack>
        )}
      </Box>
    );
  }

  return (
    <Link
      as={RouterLink}
      to={href}
      display="block"
      px={paddingLeft}
      py={3}
      borderRadius="md"
      bg={isFooter ? (isActive ? 'red.900' : 'transparent') : (isActive ? colors.sidebar.item.active : colors.sidebar.item.default)}
      borderLeft="3px solid"
      borderLeftColor={isFooter ? (isActive ? 'red.500' : 'transparent') : (isActive ? colors.text.brand : 'transparent')}
      _hover={{
        textDecoration: 'none',
        bg: isFooter ? 'red.900' : colors.sidebar.item.hover,
        borderLeftColor: isFooter ? 'red.500' : colors.text.brand,
      }}
      _focus={{ boxShadow: 'none', outline: 'none' }}
      _active={{ boxShadow: 'none', outline: 'none' }}
      _focusVisible={{ boxShadow: 'none', outline: 'none' }}
      transition="all 0.2s"
    >
      <Text
        fontWeight={isActive ? 'semibold' : 'medium'}
        fontSize="sm"
        color={isFooter ? (isActive ? 'red.400' : 'red.500') : (isActive ? colors.sidebar.item.activeText : colors.text.primary)}
      >
        {t(labelKey)}
      </Text>
    </Link>
  );
};

export default SidebarItem;