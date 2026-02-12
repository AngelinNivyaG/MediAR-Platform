import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const patientId = localStorage.getItem("user_id");

  const [user, setUser] = useState({
    name: ""
  });

  const [stats, setStats] = useState({
    consultations: 0,
    xrays: 0,
    appointments: 0,
    reports: 0
  });

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
  localStorage.clear();
  navigate("/login");
};
  useEffect(() => {
    const name = localStorage.getItem("name");

    setUser({
      name: name || "Patient"
    });

    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      if (!patientId) {
        console.log("No patient ID found");
        return;
      }

      const res = await axios.get(
        `http://localhost:5000/api/appointment/patient/${patientId}`
      );

      setAppointments(res.data);

      setStats({
        consultations: 0,
        xrays: 0,
        appointments: res.data.length,
        reports: 0
      });

    } catch (err) {
      console.log("Patient dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
  <div>
    <h1 className="text-3xl font-bold">My Health Dashboard</h1>
    <p className="text-gray-600">Welcome, {user.name}</p>
  </div>

  <button
    onClick={handleLogout}
    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
  >
    Logout
  </button>
</div>


      {/* STATS */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card title="Consultations" value={stats.consultations} />
        <Card title="X-rays Uploaded" value={stats.xrays} />
        <Card title="Upcoming Appointments" value={stats.appointments} />
        <Card title="Reports" value={stats.reports} />
      </div>

      {/* MAIN SECTION */}
      <div className="grid grid-cols-2 gap-6 mb-8">

        {/* APPOINTMENTS */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">
            My Appointments
          </h2>

          {loading ? (
            <p>Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <p className="text-gray-500">
              No appointments yet.
            </p>
          ) : (
            appointments.map((appt) => (
              <div
                key={appt._id}
                className="border p-4 rounded-lg mb-4"
              >
                <p className="font-semibold text-lg">
                  Dr. {appt.doctorId?.name || "Doctor"}
                </p>

                <p className="text-sm text-gray-600">
                  {appt.date} • {appt.time}
                </p>

                <p className="mt-1 font-medium">
                  Status:{" "}
                  <span
                    className={
                      appt.status === "accepted"
                        ? "text-green-600"
                        : appt.status === "rejected"
                        ? "text-red-600"
                        : appt.status === "rescheduled"
                        ? "text-blue-600"
                        : "text-yellow-600"
                    }
                  >
                    {appt.status}
                  </span>
                </p>

                {appt.status === "rescheduled" && (
                  <p className="text-blue-600 text-sm mt-1">
                    New Date: {appt.rescheduledDate} • {appt.rescheduledTime}
                  </p>
                )}

                {appt.status === "accepted" && (
                  <button
                    onClick={() => navigate("/consultation")}
                    className="mt-3 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                  >
                    Start Consultation
                  </button>
                )}
              </div>
            ))
          )}

          <button
            onClick={() => navigate("/book-appointment")}
            className="mt-4 w-full border py-2 rounded-lg hover:bg-gray-100"
          >
            Schedule New Appointment
          </button>
        </div>

        {/* MEDICAL RECORDS */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">
            Recent Medical Records
          </h2>

          <p className="text-gray-500 mb-4">
            No medical records yet. Upload an X-ray to get started!
          </p>

          <button
            onClick={() => navigate("/records")}
            className="w-full border py-2 rounded-lg hover:bg-gray-100"
          >
            View All Records
          </button>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">
          Quick Actions
        </h2>

        <div className="flex gap-4 flex-wrap">

          <button
            onClick={() => navigate("/consultation")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Start Consultation
          </button>

          <button
            onClick={() => navigate("/upload-xray")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Upload X-ray
          </button>

          <button
            onClick={() => navigate("/book-appointment")}
            className="border px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Book Appointment
          </button>

          <button
            onClick={() => navigate("/analysis")}
            className="border px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            View AI Analysis
          </button>

        </div>
      </div>

    </div>
  );
}

/* CARD COMPONENT */
function Card({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
