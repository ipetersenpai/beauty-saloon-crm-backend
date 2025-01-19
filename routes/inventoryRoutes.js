const express = require("express");
const router = express.Router();
const Inventory = require("../models/inventory/Inventory");

// Add a new inventory item
router.post("/inventory", async (req, res) => {
  try {
    const { barCode, productName, availableStock, totalStock } = req.body;

    const newInventoryItem = new Inventory({
      barCode,
      productName,
      availableStock,
      totalStock,
    });

    await newInventoryItem.save();
    res
      .status(201)
      .json({
        message: "Inventory item added successfully",
        data: newInventoryItem,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all inventory items
router.get("/inventory", async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single inventory item by _id
router.get("/inventory/:id", async (req, res) => {
  try {
    const inventoryItem = await Inventory.findById(req.params.id);

    if (!inventoryItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.status(200).json(inventoryItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an inventory item by _id
router.put("/inventory/:id", async (req, res) => {
  try {
    const { barCode, productName, availableStock, totalStock } = req.body;

    // Prepare an object to update based on the incoming request data
    const updatedData = {};

    if (barCode) updatedData.barCode = barCode;
    if (productName) updatedData.productName = productName;
    if (availableStock !== undefined)
      updatedData.availableStock = availableStock;
    if (totalStock !== undefined) updatedData.totalStock = totalStock;

    const updatedInventoryItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true, // This will return the updated document
      }
    );

    if (!updatedInventoryItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res
      .status(200)
      .json({
        message: "Inventory item updated successfully",
        data: updatedInventoryItem,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an inventory item by _id
router.delete("/inventory/:id", async (req, res) => {
  try {
    const deletedItem = await Inventory.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res
      .status(200)
      .json({
        message: "Inventory item deleted successfully",
        data: deletedItem,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
