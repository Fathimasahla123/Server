const Reservation = require("../models/reservationModel");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();

const createReservation = async (req, res) => {
  const { customerName, phonenumber, date, time, guests, specialRequests } =
    req.body;

  try {
    const reservation = new Reservation({
      customerName,
      phonenumber,
      date,
      time,
      guests,
      specialRequests,
    });
    await reservation.save();
    res.status(201).json({ message: "Reservation created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal sever error", error });
  }
};

const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({});
    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getReservationById = async (req, res) => {
  const { id } = req.params;

  try {
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    res.status(200).json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateReservation = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const reservation = await Reservation.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    res.status(200).json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteReservation = async (req, res) => {
  const { id } = req.params;

  try {
    const reservation = await Reservation.findByIdAndDelete(id);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createReservation,
  getReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
};
