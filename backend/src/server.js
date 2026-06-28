require("dotenv").config();

const express = require("express");
const cors = require("cors");
const healthRoutes = require("./routes/health");

const app = express();
app.use(cors());
app.use("/api/health", healthRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
