import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { categoryTable } from '../db/models/category';
import { vendorTable } from '../db/models/vendor';
import { brandTable } from '../db/models/brand';
import { productTable } from '../db/models/product';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

function getScriptDatabaseUrl(): string {
  let raw = process.env.DATABASE_URL;
  if (!raw) {
    try {
      const envPath = path.resolve(process.cwd(), '.env.local');
      const fallbackPath = path.resolve(process.cwd(), '.env');
      const fileToRead = fs.existsSync(envPath) ? envPath : fallbackPath;
      if (fs.existsSync(fileToRead)) {
        const content = fs.readFileSync(fileToRead, 'utf-8');
        const match = content.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
        if (match) raw = match[1];
      }
    } catch {}
  }
  if (!raw) return '';
  try {
    const parsed = new URL(raw);
    parsed.port = '5432';
    return parsed.toString();
  } catch {
    return raw;
  }
}

function generatePseudoEmbedding(text: string, dimensions = 64): number[] {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  const vec: number[] = [];
  let sumSq = 0;
  for (let d = 0; d < dimensions; d++) {
    const val = Math.sin(hash * (d + 1) * 0.173) * Math.cos(d * 0.31);
    vec.push(val);
    sumSq += val * val;
  }
  const norm = Math.sqrt(sumSq) || 1;
  return vec.map((v) => +(v / norm).toFixed(5));
}

const BRAND_DEFINITIONS = [
  {
    name: "Samsung",
    description: "Global leader in technology, opening new possibilities for people everywhere with Galaxy smartphones, Neo QLED displays, and memory.",
    logoUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&auto=format&fit=crop&q=80",
    website: "https://www.samsung.com",
  },
  {
    name: "Apple",
    description: "Pioneering technology and design with iPhone, iPad, Mac, Apple Watch, and AirPods crafted for performance and elegance.",
    logoUrl: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=400&auto=format&fit=crop&q=80",
    website: "https://www.apple.com",
  },
  {
    name: "Nike",
    description: "World’s leading athletic footwear, apparel, equipment, and accessories engineered to inspire every athlete.",
    logoUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80",
    website: "https://www.nike.com",
  },
  {
    name: "Adidas",
    description: "Iconic sportswear, sneakers, and streetwear blending heritage design with high-performance sports technology.",
    logoUrl: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=400&auto=format&fit=crop&q=80",
    website: "https://www.adidas.com",
  },
  {
    name: "HP",
    description: "Innovator in personal computing, laptops, workstations, and smart printing solutions for professionals and students.",
    logoUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&auto=format&fit=crop&q=80",
    website: "https://www.hp.com",
  },
  {
    name: "Sony",
    description: "Creative entertainment company with PlayStation gaming consoles, industry-leading noise canceling headphones, and Alpha cameras.",
    logoUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80",
    website: "https://www.sony.com",
  },
  {
    name: "Oraimo",
    description: "Smart accessories brand bringing premium wireless earbuds, heavy bass sound, durable power banks, and wearables.",
    logoUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80",
    website: "https://www.oraimo.com",
  },
  {
    name: "Hisense",
    description: "Multinational appliance and electronics manufacturer celebrated for 4K Laser & ULED TVs, smart refrigerators, and home comfort.",
    logoUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&auto=format&fit=crop&q=80",
    website: "https://www.hisense.com",
  },
  {
    name: "Vitron",
    description: "Affordable home electronics brand offering crystal-clear frameless LED TVs, multimedia soundbars, and home entertainment.",
    logoUrl: "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=400&auto=format&fit=crop&q=80",
    website: "https://www.vitron.co.ke",
  },
  {
    name: "Amaze",
    description: "Reliable power protection systems, digital surge protectors, UPS backups, and heavy-duty electrical accessories.",
    logoUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80",
    website: "https://www.amaze.com",
  },
];

const BRAND_PRODUCTS: Record<string, Array<{
  name: string;
  price: number;
  categoryName: string;
  type: string;
  label: "BestSelling" | "Popular" | "Featured" | "Trending" | "New";
  budgetTier: "budget" | "mid" | "premium";
  images: string[];
  shortDesc: string;
  longDesc: string;
  sizes?: string[];
  colors?: string[];
  stock: number;
  discount?: number;
}>> = {
  Samsung: [
    {
      name: "Samsung Galaxy S24 Ultra 5G (512GB/12GB RAM, Titanium Gray)",
      price: 185000,
      categoryName: "Smart Phones & Tablets",
      type: "Smartphone",
      label: "BestSelling",
      budgetTier: "premium",
      images: ["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "Flagship Galaxy AI powerhouse with 200MP camera, built-in S Pen, and titanium frame.",
      longDesc: "<h3>Meet the Samsung Galaxy S24 Ultra</h3><p>Unleash new levels of creativity and productivity with Galaxy AI. Features a 6.8-inch Dynamic AMOLED 2X flat display with Corning Gorilla Armor, Snapdragon 8 Gen 3 for Galaxy, and an advanced 200MP quad-telephoto camera system with 5x optical zoom.</p>",
      sizes: ["256GB", "512GB", "1TB"],
      colors: ["Titanium Gray", "Titanium Black", "Titanium Violet"],
      stock: 45,
      discount: 10,
    },
    {
      name: "Samsung Galaxy S24+ 5G (256GB/12GB RAM, Onyx Black)",
      price: 135000,
      categoryName: "Smart Phones & Tablets",
      type: "Smartphone",
      label: "Popular",
      budgetTier: "premium",
      images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "Stunning 6.7-inch QHD+ display with Galaxy AI tools and 4900mAh all-day battery.",
      longDesc: "<h3>Samsung Galaxy S24+</h3><p>Experience expansive performance with an immersive QHD+ screen, pro-grade 50MP triple lens camera, intelligent Photo Assist, and Circle to Search with Google.</p>",
      sizes: ["256GB", "512GB"],
      colors: ["Onyx Black", "Marble Gray", "Cobalt Violet"],
      stock: 38,
      discount: 8,
    },
    {
      name: "Samsung Galaxy A55 5G (256GB/8GB RAM, Awesome Navy)",
      price: 52000,
      categoryName: "Smart Phones & Tablets",
      type: "Smartphone",
      label: "Trending",
      budgetTier: "mid",
      images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "Premium metal frame, vibrant 120Hz Super AMOLED display, and IP67 water resistance.",
      longDesc: "<h3>Samsung Galaxy A55 5G</h3><p>Combines flagship aesthetic design with a refined metal frame, clear Nightography with a 50MP sensor, and 2-day battery life with 5,000mAh capacity.</p>",
      sizes: ["128GB", "256GB"],
      colors: ["Awesome Navy", "Awesome Iceblue", "Awesome Lemon"],
      stock: 60,
      discount: 12,
    },
    {
      name: "Samsung Galaxy A35 5G (128GB/6GB RAM, Awesome Iceblue)",
      price: 39500,
      categoryName: "Smart Phones & Tablets",
      type: "Smartphone",
      label: "New",
      budgetTier: "mid",
      images: ["https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "Crisp 6.6-inch FHD+ Super AMOLED display, Samsung Knox Vault security, and 50MP camera.",
      longDesc: "<h3>Samsung Galaxy A35 5G</h3><p>Engineered for everyday brilliance with Corning Gorilla Glass Victus+, 50MP high-resolution camera with OIS, and 4 generations of OS upgrades.</p>",
      sizes: ["128GB"],
      colors: ["Awesome Iceblue", "Awesome Lilac", "Awesome Navy"],
      stock: 50,
      discount: 5,
    },
    {
      name: "Samsung Galaxy A15 (128GB/4GB RAM, Blue Black)",
      price: 19800,
      categoryName: "Smart Phones & Tablets",
      type: "Smartphone",
      label: "BestSelling",
      budgetTier: "budget",
      images: ["https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "Best value budget smartphone with 90Hz Super AMOLED screen and 50MP camera.",
      longDesc: "<h3>Samsung Galaxy A15</h3><p>Enjoy vibrant colors on a 6.5-inch Super AMOLED display with Vision Booster, robust octa-core processor, and long-lasting 5,000mAh battery with 25W fast charging.</p>",
      sizes: ["128GB"],
      colors: ["Blue Black", "Light Blue", "Yellow"],
      stock: 80,
      discount: 7,
    },
    {
      name: "Samsung Galaxy Z Fold5 (512GB/12GB RAM, Phantom Black)",
      price: 245000,
      categoryName: "Smart Phones & Tablets",
      type: "Foldable Smartphone",
      label: "Featured",
      budgetTier: "premium",
      images: ["https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "Massive 7.6-inch folding display for PC-level multitasking in your pocket.",
      longDesc: "<h3>Samsung Galaxy Z Fold5</h3><p>Flex Hinge technology delivers a completely flat fold. Multi-Window lets you keep three windows open on one screen for unparalleled mobile productivity.</p>",
      sizes: ["512GB"],
      colors: ["Phantom Black", "Icy Blue"],
      stock: 20,
      discount: 15,
    },
    {
      name: "Samsung 65-Inch Crystal UHD 4K Smart TV (DU7000 Series)",
      price: 89000,
      categoryName: "Electronics",
      type: "Smart TV",
      label: "BestSelling",
      budgetTier: "mid",
      images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "PurColor technology, Crystal Processor 4K, and seamless Tizen OS streaming.",
      longDesc: "<h3>Samsung 65\" Crystal UHD 4K Smart TV</h3><p>Experience stunning lifelike color with PurColor and Crystal Processor 4K upscaling. Features Q-Symphony sound synchronization and SmartThings IoT hub integration.</p>",
      sizes: ["65 Inch"],
      colors: ["Titan Gray"],
      stock: 25,
      discount: 14,
    },
    {
      name: "Samsung 55-Inch QLED 4K Smart TV (Q60D Series)",
      price: 105000,
      categoryName: "Electronics",
      type: "Smart TV",
      label: "Popular",
      budgetTier: "premium",
      images: ["https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "100% Color Volume with Quantum Dot technology and AirSlim sleek design.",
      longDesc: "<h3>Samsung 55\" QLED 4K TV</h3><p>Quantum Processor Lite 4K optimizes picture and sound for pure cinematic brilliance. Dual LED backlight technology delivers deeper contrast and accurate tone calibration.</p>",
      sizes: ["55 Inch"],
      colors: ["Black"],
      stock: 30,
      discount: 10,
    },
    {
      name: "Samsung Galaxy Buds2 Pro (Active Noise Canceling, Graphite)",
      price: 24500,
      categoryName: "Electronics",
      type: "Audio & Earbuds",
      label: "Trending",
      budgetTier: "mid",
      images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "24-bit Hi-Fi sound, intelligent Active Noise Canceling, and 360 Audio.",
      longDesc: "<h3>Samsung Galaxy Buds2 Pro</h3><p>Hear studio quality audio directly in your ears with seamless Galaxy ecosystem pairing, Voice Detect conversational mode, and IPX7 water resistance.</p>",
      sizes: ["Standard"],
      colors: ["Graphite", "White", "Bora Purple"],
      stock: 55,
      discount: 15,
    },
    {
      name: "Samsung 990 PRO 2TB PCIe 4.0 NVMe M.2 Internal SSD",
      price: 28500,
      categoryName: "Computing & Stationery",
      type: "Storage",
      label: "Featured",
      budgetTier: "premium",
      images: ["https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "Blazing 7,450 MB/s read speeds for extreme gaming and heavy professional workflows.",
      longDesc: "<h3>Samsung 990 PRO 2TB NVMe SSD</h3><p>Reaches near-max performance of PCIe 4.0. Nickel coating on controller and smart thermal control algorithm deliver optimized power efficiency and heat management.</p>",
      sizes: ["1TB", "2TB"],
      colors: ["Black"],
      stock: 40,
      discount: 5,
    },
  ],

  Apple: [
    {
      name: "Apple iPhone 15 Pro Max (256GB, Natural Titanium)",
      price: 198000,
      categoryName: "Smart Phones & Tablets",
      type: "Smartphone",
      label: "BestSelling",
      budgetTier: "premium",
      images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "Aerospace-grade titanium design, A17 Pro chip, Action button, and 5x Telephoto camera.",
      longDesc: "<h3>Apple iPhone 15 Pro Max</h3><p>Forged in titanium and featuring the groundbreaking A17 Pro chip, customizable Action button, Super Retina XDR display with ProMotion, and USB-C connectivity with USB 3 speeds.</p>",
      sizes: ["256GB", "512GB", "1TB"],
      colors: ["Natural Titanium", "Blue Titanium", "Black Titanium"],
      stock: 35,
      discount: 6,
    },
    {
      name: "Apple iPhone 15 (128GB, Black)",
      price: 125000,
      categoryName: "Smart Phones & Tablets",
      type: "Smartphone",
      label: "Popular",
      budgetTier: "premium",
      images: ["https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "Dynamic Island, 48MP Main camera with 2x Telephoto, and color-infused glass back.",
      longDesc: "<h3>Apple iPhone 15</h3><p>Dynamic Island bubbles up alerts and Live Activities. 48MP camera captures super-high-resolution photos with ease. Powered by the A16 Bionic chip with all-day battery life.</p>",
      sizes: ["128GB", "256GB"],
      colors: ["Black", "Blue", "Green", "Pink"],
      stock: 45,
      discount: 8,
    },
    {
      name: "Apple MacBook Air 13-inch (M3 chip, 8GB RAM, 256GB SSD, Midnight)",
      price: 165000,
      categoryName: "Computing & Stationery",
      type: "Laptop",
      label: "BestSelling",
      budgetTier: "premium",
      images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "Supercharged by M3, strikingly thin aluminum chassis, and up to 18 hours of battery.",
      longDesc: "<h3>Apple MacBook Air 13\" M3</h3><p>Features an 8-core CPU, up to 10-core GPU, support for up to two external displays, Liquid Retina display, 1080p FaceTime HD camera, and MagSafe 3 charging.</p>",
      sizes: ["256GB SSD", "512GB SSD"],
      colors: ["Midnight", "Starlight", "Space Gray", "Silver"],
      stock: 28,
      discount: 5,
    },
    {
      name: "Apple iPad Air 11-inch (M2 chip, Wi-Fi 128GB, Space Gray)",
      price: 98000,
      categoryName: "Smart Phones & Tablets",
      type: "Tablet",
      label: "Trending",
      budgetTier: "premium",
      images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "Freshly redesigned with the powerful M2 chip and landscape 12MP front camera.",
      longDesc: "<h3>Apple iPad Air 11\" M2</h3><p>Incredible performance for creative pros and students. Supports Apple Pencil Pro and Magic Keyboard. Brilliant Liquid Retina display with P3 wide color and True Tone.</p>",
      sizes: ["128GB", "256GB"],
      colors: ["Space Gray", "Blue", "Purple", "Starlight"],
      stock: 32,
      discount: 7,
    },
    {
      name: "Apple AirPods Pro 2nd Gen (with USB-C MagSafe Case)",
      price: 36000,
      categoryName: "Electronics",
      type: "Audio & Earbuds",
      label: "BestSelling",
      budgetTier: "premium",
      images: ["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "Up to 2x more Active Noise Cancellation, Adaptive Audio, and Personalized Spatial Audio.",
      longDesc: "<h3>Apple AirPods Pro 2</h3><p>The Apple-designed H2 chip pushes advanced audio performance even further. Transparency mode lets you comfortably hear the world around you. Dust, sweat, and water resistant (IP54).</p>",
      sizes: ["Standard"],
      colors: ["White"],
      stock: 50,
      discount: 10,
    },
    {
      name: "Apple Watch Series 9 GPS 45mm (Midnight Aluminum Case)",
      price: 68000,
      categoryName: "Smart Phones & Tablets",
      type: "Smartwatch",
      label: "Popular",
      budgetTier: "premium",
      images: ["https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "Powerful S9 SiP chip, double tap gesture interaction, and advanced health metrics.",
      longDesc: "<h3>Apple Watch Series 9</h3><p>Magic at your fingertips with double tap. Bright edge-to-edge Always-On Retina display, blood oxygen tracking, ECG generation, and Crash Detection safety features.</p>",
      sizes: ["41mm", "45mm"],
      colors: ["Midnight", "Starlight", "Silver", "Product(RED)"],
      stock: 24,
      discount: 10,
    },
  ],

  Nike: [
    {
      name: "Nike Air Force 1 '07 All-White Classic Sneakers",
      price: 14500,
      categoryName: "Fashion & Apparel",
      type: "Sneakers",
      label: "BestSelling",
      budgetTier: "mid",
      images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "The legendary basketball icon with stitched overlays, clean leather finish, and Air-Sole cushioning.",
      longDesc: "<h3>Nike Air Force 1 '07</h3><p>From pristine leather to durable stitching, the AF1 delivers comfort that lasts. Originally designed for performance hoops, the encapsulated Nike Air cushioning adds lightweight comfort all day long.</p>",
      sizes: ["40", "41", "42", "43", "44", "45"],
      colors: ["Triple White", "Black/White"],
      stock: 65,
      discount: 15,
    },
    {
      name: "Nike Air Max 270 Lifestyle Running Shoes",
      price: 18500,
      categoryName: "Fashion & Apparel",
      type: "Running Shoes",
      label: "Popular",
      budgetTier: "mid",
      images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "Extra-large Max Air heel unit delivers unmatched trampoline-like bounce and modern street style.",
      longDesc: "<h3>Nike Air Max 270</h3><p>Boasting Nike’s biggest heel Air unit yet, the Air Max 270 delivers a super-soft ride that feels as impossible as it looks. Knit fabric upper gives breathable structure.</p>",
      sizes: ["41", "42", "43", "44", "45"],
      colors: ["Black/University Red", "White/Black"],
      stock: 45,
      discount: 12,
    },
    {
      name: "Nike Club Fleece Pullover Hoodie (Black)",
      price: 6500,
      categoryName: "Fashion & Apparel",
      type: "Hoodie",
      label: "Trending",
      budgetTier: "budget",
      images: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "Soft brushed-back fleece with embroidered Nike Futura logo and kangaroo pocket.",
      longDesc: "<h3>Nike Sportswear Club Fleece Hoodie</h3><p>A wardrobe staple that combines classic style with soft brushed-back fleece for elevated everyday comfort. Ribbed hem and cuffs lock in warmth.</p>",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Black", "Heather Grey", "Navy"],
      stock: 70,
      discount: 10,
    },
    {
      name: "Nike Dri-FIT Academy Training Tracksuit",
      price: 9500,
      categoryName: "Fashion & Apparel",
      type: "Tracksuit",
      label: "New",
      budgetTier: "mid",
      images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "Moisture-wicking Dri-FIT fabric keeps you cool and dry through intense gym workouts.",
      longDesc: "<h3>Nike Dri-FIT Academy Tracksuit</h3><p>Features sweat-wicking knit fabric, zippered leg hems for easy transitions over boots or shoes, and secure zippered pockets.</p>",
      sizes: ["M", "L", "XL"],
      colors: ["Obsidian Navy", "Black/White"],
      stock: 55,
      discount: 8,
    },
  ],

  Adidas: [
    {
      name: "Adidas Samba OG Classic Leather Shoes (Cloud White/Black)",
      price: 15500,
      categoryName: "Fashion & Apparel",
      type: "Sneakers",
      label: "BestSelling",
      budgetTier: "mid",
      images: ["https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "Timeless streetwear silhouette featuring soft full-grain leather and gum rubber outsole.",
      longDesc: "<h3>Adidas Samba OG</h3><p>Born on the soccer pitch, the Samba is an undeniable icon of street style. Features a soft leather upper and suede overlays staying true to its legacy.</p>",
      sizes: ["40", "41", "42", "43", "44"],
      colors: ["Cloud White/Core Black", "Core Black/White"],
      stock: 50,
      discount: 10,
    },
    {
      name: "Adidas Ultraboost Light Running Shoes (Core Black)",
      price: 21000,
      categoryName: "Fashion & Apparel",
      type: "Running Shoes",
      label: "Featured",
      budgetTier: "premium",
      images: ["https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "30% lighter Light BOOST material engineered for ultimate energy return and endurance.",
      longDesc: "<h3>Adidas Ultraboost Light</h3><p>Experience epic energy with the lightest BOOST ever. Primeknit+ upper hugs your foot with a supportive fit, paired with the Linear Energy Push system.</p>",
      sizes: ["41", "42", "43", "44", "45"],
      colors: ["Core Black", "White/Solar Red"],
      stock: 40,
      discount: 14,
    },
    {
      name: "Adidas Tiro 23 League Training Tracksuit Pants",
      price: 5800,
      categoryName: "Fashion & Apparel",
      type: "Pants",
      label: "Popular",
      budgetTier: "budget",
      images: ["https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "Tapered football track pants made with recycled materials and AEROREADY moisture control.",
      longDesc: "<h3>Adidas Tiro 23 Pants</h3><p>Born from football culture, these slim-fitting pants keep you dry and comfortable with AEROREADY technology and ankle zips for quick on-and-off.</p>",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black/White", "Team Navy"],
      stock: 65,
      discount: 12,
    },
  ],

  HP: [
    {
      name: "HP Pavilion 15 Laptop (Intel Core i7 13th Gen, 16GB RAM, 512GB SSD)",
      price: 92000,
      categoryName: "Computing & Stationery",
      type: "Laptop",
      label: "BestSelling",
      budgetTier: "mid",
      images: ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "15.6-inch FHD micro-edge display, B&O audio, fast-charging battery, and sleek natural silver finish.",
      longDesc: "<h3>HP Pavilion 15 Laptop</h3><p>Get work done efficiently with a 13th Gen Intel Core i7 processor, 16GB dual-channel DDR4 RAM, fast NVMe SSD, and crystal-clear HP Wide Vision 720p HD webcam.</p>",
      sizes: ["16GB / 512GB"],
      colors: ["Natural Silver"],
      stock: 35,
      discount: 10,
    },
    {
      name: "HP Envy x360 2-in-1 Convertible Laptop (15.6\" Touch, AMD Ryzen 7, 16GB)",
      price: 118000,
      categoryName: "Computing & Stationery",
      type: "Laptop",
      label: "Featured",
      budgetTier: "premium",
      images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "360-degree hinge flips between laptop, tent, and tablet modes with OLED precision.",
      longDesc: "<h3>HP Envy x360 2-in-1</h3><p>Versatile convertible with AMD Ryzen 7 7730U, 15.6-inch Full HD touch display, stylus pen support, privacy shutter camera, and Bang & Olufsen tuned quad speakers.</p>",
      sizes: ["16GB / 512GB", "16GB / 1TB"],
      colors: ["Nightfall Black"],
      stock: 22,
      discount: 8,
    },
    {
      name: "HP Smart Tank 580 All-in-One Wireless Color Ink Tank Printer",
      price: 24500,
      categoryName: "Computing & Stationery",
      type: "Printer",
      label: "Popular",
      budgetTier: "mid",
      images: ["https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "High-yield thermal ink tank printing up to 18,000 black or 8,000 color pages right out of the box.",
      longDesc: "<h3>HP Smart Tank 580 All-in-One</h3><p>Print, scan, and copy with seamless Wi-Fi auto-healing, HP Smart App integration, and spill-free refill bottles for ultra-low cost per page.</p>",
      sizes: ["Standard"],
      colors: ["Light Basalt"],
      stock: 45,
      discount: 15,
    },
  ],

  Sony: [
    {
      name: "Sony PlayStation 5 Slim Console (1TB SSD Disc Edition)",
      price: 78000,
      categoryName: "Electronics",
      type: "Gaming Console",
      label: "BestSelling",
      budgetTier: "premium",
      images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "Ultra-high speed SSD, haptic feedback, adaptive triggers, and 3D Audio gaming revolution.",
      longDesc: "<h3>Sony PlayStation 5 Slim</h3><p>Harness the power of a custom CPU, GPU, and SSD with Integrated I/O that rewrite the rules of what a console can do. Enjoy 4K-TV gaming up to 120fps with ray tracing.</p>",
      sizes: ["1TB SSD"],
      colors: ["White/Black"],
      stock: 30,
      discount: 5,
    },
    {
      name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
      price: 45000,
      categoryName: "Electronics",
      type: "Headphones",
      label: "Popular",
      budgetTier: "premium",
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "Industry-leading noise cancellation with two processors and 8 microphones for crystal calls.",
      longDesc: "<h3>Sony WH-1000XM5</h3><p>Magnificent sound engineered to perfection with High-Resolution Audio, Auto NC Optimizer, Speak-to-Chat technology, and up to 30 hours of battery life with quick charging.</p>",
      sizes: ["Standard"],
      colors: ["Black", "Silver", "Midnight Blue"],
      stock: 40,
      discount: 12,
    },
  ],

  Oraimo: [
    {
      name: "Oraimo FreePods 4 Active Noise Cancellation TWS Earbuds",
      price: 4500,
      categoryName: "Electronics",
      type: "Wireless Earbuds",
      label: "BestSelling",
      budgetTier: "budget",
      images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "Active Noise Cancellation up to 30dB, HavyBass sound algorithm, and 35.5-hour total battery.",
      longDesc: "<h3>Oraimo FreePods 4</h3><p>Tune out ambient distractions with ANC mode or stay connected with Transparency mode. Customizable sound modes via the Oraimo Sound App and IPX5 sweat-proof rating.</p>",
      sizes: ["Standard"],
      colors: ["White", "Black"],
      stock: 120,
      discount: 20,
    },
    {
      name: "Oraimo Traveler 3 30000mAh 20W Fast Charging Power Bank",
      price: 3800,
      categoryName: "Electronics",
      type: "Power Bank",
      label: "Popular",
      budgetTier: "budget",
      images: ["https://images.unsplash.com/photo-1609592424368-f9b8c00c73e1?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "Colossal 30,000mAh capacity charges standard phones up to 7 times with 20W Power Delivery.",
      longDesc: "<h3>Oraimo Traveler 3 Power Bank</h3><p>Dual output ports (Type-C and USB-A) let you charge two devices simultaneously. Built-in LED torch and multi-protection safety chip prevent surges.</p>",
      sizes: ["30000mAh"],
      colors: ["Black"],
      stock: 95,
      discount: 15,
    },
  ],

  Hisense: [
    {
      name: "Hisense 58-Inch 4K UHD Smart TV (58A6K Series with VIDAA OS)",
      price: 54000,
      categoryName: "Electronics",
      type: "Smart TV",
      label: "BestSelling",
      budgetTier: "mid",
      images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "Dolby Vision HDR, DTS Virtual:X audio, bezel-less design, and instant app launching.",
      longDesc: "<h3>Hisense 58\" 4K UHD Smart TV</h3><p>Direct Full Array illumination delivers consistent brightness across the whole screen. VIDAA Smart OS gives quick access to Netflix, YouTube, Prime Video, and Apple TV+.</p>",
      sizes: ["58 Inch"],
      colors: ["Black"],
      stock: 35,
      discount: 18,
    },
    {
      name: "Hisense 205-Litre Top Mount Double Door Refrigerator",
      price: 38500,
      categoryName: "Home & Living",
      type: "Refrigerator",
      label: "Popular",
      budgetTier: "mid",
      images: ["https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "Frost-free cooling, adjustable glass shelves, vegetable crisper, and low-noise energy efficiency.",
      longDesc: "<h3>Hisense 205L Double Door Fridge</h3><p>Features multi-air flow cooling that distributes chilled air into every corner. Recessed handles, LED interior lighting, and durable tempered glass shelves.</p>",
      sizes: ["205 Litres"],
      colors: ["Silver Metallic"],
      stock: 25,
      discount: 10,
    },
  ],

  Vitron: [
    {
      name: "Vitron 43-Inch Full HD Frameless Smart Android TV",
      price: 22500,
      categoryName: "Electronics",
      type: "Smart TV",
      label: "BestSelling",
      budgetTier: "budget",
      images: ["https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "Vibrant 1080p Full HD frameless display with built-in Android OS and Free Wall Mount.",
      longDesc: "<h3>Vitron 43\" Frameless Smart TV</h3><p>Sleek bezel-less aesthetic with Android OS for streaming apps, built-in digital tuner (DVBT2), 2 HDMI ports, and USB media playback. Free heavy-duty wall bracket included.</p>",
      sizes: ["43 Inch"],
      colors: ["Black"],
      stock: 45,
      discount: 15,
    },
  ],

  Amaze: [
    {
      name: "Amaze 13A Automatic Digital Voltage Surge Protector",
      price: 2400,
      categoryName: "Electronics",
      type: "Surge Protector",
      label: "BestSelling",
      budgetTier: "budget",
      images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80"],
      shortDesc: "Protects high-value refrigerators, TVs, and computers against sudden voltage spikes and power brownouts.",
      longDesc: "<h3>Amaze Digital Voltage Protector</h3><p>Automatically disconnects power when grid voltage drops below 160V or surges above 260V. Built-in delay timer safeguards sensitive refrigeration compressors.</p>",
      sizes: ["13 Amp"],
      colors: ["White"],
      stock: 80,
      discount: 10,
    },
  ],
};

async function seedTopBrands() {
  const connectionString = getScriptDatabaseUrl();
  console.log("Connecting to PostgreSQL...");
  const client = postgres(connectionString, {
    max: 1,
    idle_timeout: 0,
    connect_timeout: 30,
  });
  const db = drizzle(client);

  // 1. Get or create a default vendor
  let vendors = await db.select().from(vendorTable).limit(1);
  let vendorId: string;
  if (vendors.length === 0) {
    const [newVendor] = await db.insert(vendorTable).values({
      storeName: "Official Brand Store",
      storeSlug: "official-brand-store",
    } as any).returning();
    vendorId = newVendor.id;
  } else {
    vendorId = vendors[0].id;
  }
  console.log(`Using vendor: ${vendorId}`);

  // 2. Fetch all categories
  const categories = await db.select().from(categoryTable);
  const categoryMap = new Map<string, string>();
  for (const c of categories) {
    categoryMap.set(c.name.toLowerCase(), c.id);
  }

  // 3. Ensure top brands exist
  console.log("\nEnsuring top brands exist in brandTable...");
  const brandIdMap = new Map<string, string>();
  for (const def of BRAND_DEFINITIONS) {
    const existing = await db
      .select()
      .from(brandTable)
      .where(eq(brandTable.name, def.name));

    if (existing.length > 0) {
      brandIdMap.set(def.name, existing[0].id);
      console.log(`✓ Brand "${def.name}" exists [ID: ${existing[0].id}]`);
    } else {
      const [inserted] = await db
        .insert(brandTable)
        .values({
          name: def.name,
          description: def.description,
          logoUrl: def.logoUrl,
          website: def.website,
        })
        .returning();
      brandIdMap.set(def.name, inserted.id);
      console.log(`+ Brand "${def.name}" created [ID: ${inserted.id}]`);
    }
  }

  // 4. Insert authentic brand products
  console.log("\nSeeding authentic brand products...");
  let totalInserted = 0;
  for (const [brandName, products] of Object.entries(BRAND_PRODUCTS)) {
    const brandId = brandIdMap.get(brandName);
    if (!brandId) continue;

    for (const p of products) {
      // Find category ID
      let catId = categoryMap.get(p.categoryName.toLowerCase());
      if (!catId) {
        // Fallback by partial match
        for (const [cName, cId] of categoryMap.entries()) {
          if (cName.includes(p.categoryName.toLowerCase()) || p.categoryName.toLowerCase().includes(cName)) {
            catId = cId;
            break;
          }
        }
      }
      const categoryIds = catId ? [catId] : [];

      // Check if product already exists by exact name
      const existing = await db
        .select({ id: productTable.id })
        .from(productTable)
        .where(eq(productTable.name, p.name));

      if (existing.length > 0) {
        // Update brandIds to ensure brand link
        await db
          .update(productTable)
          .set({
            brandIds: [brandId],
            categoryIds: categoryIds,
          })
          .where(eq(productTable.id, existing[0].id));
        console.log(`  Updated existing product link: "${p.name}"`);
        continue;
      }

      const embedding = generatePseudoEmbedding(`${p.name} ${brandName} ${p.type} ${p.shortDesc}`);
      const additionalInfo = {
        ai_metadata: {
          keywords: [brandName.toLowerCase(), p.type.toLowerCase(), "original", "warranty"],
          target_audience: "Shoppers seeking verified top brand quality",
          suggested_questions: [
            `What warranty is provided for this ${brandName} product?`,
            `How fast is delivery for ${p.name}?`,
          ],
          sentiment: "positive",
          embedding,
        },
      };

      await db.insert(productTable).values({
        vendorId,
        name: p.name,
        price: p.price,
        shortDescription: p.shortDesc,
        longDescription: p.longDesc,
        label: p.label,
        type: p.type,
        additionalInfo,
        sizes: p.sizes || ["Standard"],
        images: p.images,
        colorVariants: p.colors || ["Standard"],
        stock: p.stock,
        discount: p.discount || 0,
        brandIds: [brandId],
        categoryIds,
        isActive: true,
        isHot: p.label === "BestSelling" || p.label === "Trending",
        isSponsored: p.label === "Featured",
        budgetTier: p.budgetTier,
      });

      totalInserted++;
      console.log(`  + Inserted: [${brandName}] "${p.name}" (KSh ${p.price.toLocaleString()})`);
    }
  }

  console.log(`\nSuccessfully linked & seeded ${totalInserted} brand products!`);
  await client.end();
  process.exit(0);
}

seedTopBrands().catch((err) => {
  console.error("Error seeding top brands:", err);
  process.exit(1);
});
