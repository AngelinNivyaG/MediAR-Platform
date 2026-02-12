import { useEffect, useState } from "react";
import axios from "axios";

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    doctorId: "",
    date: "",
    time: "",
    reason: ""
  });

  const patientId = localStorage.getItem("user_id"); // ✅ FIXED

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/doctors");
      setDoctors(res.data);
    } catch (err) {
      console.log("Fetch doctor error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/appointment/book", {
        ...form,
        patientId
      });

      alert("Appointment request sent");
      window.location.href = "/patient-dashboard";
    } catch (err) {
      console.log("Book error:", err);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Book Appointment</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <select
          required
          onChange={(e) =>
            setForm({ ...form, doctorId: e.target.value })
          }
          className="border p-2 w-full"
        >
          <option value="">Select Doctor</option>
          {doctors.map((doc) => (
            <option key={doc._id} value={doc._id}>
              Dr. {doc.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          required
          className="border p-2 w-full"
          onChange={(e) =>
            setForm({ ...form, date: e.target.value })
          }
        />

        <input
          type="time"
          required
          className="border p-2 w-full"
          onChange={(e) =>
            setForm({ ...form, time: e.target.value })
          }
        />

        <textarea
          placeholder="Reason"
          className="border p-2 w-full"
          onChange={(e) =>
            setForm({ ...form, reason: e.target.value })
          }
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Book
        </button>

      </form>
    </div>
  );
}
