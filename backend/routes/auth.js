// const express = require("express");
// const bcrypt = require("bcryptjs");
// const User = require("../models/User");

// const router = express.Router();

// /* ================= REGISTER ================= */

// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password, role, specialization } = req.body;

//     // Basic validation
//     if (!name || !email || !password || !role) {
//       return res.status(400).json({ message: "All required fields must be filled" });
//     }

//     const normalizedEmail = email.toLowerCase().trim();

//     // Check if user exists
//     const existingUser = await User.findOne({ email: normalizedEmail });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user object
//     const newUserData = {
//       name,
//       email: normalizedEmail,
//       password: hashedPassword,
//       role,
//     };

//     // Add specialization only if doctor
//     if (role === "doctor") {
//       if (!specialization) {
//         return res.status(400).json({ message: "Specialization required for doctor" });
//       }
//       newUserData.specialization = specialization;
//     }

//     const newUser = new User(newUserData);

//     await newUser.save();

//     res.status(201).json({ message: "User registered successfully" });

//   } catch (err) {
//     console.error("Register error:", err);
//     res.status(500).json({ message: "Registration failed" });
//   }
// });


// /* ================= LOGIN ================= */

// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password required" });
//     }

//     const normalizedEmail = email.toLowerCase().trim();

//     const user = await User.findOne({ email: normalizedEmail });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Compare password safely
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid password" });
//     }

//     res.status(200).json({
//       message: "Login successful",
//       role: user.role,
//       userId: user._id,
//       name: user.name
//     });

//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ message: "Login failed" });
//   }
// });


// module.exports = router;
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, specialization } = req.body;

    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      specialization: role === "doctor" ? specialization : null
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Registration failed" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase()
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        role: user.role
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
