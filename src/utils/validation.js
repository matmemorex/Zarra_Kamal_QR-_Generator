/**
 * Validate product form data
 * @param {Object} formData - Form data object
 * @returns {Object} Object containing validation errors (empty if valid)
 */
export const validateProductForm = (formData) => {
  const errors = {};

  // Required field validations
  // Product name is optional

  // Model name is required (or will use productName as fallback)
  if (!formData.model_name?.trim() && !formData.productName?.trim()) {
    errors.model_name = 'Model name is required (or provide Product Name)';
  }

  if (!formData.colour?.trim()) {
    errors.colour = 'Colour is required';
  }

  if (!formData.batch_no?.trim()) {
    errors.batch_no = 'Batch number is required';
  }

  if (!formData.channel?.trim()) {
    errors.channel = 'Channel is required';
  }

  if (!formData.agent_id || formData.agent_id === '') {
    errors.agent_id = 'Agent ID is required';
  } else if (isNaN(parseInt(formData.agent_id)) || parseInt(formData.agent_id) < 0) {
    errors.agent_id = 'Agent ID must be a valid number (0 or greater)';
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
