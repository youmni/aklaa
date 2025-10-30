import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Box, Text, Link, VStack } from '@chakra-ui/react';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';

const SidebarItem = ({ id, label, href, children, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const hasChildren = children && children.length > 0;
  const isActive = href && location.pathname === href;

  const paddingLeft = level === 0 ? 3 : 3 + level * 4;

  if (hasChildren) {
    return (
      <Box>
        <Box
          px={paddingLeft}
          py={3}
          borderRadius="md"
          cursor="pointer"
          bg={isOpen ? 'blue.50' : 'transparent'}
          borderLeft="3px solid transparent"
          _hover={{
            bg: 'blue.50',
            borderLeftColor: '#083951',
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
          <Text fontWeight={level === 0 ? 'semibold' : 'medium'} fontSize="sm" color="gray.700">
            {label}
          </Text>
          <Box color="gray.500">
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
      _hover={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none', outline: 'none' }}
      _active={{ boxShadow: 'none', outline: 'none' }}
      _focusVisible={{ boxShadow: 'none', outline: 'none' }}
    >
      <Box
        px={paddingLeft}
        py={3}
        borderRadius="md"
        bg={isActive ? 'blue.50' : 'transparent'}
        borderLeft="3px solid"
        borderLeftColor={isActive ? '#083951' : 'transparent'}
        _hover={{
          bg: 'blue.50',
          borderLeftColor: '#083951',
        }}
        _focus={{ boxShadow: 'none', outline: 'none', border: 'none' }}
        _focusVisible={{ boxShadow: 'none', outline: 'none' }}
        _active={{ boxShadow: 'none', outline: 'none', border: 'none' }}
        transition="all 0.2s"
      >
        <Text
          fontWeight={isActive ? 'semibold' : 'medium'}
          fontSize="sm"
          color={isActive ? 'blue.700' : 'gray.700'}
        >
          {label}
        </Text>
      </Box>
    </Link>
  );
};

export default SidebarItem;