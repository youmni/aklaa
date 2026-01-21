import api from '../api/axiosConfig';

/**
 * User Service
 * Handles all user-related API calls
 */

const userService = {
  /**
   * Get all users (admin)
   * @param {Object} params - Query parameters
   * @returns {Promise} Users list
   */
  getUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response;
  },

  /**
   * Update user email
   * @param {Object} emailData - New email data
   * @returns {Promise} Update response
   */
  updateEmail: async (emailData) => {
    return api.put('/users/email', emailData);
  },

  /**
   * Update user role (admin)
   * @param {number|string} userId - User ID
   * @param {string} newRole - New role
   * @returns {Promise} Update response
   */
  updateUserRole: async (userId, newRole) => {
    return api.put(`/users/${userId}`, null, { params: { type: newRole } });
  },

  /**
   * Enable user account (admin)
   * @param {number|string} userId - User ID
   * @returns {Promise} Enable response
   */
  enableUser: async (userId) => {
    return api.put(`/users/enable/${userId}`);
  },

  /**
   * Delete user (admin or self)
   * @param {number|string} userId - User ID (optional, deletes current user if not provided)
   * @returns {Promise} Delete response
   */
  deleteUser: async (userId = null) => {
    if (userId) {
      return api.delete(`/users/${userId}`);
    }
    return api.delete('/users');
  },

  /**
   * Export user data
   * @returns {Promise} Exported data blob
   */
  exportUserData: async () => {
    const response = await api.get('/users/data/export', { responseType: 'blob' });
    return response;
  },
};

export default userService;
