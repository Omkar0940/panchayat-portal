const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    console.error(
      "Tip: Add 0.0.0.0/0 to your MongoDB Atlas IP whitelist to allow connections from Replit."
    );
  }
};

module.exports = connectDB;
