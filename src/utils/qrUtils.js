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

/**
 * Generate product serial number in format: PREFIX-YEAR-INCREMENTAL
 * @param {string} prefix - Serial prefix (e.g., "ASL-TDG")
 * @param {number} year - Year (defaults to current year)
 * @param {number} counter - Incremental counter (6 digits)
 * @returns {string} Serial number in format: ASL-TDG-2025-000123
 */
export const generateProductSerial = (prefix, year, counter) => {
  const serialPrefix = (prefix || 'ASL-TDG').toUpperCase();
  const serialYear = year || new Date().getFullYear();
  const serialCounter = String(counter).padStart(6, '0');
  return `${serialPrefix}-${serialYear}-${serialCounter}`;
};

/**
 * Generate QR code data as JSON string
 * @param {Object} data - Product data object
 * @returns {string} JSON string for QR code
 */
export const generateQRData = (data) => {
  const qrData = {
    product_serial: data.product_serial,
    model_name: data.model_name,
    colour: data.colour,
    batch_no: data.batch_no,
    channel: data.channel,
    agent_id: data.agent_id
  };
  return JSON.stringify(qrData);
};

/**
 * Generate QR code URL that points to thank you page with product data
 * @param {Object} data - Product data object
 * @returns {string} URL string for QR code
 */
export const generateThankYouURL = (data) => {
  const qrData = {
    product_serial: data.product_serial,
    model_name: data.model_name,
    colour: data.colour,
    batch_no: data.batch_no,
    channel: data.channel,
    agent_id: data.agent_id
  };
  const jsonString = JSON.stringify(qrData);
  const encodedData = encodeURIComponent(jsonString);
  
  // Get the current origin (works for both localhost and production)
  // Use window.location.origin if available, otherwise construct from protocol and host
  let origin;
  if (typeof window !== 'undefined' && window.location) {
    origin = window.location.origin;
    // For SPA, use hash-based routing or query params
    // Using query params which works better for QR codes
    return `${origin}/?thank-you=1&data=${encodedData}`;
  } else {
    // Fallback for server-side rendering or testing
    origin = 'https://yourfashionbrand.com';
    return `${origin}/?thank-you=1&data=${encodedData}`;
  }
};
