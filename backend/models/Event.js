const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, default: "10:00 AM" },
    location: { type: String, required: true },
    category: { type: String, default: "General" },
    organizer: { type: String, default: "Gram Panchayat" },
    city: { type: String, required: true },
    area: { type: String, default: "" },
    latitude: { type: Number },
    longitude: { type: Number },
    interestedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
