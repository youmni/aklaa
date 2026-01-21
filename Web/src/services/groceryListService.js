import api from '../api/axiosConfig';

/**
 * Grocery List Service
 * Handles all grocery list-related API calls
 */

const groceryListService = {
  /**
   * Get all grocery lists
   * @returns {Promise} All grocery lists
   */
  getGroceryLists: async () => {
    const response = await api.get('/grocerylists', {});
    return response;
  },

  /**
   * Get grocery list ingredients by ID
   * @param {number|string} id - Grocery list ID
   * @param {Object} params - Additional parameters
   * @returns {Promise} Grocery list ingredients
   */
  getGroceryListIngredients: async (id, params = {}) => {
    const response = await api.get(`/grocerylists/${id}/ingredients`, { params });
    return response;
  },

  /**
   * Update grocery list
   * @param {number|string} id - Grocery list ID
   * @param {Object} data - Updated grocery list data
   * @returns {Promise} Updated grocery list
   */
  updateGroceryList: async (id, data) => {
    return api.put(`/grocerylists/${id}`, data);
  },

  /**
   * Delete grocery list
   * @param {number|string} id - Grocery list ID
   * @returns {Promise} Delete response
   */
  deleteGroceryList: async (id) => {
    return api.delete(`/grocerylists/${id}`);
  },

  /**
   * Save cart to grocery list
   * @param {Object} params - Save parameters
   * @returns {Promise} Save response
   */
  saveCartToGroceryList: async (params = {}) => {
    return api.post('/grocerylists/save', null, { params });
  },
};

export default groceryListService;
