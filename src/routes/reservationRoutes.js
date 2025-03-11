const express = require("express");
const {
  createReservation,
  getReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
} = require("../controller/reservationController");

const router = express.Router();

router.post("/", createReservation);
router.get("/", getReservations);
router.get("/:id", getReservationById);
router.put("/:id", updateReservation);
router.delete("/:id", deleteReservation);

module.exports = router;
