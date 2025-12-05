import React, { useEffect, useState } from 'react';
import './../styles/thankyou.css';

const ThankYou = () => {
  const [productData, setProductData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get data from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get('data');
    
    if (dataParam) {
      try {
        // Decode and parse the JSON data
        const decoded = decodeURIComponent(dataParam);
        const data = JSON.parse(decoded);
        setProductData(data);
      } catch (err) {
        console.error('Error parsing QR data:', err);
        setError('Invalid QR code data. Please scan a valid QR code.');
      }
    } else {
      // Try to get from hash or direct JSON in URL
      const hash = window.location.hash.substring(1);
      if (hash) {
        try {
          const data = JSON.parse(decodeURIComponent(hash));
          setProductData(data);
        } catch (err) {
          // If hash is not JSON, try as direct data
          try {
            const data = JSON.parse(hash);
            setProductData(data);
          } catch (e) {
            setError('No product data found. Please scan a valid QR code.');
          }
        }
      } else {
        setError('No product data found. Please scan a valid QR code.');
      }
    }
  }, []);

  if (error) {
    return (
      <div className="thank-you-container">
        <div className="thank-you-card error">
          <div className="thank-you-icon">⚠️</div>
          <h1>Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="thank-you-container">
        <div className="thank-you-card loading">
          <div className="thank-you-icon">⏳</div>
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="thank-you-container">
      <div className="thank-you-card">
        <div className="thank-you-header">
          <div className="thank-you-icon">✅</div>
          <h1 className="thank-you-title">Thank You for Purchase with Us</h1>
          <p className="thank-you-subtitle">We appreciate your business</p>
        </div>

        <div className="thank-you-content">
          <div className="purchase-details">
            <h2 className="details-title">Purchase Details</h2>
            
            <div className="detail-item serial-highlight">
              <span className="detail-label">Product Serial:</span>
              <span className="detail-value serial-value">{productData.product_serial || 'N/A'}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Model Name:</span>
              <span className="detail-value">{productData.model_name || 'N/A'}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Colour:</span>
              <span className="detail-value">{productData.colour || 'N/A'}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Batch Number:</span>
              <span className="detail-value">{productData.batch_no || 'N/A'}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Channel:</span>
              <span className="detail-value">{productData.channel || 'N/A'}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Agent ID:</span>
              <span className="detail-value">{productData.agent_id || 'N/A'}</span>
            </div>
          </div>

          <div className="thank-you-footer">
            <p className="footer-message">
              Your purchase has been recorded. We hope you enjoy your product!
            </p>
            <div className="footer-brand">
              <p>For any inquiries, please contact our customer service.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;

