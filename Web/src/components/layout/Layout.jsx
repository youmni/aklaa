import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  VStack,
  Spinner,
  IconButton,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { FiMenu, FiX, FiShoppingCart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { sidebarItems, sidebarFooterItems } from '../navigation/sidebarConfig';
import SidebarItem from '../navigation/SidebarItem';
import { Outlet } from 'react-router-dom';
import { useThemeColors } from '../../hooks/useThemeColors';

const Layout = () => {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const colors = useThemeColors();

  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  const filterItems = (items) => {
    return items
      .map((item) => {
        if (item.hideWhenLoggedIn && user) {
          return null;
        }

        const hasAccess =
          !item.roles ||
          item.roles.length === 0 ||
          (user && item.roles.includes(user.userType));

        if (!hasAccess) return null;

        if (item.children) {
          const filteredChildren = filterItems(item.children);
          if (filteredChildren.length === 0) return null;
          return { ...item, children: filteredChildren };
        }

        return item;
      })
      .filter(Boolean);
  };

  const filteredItems = filterItems(sidebarItems);
  const filteredFooterItems = filterItems(sidebarFooterItems);

  const hasCartAccess = user && (user.userType === 'USER' || user.userType === 'ADMIN');

  return (
    <Box minH="100vh" position="relative" bg={colors.bg.page}>
      <Flex
        as="header"
        justify="space-between"
        align="center"
        bg={colors.bg.page}
        borderBottom="1px solid"
        borderColor={colors.border.default}
        px={6}
        py={4}
        shadow="sm"
        position="sticky"
        top="0"
        zIndex="1100"
      >
        <Text fontWeight="bold" fontSize="2xl" color={colors.text.brand}>
          Aklaa
        </Text>
        
        <HStack gap={2}>
          {hasCartAccess && (
            <Box
              as="button"
              onClick={() => navigate('/cart')}
              cursor="pointer"
              p={2}
              borderRadius="md"
              transition="all 0.2s"
              _hover={{ bg: colors.bg.hover }}
              color={colors.text.brand}
            >
              <FiShoppingCart size={24} />
            </Box>
          )}
          
          <Box
            display={{ base: 'block', md: 'none' }}
            cursor="pointer"
            onClick={() => setIsOpen(!isOpen)}
            p={2}
            borderRadius="md"
            _hover={{ bg: colors.bg.hover }}
            color={colors.text.brand}
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </Box>
        </HStack>
      </Flex>

      <Flex>
        <Box
          as="nav"
          bg={colors.sidebar.bg}
          borderRight="1px solid"
          borderColor={colors.border.default}
          w={{ base: '0', md: '260px' }}
          display={{ base: 'none', md: 'flex' }}
          flexDirection="column"
          justifyContent="space-between"
          p={3}
          position="sticky"
          top="73px"
          height="calc(100vh - 73px)"
          overflowY="auto"
        >
          <VStack align="stretch" spacing={1}>
            {filteredItems.map((item) => (
              <SidebarItem key={item.id} {...item} />
            ))}
          </VStack>
          <VStack align="stretch" spacing={1} mt={4} pt={4} borderTop="1px solid" borderColor={colors.border.default}>
            {filteredFooterItems.map((item) => (
              <SidebarItem key={item.id} {...item} isFooter={true} />
            ))}
          </VStack>
        </Box>

        {isOpen && (
          <Box
            position="fixed"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="rgba(0,0,0,0.6)"
            zIndex="1090"
            display={{ base: 'block', md: 'none' }}
            onClick={() => setIsOpen(false)}
          />
        )}

        <Box
          as="nav"
          position="fixed"
          top="73px"
          left={isOpen ? '0' : '-280px'}
          bottom="0"
          w="280px"
          bg={colors.sidebar.bg}
          zIndex="1095"
          display={{ base: 'flex', md: 'none' }}
          flexDirection="column"
          justifyContent="space-between"
          transition="left 0.3s ease"
          shadow="xl"
          overflowY="auto"
        >
          <Box p={3}>
            <VStack align="stretch" spacing={1}>
              {filteredItems.map((item) => (
                <SidebarItem key={item.id} {...item} />
              ))}
            </VStack>
          </Box>
          <Box p={3} borderTop="1px solid" borderColor={colors.border.default}>
            <VStack align="stretch" spacing={1}>
              {filteredFooterItems.map((item) => (
                <SidebarItem key={item.id} {...item} isFooter={true} />
              ))}
            </VStack>
          </Box>
        </Box>

        <Box flex="1" bg={colors.bg.primary} minH="calc(100vh - 73px)">
          <Outlet />
        </Box>
      </Flex>
    </Box>
  );
};

export default Layout;