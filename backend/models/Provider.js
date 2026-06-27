const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    whatsapp: {
      type: String,
    },

    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    area: {
      type: String,
      required: true,
    },

    latitude: Number,

    longitude: Number,

    rating: {
      type: Number,
      default: 4.0,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    openNow: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Provider", providerSchema);