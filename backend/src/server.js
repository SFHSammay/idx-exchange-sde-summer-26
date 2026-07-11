require("dotenv").config();

const express = require("express");
const cors = require("cors");
const healthRoutes = require("./routes/health");
const propertyRoutes = require("./routes/properties");

const app = express();

app.use(cors());

app.use((req, res, next) => {
  const startTime = Date.now();
  const timestamp = new Date().toLocaleString();
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    console.log(
      `${timestamp} ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`
    );
  });
  next();
});

app.use("/api/health", healthRoutes);
app.use("/api/properties", propertyRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
