// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const reservationRoutes = require("./src/routes/reservationRoutes")


// app.use(express.json());;
// connectDB();

// const app = express();
// app.use(cors());

// app.use('/api/reservations', reservationRoutes);
// app.all("*", (req,res)=>{
//     res.send("api is working");
// })

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server started on port ${PORT}`);
// });

require("dotenv").config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
connectDB();


// Import routers
const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
//const dashboardRoutes = require('./src/routes/dashboardRoutes');
const reservationRoutes = require('./src/routes/reservationRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const feedbackRoutes = require('./src/routes/feedbackRoutes');
const analyticsRoutes = require('./src/routes/analyticRoutes');
const staffRoutes = require('./src/routes/staffRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // Login/Signup
app.use('/api/admin',adminRoutes);
//app.use('/api/dashboard', dashboardRoutes); // Role-based dashboards
app.use('/api/reservations', reservationRoutes); // Reservations
app.use('/api/orders', orderRoutes); // Orders
app.use('/api/payments', paymentRoutes); // Payments
app.use('/api/feedback', feedbackRoutes); // Feedback
app.use('/api/analytics', analyticsRoutes); // Analytics
app.use('/api/staff', staffRoutes); // Staff management

// Error handling middleware
// app.use((err, req, res, next) => {
//   res.status(500).json({ error: err.message });
// });


app.all("*", (req,res)=>{
      res.send("api is working");
  })
  
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
