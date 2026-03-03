import api from '../api/axiosConfig';
import { blobToDataURL, isAzureBlobUrl } from '../utils/imageUtils';

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

  /**
   * Proxy image through backend to avoid CORS issues
   * @param {string} imageUrl - The image URL to proxy
   * @returns {Promise<Blob>} Image blob
   */
  proxyImage: async (imageUrl) => {
    const response = await api.get('/images/proxy', {
      params: { url: imageUrl },
      responseType: 'blob'
    });
    return response.data;
  },

  /**
   * Fetch image as base64 data URL, handling CORS appropriately
   * @param {string} imageUrl - The image URL to fetch
   * @returns {Promise<string>} Base64 data URL
   */
  fetchImageAsDataURL: async (imageUrl) => {
    let blob;
    
    if (isAzureBlobUrl(imageUrl)) {
      // Use proxy for Azure Blob Storage to avoid CORS
      blob = await imageService.proxyImage(imageUrl);
    } else {
      // For Minio and other URLs, fetch directly
      const response = await fetch(imageUrl);
      blob = await response.blob();
    }
    
    return blobToDataURL(blob);
  },
};

export default imageService;