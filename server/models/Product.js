const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shade: { type: String, required: true },
  price: { type: Number, required: true },
  icon: { type: String, required: true }, // E.g., "💋"
  tag: { type: String, default: null }, // E.g., "Bestseller"
  tagColor: { type: String, default: null } // E.g., "var(--rose)"
}, {
  timestamps: true // Automatically adds createdAt and updatedAt dates
});

module.exports = mongoose.model('Product', productSchema);