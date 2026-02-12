import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const doctorId = localStorage.getItem("user_id");

  const [doctor, setDoctor] = useState({
    name: ""
  });

  const [appointments, setAppointments] = useState([]);

  const handleLogout = () => {
  localStorage.clear();
  navigate("/login");
};
  useEffect(() => {
    setDoctor({
      name: localStorage.getItem("name") || "Doctor"
    });

    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/appointment/doctor/${doctorId}`
      );

      setAppointments(res.data);
    } catch (err) {
      console.log("Doctor dashboard error:", err);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const todaySchedule = appointments.filter(
    (appt) =>
      appt.date === today && appt.status === "accepted"
  );

  const confirmed = appointments.filter(
    (appt) => appt.status === "accepted"
  ).length;

  const pending = appointments.filter(
    (appt) => appt.status === "pending"
  ).length;

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="flex justify-between items-center mb-6">
  <h1 className="text-3xl font-bold">
    Welcome Dr. {doctor.name}
  </h1>

  <button
    onClick={handleLogout}
    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
  >
    Logout
  </button>
</div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatCard title="Confirmed" value={confirmed} />
        <StatCard title="Pending" value={pending} />
        <StatCard title="Total" value={appointments.length} />
      </div>

      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Today's Accepted Appointments
        </h2>

        {todaySchedule.length === 0 ? (
          <p>No accepted appointments today.</p>
        ) : (
          todaySchedule.map((appt) => (
            <div key={appt._id} className="border p-3 mb-3 rounded">
              <p>
                <strong>Patient:</strong>{" "}
                {appt.patientId?.name || "Unknown"}
              </p>
              <p>{appt.date} • {appt.time}</p>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => navigate("/doctor/appointments")}
        className="border px-4 py-2 rounded"
      >
        Manage Appointments
      </button>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <p>{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
