import React, { useState } from 'react';
import QRCodeDisplay from './QRCodeDisplay';
import { downloadCanvas } from '../utils/qrUtils';

const ProductCard = ({ product, onScan, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const scanPercentage = Math.round((product.totalScanned / product.units.length) * 100);

  const handleDownloadAll = () => {
    product.units.forEach((unit, index) => {
      setTimeout(() => {
        const canvas = document.getElementById(`qr-canvas-${product.id}-${index}`)?.querySelector('canvas');
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
          <span className="stat-value">{product.totalScanned}/{product.units.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Created:</span>
          <span className="stat-value">{new Date(product.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="product-url">
        <strong>URL:</strong> <a href={product.productUrl} target="_blank" rel="noopener noreferrer">{product.productUrl}</a>
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
              <div key={unit.uniqueCode} id={`qr-canvas-${product.id}-${index}`}>
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

export default ProductCard;
