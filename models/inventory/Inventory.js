const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
  barCode: { type: String, required: true, unique: true },
  productName: { type: String, required: true },
  availableStock: { type: Number, required: true },
  totalStock: { type: Number, required: true },
  dateAdded: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Inventory", InventorySchema);
