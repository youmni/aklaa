import { FiHome, FiSettings, FiLogIn, FiUserPlus } from 'react-icons/fi';
import { FaTools } from 'react-icons/fa';

export const sidebarItems = [
  {
    id: 'auth',
    labelKey: 'sidebar.account',
    roles: [],
    children: [
      {
        id: 'login',
        labelKey: 'sidebar.login',
        href: '/auth/login',
        roles: [],
        hideWhenLoggedIn: true,
      },
      {
        id: 'register',
        labelKey: 'sidebar.register',
        href: '/auth/register',
        roles: [],
        hideWhenLoggedIn: true,
      },
    ],
  },
  {
    id: 'users',
    labelKey: 'sidebar.users',
    href: '/admin/users',
    roles: ['ADMIN'],
  },
  {
    id: 'groceries',
    labelKey: 'sidebar.groceries',
    roles: [],
    children: [
      {
        id: 'ingredients',
        labelKey: 'sidebar.ingredients',
        href: '/ingredients',
        roles: ['USER', 'ADMIN'],
      },
      {
        id: 'dishes',
        labelKey: 'sidebar.dishes',
        href: '/dishes',
        roles: ['USER', 'ADMIN'],
      }
    ],
  },
  {
    id: 'grocerylists',
    labelKey: 'sidebar.lists',
    href: '/grocerylists',
    roles: ['USER', 'ADMIN'],
  },
  {
    id: 'settings',
    labelKey: 'sidebar.settings',
    roles: [],
    children: [
      {
        id: 'export',
        labelKey: 'sidebar.exportData',
        href: '/settings/export',
        roles: ['USER', 'ADMIN'],
      },
            {
        id: 'profile',
        labelKey: 'sidebar.profile',
        href: '/settings/profile',
        roles: ['USER', 'ADMIN'],
      },
      {
        id: 'password-reset',
        labelKey: 'sidebar.resetPassword',
        href: '/settings/password-reset',
        roles: ['USER', 'ADMIN'],
      },
    ],
  },
];

export const sidebarFooterItems = [
  {
    id: 'logout',
    labelKey: 'sidebar.logout',
    href: '/auth/logout',
    roles: ['USER', 'ADMIN'],
    isFooter: true,
  },
];