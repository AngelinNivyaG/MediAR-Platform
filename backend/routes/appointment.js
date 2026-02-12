const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

/* =========================================
   📌 BOOK APPOINTMENT
========================================= */
router.post("/book", async (req, res) => {
  try {
    const { patientId, doctorId, date, time, reason } = req.body;

    if (!patientId || !doctorId || !date || !time) {
      return res.status(400).json({
        message: "All required fields must be filled"
      });
    }

    const appointment = new Appointment({
      patientId,
      doctorId,
      date,
      time,
      reason,
      status: "pending"
    });

    await appointment.save();

    res.status(201).json({
      message: "Appointment request sent successfully",
      appointment
    });

  } catch (err) {
    console.error("Book Error:", err);
    res.status(500).json({ error: err.message });
  }
});


/* =========================================
   📌 GET ALL APPOINTMENTS FOR DOCTOR
========================================= */
router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctorId: req.params.doctorId
    })
      .populate("patientId", "name email")
      .sort({ createdAt: -1 });

    res.json(appointments);

  } catch (err) {
    console.error("Doctor Fetch Error:", err);
    res.status(500).json({ error: err.message });
  }
});


/* =========================================
   📌 GET ALL APPOINTMENTS FOR PATIENT
========================================= */
router.get("/patient/:patientId", async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.params.patientId
    })
      .populate("doctorId", "name email specialization")
      .sort({ createdAt: -1 });

    res.json(appointments);

  } catch (err) {
    console.error("Patient Fetch Error:", err);
    res.status(500).json({ error: err.message });
  }
});


/* =========================================
   ✅ ACCEPT APPOINTMENT
========================================= */
router.put("/accept/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "accepted" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({
      message: "Appointment accepted",
      appointment
    });

  } catch (err) {
    console.error("Accept Error:", err);
    res.status(500).json({ error: err.message });
  }
});


/* =========================================
   ❌ REJECT APPOINTMENT
========================================= */
router.put("/reject/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({
      message: "Appointment rejected",
      appointment
    });

  } catch (err) {
    console.error("Reject Error:", err);
    res.status(500).json({ error: err.message });
  }
});


/* =========================================
   🔁 RESCHEDULE APPOINTMENT
========================================= */
router.put("/reschedule/:id", async (req, res) => {
  try {
    const { date, time } = req.body;

    if (!date || !time) {
      return res.status(400).json({
        message: "New date and time required"
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        status: "rescheduled",
        rescheduledDate: date,
        rescheduledTime: time
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({
      message: "Appointment rescheduled",
      appointment
    });

  } catch (err) {
    console.error("Reschedule Error:", err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
