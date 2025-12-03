import React from 'react';
import Statistics from './Statistics';
import ProductCard from './ProductCard';
import { exportProductsData, clearProducts } from '../utils/storage';

const Dashboard = ({ products, onScan, onDelete, onClearAll, onTabChange }) => {
  const handleExportData = () => {
    exportProductsData(products);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear ALL products and QR codes? This cannot be undone.')) {
      clearProducts();
      onClearAll();
    }
  };

  return (
    <>
      <Statistics products={products} />

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📦 Product Inventory</h2>
          <div className="card-actions">
            {products.length > 0 && (
              <>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleExportData}
                >
                  💾 Export Data
                </button>
                <button
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
                className="btn btn-primary"
                onClick={() => onTabChange('form')}
              >
                Create First Product
              </button>
            </div>
          ) : (
            products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onScan={onScan}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
