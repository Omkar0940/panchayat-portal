const express = require("express");
const router = express.Router();
const Emergency = require("../models/Emergency");

// GET ALL EMERGENCY CONTACTS
router.get("/", async (req, res) => {
  try {
    const contacts = await Emergency.find().sort({ type: 1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD EMERGENCY CONTACT
router.post("/", async (req, res) => {
  try {
    const contact = await Emergency.create(req.body);
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE EMERGENCY CONTACT
router.put("/:id", async (req, res) => {
  try {
    const contact = await Emergency.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE EMERGENCY CONTACT
router.delete("/:id", async (req, res) => {
  try {
    await Emergency.findByIdAndDelete(req.params.id);
    res.json({ message: "Emergency Contact Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
