import { useColorModeValue } from '../components/ui/color-mode';

/**
 * Central theme colors hook for consistent dark/light mode colors across the app
 * @returns {Object} Theme colors object with all color tokens
 */
export const useThemeColors = () => {
  return {
    bg: {
      primary: useColorModeValue('white', '#1a1f2e'),
      secondary: useColorModeValue('gray.50', '#1a1f2e'),
      tertiary: useColorModeValue('gray.100', '#252d3a'),
      hover: useColorModeValue('gray.100', 'whiteAlpha.200'),
      active: useColorModeValue('gray.200', 'whiteAlpha.300'),
      page: useColorModeValue('gray.50', '#1a1f2e'),
    },

    text: {
      primary: useColorModeValue('gray.900', 'gray.50'),
      secondary: useColorModeValue('gray.600', 'gray.300'),
      tertiary: useColorModeValue('gray.500', 'gray.400'),
      brand: useColorModeValue('#083951', 'cyan.300'),
      brandHover: useColorModeValue('#0a4a68', 'cyan.200'),
      link: useColorModeValue('blue.600', 'blue.300'),
      error: useColorModeValue('red.600', 'red.400'),
      success: useColorModeValue('green.600', 'green.400'),
      warning: useColorModeValue('orange.600', 'orange.300'),
      muted: useColorModeValue('gray.500', 'gray.500'),
      placeholder: useColorModeValue('gray.400', 'gray.500'),
    },

    border: {
      default: useColorModeValue('gray.200', 'gray.700'),
      light: useColorModeValue('gray.100', 'gray.750'),
      hover: useColorModeValue('gray.300', 'gray.600'),
      focus: useColorModeValue('blue.500', 'blue.400'),
      error: useColorModeValue('red.500', 'red.400'),
    },

    card: {
      bg: useColorModeValue('white', '#1e2530'),
      bgAlt: useColorModeValue('white', '#252d3a'),
      border: useColorModeValue('gray.200', 'gray.700'),
      hover: useColorModeValue('gray.50', '#252d3a'),
      shadow: useColorModeValue('md', 'dark-lg'),
    },

    sidebar: {
      bg: useColorModeValue('white', '#1a1f2e'),
      border: useColorModeValue('gray.200', 'gray.800'),
      item: {
        default: useColorModeValue('transparent', 'transparent'),
        hover: useColorModeValue('gray.100', 'whiteAlpha.100'),
        active: useColorModeValue('blue.50', 'cyan.900'),
        activeText: useColorModeValue('blue.700', 'cyan.300'),
      },
    },

    header: {
      bg: useColorModeValue('white', 'gray.900'),
      border: useColorModeValue('gray.200', 'gray.800'),
    },

    button: {
      primary: {
        bg: useColorModeValue('#083951', 'cyan.600'),
        hover: useColorModeValue('#0a4a63', 'cyan.500'),
        text: useColorModeValue('white', 'white'),
      },
      secondary: {
        bg: useColorModeValue('gray.100', 'gray.700'),
        bgHover: useColorModeValue('gray.200', 'gray.600'),
        text: useColorModeValue('gray.900', 'gray.100'),
      },
      danger: {
        bg: useColorModeValue('red.600', 'red.500'),
        bgHover: useColorModeValue('red.700', 'red.400'),
        text: useColorModeValue('white', 'white'),
      },
    },

    input: {
      bg: useColorModeValue('white', '#252d3a'),
      bgFocus: useColorModeValue('white', '#2a3340'),
      border: useColorModeValue('gray.300', 'gray.600'),
      borderFocus: useColorModeValue('blue.500', 'cyan.400'),
      placeholder: useColorModeValue('gray.400', 'gray.500'),
      text: useColorModeValue('gray.900', 'gray.100'),
    },

    modal: {
      overlay: useColorModeValue('rgba(0, 0, 0, 0.48)', 'rgba(0, 0, 0, 0.8)'),
      bg: useColorModeValue('white', 'gray.800'),
      border: useColorModeValue('gray.200', 'gray.700'),
    },

    table: {
      header: useColorModeValue('gray.50', 'gray.800'),
      row: useColorModeValue('white', 'gray.900'),
      rowHover: useColorModeValue('gray.50', 'gray.800'),
      border: useColorModeValue('gray.200', 'gray.700'),
    },

    badge: {
      bg: useColorModeValue('gray.100', 'gray.700'),
      text: useColorModeValue('gray.700', 'gray.100'),
    },

    icon: {
      view: {
        default: useColorModeValue('green.600', 'cyan.400'),
        hover: useColorModeValue('green.700', 'cyan.300'),
      },
      edit: {
        default: useColorModeValue('blue.600', 'purple.400'),
        hover: useColorModeValue('blue.700', 'purple.300'),
      },
      delete: {
        default: useColorModeValue('red.600', 'red.400'),
        hover: useColorModeValue('red.700', 'red.300'),
      },
    },

    shadow: {
      sm: useColorModeValue('sm', 'dark-lg'),
      md: useColorModeValue('md', 'dark-lg'),
      lg: useColorModeValue('lg', '2xl'),
    },

    divider: useColorModeValue('gray.200', 'gray.700'),
  };
};
