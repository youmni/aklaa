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
    id: 'home',
    label: 'Home',
    href: '/',
    roles: ['USER', 'ADMIN'],
  },
  {
    id: 'logout',
    label: 'Logout',
    href: '/auth/logout',
    roles: ['USER', 'ADMIN'],
  },
];