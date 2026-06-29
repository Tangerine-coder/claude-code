import fs from 'fs';
import path from 'path';

const dir = 'public/images/products';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const products = [
  // Clothing - Men's
  {
    file: 'oxford-shirt.svg', bg: '#F5F0EB', category: "男装",
    draw: (w, h) => `
      <rect x="${w*0.25}" y="${h*0.15}" width="${w*0.5}" height="${h*0.55}" rx="8" fill="#E8E0D5" stroke="#D4C9B8" stroke-width="2"/>
      <path d="M ${w*0.3} ${h*0.15} L ${w*0.5} ${h*0.22} L ${w*0.7} ${h*0.15}" fill="none" stroke="#D4C9B8" stroke-width="3"/>
      <rect x="${w*0.55}" y="${h*0.3}" width="${w*0.12}" height="${h*0.12}" rx="2" fill="none" stroke="#D4C9B8" stroke-width="1.5"/>
      <circle cx="${w*0.5}" cy="${h*0.28}" r="3" fill="#C4B8A8"/>
      <circle cx="${w*0.5}" cy="${h*0.38}" r="3" fill="#C4B8A8"/>
      <circle cx="${w*0.5}" cy="${h*0.48}" r="3" fill="#C4B8A8"/>`
  },
  {
    file: 'stretch-chinos.svg', bg: '#F0EDE8', category: "男装",
    draw: (w, h) => `
      <rect x="${w*0.22}" y="${h*0.1}" width="${w*0.56}" height="${h*0.75}" rx="6" fill="#D4C4A8" stroke="#C0B090" stroke-width="2"/>
      <line x1="${w*0.5}" y1="${h*0.1}" x2="${w*0.5}" y2="${h*0.5}" stroke="#C0B090" stroke-width="1.5"/>
      <rect x="${w*0.28}" y="${h*0.08}" width="${w*0.04}" height="${h*0.08}" rx="1" fill="#C0B090"/>
      <rect x="${w*0.68}" y="${h*0.08}" width="${w*0.04}" height="${h*0.08}" rx="1" fill="#C0B090"/>`
  },
  {
    file: 'merino-sweater.svg', bg: '#F2EFEB', category: "男装",
    draw: (w, h) => `
      <path d="M ${w*0.2} ${h*0.15} L ${w*0.5} ${h*0.08} L ${w*0.8} ${h*0.15} L ${w*0.85} ${h*0.7} L ${w*0.15} ${h*0.7} Z" fill="#2C4050" stroke="#1A2A38" stroke-width="2"/>
      <path d="M ${w*0.35} ${h*0.08} L ${w*0.5} ${h*0.02} L ${w*0.65} ${h*0.08}" fill="none" stroke="#3D5670" stroke-width="3"/>`
  },
  // Clothing - Women's
  {
    file: 'floral-dress.svg', bg: '#FDF2F4', category: "女装",
    draw: (w, h) => `
      <path d="M ${w*0.3} ${h*0.1} L ${w*0.5} ${h*0.05} L ${w*0.7} ${h*0.1} L ${w*0.75} ${h*0.5} L ${w*0.6} ${h*0.9} L ${w*0.4} ${h*0.9} L ${w*0.25} ${h*0.5} Z" fill="#F8D5DA" stroke="#E8B4BC" stroke-width="2"/>
      <circle cx="${w*0.42}" cy="${h*0.35}" r="${w*0.04}" fill="#FF9EB5" opacity="0.6"/>
      <circle cx="${w*0.58}" cy="${h*0.25}" r="${w*0.03}" fill="#FFB8C9" opacity="0.6"/>
      <circle cx="${w*0.45}" cy="${h*0.55}" r="${w*0.035}" fill="#FF9EB5" opacity="0.5"/>`
  },
  {
    file: 'wide-leg-trousers.svg', bg: '#F5F0EC', category: "女装",
    draw: (w, h) => `
      <path d="M ${w*0.25} ${h*0.1} L ${w*0.75} ${h*0.1} L ${w*0.85} ${h*0.9} L ${w*0.15} ${h*0.9} Z" fill="#3A3A3A" stroke="#2A2A2A" stroke-width="2"/>
      <line x1="${w*0.5}" y1="${h*0.1}" x2="${w*0.5}" y2="${h*0.45}" stroke="#2A2A2A" stroke-width="1.5"/>`
  },
  {
    file: 'cashmere-cardigan.svg', bg: '#F5F0EA', category: "女装",
    draw: (w, h) => `
      <rect x="${w*0.2}" y="${h*0.12}" width="${w*0.6}" height="${h*0.6}" rx="10" fill="#C4A882" stroke="#B09872" stroke-width="2"/>
      <line x1="${w*0.5}" y1="${h*0.12}" x2="${w*0.5}" y2="${h*0.72}" stroke="#B09872" stroke-width="1.5"/>
      <circle cx="${w*0.5}" cy="${h*0.25}" r="3" fill="#D4B892"/>
      <circle cx="${w*0.5}" cy="${h*0.35}" r="3" fill="#D4B892"/>
      <circle cx="${w*0.5}" cy="${h*0.45}" r="3" fill="#D4B892"/>`
  },
  // Clothing - Kids
  {
    file: 'cotton-pj-set.svg', bg: '#F0F8FF', category: "童装",
    draw: (w, h) => `
      <rect x="${w*0.3}" y="${h*0.1}" width="${w*0.4}" height="${h*0.35}" rx="8" fill="#B8D8F0" stroke="#98C0E0" stroke-width="2"/>
      <rect x="${w*0.3}" y="${h*0.52}" width="${w*0.4}" height="${h*0.35}" rx="8" fill="#B8D8F0" stroke="#98C0E0" stroke-width="2"/>
      <text x="${w*0.5}" y="${h*0.32}" text-anchor="middle" fill="#6A9FC0" font-size="24" font-family="sans-serif">★</text>
      <text x="${w*0.5}" y="${h*0.74}" text-anchor="middle" fill="#6A9FC0" font-size="24" font-family="sans-serif">★</text>`
  },
  {
    file: 'kids-denim-overalls.svg', bg: '#F0F4F8', category: "童装",
    draw: (w, h) => `
      <rect x="${w*0.22}" y="${h*0.05}" width="${w*0.56}" height="${h*0.85}" rx="6" fill="#5B7FA5" stroke="#4A6A8A" stroke-width="2"/>
      <rect x="${w*0.32}" y="${h*0.05}" width="${w*0.15}" height="${h*0.2}" rx="3" fill="#4A6A8A"/>
      <rect x="${w*0.53}" y="${h*0.05}" width="${w*0.15}" height="${h*0.2}" rx="3" fill="#4A6A8A"/>
      <rect x="${w*0.4}" y="${h*0.15}" width="${w*0.2}" height="${h*0.18}" rx="2" fill="none" stroke="#6A8AAA" stroke-width="1.5"/>`
  },
  // Electronics - Phones
  {
    file: 'novaphone-15-pro.svg', bg: '#1A1A2E', category: "智能手机",
    draw: (w, h) => `
      <rect x="${w*0.32}" y="${h*0.05}" width="${w*0.36}" height="${h*0.9}" rx="18" fill="#2C2C44" stroke="#4A4A6A" stroke-width="3"/>
      <rect x="${w*0.36}" y="${h*0.1}" width="${w*0.28}" height="${h*0.78}" rx="4" fill="#1A1A3E"/>
      <circle cx="${w*0.5}" cy="${h*0.18}" r="3" fill="#333"/>
      <rect x="${w*0.42}" y="${h*0.82}" width="${w*0.16}" height="2" rx="1" fill="#4A4A6A"/>
      <circle cx="${w*0.42}" cy="${h*0.12}" r="5" fill="#1A1A3E" stroke="#555" stroke-width="1"/>
      <circle cx="${w*0.42}" cy="${h*0.12}" r="2.5" fill="#335"/>`
  },
  {
    file: 'novaphone-15.svg', bg: '#FAFAFA', category: "智能手机",
    draw: (w, h) => `
      <rect x="${w*0.32}" y="${h*0.05}" width="${w*0.36}" height="${h*0.9}" rx="18" fill="#E8E8F0" stroke="#D0D0D8" stroke-width="3"/>
      <rect x="${w*0.36}" y="${h*0.1}" width="${w*0.28}" height="${h*0.78}" rx="4" fill="#F5F5FA"/>
      <circle cx="${w*0.5}" cy="${h*0.18}" r="3" fill="#CCC"/>
      <rect x="${w*0.42}" y="${h*0.82}" width="${w*0.16}" height="2" rx="1" fill="#D0D0D8"/>
      <circle cx="${w*0.42}" cy="${h*0.12}" r="5" fill="#F5F5FA" stroke="#CCC" stroke-width="1"/>`
  },
  // Electronics - Laptops
  {
    file: 'novabook-pro.svg', bg: '#1C1C2E', category: "笔记本电脑",
    draw: (w, h) => `
      <rect x="${w*0.15}" y="${h*0.08}" width="${w*0.7}" height="${h*0.52}" rx="6" fill="#3A3A5A" stroke="#5A5A7A" stroke-width="2"/>
      <rect x="${w*0.2}" y="${h*0.13}" width="${w*0.6}" height="${h*0.42}" rx="2" fill="#2A2A4A"/>
      <rect x="${w*0.15}" y="${h*0.62}" width="${w*0.7}" height="${h*0.06}" rx="3" fill="#4A4A6A"/>
      <rect x="${w*0.4}" y="${h*0.7}" width="${w*0.2}" height="${h*0.15}" rx="3" fill="#4A4A6A"/>
      <rect x="${w*0.25}" y="${h*0.73}" width="${w*0.5}" height="${h*0.08}" rx="2" fill="#3A3A5A"/>`
  },
  {
    file: 'novabook-air.svg', bg: '#F8F4F0', category: "笔记本电脑",
    draw: (w, h) => `
      <rect x="${w*0.15}" y="${h*0.08}" width="${w*0.7}" height="${h*0.48}" rx="5" fill="#E8E0D5" stroke="#D4C8B8" stroke-width="2"/>
      <rect x="${w*0.2}" y="${h*0.12}" width="${w*0.6}" height="${h*0.38}" rx="2" fill="#F0E8DD"/>
      <rect x="${w*0.15}" y="${h*0.6}" width="${w*0.7}" height="${h*0.05}" rx="2" fill="#DDD0C0"/>
      <rect x="${w*0.4}" y="${h*0.68}" width="${w*0.2}" height="${h*0.18}" rx="2" fill="#DDD0C0"/>`
  },
  // Electronics - Audio
  {
    file: 'novapods-pro.svg', bg: '#F8F9FA', category: "音频设备",
    draw: (w, h) => `
      <rect x="${w*0.32}" y="${h*0.5}" width="${w*0.36}" height="${h*0.3}" rx="10" fill="#E8E8ED" stroke="#D0D0D8" stroke-width="2"/>
      <circle cx="${w*0.35}" cy="${h*0.35}" r="${w*0.08}" fill="#F0F0F5" stroke="#D0D0D8" stroke-width="2"/>
      <path d="M ${w*0.35} ${h*0.27} L ${w*0.35} ${h*0.15}" stroke="#D0D0D8" stroke-width="3" stroke-linecap="round"/>
      <circle cx="${w*0.65}" cy="${h*0.35}" r="${w*0.08}" fill="#F0F0F5" stroke="#D0D0D8" stroke-width="2"/>
      <path d="M ${w*0.65} ${h*0.27} L ${w*0.65} ${h*0.15}" stroke="#D0D0D8" stroke-width="3" stroke-linecap="round"/>`
  },
  {
    file: 'studio-headphones.svg', bg: '#1A1A2E', category: "音频设备",
    draw: (w, h) => `
      <path d="M ${w*0.2} ${h*0.6} Q ${w*0.5} ${h*0.1} ${w*0.8} ${h*0.6}" fill="none" stroke="#5A5A8A" stroke-width="8" stroke-linecap="round"/>
      <rect x="${w*0.1}" y="${h*0.4}" width="${w*0.2}" height="${h*0.4}" rx="12" fill="#3A3A5A" stroke="#5A5A8A" stroke-width="2"/>
      <rect x="${w*0.7}" y="${h*0.4}" width="${w*0.2}" height="${h*0.4}" rx="12" fill="#3A3A5A" stroke="#5A5A8A" stroke-width="2"/>
      <circle cx="${w*0.2}" cy="${h*0.55}" r="${w*0.06}" fill="#2A2A4A"/>
      <circle cx="${w*0.8}" cy="${h*0.55}" r="${w*0.06}" fill="#2A2A4A"/>`
  },
  {
    file: 'bluetooth-speaker.svg', bg: '#F5F7FA', category: "音频设备",
    draw: (w, h) => `
      <rect x="${w*0.25}" y="${h*0.3}" width="${w*0.5}" height="${h*0.4}" rx="12" fill="#E0E5EC" stroke="#C8CED6" stroke-width="2"/>
      <circle cx="${w*0.5}" cy="${h*0.45}" r="${w*0.12}" fill="#D0D8E0" stroke="#C0C8D0" stroke-width="1.5"/>
      <circle cx="${w*0.5}" cy="${h*0.45}" r="${w*0.04}" fill="#B0B8C0"/>
      <rect x="${w*0.35}" y="${h*0.22}" width="${w*0.3}" height="${h*0.05}" rx="2" fill="#C8CED6"/>`
  },
  // Home - Furniture
  {
    file: 'modern-sofa.svg', bg: '#F5F3EF', category: "家具",
    draw: (w, h) => `
      <rect x="${w*0.1}" y="${h*0.35}" width="${w*0.8}" height="${h*0.3}" rx="10" fill="#5B8C7A" stroke="#4A7A6A" stroke-width="2"/>
      <rect x="${w*0.08}" y="${h*0.25}" width="${w*0.84}" height="${h*0.15}" rx="8" fill="#6B9C8A"/>
      <rect x="${w*0.15}" y="${h*0.65}" width="${w*0.1}" height="${h*0.2}" rx="3" fill="#8B7050"/>
      <rect x="${w*0.75}" y="${h*0.65}" width="${w*0.1}" height="${h*0.2}" rx="3" fill="#8B7050"/>
      <circle cx="${w*0.85}" cy="${h*0.35}" r="${w*0.05}" fill="#D4A874" opacity="0.5"/>`
  },
  {
    file: 'standing-desk.svg', bg: '#F8F6F3', category: "家具",
    draw: (w, h) => `
      <rect x="${w*0.15}" y="${h*0.3}" width="${w*0.7}" height="${h*0.08}" rx="3" fill="#C4A878" stroke="#B09868" stroke-width="1.5"/>
      <rect x="${w*0.25}" y="${h*0.38}" width="${w*0.06}" height="${h*0.55}" rx="2" fill="#888"/>
      <rect x="${w*0.69}" y="${h*0.38}" width="${w*0.06}" height="${h*0.55}" rx="2" fill="#888"/>
      <rect x="${w*0.4}" y="${h*0.7}" width="${w*0.2}" height="${h*0.05}" rx="2" fill="#666"/>
      <rect x="${w*0.35}" y="${h*0.18}" width="${w*0.3}" height="${h*0.12}" rx="3" fill="#555"/>
      <rect x="${w*0.45}" y="${h*0.12}" width="${w*0.1}" height="${h*0.06}" rx="1" fill="#555"/>`
  },
  {
    file: 'velvet-armchair.svg', bg: '#FDF5F5', category: "家具",
    draw: (w, h) => `
      <rect x="${w*0.15}" y="${h*0.2}" width="${w*0.7}" height="${h*0.45}" rx="12" fill="#C75B5B" stroke="#B04A4A" stroke-width="2"/>
      <rect x="${w*0.12}" y="${h*0.18}" width="${w*0.76}" height="${h*0.12}" rx="8" fill="#D46B6B"/>
      <rect x="${w*0.2}" y="${h*0.65}" width="${w*0.08}" height="${h*0.2}" rx="2" fill="#C8A860"/>
      <rect x="${w*0.72}" y="${h*0.65}" width="${w*0.08}" height="${h*0.2}" rx="2" fill="#C8A860"/>`
  },
  // Home - Decor
  {
    file: 'macrame-wall-hanging.svg', bg: '#FBF8F4', category: "装饰",
    draw: (w, h) => `
      <rect x="${w*0.3}" y="${h*0.05}" width="${w*0.4}" height="${h*0.06}" rx="3" fill="#C4A878"/>
      <path d="M ${w*0.35} ${h*0.11} L ${w*0.35} ${h*0.35}" stroke="#D4B898" stroke-width="2"/>
      <path d="M ${w*0.5} ${h*0.11} L ${w*0.5} ${h*0.4}" stroke="#D4B898" stroke-width="2"/>
      <path d="M ${w*0.65} ${h*0.11} L ${w*0.65} ${h*0.35}" stroke="#D4B898" stroke-width="2"/>
      <path d="M ${w*0.35} ${h*0.35} Q ${w*0.5} ${h*0.55} ${w*0.65} ${h*0.35}" fill="none" stroke="#C4A878" stroke-width="1.5"/>
      <path d="M ${w*0.35} ${h*0.3} Q ${w*0.5} ${h*0.65} ${w*0.65} ${h*0.3}" fill="none" stroke="#D4B898" stroke-width="1.5"/>
      <path d="M ${w*0.35} ${h*0.25} Q ${w*0.5} ${h*0.75} ${w*0.65} ${h*0.25}" fill="none" stroke="#E4C8A8" stroke-width="1.5"/>`
  },
  {
    file: 'soy-candle.svg', bg: '#FFFBF5', category: "装饰",
    draw: (w, h) => `
      <rect x="${w*0.3}" y="${h*0.25}" width="${w*0.4}" height="${h*0.45}" rx="8" fill="#F5E6C8" stroke="#E0D0B0" stroke-width="2"/>
      <rect x="${w*0.25}" y="${h*0.22}" width="${w*0.5}" height="${h*0.06}" rx="2" fill="#8B6B4A"/>
      <line x1="${w*0.5}" y1="${h*0.22}" x2="${w*0.5}" y2="${h*0.15}" stroke="#8B6B4A" stroke-width="2"/>
      <ellipse cx="${w*0.5}" cy="${h*0.12}" rx="${w*0.04}" ry="${h*0.05}" fill="#FFB84D" opacity="0.8"/>`
  },
  // Home - Kitchen
  {
    file: 'chef-knife-set.svg', bg: '#F9F8F6', category: "厨房用品",
    draw: (w, h) => `
      <rect x="${w*0.35}" y="${h*0.55}" width="${w*0.3}" height="${h*0.35}" rx="4" fill="#C4A878"/>
      <rect x="${w*0.38}" y="${h*0.15}" width="${w*0.06}" height="${h*0.42}" rx="2" fill="#D0D0D8" stroke="#C0C0C8" stroke-width="1"/>
      <rect x="${w*0.46}" y="${h*0.2}" width="${w*0.06}" height="${h*0.37}" rx="2" fill="#D0D0D8" stroke="#C0C0C8" stroke-width="1"/>
      <rect x="${w*0.54}" y="${h*0.25}" width="${w*0.06}" height="${h*0.32}" rx="2" fill="#D0D0D8" stroke="#C0C0C8" stroke-width="1"/>
      <rect x="${w*0.38}" y="${h*0.1}" width="${w*0.06}" height="${h*0.08}" rx="1" fill="#B0B0B8"/>
      <rect x="${w*0.46}" y="${h*0.14}" width="${w*0.06}" height="${h*0.08}" rx="1" fill="#B0B0B8"/>
      <rect x="${w*0.54}" y="${h*0.18}" width="${w*0.06}" height="${h*0.08}" rx="1" fill="#B0B0B8"/>`
  },
  {
    file: 'dutch-oven.svg', bg: '#FDF8F4', category: "厨房用品",
    draw: (w, h) => `
      <ellipse cx="${w*0.5}" cy="${h*0.4}" rx="${w*0.35}" ry="${h*0.25}" fill="#D45B3A" stroke="#C04A2A" stroke-width="2"/>
      <rect x="${w*0.15}" y="${h*0.35}" width="${w*0.7}" height="${h*0.15}" rx="3" fill="#D45B3A"/>
      <ellipse cx="${w*0.5}" cy="${h*0.32}" rx="${w*0.3}" ry="${h*0.08}" fill="#E46B4A"/>
      <rect x="${w*0.3}" y="${h*0.28}" width="${w*0.4}" height="${h*0.05}" rx="2" fill="#B0B0B8"/>
      <circle cx="${w*0.5}" cy="${h*0.3}" r="${w*0.04}" fill="#C0C0C8"/>`
  },
  {
    file: 'cookware-set.svg', bg: '#F8F6F4', category: "厨房用品",
    draw: (w, h) => `
      <ellipse cx="${w*0.5}" cy="${h*0.3}" rx="${w*0.3}" ry="${h*0.12}" fill="#E0E0E8" stroke="#C8C8D0" stroke-width="2"/>
      <rect x="${w*0.2}" y="${h*0.25}" width="${w*0.6}" height="${h*0.1}" rx="2" fill="#D0D0D8"/>
      <rect x="${w*0.35}" y="${h*0.1}" width="${w*0.08}" height="${h*0.18}" rx="2" fill="#C0C0C8"/>
      <rect x="${w*0.57}" y="${h*0.1}" width="${w*0.08}" height="${h*0.18}" rx="2" fill="#C0C0C8"/>
      <ellipse cx="${w*0.5}" cy="${h*0.5}" rx="${w*0.25}" ry="${h*0.1}" fill="#E8E8F0" stroke="#D0D0D8" stroke-width="1.5"/>
      <rect x="${w*0.25}" y="${h*0.45}" width="${w*0.5}" height="${h*0.08}" rx="2" fill="#D8D8E0"/>
      <ellipse cx="${w*0.5}" cy="${h*0.72}" rx="${w*0.2}" ry="${h*0.08}" fill="#F0F0F5" stroke="#D8D8E0" stroke-width="1.5"/>
      <rect x="${w*0.3}" y="${h*0.68}" width="${w*0.4}" height="${h*0.06}" rx="2" fill="#E0E0E8"/>`
  },
  {
    file: 'smart-coffee-maker.svg', bg: '#FAF8F6', category: "厨房用品",
    draw: (w, h) => `
      <rect x="${w*0.2}" y="${h*0.2}" width="${w*0.6}" height="${h*0.5}" rx="8" fill="#3A3A3A" stroke="#2A2A2A" stroke-width="2"/>
      <rect x="${w*0.25}" y="${h*0.25}" width="${w*0.5}" height="${h*0.15}" rx="4" fill="#4A4A4A"/>
      <circle cx="${w*0.5}" cy="${h*0.33}" r="${w*0.03}" fill="#FF6B35"/>
      <rect x="${w*0.15}" y="${h*0.5}" width="${w*0.18}" height="${h*0.15}" rx="3" fill="#555"/>
      <rect x="${w*0.08}" y="${h*0.45}" width="${w*0.08}" height="${h*0.25}" rx="2" fill="#444"/>`
  },
];

// Generate SVGs
products.forEach(p => {
  const w = 600, h = 600;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${p.bg};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${p.bg};stop-opacity:0.7" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)" rx="12"/>
  ${p.draw(w, h)}
  <text x="${w/2}" y="${h-25}" text-anchor="middle" fill="#999" font-size="12" font-family="sans-serif">${p.category}</text>
</svg>`;

  fs.writeFileSync(path.join(dir, p.file), svg);
  console.log('Created:', p.file);
});

console.log('\nDone! Generated', products.length, 'product images.');
