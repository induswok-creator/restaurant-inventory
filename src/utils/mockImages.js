// Helper to generate crisp SVG data URIs for realistic restaurant inventory visuals

export const createScalePhotoSvg = (itemTitle, weightKg, timestamp, temp = "2.4°C") => {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <defs>
      <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#334155" />
        <stop offset="50%" stop-color="#1e293b" />
        <stop offset="100%" stop-color="#0f172a" />
      </linearGradient>
      <linearGradient id="screen" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#064e3b" />
        <stop offset="100%" stop-color="#022c22" />
      </linearGradient>
      <linearGradient id="tray" x1="0%" y1="0%" x2="100%" y2="50%">
        <stop offset="0%" stop-color="#94a3b8" />
        <stop offset="50%" stop-color="#cbd5e1" />
        <stop offset="100%" stop-color="#64748b" />
      </linearGradient>
    </defs>
    <!-- Background Kitchen Chiller Bench -->
    <rect width="600" height="400" fill="url(#metal)"/>
    <line x1="0" y1="120" x2="600" y2="120" stroke="#475569" stroke-width="2" stroke-dasharray="8 8" opacity="0.3"/>
    
    <!-- Stainless Steel Scale Base -->
    <rect x="50" y="70" width="500" height="280" rx="16" fill="#1e293b" stroke="#475569" stroke-width="3"/>
    <rect x="80" y="95" width="440" height="150" rx="12" fill="url(#tray)" stroke="#94a3b8" stroke-width="2"/>
    
    <!-- Food Container Pattern on Scale -->
    <rect x="110" y="110" width="380" height="120" rx="8" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Simulated Raw Chicken Meat Trays -->
    <ellipse cx="210" cy="170" rx="70" ry="35" fill="#fbcfe8" opacity="0.9"/>
    <ellipse cx="270" cy="165" rx="65" ry="38" fill="#fda4af" opacity="0.85"/>
    <ellipse cx="360" cy="175" rx="75" ry="36" fill="#f43f5e" opacity="0.4"/>
    <ellipse cx="320" cy="160" rx="60" ry="30" fill="#fb7185" opacity="0.6"/>
    
    <!-- Label on Tray -->
    <rect x="130" y="125" width="140" height="28" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
    <text x="140" y="144" font-family="monospace" font-size="12" font-weight="bold" fill="#0f172a">${itemTitle.toUpperCase()}</text>
    
    <!-- Digital Scale Readout Display -->
    <rect x="160" y="265" width="280" height="70" rx="8" fill="url(#screen)" stroke="#059669" stroke-width="2"/>
    
    <!-- LED Weight Value -->
    <text x="180" y="312" font-family="monospace" font-size="36" font-weight="900" fill="#34d399" letter-spacing="2">
      ${Number(weightKg).toFixed(2)} <tspan font-size="20" fill="#a7f3d0">KG</tspan>
    </text>
    <text x="360" y="300" font-family="monospace" font-size="12" fill="#6ee7b7">TARE: 0.00</text>
    <text x="360" y="318" font-family="monospace" font-size="12" fill="#6ee7b7">STABLE [●]</text>

    <!-- Watermark Stamp / Timestamp -->
    <rect x="20" y="20" width="220" height="32" rx="6" fill="#0f172ab0" stroke="#334155"/>
    <circle cx="34" cy="36" r="5" fill="#22c55e"/>
    <text x="46" y="40" font-family="sans-serif" font-size="12" font-weight="600" fill="#f8fafc">WhatsApp Log • ${timestamp}</text>
    
    <!-- Chiller Temp Badge -->
    <rect x="460" y="20" width="120" height="32" rx="6" fill="#0284c722" stroke="#0284c7"/>
    <text x="475" y="41" font-family="sans-serif" font-size="12" font-weight="bold" fill="#38bdf8">❄️ Temp: ${temp}</text>
  </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const createDeliveryChallanSvg = (invoiceNo, vendor, weightKg, amount, timestamp) => {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="420" viewBox="0 0 600 420">
    <rect width="600" height="420" fill="#f8fafc"/>
    <rect x="30" y="25" width="540" height="370" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
    
    <!-- Invoice Header -->
    <rect x="30" y="25" width="540" height="65" rx="10 10 0 0" fill="#1e293b"/>
    <text x="55" y="60" font-family="sans-serif" font-size="18" font-weight="800" fill="#f8fafc">POULTRY SUPPLY DELIVERY CHALLAN</text>
    <text x="55" y="78" font-family="sans-serif" font-size="11" fill="#94a3b8">SUPPLIER: ${vendor.toUpperCase()} • INVOICE #${invoiceNo}</text>
    
    <!-- Meta details -->
    <text x="55" y="120" font-family="sans-serif" font-size="13" font-weight="600" fill="#334155">Date & Time: <tspan font-weight="normal" fill="#64748b">${timestamp}</tspan></text>
    <text x="360" y="120" font-family="sans-serif" font-size="13" font-weight="600" fill="#334155">Vehicle Temp: <tspan font-weight="bold" fill="#0284c7">+1.8°C (Verified)</tspan></text>
    
    <!-- Table Header -->
    <rect x="55" y="145" width="490" height="30" fill="#f1f5f9"/>
    <text x="70" y="165" font-family="sans-serif" font-size="12" font-weight="700" fill="#475569">ITEM DESCRIPTION</text>
    <text x="280" y="165" font-family="sans-serif" font-size="12" font-weight="700" fill="#475569">BILLED (KG)</text>
    <text x="380" y="165" font-family="sans-serif" font-size="12" font-weight="700" fill="#475569">RECVD (KG)</text>
    <text x="480" y="165" font-family="sans-serif" font-size="12" font-weight="700" fill="#475569">AMOUNT</text>
    
    <!-- Table Row 1 -->
    <line x1="55" y1="210" x2="545" y2="210" stroke="#e2e8f0"/>
    <text x="70" y="195" font-family="sans-serif" font-size="13" font-weight="600" fill="#0f172a">Fresh Broiler Chicken (Whole/Cut)</text>
    <text x="280" y="195" font-family="sans-serif" font-size="13" fill="#334155">${weightKg} kg</text>
    <text x="380" y="195" font-family="sans-serif" font-size="13" font-weight="bold" fill="#059669">${weightKg} kg ✓</text>
    <text x="480" y="195" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a">${amount}</text>
    
    <!-- Stamp -->
    <g transform="translate(370, 240) rotate(-8)">
      <rect x="0" y="0" width="160" height="60" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="2.5" stroke-dasharray="4 2"/>
      <text x="20" y="26" font-family="sans-serif" font-size="14" font-weight="900" fill="#15803d">STOCK RECEIVED</text>
      <text x="32" y="46" font-family="sans-serif" font-size="11" font-weight="700" fill="#166534">WEIGHT VERIFIED</text>
    </g>
    
    <line x1="55" y1="330" x2="545" y2="330" stroke="#cbd5e1"/>
    <text x="55" y="360" font-family="sans-serif" font-size="12" fill="#64748b">Receiver Staff Signature: ✍️ Rajesh K. (Morning Shift Lead)</text>
  </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
