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
    parsed.port = '5432'; // Port 5432 session mode avoids connection timeouts during long crawls
    return parsed.toString();
  } catch {
    return raw;
  }
}

const client = postgres(getScriptDatabaseUrl(), {
  prepare: false,
  ssl: 'require',
  connect_timeout: 30,
  idle_timeout: 0,
  max: 5,
});

const db = drizzle(client);

interface CategoryTarget {
  name: string;
  urls: string[];
  typeOptions: string[];
  sizeOptions: string[];
  colorOptions: string[];
}

// Strict Adult Content Filter
const ADULT_REGEX = /\b(sex|dildo|vibrat\w*|penis|vagina\w*|clitor\w*|anal|butt\s*plug|masturbat\w*|fetish|erotic|condom|lubricant|lingerie\s*sexy|adult\s*toy|nipple)\b/i;
function isAdultContent(name: string, url?: string): boolean {
  if (ADULT_REGEX.test(name)) return true;
  if (url && (url.includes('adult') || url.includes('sexual') || url.includes('erotic'))) return true;
  return false;
}

// 64-Dimensional L2-Normalized Pseudo-Embedding Generator for Vector DB
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

function generateAiKeywords(name: string, brand: string, type: string): string[] {
  const words = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !['and', 'for', 'with', 'the', 'new', 'pro'].includes(w));
  return Array.from(new Set([brand.toLowerCase(), type.toLowerCase(), ...words.slice(0, 8)]));
}

function getTargetAudience(type: string): string {
  const lower = type.toLowerCase();
  if (lower.includes('food') || lower.includes('grocery') || lower.includes('drink') || lower.includes('beverage') || lower.includes('tea') || lower.includes('snack')) {
    return 'Households, Busy Families, Foodies, Everyday Grocery Shoppers';
  }
  if (lower.includes('book') || lower.includes('novel') || lower.includes('stationery') || lower.includes('paper')) {
    return 'Avid Readers, Students, Educators, Book Club Members';
  }
  if (lower.includes('phone') || lower.includes('tablet') || lower.includes('smart')) {
    return 'Mobile Professionals, Students, Tech Enthusiasts';
  }
  if (lower.includes('laptop') || lower.includes('computer')) {
    return 'Remote Workers, Developers, Students, Creators';
  }
  if (lower.includes('camera') || lower.includes('photo')) {
    return 'Photographers, Content Creators, Travelers';
  }
  if (lower.includes('audio') || lower.includes('earbud') || lower.includes('speaker')) {
    return 'Music Lovers, Audiophiles, Commuters';
  }
  if (lower.includes('fitness') || lower.includes('sport')) {
    return 'Athletes, Gym Goers, Outdoor Adventurers';
  }
  if (lower.includes('beauty') || lower.includes('skin')) {
    return 'Skincare Enthusiasts, Daily Grooming, Wellness Shoppers';
  }
  if (lower.includes('cook') || lower.includes('kitchen')) {
    return 'Home Chefs, Culinary Enthusiasts, Families';
  }
  if (lower.includes('toy') || lower.includes('game')) {
    return 'Kids, Parents, Gamers, Family Entertainment';
  }
  return 'Everyday Shoppers, Homeowners, Gift Buyers';
}

const CATEGORY_CONFIG: CategoryTarget[] = [
  {
    name: 'Food, Drinks & Groceries',
    urls: [
      'https://www.jumia.co.ke/groceries/',
      'https://www.jumia.co.ke/drinks/',
      'https://www.jumia.co.ke/food-cupboard-supplies/',
      'https://www.jumia.co.ke/groceries/?page=2',
      'https://www.jumia.co.ke/drinks/?page=2',
      'https://www.jumia.co.ke/cooking-ingredients/',
      'https://www.jumia.co.ke/snacks/',
    ],
    typeOptions: ['Cooking Oil', 'Pantry Staple', 'Premium Coffee & Tea', 'Breakfast Cereal', 'Juice & Beverages', 'Spices & Seasoning', 'Healthy Snacks'],
    sizeOptions: ['1kg', '2kg', '500g', '1 Litre', '2 Litres', 'Pack of 6', 'Family Size'],
    colorOptions: ['Standard', 'Original', 'Sugar Free', 'Classic Blend'],
  },
  {
    name: 'Books & Stationery',
    urls: [
      'https://www.jumia.co.ke/books/',
      'https://www.jumia.co.ke/books-movies-music/',
      'https://www.jumia.co.ke/books/?page=2',
      'https://www.jumia.co.ke/literature-fiction-books/',
      'https://www.jumia.co.ke/self-help-books/',
      'https://www.jumia.co.ke/childrens-books/',
      'https://www.jumia.co.ke/stationery/',
    ],
    typeOptions: ['Self-Help Book', 'Fiction Novel', 'Educational Textbook', 'Business & Leadership', 'Children Storybook', 'Hardcover Journal'],
    sizeOptions: ['Paperback', 'Hardcover', 'Collector Edition', 'Standard'],
    colorOptions: ['Illustrated', 'Standard Print', 'Deluxe Edition'],
  },
  {
    name: 'Toys & Games',
    urls: [
      'https://www.jumia.co.ke/toys-games/',
      'https://www.jumia.co.ke/toys-games/?page=2',
      'https://www.jumia.co.ke/video-games/',
      'https://www.jumia.co.ke/toys-games/?page=3',
      'https://www.jumia.co.ke/baby-toys/',
    ],
    typeOptions: ['Action Figure', 'Board Game', 'Puzzle Set', 'Gaming Controller', 'Educational Toy', 'RC Car', 'Building Blocks'],
    sizeOptions: ['Standard', 'Ages 3-6', 'Ages 7-12', 'Deluxe Edition', 'Set of 100 Pcs'],
    colorOptions: ['Multicolor', 'Blue', 'Red', 'Yellow', 'Green'],
  },
  {
    name: 'Cameras & Photo',
    urls: [
      'https://www.jumia.co.ke/cameras/',
      'https://www.jumia.co.ke/catalog/?q=camera',
      'https://www.jumia.co.ke/digital-cameras/',
      'https://www.jumia.co.ke/camera-accessories/',
      'https://www.jumia.co.ke/camcorders/',
      'https://www.jumia.co.ke/surveillance-cameras/',
      'https://www.jumia.co.ke/catalog/?q=tripod+stand',
    ],
    typeOptions: ['DSLR Camera', 'Mirrorless Camera', 'Action Cam', 'Camera Lens', 'Tripod Stand', 'Gimbal Stabilizer', 'Security Cam'],
    sizeOptions: ['Standard Kit', 'Body Only', 'Lens Bundle', '4K UHD', '1080p'],
    colorOptions: ['Matte Black', 'Graphite', 'Silver'],
  },
  {
    name: 'Accessories & Jewelry',
    urls: [
      'https://www.jumia.co.ke/smart-watches/',
      'https://www.jumia.co.ke/watches-sunglasses/',
      'https://www.jumia.co.ke/jewellery/',
      'https://www.jumia.co.ke/smart-watches/?page=2',
      'https://www.jumia.co.ke/wallets-card-holders/',
    ],
    typeOptions: ['Smartwatch', 'Chronograph Watch', 'Sunglasses', 'Leather Wallet', 'Bracelet', 'Necklace', 'Travel Bag'],
    sizeOptions: ['One Size', '40mm', '44mm', '46mm', 'Adjustable'],
    colorOptions: ['Gold', 'Silver', 'Rose Gold', 'Matte Black', 'Classic Brown'],
  },
  {
    name: 'Cooking & Kitchenware',
    urls: [
      'https://www.jumia.co.ke/cookware/',
      'https://www.jumia.co.ke/small-appliances/',
      'https://www.jumia.co.ke/kitchen-dining/',
      'https://www.jumia.co.ke/cookware/?page=2',
      'https://www.jumia.co.ke/small-appliances/?page=2',
    ],
    typeOptions: ['Air Fryer', 'Blender', 'Pressure Cooker', 'Non-Stick Pan', 'Electric Kettle', 'Knife Set', 'Toaster'],
    sizeOptions: ['2.5L', '4.5L', '6.0L', 'Set of 6', 'Set of 12', 'Standard'],
    colorOptions: ['Stainless Steel', 'Black', 'Cherry Red', 'Sage Green'],
  },
  {
    name: 'Furniture',
    urls: [
      'https://www.jumia.co.ke/living-room-furniture/',
      'https://www.jumia.co.ke/office-furniture/',
      'https://www.jumia.co.ke/bedroom-furniture/',
      'https://www.jumia.co.ke/living-room-furniture/?page=2',
    ],
    typeOptions: ['Ergonomic Office Chair', 'Coffee Table', 'Shoe Rack', 'Bookshelf', 'Recliner Sofa', 'TV Stand'],
    sizeOptions: ['Standard', 'Large', 'Adjustable', '2-Seater', '3-Seater'],
    colorOptions: ['Charcoal Gray', 'Walnut Wood', 'Deep Brown', 'Cream Beige'],
  },
  {
    name: 'Electronics',
    urls: [
      'https://www.jumia.co.ke/televisions/',
      'https://www.jumia.co.ke/audio-headphones/',
      'https://www.jumia.co.ke/home-audio-electronics/',
      'https://www.jumia.co.ke/electronics/?page=2',
      'https://www.jumia.co.ke/televisions/?page=2',
    ],
    typeOptions: ['4K Smart TV', 'Noise Cancelling Headphones', 'Bluetooth Speaker', 'Soundbar 2.1', 'Streaming Stick', 'Projector'],
    sizeOptions: ['32-inch', '43-inch', '55-inch', '65-inch', 'Standard'],
    colorOptions: ['Titanium Black', 'Silver Trim', 'Matte Slate'],
  },
  {
    name: 'Smart Phones & Tablets',
    urls: [
      'https://www.jumia.co.ke/smartphones/',
      'https://www.jumia.co.ke/tablets/',
      'https://www.jumia.co.ke/mobile-accessories/',
      'https://www.jumia.co.ke/smartphones/?page=2',
      'https://www.jumia.co.ke/smartphones/?page=3',
    ],
    typeOptions: ['Smartphone', 'Tablet', 'Stylus', 'Fast Charger', 'Screen Protector', 'Phone Case', 'Wireless Power Bank'],
    sizeOptions: ['128GB', '256GB', '512GB', '64GB'],
    colorOptions: ['Midnight Black', 'Silver', 'Ocean Blue', 'Titanium Gray'],
  },
  {
    name: 'Beauty & Personal Care',
    urls: [
      'https://www.jumia.co.ke/skin-care/',
      'https://www.jumia.co.ke/fragrances/',
      'https://www.jumia.co.ke/hair-care/',
      'https://www.jumia.co.ke/skin-care/?page=2',
      'https://www.jumia.co.ke/fragrances/?page=2',
    ],
    typeOptions: ['Hydrating Serum', 'Facial Cleanser', 'Eau de Parfum', 'Hair Treatment', 'Sunscreen SPF 50', 'Body Lotion'],
    sizeOptions: ['50ml', '100ml', '200ml', '250ml', 'Single Pack'],
    colorOptions: ['Natural Glow', 'Rose', 'Clear', 'Vanilla Gold'],
  },
  {
    name: 'Fashion & Apparel',
    urls: [
      'https://www.jumia.co.ke/mens-shoes/',
      'https://www.jumia.co.ke/womens-shoes/?page=2',
      'https://www.jumia.co.ke/mens-shoes/?page=2',
      'https://www.jumia.co.ke/category-fashion-by-jumia/?page=2',
    ],
    typeOptions: ['Casual Shirt', 'Denim Jeans', 'Sneakers', 'Running Shoes', 'Formal Blazer', 'Tote Bag'],
    sizeOptions: ['S', 'M', 'L', 'XL', '40', '41', '42', '43', '44'],
    colorOptions: ['Navy Blue', 'Classic Black', 'Pure White', 'Burgundy', 'Olive Green'],
  },
  {
    name: 'Sports & Outdoors',
    urls: [
      'https://www.jumia.co.ke/cardio-training/',
      'https://www.jumia.co.ke/sports-fitness/?page=2',
      'https://www.jumia.co.ke/sporting-goods/?page=2',
      'https://www.jumia.co.ke/cardio-training/?page=2',
    ],
    typeOptions: ['Resistance Bands', 'Dumbbell Set', 'Yoga Mat', 'Jump Rope', 'Sports Water Bottle', 'Fitness Tracker'],
    sizeOptions: ['Standard', '5kg Pair', '10kg Pair', '6mm Thick', '1 Litre'],
    colorOptions: ['Crimson Red', 'Cobalt Blue', 'Stealth Black', 'Emerald Green'],
  },
];

const LABELS = ['BestSelling', 'Popular', 'Featured', 'Trending', 'New', 'MostSelling'] as const;

async function fetchHtml(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
      },
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
  } catch (err: any) {
    clearTimeout(timer);
    throw err;
  }
}

interface RawProduct {
  name: string;
  price: number;
  discount: number;
  brand: string;
  images: string[];
}

function parseProductsFromHtml(html: string, url: string): RawProduct[] {
  const articleRegex = /<article class="prd\s+[^"]*"[\s\S]*?<\/article>/g;
  const articles = html.match(articleRegex) || [];
  const results: RawProduct[] = [];

  for (const articleHtml of articles) {
    let name = '';
    const gtmName = articleHtml.match(/data-gtm-name="([^"]+)"/);
    const ga4Name = articleHtml.match(/data-ga4-item_name="([^"]+)"/);
    const nameDiv = articleHtml.match(/<div class="name">([^<]+)<\/div>/);
    if (gtmName && gtmName[1]) name = gtmName[1];
    else if (ga4Name && ga4Name[1]) name = ga4Name[1];
    else if (nameDiv && nameDiv[1]) name = nameDiv[1];

    name = name
      .replace(/&amp;/g, '&')
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, ' ')
      .trim();

    if (!name || name.length < 3) continue;

    // Strict adult filter
    if (isAdultContent(name, url)) {
      console.log(`   [SKIP ADULT CONTENT]: "${name}"`);
      continue;
    }

    let price = 0;
    const prcMatch = articleHtml.match(/<div class="prc"[^>]*>KSh\s*([0-9,]+)<\/div>/);
    if (prcMatch) {
      price = parseInt(prcMatch[1].replace(/,/g, ''), 10);
    } else {
      const gtmPrice = articleHtml.match(/data-gtm-price="([0-9.]+)"/);
      if (gtmPrice) price = Math.round(parseFloat(gtmPrice[1]) * 130);
    }

    if (!price || price <= 0) continue;

    let discount = 0;
    const bdgMatch = articleHtml.match(/<div class="bdg[^>]*>-?([0-9]+)%<\/div>/);
    if (bdgMatch) {
      discount = parseInt(bdgMatch[1], 10);
    } else {
      const oprcMatch = articleHtml.match(/data-oprc="KSh\s*([0-9,]+)"/);
      if (oprcMatch) {
        const orig = parseInt(oprcMatch[1].replace(/,/g, ''), 10);
        if (orig > price) discount = Math.min(60, Math.round(((orig - price) / orig) * 100));
      }
    }
    if (discount <= 0) discount = Math.floor(Math.random() * 25) + 5;

    let brand = 'Generic';
    const gtmBrand = articleHtml.match(/data-gtm-brand="([^"]+)"/) || articleHtml.match(/data-ga4-item_brand="([^"]+)"/);
    if (gtmBrand && gtmBrand[1].trim()) {
      brand = gtmBrand[1].replace(/&amp;/g, '&').trim();
    } else {
      const firstWord = name.split(' ')[0];
      if (firstWord && firstWord.length > 2 && !['Super', 'Best', 'Hot', 'High', 'New', 'Free'].includes(firstWord)) {
        brand = firstWord;
      }
    }

    const imgMatch =
      articleHtml.match(/data-src="([^"]+)"/) ||
      articleHtml.match(/src="(https:\/\/ke\.jumia\.is[^"]+)"/);
    const images: string[] = [];
    if (imgMatch && imgMatch[1]) {
      const highRes = imgMatch[1]
        .replace(/\/fit-in\/[0-9]+x[0-9]+\//, '/fit-in/500x500/')
        .split('?')[0];
      images.push(highRes);
      if (highRes.includes('/1.jpg')) {
        images.push(highRes.replace('/1.jpg', '/2.jpg'));
        images.push(highRes.replace('/1.jpg', '/3.jpg'));
      }
    }

    if (images.length === 0) continue;

    results.push({ name, price, discount, brand, images });
  }

  return results;
}

async function withRetry<T>(fn: () => Promise<T>, retries = 5, delay = 2000): Promise<T> {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (err: any) {
      attempt++;
      console.warn(`[DB Retry ${attempt}/${retries}] ${err.message}`);
      if (attempt >= retries) throw err;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error("Failed after retries");
}

async function run() {
  console.log('🚀 Phase 1: Checking current catalog status...');
  const vendors = await withRetry(() => db.select().from(vendorTable).limit(5));
  if (!vendors.length) throw new Error('No vendor found');

  const dbCategories = await withRetry(() => db.select().from(categoryTable));
  const existingProducts = await withRetry(() => db.select().from(productTable));
  const existingProductNames = new Set(existingProducts.map((p) => p.name.toLowerCase().trim()));
  console.log(`✓ Currently ${existingProducts.length} clean products in DB across ${dbCategories.length} categories.`);

  const existingBrands = await withRetry(() => db.select().from(brandTable));
  const brandMap = new Map<string, string>();
  for (const b of existingBrands) {
    brandMap.set(b.name.toLowerCase().trim(), b.id);
  }

  async function getOrCreateBrand(brandName: string): Promise<string> {
    const key = brandName.toLowerCase().trim();
    if (brandMap.has(key)) return brandMap.get(key)!;
    try {
      const [newBrand] = await db
        .insert(brandTable)
        .values({
          name: brandName,
          description: `Official ${brandName} products with authentic warranty.`,
        })
        .returning();
      brandMap.set(key, newBrand.id);
      return newBrand.id;
    } catch {
      const found = await db.select().from(brandTable).where(eq(brandTable.name, brandName)).limit(1);
      if (found.length) {
        brandMap.set(key, found[0].id);
        return found[0].id;
      }
      return existingBrands[0]?.id || brandMap.values().next().value || '';
    }
  }

  const TARGET_PER_CATEGORY = 102; // Guarantee at least 100 products per category
  let totalNew = 0;

  console.log('\n🚀 Phase 2: Scaling each category to AT LEAST 100 products...');

  for (const config of CATEGORY_CONFIG) {
    const dbCat = dbCategories.find(
      (c) =>
        c.name.toLowerCase().includes(config.name.toLowerCase()) ||
        config.name.toLowerCase().includes(c.name.toLowerCase())
    );
    if (!dbCat) {
      console.warn(`Category "${config.name}" not found in DB. Skipping.`);
      continue;
    }

    const currentInCat = existingProducts.filter((p) => {
      const catIds = Array.isArray(p.categoryIds) ? (p.categoryIds as string[]) : [];
      return catIds.includes(dbCat.id);
    });

    if (currentInCat.length >= TARGET_PER_CATEGORY) {
      console.log(`✓ [${dbCat.name}] already has ${currentInCat.length} products (>= 100). Skipping.`);
      continue;
    }

    const needed = TARGET_PER_CATEGORY - currentInCat.length;
    console.log(`\n📦 Category [${dbCat.name}]: currently ${currentInCat.length} items. Fetching ${needed} more to reach 100+...`);

    const rawList: RawProduct[] = [];
    for (const url of config.urls) {
      if (rawList.length >= needed) break;
      try {
        console.log(`   Crawling: ${url}`);
        const html = await fetchHtml(url);
        const parsed = parseProductsFromHtml(html, url);
        for (const item of parsed) {
          if (rawList.length >= needed) break;
          const key = item.name.toLowerCase().trim();
          if (!existingProductNames.has(key)) {
            existingProductNames.add(key);
            rawList.push(item);
          }
        }
      } catch (err: any) {
        console.error(`   Error fetching ${url}:`, err.message);
      }
    }

    console.log(`   Inserting ${rawList.length} items for "${dbCat.name}"...`);

    for (let i = 0; i < rawList.length; i++) {
      const item = rawList[i];
      const brandId = await getOrCreateBrand(item.brand);
      const label = LABELS[i % LABELS.length];
      const prodType = config.typeOptions[i % config.typeOptions.length];
      const vendor = vendors[i % vendors.length];

      const shortDesc = `${item.name}. Genuine ${item.brand} product featuring high performance, durability, and reliable everyday utility. Includes manufacturer warranty and fast fulfillment.`.slice(0, 490);
      const longDesc = `
<h3>Overview</h3>
<p>The <strong>${item.name}</strong> from <em>${item.brand}</em> delivers exceptional quality and dependable performance. Engineered for demanding users, it combines robust materials with modern styling to offer the ultimate value.</p>
<h3>Key Features</h3>
<ul>
  <li><strong>Authenticity Guaranteed:</strong> 100% genuine product sourced directly from verified manufacturers.</li>
  <li><strong>Superior Build:</strong> Crafted with high-grade components for long-lasting durability.</li>
  <li><strong>Instant Fulfillment:</strong> Eligible for both Home Delivery and FREE Pickup Station collection.</li>
  <li><strong>Official Warranty:</strong> Covered by standard manufacturer warranty and return protection.</li>
</ul>
<h3>What's in the Box</h3>
<ul>
  <li>1 x ${item.name}</li>
  <li>User Manual & Documentation</li>
  <li>Warranty Card & Security Tag</li>
</ul>`.trim();

      // Determine Budget Tier based on price
      let budgetTier: 'budget' | 'mid' | 'premium' = 'mid';
      if (item.price < 3000) budgetTier = 'budget';
      else if (item.price > 20000) budgetTier = 'premium';

      // Generate AI-Native Metadata for Vector DB & Agentic Search
      const aiKeywords = generateAiKeywords(item.name, item.brand, prodType);
      const aiTags = [prodType, item.brand, label, 'Verified Quality', 'Fast Shipping', budgetTier];
      const aiEmbeddingMock = generatePseudoEmbedding(`${item.name} ${item.brand} ${prodType} ${budgetTier}`);
      const aiSummary = `${item.name} by ${item.brand} offers exceptional performance in ${prodType}, engineered for durability and high value.`;
      const suggestedQuestions = [
        `What are the standout features of this ${item.brand} ${prodType}?`,
        `Is this covered under the platform return policy?`,
        `What is the expected delivery timeframe for this item?`,
      ];

      const additionalInfo = {
        Brand: item.brand,
        Model: `${item.brand.replace(/\s+/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
        Warranty: '1 Year Manufacturer Warranty',
        Authenticity: '100% Original Brand New',
        CountryOfOrigin: 'Official Regional Distribution',
        // AI-Native Fields for Vector Search & AI agents
        aiSummary,
        aiKeywords,
        aiTags,
        aiEmbeddingMock, // 64-dimensional float vector
        sentimentScore: +(0.85 + Math.random() * 0.14).toFixed(2),
        suggestedQuestions,
        targetAudience: getTargetAudience(prodType),
      };

      try {
        await withRetry(() =>
          db.insert(productTable).values({
            vendorId: vendor.id,
            name: item.name,
            price: item.price,
            shortDescription: shortDesc,
            longDescription: longDesc,
            label: label,
            type: prodType,
            additionalInfo: additionalInfo,
            sizes: config.sizeOptions.slice(0, 3),
            images: item.images,
            colorVariants: config.colorOptions.slice(0, 3),
            stock: Math.floor(Math.random() * 45) + 15,
            discount: item.discount,
            brandIds: [brandId],
            categoryIds: [dbCat.id],
            budgetTier,
            isHot: label === 'BestSelling' || Math.random() > 0.7,
            isSponsored: Math.random() > 0.85,
            isActive: true,
          })
        );
        totalNew++;
      } catch (err: any) {
        console.error(`   Failed to insert "${item.name}":`, err.message);
      }
    }
  }

  const finalProducts = await db.select().from(productTable);
  console.log(`\n🎉 DONE! Added ${totalNew} new clean products.`);
  console.log(`Total clean products in database is now: ${finalProducts.length}`);
  process.exit(0);
}

run().catch((e) => {
  console.error('Fatal error in crawler:', e);
  process.exit(1);
});
