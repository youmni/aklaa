import api from '../api/axiosConfig';

/**
 * Image Service
 * Handles all image-related API calls
 */

const imageService = {
  /**
   * Upload image
   * @param {FormData} formData - Form data with image file
   * @returns {Promise} Upload response with image URL
   */
  uploadImage: async (formData) => {
    const response = await api.post('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },
};

export default imageService;
