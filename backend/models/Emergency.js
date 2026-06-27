const mongoose = require("mongoose");

const emergencySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: [
        "Hospital",
        "Ambulance",
        "Doctor",
        "Police",
        "Fire Station",
        "Blood Bank",
        "Pharmacy",
        "Municipal Office",
        "Other",
      ],
    },
    phone: { type: String, required: true },
    phone2: { type: String, default: "" },
    address: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: String, default: "" },
    latitude: { type: Number },
    longitude: { type: Number },
    available24x7: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Emergency", emergencySchema);
