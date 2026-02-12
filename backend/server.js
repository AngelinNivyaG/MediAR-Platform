const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const patientRoutes = require("./routes/patient");
const app = express();
const doctorRoutes = require("./routes/doctor");
const appointmentRoutes = require("./routes/appointment");
const userRoutes = require("./routes/users");

app.use(cors());
app.use(express.json());
app.use("/api/patient", patientRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/users", userRoutes);


mongoose.connect("mongodb://127.0.0.1:27017/mediarDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use("/api", authRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
