import React from 'react';

const Tabs = ({ activeTab, onTabChange, productCount }) => {
  return (
    <nav className="tabs">
      <button
        className={`tab ${activeTab === 'form' ? 'active' : ''}`}
        onClick={() => onTabChange('form')}
      >
        📝 Generate QR
      </button>
      <button
        className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
        onClick={() => onTabChange('dashboard')}
      >
        📊 Dashboard
        {productCount > 0 && (
          <span className="tab-badge">{productCount}</span>
        )}
      </button>
    </nav>
  );
};

export default Tabs;
