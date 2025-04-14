require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
connectDB();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  
  })
);
app.options('*', cors());

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));
app.use("/api/staff", require("./src/routes/staffRoutes"));
app.use("/api/customer", require("./src/routes/customerRoutes"));
app.use("/api/analytic", require("./src/routes/analyticRoutes"));
app.use("/api/product", require("./src/routes/productRoutes"));

app.all("*", (req, res) => {
  res.send("api is working");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
