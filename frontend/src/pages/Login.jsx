import { useState } from "react";
import axios from "axios";

export default function Login() {

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post("http://localhost:5000/api/login", form);

    console.log(res.data);

    localStorage.setItem("user_id", res.data.user._id);
    localStorage.setItem("role", res.data.user.role);
    localStorage.setItem("name", res.data.user.name);

    alert("Login successful");

    if (res.data.user.role === "doctor") {
      window.location.href = "/doctor";
    } else {
      window.location.href = "/patient-dashboard";
    }

  } catch (error) {
    console.log(error);
    alert(error.response?.data?.message || "Login failed");
  }
};


  return (
    <div className="flex items-center justify-center h-screen bg-slate-100">
      <div className="bg-white p-8 rounded shadow w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form onSubmit={handleSubmit}>

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border mb-4"
            placeholder="Email"
            required
          />

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border mb-4"
            placeholder="Password"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );
}
