const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const providerRoutes = require("./routes/providerRoutes");
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const eventRoutes = require("./routes/eventRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/providers", providerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/emergency", emergencyRoutes);

app.get("/", (req, res) => {
  res.send("Panchayat API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server Running On Port ${PORT}`);
});
