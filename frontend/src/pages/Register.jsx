import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    specialization: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/register", form);
      alert("Registration successful");
    } catch (error) {
      alert("Registration failed");
      console.log(error.response?.data);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-100">
      <div className="bg-white p-8 rounded shadow w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            onChange={handleChange}
            className="w-full p-2 border mb-3"
            placeholder="Name"
            required
          />

          <input
            name="email"
            onChange={handleChange}
            className="w-full p-2 border mb-3"
            placeholder="Email"
            required
          />

          <select
            name="role"
            onChange={handleChange}
            className="w-full p-2 border mb-3"
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>

          {form.role === "doctor" && (
            <input
              name="specialization"
              onChange={handleChange}
              className="w-full p-2 border mb-3"
              placeholder="Specialization"
              required
            />
          )}

          <input
            name="password"
            type="password"
            onChange={handleChange}
            className="w-full p-4 border mb-4"
            placeholder="Password"
            required
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
