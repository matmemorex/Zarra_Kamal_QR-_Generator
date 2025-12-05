import React, { useEffect, useRef } from 'react';
import QRious from 'qrious';
import { downloadCanvas } from '../utils/qrUtils';

const QRCodeDisplay = ({ unit, productId, unitIndex, onScan }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      try {
        // Use qrUrl (thank you page URL) as primary, fall back to qrData (JSON) if needed
        const qrValue = unit.qrUrl || unit.qrData || '';
        if (qrValue) {
          new QRious({
            element: canvasRef.current,
            value: qrValue,
            size: 200,
            level: 'H',
            background: 'white',
            foreground: 'black'
          });
        }
      } catch (error) {
        console.error('QR generation error:', error);
      }
    }
  }, [unit.qrUrl, unit.qrData]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const filename = unit.product_serial 
        ? `QR-${unit.product_serial.replace(/\s+/g, '-')}.png`
        : `QR-${unit.uniqueCode}.png`;
      downloadCanvas(canvasRef.current, filename);
    }
  };

  return (
    <div className="qr-item">
      <div
        className={`scan-status ${unit.scanned ? 'scanned' : 'unscanned'}`}
        title={unit.scanned ? `Scanned on ${new Date(unit.scanDate).toLocaleDateString()}` : 'Not scanned yet'}
      />
      <canvas
        ref={canvasRef}
        className="qr-canvas"
      />
      <div className="qr-serial-number">
        {unit.product_serial || 'N/A'}
      </div>
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

export default QRCodeDisplay;
