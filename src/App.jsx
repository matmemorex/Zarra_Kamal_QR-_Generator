import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Alert from './components/Alert';
import Tabs from './components/Tabs';
import ProductForm from './components/ProductForm';
import Dashboard from './components/Dashboard';
import { loadProducts, saveProducts } from './utils/storage';

// Import all styles
import './styles/index.css';
import './styles/tabs.css';
import './styles/form.css';
import './styles/buttons.css';
import './styles/statistics.css';
import './styles/products.css';
import './styles/qr.css';
import './styles/responsive.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('form');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Load products from localStorage on mount
  useEffect(() => {
    const saved = loadProducts();
    if (saved.length > 0) {
      setProducts(saved);
    }
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    if (products.length > 0) {
      saveProducts(products);
    }
  }, [products]);

  const showAlertMessage = useCallback((message, duration = 4000) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), duration);
  }, []);

  const handleProductSubmit = useCallback((newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
    showAlertMessage(
      `Successfully generated ${newProduct.units.length} QR codes for ${newProduct.productName}!`
    );
    setActiveTab('dashboard');
  }, [showAlertMessage]);

  const handleScan = useCallback((productId, unitIndex) => {
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        const updatedUnits = [...product.units];
        updatedUnits[unitIndex] = {
          ...updatedUnits[unitIndex],
          scanned: true,
          scanDate: new Date().toISOString()
        };
        return {
          ...product,
          units: updatedUnits,
          totalScanned: updatedUnits.filter(u => u.scanned).length
        };
      }
      return product;
    }));
    showAlertMessage('Unit marked as scanned!', 2000);
  }, [showAlertMessage]);

  const handleDeleteProduct = useCallback((productId) => {
    if (confirm('Are you sure you want to delete this product and all its QR codes?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      showAlertMessage('Product deleted successfully', 2000);
    }
  }, [showAlertMessage]);

  const handleClearAll = useCallback(() => {
    setProducts([]);
    showAlertMessage('All data cleared', 2000);
  }, [showAlertMessage]);

  return (
    <div className="app">
      <Header />

      <Alert message={alertMessage} show={showAlert} />

      <div className="container">
        <Tabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          productCount={products.length}
        />

        <div className="tab-content">
          {activeTab === 'form' && (
            <div className="card">
              <h2 className="card-title">🎨 Product Information</h2>
              <ProductForm onSubmit={handleProductSubmit} products={products} />
            </div>
          )}

          {activeTab === 'dashboard' && (
            <Dashboard
              products={products}
              onScan={handleScan}
              onDelete={handleDeleteProduct}
              onClearAll={handleClearAll}
              onTabChange={setActiveTab}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
