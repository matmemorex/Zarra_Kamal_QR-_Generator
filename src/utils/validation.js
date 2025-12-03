/**
 * Validate product form data
 * @param {Object} formData - Form data object
 * @returns {Object} Object containing validation errors (empty if valid)
 */
export const validateProductForm = (formData) => {
  const errors = {};

  // Required field validations
  if (!formData.productName?.trim()) {
    errors.productName = 'Product name is required';
  }

  if (!formData.colour?.trim()) {
    errors.colour = 'Colour is required';
  }

  // Units validation
  if (formData.units < 1 || formData.units > 100) {
    errors.units = 'Units must be between 1 and 100';
  }

  // URL validation (optional field)
  if (formData.productUrl && !formData.productUrl.match(/^https?:\/\/.+/)) {
    errors.productUrl = 'Please enter a valid URL starting with http:// or https://';
  }

  return errors;
};
