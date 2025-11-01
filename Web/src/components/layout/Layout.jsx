import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  VStack,
  Spinner,
} from '@chakra-ui/react';
import { FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { sidebarItems, sidebarFooterItems } from '../navigation/sidebarConfig';
import SidebarItem from '../navigation/SidebarItem';
import { Outlet } from 'react-router-dom';

const Layout = ({ children }) => {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <Box minH="100vh" position="relative">
      <Flex
        as="header"
        justify="space-between"
        align="center"
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.200"
        px={6}
        py={4}
        shadow="sm"
        position="sticky"
        top="0"
        zIndex="1100"
      >
        <Text fontWeight="bold" fontSize="2xl" color="#083951">
          Aklaa
        </Text>
        <Box
          display={{ base: 'block', md: 'none' }}
          cursor="pointer"
          onClick={() => setIsOpen(!isOpen)}
          p={2}
          borderRadius="md"
          _hover={{ bg: 'gray.100' }}
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </Box>
      </Flex>

      <Flex>
        <Box
          as="nav"
          bg="white"
          borderRight="1px solid"
          borderColor="gray.200"
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
          <VStack align="stretch" spacing={1} mt={4} pt={4} borderTop="1px solid" borderColor="gray.200">
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
          bg="white"
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
          <Box p={3} borderTop="1px solid" borderColor="gray.200">
            <VStack align="stretch" spacing={1}>
              {filteredFooterItems.map((item) => (
                <SidebarItem key={item.id} {...item} isFooter={true} />
              ))}
            </VStack>
          </Box>
        </Box>

        <Box flex="1" bg="gray.50" minH="calc(100vh - 73px)">
          <Outlet />
        </Box>
      </Flex>
    </Box>
  );
};

export default Layout;