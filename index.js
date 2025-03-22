require("dotenv").config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./src/routes/authRoutes')); // Login/Signup
app.use('/api/admin',require('./src/routes/adminRoutes'));
//app.use('/api/dashboard', dashboardRoutes); // Role-based dashboards
// app.use('/api/reservations', reservationRoutes); // Reservations
// app.use('/api/orders', orderRoutes); // Orders
// app.use('/api/payments', paymentRoutes); // Payments
// app.use('/api/feedback', feedbackRoutes); // Feedback
// app.use('/api/analytics', analyticsRoutes); // Analytics
app.use('/api/staff',require('./src/routes/staffRoutes')); // Staff management




app.all("*", (req,res)=>{
      res.send("api is working");
  })
  
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
