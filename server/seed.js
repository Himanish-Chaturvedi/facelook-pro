const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Product = require('./models/Product'); // The blueprint we just made

// Load your secret .env variables
dotenv.config();

// The exact same products from your frontend
const products = [
  { name: 'Velvet Matte Lip', shade: 'Rosewood', price: 349, icon: '💋', tag: 'Bestseller', tagColor: 'var(--rose)' },
  { name: 'Kohl Kajal Pro', shade: 'Deep Black', price: 249, icon: '🖤', tag: 'New', tagColor: 'var(--rose-dark)' },
  { name: 'Glow Highlighter', shade: 'Pearl Blush', price: 449, icon: '✨', tag: 'Limited', tagColor: '#C8909A' },
  { name: 'Rose Blush Duo', shade: 'Petal & Mauve', price: 399, icon: '🌹', tag: null, tagColor: null },
  { name: 'Skin Tint SPF30', shade: 'Natural Beige', price: 599, icon: '💆', tag: null, tagColor: null },
];

const seedDatabase = async () => {
  try {
    await connectDB(); // Turn on the connection

    console.log('Clearing old data...');
    await Product.deleteMany(); // Wipe the database clean so we don't get duplicates

    console.log('Inserting Queen of Mattes collection...');
    await Product.insertMany(products); // Blast the array into MongoDB

    console.log('✅ Database Seeded Successfully!');
    process.exit(); // Close the script
  } catch (error) {
    console.error(`❌ Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

// Run the function
seedDatabase();