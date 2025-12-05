import React, { useState, useEffect } from 'react';
import { generateBaseId, generateUniqueCode, generateProductUrl, generateProductSerial, generateQRData, generateThankYouURL } from '../utils/qrUtils';
import { validateProductForm } from '../utils/validation';
import { getAndIncrementSerialCounter } from '../utils/storage';

const autoGenerateSku = (formData, products = []) => {
  // Get normalized values for comparison
  const productName = (formData.productName || '').trim().toLowerCase();
  const modelName = (formData.model_name || '').trim().toLowerCase();
  const colour = (formData.colour || '').trim().toLowerCase();

  // Try to reuse SKU if product name, model name, and colour all match an existing product
  if (productName && modelName && colour) {
    const match = products.find((p) => {
      const pProductName = (p.productName || '').trim().toLowerCase();
      const pModelName = (p.model_name || '').trim().toLowerCase();
      const pColour = (p.colour || '').trim().toLowerCase();
      return pProductName === productName && 
             pModelName === modelName && 
             pColour === colour;
    });
    if (match?.sku) return match.sku;
  }

  // Otherwise generate a new SKU based on product name, model name, and colour
  const namePart = (formData.productName || 'PROD').slice(0, 3).toUpperCase().replace(/\s+/g, '');
  const modelPart = (formData.model_name || formData.productName || 'MOD').slice(0, 3).toUpperCase().replace(/\s+/g, '');
  const colourPart = (formData.colour || 'GEN').slice(0, 3).toUpperCase().replace(/\s+/g, '');
  const uniquePart = Date.now().toString(36).toUpperCase().slice(-4);
  return `${namePart}${modelPart}${colourPart}-${uniquePart}`;
};

const ProductForm = ({ onSubmit, products }) => {
  const [formData, setFormData] = useState({
    sku: '',
    productName: '',
    model_name: '',
    colour: '',
    variant: '',
    batch_no: '',
    channel: '',
    agent_id: '',
    serial_prefix: 'ASL-TDG',
    units: 1,
    productUrl: ''
  });

  const [errors, setErrors] = useState({});

  // Auto-generate SKU when product name, model name, or colour is entered
  useEffect(() => {
    if (formData.productName || formData.model_name || formData.colour) {
      const generatedSku = autoGenerateSku(formData, products);
      if (generatedSku && generatedSku !== formData.sku) {
        setFormData(prev => ({ ...prev, sku: generatedSku }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.productName, formData.model_name, formData.colour, products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const processedValue = name === 'units' ? Math.max(1, Math.min(100, parseInt(value) || 1)) : value;
    
    setFormData(prev => {
      const updatedFormData = {
        ...prev,
        [name]: processedValue
      };
      
      // Auto-generate SKU when product name, model name, or colour changes
      if (name === 'productName' || name === 'model_name' || name === 'colour') {
        updatedFormData.sku = autoGenerateSku(updatedFormData, products);
      }
      
      return updatedFormData;
    });

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

    const baseId = generateBaseId(workingData.sku, workingData.colour, '', workingData.variant);
    const timestamp = Date.now();
    const units = [];
    const currentYear = new Date().getFullYear();

    // Get starting counter for this batch
    const startingCounter = getAndIncrementSerialCounter(workingData.units);
    
    // Use model_name if provided, otherwise fall back to productName
    const modelName = workingData.model_name || workingData.productName;

    for (let i = 1; i <= workingData.units; i++) {
      const serialCounter = startingCounter + i;
      const productSerial = generateProductSerial(
        workingData.serial_prefix || 'ASL-TDG',
        currentYear,
        serialCounter
      );
      
      const uniqueCode = generateUniqueCode(baseId, i, timestamp + i);
      
      // Generate QR data as JSON
      const productData = {
        product_serial: productSerial,
        model_name: modelName,
        colour: workingData.colour,
        batch_no: workingData.batch_no,
        channel: workingData.channel,
        agent_id: parseInt(workingData.agent_id, 10)
      };
      
      const qrData = generateQRData(productData);
      // Generate URL that points to thank you page
      const thankYouUrl = generateThankYouURL(productData);

      units.push({
        uniqueCode,
        product_serial: productSerial,
        scanned: false,
        scanDate: null,
        qrData: qrData,
        qrUrl: thankYouUrl, // URL that shows thank you page
        productUrl: generateProductUrl(workingData.sku, workingData.productUrl) // Keep for reference
      });
    }

    const newProduct = {
      id: timestamp,
      baseId,
      ...workingData,
      model_name: modelName,
      productUrl: generateProductUrl(workingData.sku, workingData.productUrl),
      units,
      createdAt: new Date().toISOString(),
      totalScanned: 0
    };

    onSubmit(newProduct);

    // Reset form
    setFormData({
      sku: '',
      productName: '',
      model_name: '',
      colour: '',
      variant: '',
      batch_no: '',
      channel: '',
      agent_id: '',
      serial_prefix: 'ASL-TDG',
      units: 1,
      productUrl: ''
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">SKU (Auto-generated)</label>
          <input
            type="text"
            name="sku"
            className={`form-input ${errors.sku ? 'error' : ''}`}
            value={formData.sku || autoGenerateSku(formData, products)}
            onChange={handleChange}
            placeholder="Auto-generated based on Product Name, Model, and Colour"
            readOnly
            style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
          />
          {errors.sku && <span className="error-message">{errors.sku}</span>}
          <small className="form-hint">
            SKU is automatically generated. Same SKU is reused if Product Name, Model Name, and Colour match an existing product.
          </small>
        </div>

        <div className="form-group">
          <label className="form-label">Product Name</label>
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
            Model Name <span className="required">*</span>
          </label>
          <input
            type="text"
            name="model_name"
            className={`form-input ${errors.model_name ? 'error' : ''}`}
            value={formData.model_name}
            onChange={handleChange}
            placeholder="e.g., Bawal Satin Luxe"
          />
          {errors.model_name && <span className="error-message">{errors.model_name}</span>}
          <small className="form-hint">
            This will be used in the QR code data. If empty, Product Name will be used.
          </small>
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
          <label className="form-label">Serial Prefix</label>
          <input
            type="text"
            name="serial_prefix"
            className={`form-input ${errors.serial_prefix ? 'error' : ''}`}
            value={formData.serial_prefix}
            onChange={handleChange}
            placeholder="e.g., ASL-TDG"
          />
          {errors.serial_prefix && <span className="error-message">{errors.serial_prefix}</span>}
          <small className="form-hint">
            Prefix for serial numbers (e.g., ASL-TDG-2025-000123)
          </small>
        </div>

        <div className="form-group">
          <label className="form-label">
            Batch No <span className="required">*</span>
          </label>
          <input
            type="text"
            name="batch_no"
            className={`form-input ${errors.batch_no ? 'error' : ''}`}
            value={formData.batch_no}
            onChange={handleChange}
            placeholder="e.g., APR25"
          />
          {errors.batch_no && <span className="error-message">{errors.batch_no}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            Channel <span className="required">*</span>
          </label>
          <input
            type="text"
            name="channel"
            className={`form-input ${errors.channel ? 'error' : ''}`}
            value={formData.channel}
            onChange={handleChange}
            placeholder="e.g., TIKTOK, INSTAGRAM, WEBSITE"
          />
          {errors.channel && <span className="error-message">{errors.channel}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            Agent ID <span className="required">*</span>
          </label>
          <input
            type="number"
            name="agent_id"
            className={`form-input ${errors.agent_id ? 'error' : ''}`}
            value={formData.agent_id}
            onChange={handleChange}
            placeholder="e.g., 3"
            min="0"
          />
          {errors.agent_id && <span className="error-message">{errors.agent_id}</span>}
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
