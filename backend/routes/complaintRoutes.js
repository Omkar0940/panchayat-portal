const express = require("express");
const router = express.Router();

const Complaint = require("../models/Complaint");

// GET ALL COMPLAINTS
router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find();

    res.json(complaints);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ADD COMPLAINT
router.post("/", async (req, res) => {
  try {
    const complaint = await Complaint.create(req.body);

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// UPDATE COMPLAINT STATUS
router.put("/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
      }
    );

    res.json(complaint);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;