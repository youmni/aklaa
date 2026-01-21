import api from '../api/axiosConfig';

/**
 * Ingredient Service
 * Handles all ingredient-related API calls
 */

const ingredientService = {
  /**
   * Get all ingredients
   * @returns {Promise} All ingredients
   */
  getAllIngredients: async () => {
    const response = await api.get('/ingredients/all');
    return response;
  },

  /**
   * Get ingredients with filters and pagination
   * @param {Object} filters - Filter parameters
   * @returns {Promise} Filtered ingredients
   */
  getIngredients: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    const response = await api.get(`/ingredients?${params.toString()}`);
    return response;
  },

  /**
   * Get ingredient by ID
   * @param {number|string} id - Ingredient ID
   * @returns {Promise} Ingredient data
   */
  getIngredientById: async (id) => {
    const response = await api.get(`/ingredients/${id}`);
    return response;
  },

  /**
   * Create new ingredient
   * @param {Object} ingredientData - Ingredient data
   * @returns {Promise} Created ingredient
   */
  createIngredient: async (ingredientData) => {
    const response = await api.post('/ingredients', ingredientData);
    return response;
  },

  /**
   * Update ingredient
   * @param {number|string} id - Ingredient ID
   * @param {Object} ingredientData - Updated ingredient data
   * @returns {Promise} Updated ingredient
   */
  updateIngredient: async (id, ingredientData) => {
    const response = await api.put(`/ingredients/${id}`, ingredientData);
    return response;
  },

  /**
   * Delete ingredient
   * @param {number|string} id - Ingredient ID
   * @returns {Promise} Delete response
   */
  deleteIngredient: async (id) => {
    return api.delete(`/ingredients/${id}`);
  },
};

export default ingredientService;
