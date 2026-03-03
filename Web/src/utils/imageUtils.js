/**
 * Image utility functions
 */

/**
 * Convert blob to base64 data URL
 * @param {Blob} blob - The blob to convert
 * @returns {Promise<string>} Base64 data URL
 */
export const blobToDataURL = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Check if URL is from Azure Blob Storage
 * @param {string} url - The URL to check
 * @returns {boolean} True if Azure URL
 */
export const isAzureBlobUrl = (url) => {
  return url.includes('blob.core.windows.net');
};