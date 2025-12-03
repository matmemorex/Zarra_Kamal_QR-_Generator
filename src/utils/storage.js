const STORAGE_KEY = 'fashionProducts_v2';

/**
 * Load products from localStorage
 * @returns {Array} Array of products or empty array if none found
 */
export const loadProducts = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading products:', error);
  }
  return [];
};

/**
 * Save products to localStorage
 * @param {Array} products - Array of products to save
 */
export const saveProducts = (products) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving products:', error);
  }
};

/**
 * Clear all products from localStorage
 */
export const clearProducts = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing products:', error);
  }
};

/**
 * Export products data as JSON file
 * @param {Array} products - Array of products to export
 */
export const exportProductsData = (products) => {
  const dataStr = JSON.stringify(products, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `fashion-qr-data-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
};
