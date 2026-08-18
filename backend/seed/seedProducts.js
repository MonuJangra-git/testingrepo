/**
 * Seed script: populates the "products" collection with realistic dummy
 * products for testing the catalog UI.
 *
 * NOTE: The descriptions below are pre-written, hand-crafted marketing-style
 * copy (they simulate what an AI product-description generator might output).
 * They are NOT fetched from a live AI API -- this keeps the seed script
 * fast, free, and runnable offline. See README.md for details.
 *
 * Usage:
 *   node seed/seedProducts.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce';

const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Immerse yourself in rich, room-filling sound with these over-ear wireless headphones. Featuring active noise cancellation and a 30-hour battery life, they are built for long commutes and even longer work sessions. Soft memory-foam ear cushions keep things comfortable from morning to night.',
    price: 2499,
    category: 'Electronics',
    rating: 4.3,
    stock: 85,
    seller: 'SoundWave Electronics',
    seed: 'headphones1'
  },
  {
    name: 'Cotton Crew Neck T-Shirt',
    description: 'A wardrobe essential made from 100% breathable combed cotton. This classic crew-neck tee holds its shape wash after wash and pairs effortlessly with jeans, shorts, or joggers. Available in a relaxed, everyday fit.',
    price: 499,
    category: 'Clothing',
    rating: 4.1,
    stock: 200,
    seller: 'Urban Threads',
    seed: 'tshirt1'
  },
  {
    name: 'Non-Stick Fry Pan 26cm',
    description: 'Cook restaurant-quality meals at home with this heavy-gauge non-stick fry pan. The reinforced coating resists scratches and ensures food releases effortlessly with little to no oil. An ergonomic stay-cool handle makes flipping and stirring safe and simple.',
    price: 899,
    category: 'Home',
    rating: 4.4,
    stock: 120,
    seller: 'KitchenPro',
    seed: 'frypan1'
  },
  {
    name: 'The Silent Orchard: A Novel',
    description: 'A gripping tale of family secrets set against the backdrop of a quiet countryside orchard. Critics have praised its lyrical prose and unforgettable characters. Perfect for readers who love slow-burn mysteries with emotional depth.',
    price: 349,
    category: 'Books',
    rating: 4.6,
    stock: 60,
    seller: 'Penhouse Publishing',
    seed: 'book1'
  },
  {
    name: 'Yoga Mat with Carry Strap',
    description: 'This extra-thick 8mm yoga mat provides superior cushioning for joints while maintaining excellent grip for balance poses. The eco-friendly, non-toxic material is lightweight and comes with a convenient carry strap for the gym or studio.',
    price: 799,
    category: 'Sports',
    rating: 4.2,
    stock: 150,
    seller: 'FlexFit Gear',
    seed: 'yogamat1'
  },
  {
    name: 'Building Blocks Set (250 Pieces)',
    description: 'Spark creativity and fine motor skills with this colorful 250-piece building block set. Compatible with most major brick brands, it comes in a reusable storage tub perfect for cleanup. A timeless toy that grows with your child.',
    price: 1299,
    category: 'Toys',
    rating: 4.5,
    stock: 90,
    seller: 'PlayWorks',
    seed: 'blocks1'
  },
  {
    name: 'Smartwatch with Heart Rate Monitor',
    description: 'Track your steps, sleep, and heart rate around the clock with this sleek smartwatch. A vibrant AMOLED display and 7-day battery life keep you connected without constant charging. Water-resistant design means it can keep up with any workout.',
    price: 3499,
    category: 'Electronics',
    rating: 4.0,
    stock: 70,
    seller: 'PulseTech',
    seed: 'smartwatch1'
  },
  {
    name: 'Denim Slim Fit Jeans',
    description: 'Crafted from premium stretch denim, these slim-fit jeans move with you throughout the day. A classic five-pocket design and fade-resistant wash make them easy to dress up or down. Built to last through countless wears and washes.',
    price: 1599,
    category: 'Clothing',
    rating: 4.2,
    stock: 140,
    seller: 'Urban Threads',
    seed: 'jeans1'
  },
  {
    name: 'Memory Foam Pillow (Set of 2)',
    description: 'Wake up refreshed with these contouring memory foam pillows designed to support your neck and shoulders. The breathable bamboo-blend cover helps regulate temperature through the night. Hypoallergenic materials make them safe for sensitive sleepers.',
    price: 1199,
    category: 'Home',
    rating: 4.3,
    stock: 100,
    seller: 'DreamHome',
    seed: 'pillow1'
  },
  {
    name: 'Atomic Habits for Beginners',
    description: 'A practical, easy-to-follow guide to building better habits and breaking bad ones. Packed with real-world examples and actionable frameworks, it distills behavioral science into steps anyone can apply today. A must-read for anyone chasing steady, lasting change.',
    price: 399,
    category: 'Books',
    rating: 4.7,
    stock: 80,
    seller: 'Penhouse Publishing',
    seed: 'book2'
  },
  {
    name: 'Adjustable Dumbbell Set (5-25kg)',
    description: 'Save space without sacrificing your workout with this adjustable dumbbell set. A quick-turn dial lets you switch weights in seconds, covering everything from warm-up sets to heavy lifts. Durable cast-iron plates are built to handle years of training.',
    price: 5999,
    category: 'Sports',
    rating: 4.4,
    stock: 40,
    seller: 'FlexFit Gear',
    seed: 'dumbbell1'
  },
  {
    name: 'Remote Control Racing Car',
    description: 'Race across any terrain with this high-speed remote control car featuring all-wheel drive and shock-absorbing suspension. A rechargeable battery delivers up to 40 minutes of nonstop play. Durable polycarbonate shell shrugs off bumps and crashes.',
    price: 1899,
    category: 'Toys',
    rating: 4.1,
    stock: 65,
    seller: 'PlayWorks',
    seed: 'rccar1'
  },
  {
    name: '4K Ultra HD Action Camera',
    description: 'Capture every adventure in stunning 4K resolution with this compact, waterproof action camera. Built-in image stabilization keeps footage smooth even on the bumpiest trails. Includes a full mounting kit for helmets, bikes, and more.',
    price: 4299,
    category: 'Electronics',
    rating: 4.3,
    stock: 55,
    seller: 'SoundWave Electronics',
    seed: 'actioncam1'
  },
  {
    name: 'Woolen Winter Sweater',
    description: 'Stay warm without the bulk in this soft wool-blend sweater. A ribbed hem and cuffs lock in warmth while the classic crew neckline keeps things versatile. Ideal for layering on the chilliest days of the year.',
    price: 1799,
    category: 'Clothing',
    rating: 4.0,
    stock: 110,
    seller: 'Nordic Knits',
    seed: 'sweater1'
  },
  {
    name: 'Stainless Steel Cookware Set (5 Pieces)',
    description: 'Upgrade your kitchen with this durable 5-piece stainless steel cookware set. Tri-ply construction ensures even heat distribution, eliminating hot spots and burnt edges. Oven-safe and dishwasher-safe for everyday convenience.',
    price: 3999,
    category: 'Home',
    rating: 4.5,
    stock: 45,
    seller: 'KitchenPro',
    seed: 'cookware1'
  },
  {
    name: "Children's Illustrated Fairy Tales",
    description: 'A beautifully illustrated collection of classic fairy tales retold for young readers. Vivid artwork on every page brings each story to life, making bedtime reading something to look forward to. A treasured addition to any child\'s bookshelf.',
    price: 599,
    category: 'Books',
    rating: 4.8,
    stock: 75,
    seller: 'Little Readers Press',
    seed: 'book3'
  },
  {
    name: 'Football Size 5 Match Ball',
    description: 'Engineered for consistent flight and touch, this size-5 match ball meets official competition standards. A durable synthetic leather cover withstands rough play on grass or turf. Bright, high-visibility graphics make it easy to track in any weather.',
    price: 999,
    category: 'Sports',
    rating: 4.3,
    stock: 130,
    seller: 'FlexFit Gear',
    seed: 'football1'
  },
  {
    name: 'Wooden Puzzle Set for Toddlers',
    description: 'Introduce toddlers to shapes, colors, and problem-solving with this set of chunky wooden puzzles. Smooth, rounded edges and non-toxic paint make them safe for little hands. Each piece is sized perfectly for developing motor skills.',
    price: 699,
    category: 'Toys',
    rating: 4.6,
    stock: 95,
    seller: 'PlayWorks',
    seed: 'puzzle1'
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: 'Take your music anywhere with this rugged, splash-resistant Bluetooth speaker. Deep bass and crisp highs come packed into a compact body with 12 hours of playback per charge. Pair two speakers together for true stereo sound.',
    price: 1699,
    category: 'Electronics',
    rating: 4.2,
    stock: 100,
    seller: 'SoundWave Electronics',
    seed: 'speaker1'
  },
  {
    name: 'Leather Wallet for Men',
    description: 'Handcrafted from genuine leather, this slim bifold wallet offers ample storage without the bulk. Multiple card slots and a dedicated cash compartment keep everything organized. A timeless accessory that ages beautifully with use.',
    price: 899,
    category: 'Clothing',
    rating: 4.4,
    stock: 160,
    seller: 'Urban Threads',
    seed: 'wallet1'
  },
  {
    name: 'LED Desk Lamp with USB Charging',
    description: 'Light up your workspace with this adjustable LED desk lamp featuring five brightness levels and three color temperatures. A built-in USB port lets you charge your phone without hunting for another outlet. Foldable design saves desk space when not in use.',
    price: 1099,
    category: 'Home',
    rating: 4.3,
    stock: 85,
    seller: 'DreamHome',
    seed: 'lamp1'
  },
  {
    name: 'The Art of Mindful Living',
    description: 'A gentle, practical introduction to mindfulness for readers navigating busy modern lives. Short daily exercises help build a sustainable meditation habit without feeling overwhelming. Grounded in research yet written in warm, approachable language.',
    price: 449,
    category: 'Books',
    rating: 4.5,
    stock: 70,
    seller: 'Penhouse Publishing',
    seed: 'book4'
  },
  {
    name: 'Cycling Helmet with Visor',
    description: 'Ride with confidence in this lightweight, well-ventilated cycling helmet. An adjustable dial system ensures a secure, custom fit for every head shape. The detachable visor shields your eyes from sun and light rain.',
    price: 1499,
    category: 'Sports',
    rating: 4.1,
    stock: 60,
    seller: 'FlexFit Gear',
    seed: 'helmet1'
  },
  {
    name: 'Plush Teddy Bear (18 inch)',
    description: 'Ultra-soft and huggable, this 18-inch teddy bear makes the perfect gift for kids and kids at heart. Premium plush fabric and reinforced stitching mean it can survive years of bedtime cuddles. Available with a cute embroidered bow.',
    price: 799,
    category: 'Toys',
    rating: 4.7,
    stock: 110,
    seller: 'PlayWorks',
    seed: 'teddy1'
  },
  {
    name: 'Noise Cancelling Earbuds',
    description: 'Enjoy true wireless freedom with these compact earbuds featuring active noise cancellation and a snug, secure fit. Touch controls make it easy to skip tracks or answer calls without reaching for your phone. The charging case delivers an extra 24 hours of listening.',
    price: 2199,
    category: 'Electronics',
    rating: 4.2,
    stock: 90,
    seller: 'SoundWave Electronics',
    seed: 'earbuds1'
  },
  {
    name: 'Formal Cotton Shirt',
    description: 'Tailored for a sharp, polished look, this wrinkle-resistant cotton shirt is ready for the boardroom or a night out. Reinforced button plackets and a tapered fit add a modern touch to a classic silhouette.',
    price: 1299,
    category: 'Clothing',
    rating: 4.0,
    stock: 130,
    seller: 'Nordic Knits',
    seed: 'shirt1'
  },
  {
    name: 'Ceramic Dinner Set (16 Pieces)',
    description: 'Set an elegant table with this 16-piece ceramic dinnerware set, service for four. The chip-resistant glaze keeps plates and bowls looking new for years. Microwave and dishwasher safe for effortless everyday use.',
    price: 2799,
    category: 'Home',
    rating: 4.4,
    stock: 50,
    seller: 'DreamHome',
    seed: 'dinnerset1'
  },
  {
    name: 'Cookbook: 100 Weeknight Dinners',
    description: 'Never wonder what to cook again with this collection of 100 fast, family-friendly recipes. Each dish is designed to come together in 30 minutes or less using everyday ingredients. Includes clear step-by-step photos for every recipe.',
    price: 549,
    category: 'Books',
    rating: 4.6,
    stock: 65,
    seller: 'Penhouse Publishing',
    seed: 'book5'
  },
  {
    name: 'Resistance Bands Set (5 Levels)',
    description: 'Build strength anywhere with this set of five resistance bands ranging from light to extra-heavy. Color-coded levels make it easy to progress your workouts over time. Includes a mesh carry bag, perfect for travel or home gyms.',
    price: 599,
    category: 'Sports',
    rating: 4.3,
    stock: 140,
    seller: 'FlexFit Gear',
    seed: 'bands1'
  },
  {
    name: 'Building Robot Toy Kit',
    description: 'Introduce kids to STEM concepts with this build-your-own robot kit. Simple snap-together pieces teach basic engineering and coding logic through hands-on play. Motorized parts bring the finished robot to life with lights and movement.',
    price: 1999,
    category: 'Toys',
    rating: 4.5,
    stock: 55,
    seller: 'PlayWorks',
    seed: 'robot1'
  }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB at', MONGODB_URI, '...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    console.log('Deleting existing products...');
    await Product.deleteMany({});

    const docs = products.map((p) => ({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      rating: p.rating,
      stock: p.stock,
      seller: p.seller,
      imageUrl: `https://picsum.photos/seed/${p.seed}/400/300`
    }));

    console.log(`Inserting ${docs.length} products...`);
    await Product.insertMany(docs);

    console.log(`Done! Seeded ${docs.length} products.`);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seed();
