import api from '../api/axiosConfig';

/**
 * Dish Service
 * Handles all dish-related API calls
 */

const dishService = {
  /**
   * Get dishes with filters
   * @param {Object} filters - Filter parameters
   * @returns {Promise} Filtered dishes
   */
  getDishes: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    const response = await api.get(`/dishes/filter?${params.toString()}`);
    return response;
  },

  /**
   * Get dish by ID
   * @param {number|string} id - Dish ID
   * @returns {Promise} Dish data
   */
  getDishById: async (id) => {
    const response = await api.get(`/dishes/${id}`);
    return response;
  },

  /**
   * Create new dish
   * @param {Object} dishData - Dish data
   * @returns {Promise} Created dish
   */
  createDish: async (dishData) => {
    return api.post('/dishes', dishData);
  },

  /**
   * Update dish
   * @param {number|string} id - Dish ID
   * @param {Object} dishData - Updated dish data
   * @returns {Promise} Updated dish
   */
  updateDish: async (id, dishData) => {
    return api.put(`/dishes/${id}`, dishData);
  },

  /**
   * Delete dish
   * @param {number|string} id - Dish ID
   * @returns {Promise} Delete response
   */
  deleteDish: async (id) => {
    const response = await api.delete(`/dishes/${id}`);
    return response;
  },
};

export default dishService;
