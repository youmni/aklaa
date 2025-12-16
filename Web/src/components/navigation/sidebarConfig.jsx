import { FiHome, FiSettings, FiLogIn, FiUserPlus } from 'react-icons/fi';
import { FaTools } from 'react-icons/fa';

export const sidebarItems = [
  {
    id: 'auth',
    label: 'Account',
    roles: [],
    children: [
      {
        id: 'login',
        label: 'Login',
        href: '/auth/login',
        roles: [],
        hideWhenLoggedIn: true,
      },
      {
        id: 'register',
        label: 'Register',
        href: '/auth/register',
        roles: [],
        hideWhenLoggedIn: true,
      },
    ],
  },
  {
    id: 'users',
    label: 'Users',
    href: '/admin/users',
    roles: ['ADMIN'],
  },
  {
    id: 'groceries',
    label: 'Groceries',
    roles: [],
    children: [
      {
        id: 'ingredients',
        label: 'Ingredients',
        href: '/ingredients',
        roles: ['USER', 'ADMIN'],
      },
      {
        id: 'dishes',
        label: 'Dishes',
        href: '/dishes',
        roles: ['USER', 'ADMIN'],
      }
    ],
  },
  {
    id: 'grocerylists',
    label: 'Lists',
    href: '/grocerylists',
    roles: ['USER', 'ADMIN'],
  },
  {
    id: 'settings',
    label: 'Settings',
    roles: [],
    children: [
      {
        id: 'export',
        label: 'Export User Data',
        href: '/settings/export',
        roles: ['USER', 'ADMIN'],
      }
    ],
  },
];

export const sidebarFooterItems = [
  {
    id: 'logout',
    label: 'Logout',
    href: '/auth/logout',
    roles: ['USER', 'ADMIN'],
    isFooter: true,
  },
];