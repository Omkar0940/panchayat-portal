const express = require("express");
const router = express.Router();
const Provider = require("../models/Provider");

// GET ALL PROVIDERS (with optional search & category filter)
router.get("/", async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (category && category !== "all") {
      query.category = { $regex: category, $options: "i" };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { area: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
      ];
    }

    const providers = await Provider.find(query);
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD PROVIDER
router.post("/", async (req, res) => {
  try {
    const provider = await Provider.create(req.body);
    res.status(201).json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET SINGLE PROVIDER
router.get("/:id", async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE PROVIDER
router.put("/:id", async (req, res) => {
  try {
    const provider = await Provider.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE PROVIDER
router.delete("/:id", async (req, res) => {
  try {
    await Provider.findByIdAndDelete(req.params.id);
    res.json({ message: "Provider Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
