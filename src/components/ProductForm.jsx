import React, { useState } from 'react';
import { generateBaseId, generateUniqueCode, generateProductUrl } from '../utils/qrUtils';
import { validateProductForm } from '../utils/validation';

const autoGenerateSku = (formData, products = []) => {
  // Try to reuse SKU if colour + variant match an existing product
  const colour = (formData.colour || '').trim().toLowerCase();
  const variant = (formData.variant || '').trim().toLowerCase();

  if (colour) {
    const match = products.find((p) => {
      const pColour = (p.colour || '').trim().toLowerCase();
      const pVariant = (p.variant || '').trim().toLowerCase();
      return pColour === colour && pVariant === variant;
    });
    if (match?.sku) return match.sku;
  }

  // Otherwise generate a new SKU based on product name + colour
  const namePart = (formData.productName || 'PROD').slice(0, 3).toUpperCase().replace(/\s+/g, '');
  const colourPart = (formData.colour || 'GEN').slice(0, 3).toUpperCase().replace(/\s+/g, '');
  const uniquePart = Date.now().toString(36).toUpperCase().slice(-4);
  return `${namePart}${colourPart}-${uniquePart}`;
};

const ProductForm = ({ onSubmit, products }) => {
  const [formData, setFormData] = useState({
    sku: '',
    productName: '',
    colour: '',
    size: '',
    variant: '',
    units: 1,
    productUrl: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'units' ? Math.max(1, Math.min(100, parseInt(value) || 1)) : value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const workingData = {
      ...formData,
      sku: formData.sku || autoGenerateSku(formData, products),
    };

    const newErrors = validateProductForm(workingData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const baseId = generateBaseId(workingData.sku, workingData.colour, workingData.size, workingData.variant);
    const timestamp = Date.now();
    const units = [];

    const productUrl = generateProductUrl(workingData.sku, workingData.productUrl);

    for (let i = 1; i <= workingData.units; i++) {
      const uniqueCode = generateUniqueCode(baseId, i, timestamp + i);
      units.push({
        uniqueCode,
        scanned: false,
        scanDate: null,
        qrUrl: productUrl
      });
    }

    const newProduct = {
      id: timestamp,
      baseId,
      ...workingData,
      productUrl,
      units,
      createdAt: new Date().toISOString(),
      totalScanned: 0
    };

    onSubmit(newProduct);

    // Reset form
    setFormData({
      sku: '',
      productName: '',
      colour: '',
      size: '',
      variant: '',
      units: 1,
      productUrl: ''
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">SKU</label>
          <input
            type="text"
            name="sku"
            className={`form-input ${errors.sku ? 'error' : ''}`}
            value={formData.sku}
            onChange={handleChange}
            placeholder="e.g., TSH-2024"
          />
          {errors.sku && <span className="error-message">{errors.sku}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            Product Name <span className="required">*</span>
          </label>
          <input
            type="text"
            name="productName"
            className={`form-input ${errors.productName ? 'error' : ''}`}
            value={formData.productName}
            onChange={handleChange}
            placeholder="e.g., Classic Cotton T-Shirt"
          />
          {errors.productName && <span className="error-message">{errors.productName}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            Colour <span className="required">*</span>
          </label>
          <input
            type="text"
            name="colour"
            className={`form-input ${errors.colour ? 'error' : ''}`}
            value={formData.colour}
            onChange={handleChange}
            placeholder="e.g., Navy Blue"
          />
          {errors.colour && <span className="error-message">{errors.colour}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Size</label>
          <input
            type="text"
            name="size"
            className={`form-input ${errors.size ? 'error' : ''}`}
            value={formData.size}
            onChange={handleChange}
            placeholder="e.g., M, L, XL"
          />
          {errors.size && <span className="error-message">{errors.size}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Variant</label>
          <input
            type="text"
            name="variant"
            className="form-input"
            value={formData.variant}
            onChange={handleChange}
            placeholder="e.g., Premium, Regular"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Units to Generate <span className="required">*</span>
          </label>
          <input
            type="number"
            name="units"
            className={`form-input ${errors.units ? 'error' : ''}`}
            value={formData.units}
            onChange={handleChange}
            min="1"
            max="100"
          />
          {errors.units && <span className="error-message">{errors.units}</span>}
        </div>
      </div>

      <div className="form-group full-width">
        <label className="form-label">Product URL</label>
        <input
          type="url"
          name="productUrl"
          className={`form-input ${errors.productUrl ? 'error' : ''}`}
          value={formData.productUrl}
          onChange={handleChange}
          placeholder="https://yourfashionbrand.com/product/tsh-2024"
        />
        {errors.productUrl && <span className="error-message">{errors.productUrl}</span>}
        <small className="form-hint">
          Leave empty to auto-generate: https://yourfashionbrand.com/product/{formData.sku || 'your-sku'}
        </small>
      </div>

      <button type="submit" className="btn btn-primary btn-large">
        🎯 Generate QR Codes
      </button>
    </form>
  );
};

export default ProductForm;
