/**
 * Generate Base ID by combining SKU, colour, size, and variant
 * @param {string} sku - Stock Keeping Unit
 * @param {string} colour - Product colour
 * @param {string} size - Product size
 * @param {string} variant - Product variant (optional)
 * @returns {string} Base ID in format: SKU-COLOUR-SIZE-VARIANT
 */
export const generateBaseId = (sku, colour, size, variant) => {
  const parts = [sku, colour, size, variant].filter(Boolean);
  return parts.join('-').toUpperCase().replace(/\s+/g, '-').replace(/[^A-Z0-9-]/g, '');
};

/**
 * Generate unique code for individual unit
 * @param {string} baseId - Base product ID
 * @param {number} unitNumber - Unit number (1, 2, 3...)
 * @param {number} timestamp - Timestamp for uniqueness
 * @returns {string} Unique code in format: BASEID-TIMESTAMP36-UUNIT
 */
export const generateUniqueCode = (baseId, unitNumber, timestamp) => {
  const shortTimestamp = timestamp.toString(36).toUpperCase();
  const paddedUnit = String(unitNumber).padStart(3, '0');
  return `${baseId}-${shortTimestamp}-U${paddedUnit}`;
};

/**
 * Download canvas as PNG file
 * @param {HTMLCanvasElement} canvas - Canvas element to download
 * @param {string} filename - Filename for download
 */
export const downloadCanvas = (canvas, filename) => {
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

/**
 * Generate product URL from SKU if no custom URL provided
 * @param {string} sku - Stock Keeping Unit
 * @param {string} customUrl - Custom URL (optional)
 * @returns {string} Product URL
 */
export const generateProductUrl = (sku, customUrl) => {
  if (customUrl) return customUrl;
  return `https://yourfashionbrand.com/product/${sku.toLowerCase().replace(/\s+/g, '-')}`;
};
