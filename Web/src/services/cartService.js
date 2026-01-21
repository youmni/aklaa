import api from '../api/axiosConfig';

/**
 * Shopping Cart Service
 * Handles all shopping cart-related API calls
 */

const cartService = {
  /**
   * Get shopping cart
   * @returns {Promise} Cart data
   */
  getCart: async () => {
    const response = await api.get('/cart');
    return response;
  },

  /**
   * Add item to cart
   * @param {Object} itemData - Item data (dishId, servings, weekPlanning)
   * @returns {Promise} Add response
   */
  addToCart: async (itemData) => {
    return api.post('/cart/add', itemData);
  },

  /**
   * Update cart item
   * @param {number|string} itemId - Cart item ID
   * @param {Object} updateData - Update data (servings, weekPlanning)
   * @returns {Promise} Update response
   */
  updateCartItem: async (itemId, updateData) => {
    return api.put(`/cart/edit/${itemId}`, updateData);
  },

  /**
   * Delete cart item
   * @param {number|string} itemId - Cart item ID
   * @returns {Promise} Delete response
   */
  deleteCartItem: async (itemId) => {
    return api.delete(`/cart/delete/${itemId}`);
  },

  /**
   * Clear entire cart
   * @returns {Promise} Clear response
   */
  clearCart: async () => {
    return api.delete('/cart/clear');
  },
};

export default cartService;
