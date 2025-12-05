# Fashion Brand QR Generator

A React-based web application for generating unique QR codes for fashion products. Each unit of a product receives a distinct QR code that directs customers to the specific product listing page.

## Features

- **Unique QR Code Generation**: Generate unique QR codes for each product unit
- **Product Management**: Track products with SKU, colour, size, and variant attributes
- **Scan Tracking**: Monitor which units have been scanned by customers
- **Analytics Dashboard**: View real-time statistics on products, QR codes, and scan rates
- **Data Persistence**: Automatic saving to browser localStorage
- **Export Functionality**: Download QR codes individually or in bulk, export data as JSON
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and development server
- **QRious** - QR code generation library
- **LocalStorage** - Client-side data persistence

## Project Structure

```
QR generator/
├── src/
│   ├── components/
│   │   ├── Alert.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Header.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductForm.jsx
│   │   ├── QRCodeDisplay.jsx
│   │   ├── Statistics.jsx
│   │   └── Tabs.jsx
│   ├── styles/
│   │   ├── index.css
│   │   ├── tabs.css
│   │   ├── form.css
│   │   ├── buttons.css
│   │   ├── statistics.css
│   │   ├── products.css
│   │   ├── qr.css
│   │   └── responsive.css
│   ├── utils/
│   │   ├── qrUtils.js
│   │   ├── storage.js
│   │   └── validation.js
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Usage

### Generating QR Codes

1. Navigate to the "Generate QR" tab
2. Fill in the product information:
   - **SKU** (required): Stock Keeping Unit
   - **Product Name** (required): Name of the product
   - **Colour** (required): Product colour
   - **Size** (required): Product size (S, M, L, XL, etc.)
   - **Variant** (optional): Product variant (Premium, Regular, etc.)
   - **Units** (required): Number of QR codes to generate (1-100)
   - **Product URL** (optional): Custom URL or auto-generated
3. Click "Generate QR Codes"
4. View and download QR codes from the Dashboard

### Dashboard Features

- **Statistics**: View total products, QR codes generated, units scanned, and scan rate
- **Product Inventory**: List of all generated products with details
- **QR Code Grid**: Expandable view of all QR codes per product
- **Download Options**: Download individual QR codes or all codes for a product
- **Test Scan**: Simulate customer scans for testing
- **Export Data**: Export all product data as JSON
- **Clear All**: Remove all products and QR codes

## Unique Code Format

Each QR code has a unique identifier in the format:
```
[SKU]-[COLOUR]-[SIZE]-[VARIANT]-[TIMESTAMP]-U[UNIT_NUMBER]

Example: TSH-2024-NAVYBLUE-M-PREMIUM-K7X2P-U001
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

## Data Storage

All data is stored in browser localStorage under the key `fashionProducts_v2`. Data persists across browser sessions but is specific to the browser and device.

## Future Enhancements

- Backend API integration for multi-device sync
- Real-time scan tracking from customer devices
- Advanced analytics and reporting
- Bulk import via CSV/Excel
- Search and filter functionality
- Direct printer integration
- Mobile app (PWA)

## License

Proprietary - MMG Fashion Brand

## Author

Kamal - MMG Data Analyst

## Version

1.0.0 - December 3, 2024
