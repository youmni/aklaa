import api from '../api/axiosConfig';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

const authService = {
  /**
   * Login user with credentials
   * @param {Object} credentials - User credentials (email, password)
   * @returns {Promise} Login response
   */
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response;
  },

  /**
   * Logout current user
   * @returns {Promise} Logout response
   */
  logout: async () => {
    return api.post('/auth/logout');
  },

/**
 * Register new user
 * @param {Object} userData - User registration data
 * @returns {Promise} Registration response
 */
register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response;
},

  /**
   * Get current authenticated user
   * @returns {Promise} User data
   */
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response;
  },

  /**
   * Refresh authentication token
   * @returns {Promise} Refresh response
   */
  refresh: async () => {
    return api.post('/auth/refresh');
  },

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise} Reset request response
   */
  requestPasswordReset: async (email) => {
    const response = await api.post('/auth/reset-password', { email });
    return response;
  },

  /**
   * Validate password reset token
   * @param {string} token - Reset token
   * @returns {Promise} Validation response
   */
  validateResetToken: async (token) => {
    return api.get(`/auth/reset-password?token=${token}`);
  },

  /**
   * Confirm password reset with new password
   * @param {Object} resetData - Reset data (token, newPassword)
   * @returns {Promise} Reset confirmation response
   */
  confirmPasswordReset: async (resetData) => {
    const response = await api.post('/auth/reset-password/confirm', resetData);
    return response;
  },

  /**
   * Reset password for authenticated user
   * @param {Object} passwordData - Current and new password
   * @returns {Promise} Password reset response
   */
  resetPassword: async (passwordData) => {
    const response = await api.put('/auth/reset-password', passwordData);
    return response;
  },
};

export default authService;
