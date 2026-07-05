require("dotenv").config();

const express = require("express");
const cors = require("cors");
const healthRoutes = require("./routes/health");
const propertyRoutes = require("./routes/properties");

const app = express();
app.use(cors());
app.use("/api/health", healthRoutes);
app.use("/api/properties", propertyRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
