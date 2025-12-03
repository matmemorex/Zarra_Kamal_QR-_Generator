import React, { useMemo } from 'react';

const Statistics = ({ products }) => {
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalUnits = products.reduce((sum, p) => sum + p.units.length, 0);
    const totalScanned = products.reduce((sum, p) => sum + p.totalScanned, 0);
    const scanRate = totalUnits > 0 ? Math.round((totalScanned / totalUnits) * 100) : 0;

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

export default Statistics;
