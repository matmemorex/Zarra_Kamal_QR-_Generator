import React, { useEffect, useRef } from 'react';
import QRious from 'qrious';
import { downloadCanvas } from '../utils/qrUtils';

const QRCodeDisplay = ({ unit, productId, unitIndex, onScan }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && unit.qrUrl) {
      try {
        new QRious({
          element: canvasRef.current,
          value: unit.qrUrl,
          size: 200,
          level: 'H',
          background: 'white',
          foreground: 'black'
        });
      } catch (error) {
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
        title={unit.scanned ? `Scanned on ${new Date(unit.scanDate).toLocaleDateString()}` : 'Not scanned yet'}
      />
      <canvas
        ref={canvasRef}
        className="qr-canvas"
      />
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

export default QRCodeDisplay;
