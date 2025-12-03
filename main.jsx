import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import QRious from 'qrious';

// Inject styles (kept here so we don't need a new CSS file)
const styleEl = document.createElement('style');
styleEl.textContent = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding-bottom: 40px;
  }

  .app {
    min-height: 100vh;
  }

  /* Header */
  .header {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 30px 20px;
    text-align: center;
    color: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
  }

  .header-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }

  .header-subtitle {
    font-size: 1.1rem;
    opacity: 0.95;
  }

  /* Container */
  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
  }

  /* Alert */
  .alert {
    max-width: 1360px;
    margin: 20px auto;
    padding: 16px 20px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    animation: slideDown 0.3s ease-out;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  @keyframes slideDown {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .alert-success {
    background: white;
    color: #065f46;
    border-left: 4px solid #10b981;
  }

  .alert-icon {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .alert-message {
    font-weight: 500;
  }

  /* Tabs */
  .tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    background: rgba(255, 255, 255, 0.1);
    padding: 8px;
    border-radius: 12px;
    backdrop-filter: blur(10px);
  }

  .tab {
    flex: 1;
    padding: 14px 24px;
    background: transparent;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .tab:hover {
    background: rgba(255, 255, 255, 0.15);
    color: white;
  }

  .tab.active {
    background: white;
    color: #667eea;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .tab-badge {
    background: #667eea;
    color: white;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 700;
  }

  .tab.active .tab-badge {
    background: #667eea;
    color: white;
  }

  /* Card */
  .card {
    background: white;
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    margin-bottom: 20px;
  }

  .card-title {
    font-size: 1.6rem;
    font-weight: 700;
    margin-bottom: 24px;
    color: #1a1a1a;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .card-actions {
    display: flex;
    gap: 10px;
  }

  /* Form */
  .product-form {
    width: 100%;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-bottom: 20px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .form-group.full-width {
    grid-column: 1 / -1;
  }

  .form-label {
    font-weight: 600;
    margin-bottom: 8px;
    color: #333;
    font-size: 0.95rem;
  }

  .required {
    color: #ef4444;
  }

  .form-input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s;
    font-family: inherit;
  }

  .form-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  }

  .form-input.error {
    border-color: #ef4444;
  }

  .error-message {
    color: #ef4444;
    font-size: 0.85rem;
    margin-top: 6px;
    font-weight: 500;
  }

  .form-hint {
    color: #6b7280;
    font-size: 0.85rem;
    margin-top: 6px;
    display: block;
  }

  /* Buttons */
  .btn {
    padding: 12px 24px;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: inherit;
  }

  .btn:active {
    transform: scale(0.98);
  }

  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  .btn-primary:hover {
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    transform: translateY(-2px);
  }

  .btn-large {
    width: 100%;
    padding: 16px 32px;
    font-size: 1.1rem;
  }

  .btn-secondary {
    background: #f3f4f6;
    color: #374151;
  }

  .btn-secondary:hover {
    background: #e5e7eb;
  }

  .btn-success {
    background: #10b981;
    color: white;
  }

  .btn-success:hover {
    background: #059669;
  }

  .btn-danger {
    background: #ef4444;
    color: white;
  }

  .btn-danger:hover {
    background: #dc2626;
  }

  .btn-download {
    background: #8b5cf6;
    color: white;
  }

  .btn-download:hover {
    background: #7c3aed;
  }

  .btn-sm {
    padding: 8px 16px;
    font-size: 0.9rem;
  }

  /* Statistics */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 24px;
  }

  .stat-card {
    background: white;
    padding: 24px;
    border-radius: 16px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s;
  }

  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }

  .stat-card-icon {
    font-size: 2.5rem;
    margin-bottom: 12px;
  }

  .stat-card-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: #667eea;
    margin-bottom: 8px;
  }

  .stat-card-label {
    color: #6b7280;
    font-size: 0.95rem;
    font-weight: 500;
  }

  /* Product List */
  .product-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-height: 800px;
    overflow-y: auto;
    padding-right: 8px;
  }

  .product-list::-webkit-scrollbar {
    width: 8px;
  }

  .product-list::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
  }

  .product-list::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }

  .product-list::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  /* Product Card */
  .product-card {
    background: #f9fafb;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 24px;
    transition: all 0.3s;
  }

  .product-card:hover {
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
  }

  .product-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  }

  .product-info {
    flex: 1;
  }

  .product-name {
    font-size: 1.3rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 8px;
  }

  .product-sku {
    color: #667eea;
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 4px;
  }

  .product-base-id {
    color: #6b7280;
    font-size: 0.85rem;
    font-family: 'Courier New', monospace;
  }

  .product-details {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 16px;
  }

  .detail-badge {
    background: white;
    padding: 8px 14px;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    color: #374151;
    border: 1px solid #e5e7eb;
  }

  .product-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 16px;
    padding: 16px;
    background: white;
    border-radius: 10px;
  }

  .stat {
    text-align: center;
  }

  .stat-label {
    display: block;
    color: #6b7280;
    font-size: 0.85rem;
    margin-bottom: 4px;
  }

  .stat-value {
    display: block;
    font-size: 1.2rem;
    font-weight: 700;
    color: #1a1a1a;
  }

  .product-url {
    padding: 12px;
    background: white;
    border-radius: 8px;
    font-size: 0.9rem;
    margin-bottom: 16px;
    word-break: break-all;
  }

  .product-url a {
    color: #667eea;
    text-decoration: none;
  }

  .product-url a:hover {
    text-decoration: underline;
  }

  /* Units Section */
  .units-section {
    margin-top: 20px;
  }

  .units-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  /* QR Grid */
  .qr-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
    margin-top: 16px;
  }

  .qr-item {
    background: white;
    padding: 16px;
    border-radius: 12px;
    border: 2px solid #e5e7eb;
    text-align: center;
    position: relative;
    transition: all 0.3s;
  }

  .qr-item:hover {
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
    transform: translateY(-2px);
  }

  .scan-status {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .scan-status.scanned {
    background: #10b981;
  }

  .scan-status.unscanned {
    background: #9ca3af;
  }

  .qr-canvas {
    width: 100%;
    height: auto;
    margin-bottom: 12px;
    border-radius: 8px;
  }

  .qr-code-text {
    font-family: 'Courier New', monospace;
    font-size: 0.75rem;
    color: #6b7280;
    margin-bottom: 12px;
    word-break: break-all;
    line-height: 1.4;
  }

  .qr-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .scan-info {
    margin-top: 8px;
    font-size: 0.75rem;
    color: #10b981;
    font-weight: 600;
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 80px 20px;
  }

  .empty-icon {
    font-size: 5rem;
    margin-bottom: 24px;
    opacity: 0.5;
  }

  .empty-title {
    font-size: 1.5rem;
    color: #374151;
    margin-bottom: 12px;
  }

  .empty-text {
    color: #6b7280;
    margin-bottom: 24px;
    font-size: 1.05rem;
  }

  /* Responsive Design */
  @media (max-width: 1200px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .header-title {
      font-size: 2rem;
    }

    .form-grid {
      grid-template-columns: 1fr;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .product-stats {
      grid-template-columns: 1fr;
    }

    .qr-grid {
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    }

    .card {
      padding: 20px;
    }

    .card-header {
      flex-direction: column;
      gap: 12px;
    }

    .card-actions {
      width: 100%;
      flex-direction: column;
    }
  }

  @media (max-width: 480px) {
    .container {
      padding: 12px;
    }

    .header {
      padding: 20px 12px;
    }

    .qr-grid {
      grid-template-columns: 1fr;
    }
  }
`;
document.head.appendChild(styleEl);

// Utility Functions
const generateBaseId = (sku, colour, size, variant) => {
  const parts = [sku, colour, size, variant].filter(Boolean);
  return parts
    .join('-')
    .toUpperCase()
    .replace(/\s+/g, '-')
    .replace(/[^A-Z0-9-]/g, '');
};

const generateUniqueCode = (baseId, unitNumber, timestamp) => {
  const shortTimestamp = timestamp.toString(36).toUpperCase();
  const paddedUnit = String(unitNumber).padStart(3, '0');
  return `${baseId}-${shortTimestamp}-U${paddedUnit}`;
};

const downloadCanvas = (canvas, filename) => {
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

// QR Code Component
const QRCodeDisplay = ({ unit, productId, unitIndex, onScan }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && unit.qrUrl) {
      try {
        // eslint-disable-next-line no-new
        new QRious({
          element: canvasRef.current,
          value: unit.qrUrl,
          size: 200,
          level: 'H',
          background: 'white',
          foreground: 'black',
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('QR generation error:', error);
      }
    }
  }, [unit.qrUrl]);

  const handleDownload = () => {
    if (canvasRef.current) {
      downloadCanvas(canvasRef.current, `QR-${unit.uniqueCode}.png`);
    }
  };

  return (
    <div className="qr-item">
      <div
        className={`scan-status ${unit.scanned ? 'scanned' : 'unscanned'}`}
        title={
          unit.scanned
            ? `Scanned on ${new Date(unit.scanDate).toLocaleDateString()}`
            : 'Not scanned yet'
        }
      />
      <canvas ref={canvasRef} className="qr-canvas" />
      <div className="qr-code-text">{unit.uniqueCode}</div>
      <div className="qr-actions">
        <button
          className="btn btn-download btn-sm"
          onClick={handleDownload}
          title="Download QR Code"
        >
          ⬇️ Download
        </button>
        {!unit.scanned && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onScan(productId, unitIndex)}
            title="Simulate customer scan"
          >
            🔍 Test Scan
          </button>
        )}
      </div>
      {unit.scanned && (
        <div className="scan-info">
          Scanned: {new Date(unit.scanDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, onScan, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const scanPercentage = Math.round(
    (product.totalScanned / product.units.length) * 100,
  );

  const handleDownloadAll = () => {
    product.units.forEach((unit, index) => {
      setTimeout(() => {
        const container = document.getElementById(
          `qr-canvas-${product.id}-${index}`,
        );
        if (!container) return;
        const canvas = container.querySelector('canvas');
        if (canvas) {
          downloadCanvas(canvas, `QR-${unit.uniqueCode}.png`);
        }
      }, index * 150);
    });
  };

  return (
    <div className="product-card">
      <div className="product-header">
        <div className="product-info">
          <h3 className="product-name">{product.productName}</h3>
          <div className="product-sku">SKU: {product.sku}</div>
          <div className="product-base-id">Base ID: {product.baseId}</div>
        </div>
        <div className="product-actions">
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(product.id)}
            title="Delete this product"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="product-details">
        <span className="detail-badge">🎨 {product.colour}</span>
        <span className="detail-badge">📏 {product.size}</span>
        {product.variant && (
          <span className="detail-badge">✨ {product.variant}</span>
        )}
        <span className="detail-badge">📦 {product.units.length} units</span>
      </div>

      <div className="product-stats">
        <div className="stat">
          <span className="stat-label">Scan Rate:</span>
          <span className="stat-value">{scanPercentage}%</span>
        </div>
        <div className="stat">
          <span className="stat-label">Scanned:</span>
          <span className="stat-value">
            {product.totalScanned}/{product.units.length}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Created:</span>
          <span className="stat-value">
            {new Date(product.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="product-url">
        <strong>URL:</strong>{' '}
        <a href={product.productUrl} target="_blank" rel="noopener noreferrer">
          {product.productUrl}
        </a>
      </div>

      <div className="units-section">
        <div className="units-header">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? '▲ Hide' : '▼ Show'} QR Codes ({product.units.length})
          </button>
          {expanded && (
            <button
              className="btn btn-success btn-sm"
              onClick={handleDownloadAll}
            >
              ⬇️ Download All
            </button>
          )}
        </div>

        {expanded && (
          <div className="qr-grid">
            {product.units.map((unit, index) => (
              <div
                key={unit.uniqueCode}
                id={`qr-canvas-${product.id}-${index}`}
              >
                <QRCodeDisplay
                  unit={unit}
                  productId={product.id}
                  unitIndex={index}
                  onScan={onScan}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Statistics Component
const Statistics = ({ products }) => {
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalUnits = products.reduce((sum, p) => sum + p.units.length, 0);
    const totalScanned = products.reduce(
      (sum, p) => sum + p.totalScanned,
      0,
    );
    const scanRate =
      totalUnits > 0 ? Math.round((totalScanned / totalUnits) * 100) : 0;

    return { totalProducts, totalUnits, totalScanned, scanRate };
  }, [products]);

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-card-icon">📦</div>
        <div className="stat-card-value">{stats.totalProducts}</div>
        <div className="stat-card-label">Total Products</div>
      </div>
      <div className="stat-card">
        <div className="stat-card-icon">🏷️</div>
        <div className="stat-card-value">{stats.totalUnits}</div>
        <div className="stat-card-label">QR Codes Generated</div>
      </div>
      <div className="stat-card">
        <div className="stat-card-icon">✅</div>
        <div className="stat-card-value">{stats.totalScanned}</div>
        <div className="stat-card-label">Units Scanned</div>
      </div>
      <div className="stat-card">
        <div className="stat-card-icon">📊</div>
        <div className="stat-card-value">{stats.scanRate}%</div>
        <div className="stat-card-label">Scan Rate</div>
      </div>
    </div>
  );
};

// Product Form Component
const ProductForm = ({ onSubmit, products }) => {
  const [formData, setFormData] = useState({
    sku: '',
    productName: '',
    colour: '',
    size: '',
    variant: '',
    units: 1,
    productUrl: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = {
        ...prev,
        [name]:
          name === 'units'
            ? Math.max(1, Math.min(100, parseInt(value, 10) || 1))
            : value,
      };

      // If SKU not filled, try to auto-match from existing products
      if (!next.sku && (name === 'colour' || name === 'variant')) {
        const match = (products || []).find((p) => {
          const pColour = (p.colour || '').trim().toLowerCase();
          const pVariant = (p.variant || '').trim().toLowerCase();
          const nColour = (next.colour || '').trim().toLowerCase();
          const nVariant = (next.variant || '').trim().toLowerCase();
          return pColour === nColour && pVariant === nVariant;
        });
        if (match) {
          next.sku = match.sku || '';
        }
      }

      return next;
    });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.productName.trim())
      newErrors.productName = 'Product name is required';
    if (!formData.colour.trim()) newErrors.colour = 'Colour is required';
    // size is optional
    if (formData.units < 1 || formData.units > 100)
      newErrors.units = 'Units must be between 1 and 100';
    if (formData.productUrl && !formData.productUrl.match(/^https?:\/\/.+/)) {
      newErrors.productUrl =
        'Please enter a valid URL starting with http:// or https://';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const baseId = generateBaseId(
      formData.sku,
      formData.colour,
      formData.size,
      formData.variant,
    );
    const timestamp = Date.now();
    const units = [];

    const productUrl =
      formData.productUrl ||
      `https://yourfashionbrand.com/product/${formData.sku
        .toLowerCase()
        .replace(/\s+/g, '-')}`;

    for (let i = 1; i <= formData.units; i += 1) {
      const uniqueCode = generateUniqueCode(baseId, i, timestamp + i);
      units.push({
        uniqueCode,
        scanned: false,
        scanDate: null,
        qrUrl: productUrl,
      });
    }

    const newProduct = {
      id: timestamp,
      baseId,
      ...formData,
      productUrl,
      units,
      createdAt: new Date().toISOString(),
      totalScanned: 0,
    };

    onSubmit(newProduct);

    setFormData({
      sku: '',
      productName: '',
      colour: '',
      size: '',
      variant: '',
      units: 1,
      productUrl: '',
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">
            SKU <span className="required">*</span>
          </label>
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
          {errors.productName && (
            <span className="error-message">{errors.productName}</span>
          )}
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
          {errors.colour && (
            <span className="error-message">{errors.colour}</span>
          )}
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
          {errors.size && (
            <span className="error-message">{errors.size}</span>
          )}
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
          {errors.units && (
            <span className="error-message">{errors.units}</span>
          )}
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
        {errors.productUrl && (
          <span className="error-message">{errors.productUrl}</span>
        )}
        <small className="form-hint">
          Leave empty to auto-generate:
          https://yourfashionbrand.com/product/
          {formData.sku || 'your-sku'}
        </small>
      </div>

      <button type="submit" className="btn btn-primary btn-large">
        🎯 Generate QR Codes
      </button>
    </form>
  );
};

// Main App Component
const App = () => {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('form');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Load products from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fashionProducts_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        setProducts(parsed);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error loading products:', error);
    }
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    if (products.length > 0) {
      try {
        localStorage.setItem('fashionProducts_v2', JSON.stringify(products));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error saving products:', error);
      }
    }
  }, [products]);

  const handleProductSubmit = useCallback((newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    setAlertMessage(
      `Successfully generated ${newProduct.units.length} QR codes for ${newProduct.productName}!`,
    );
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
    setActiveTab('dashboard');
  }, []);

  const handleScan = useCallback((productId, unitIndex) => {
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id === productId) {
          const updatedUnits = [...product.units];
          updatedUnits[unitIndex] = {
            ...updatedUnits[unitIndex],
            scanned: true,
            scanDate: new Date().toISOString(),
          };
          return {
            ...product,
            units: updatedUnits,
            totalScanned: updatedUnits.filter((u) => u.scanned).length,
          };
        }
        return product;
      }),
    );
    setAlertMessage('Unit marked as scanned!');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2000);
  }, []);

  const handleDeleteProduct = useCallback((productId) => {
    if (window.confirm('Are you sure you want to delete this product and all its QR codes?')) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setAlertMessage('Product deleted successfully');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    }
  }, []);

  const handleClearAll = useCallback(() => {
    if (
      window.confirm(
        'Are you sure you want to clear ALL products and QR codes? This cannot be undone.',
      )
    ) {
      setProducts([]);
      localStorage.removeItem('fashionProducts_v2');
      setAlertMessage('All data cleared');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    }
  }, []);

  const handleExportData = useCallback(() => {
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fashion-qr-data-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [products]);

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">🏷️ Fashion QR Generator</h1>
          <p className="header-subtitle">
            Generate unique QR codes for your fashion brand products
          </p>
        </div>
      </header>

      {showAlert && (
        <div className="alert alert-success">
          <span className="alert-icon">✓</span>
          <span className="alert-message">{alertMessage}</span>
        </div>
      )}

      <div className="container">
        <nav className="tabs">
          <button
            type="button"
            className={`tab ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => setActiveTab('form')}
          >
            📝 Generate QR
          </button>
          <button
            type="button"
            className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
            {products.length > 0 && (
              <span className="tab-badge">{products.length}</span>
            )}
          </button>
        </nav>

        <div className="tab-content">
          {activeTab === 'form' && (
            <div className="card">
              <h2 className="card-title">🎨 Product Information</h2>
              <ProductForm onSubmit={handleProductSubmit} products={products} />
            </div>
          )}

          {activeTab === 'dashboard' && (
            <>
              <Statistics products={products} />

              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">📦 Product Inventory</h2>
                  <div className="card-actions">
                    {products.length > 0 && (
                      <>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={handleExportData}
                        >
                          💾 Export Data
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={handleClearAll}
                        >
                          🗑️ Clear All
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="product-list">
                  {products.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">📭</div>
                      <h3 className="empty-title">No Products Yet</h3>
                      <p className="empty-text">
                        Start by generating your first QR codes using the form
                      </p>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setActiveTab('form')}
                      >
                        Create First Product
                      </button>
                    </div>
                  ) : (
                    products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onScan={handleScan}
                        onDelete={handleDeleteProduct}
                      />
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Render App (assumes there is a <div id="root"></div> in your index.html)
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}