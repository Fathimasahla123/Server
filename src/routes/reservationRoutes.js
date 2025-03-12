// const express = require("express");
// const {
//   createReservation,
//   getReservations,
//   getReservationById,
//   updateReservation,
//   deleteReservation,
// } = require("../controllers/reservationController");

// const router = express.Router();

// router.post("/", createReservation);
// router.get("/", getReservations);
// router.get("/:id", getReservationById);
// router.put("/:id", updateReservation);
// router.delete("/:id", deleteReservation);

// module.exports = router;

// routes/reservationRoutes.js
const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const {
  createReservation,
  getReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
} = require('../controllers/reservationController');

const router = express.Router();

// Create a reservation (accessible to Customers)
router.post('/', authenticate, authorize('Customer'), createReservation);

// Get all reservations (accessible to Admin and Staff)
router.get('/', authenticate, authorize(['Admin', 'Staff']), getReservations);

// Get a specific reservation by ID (accessible to Admin, Staff, and the Customer who made the reservation)
router.get('/:id', authenticate, getReservationById);

// Update a reservation (accessible to Admin, Staff, and the Customer who made the reservation)
router.put('/:id', authenticate, updateReservation);

// Delete a reservation (accessible to Admin, Staff, and the Customer who made the reservation)
router.delete('/:id', authenticate, deleteReservation);

module.exports = router;
