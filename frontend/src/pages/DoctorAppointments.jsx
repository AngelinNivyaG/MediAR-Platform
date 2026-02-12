import { useEffect, useState } from "react";
import axios from "axios";

export default function DoctorAppointment() {

  const [appointments, setAppointments] = useState([]);
  const doctorId = localStorage.getItem("user_id");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/appointment/doctor/${doctorId}`
    );
    setAppointments(res.data);
  };

  const acceptAppointment = async (id) => {
    await axios.put(
      `http://localhost:5000/api/appointment/accept/${id}`
    );
    fetchAppointments();
  };

  const rejectAppointment = async (id) => {
    await axios.put(
      `http://localhost:5000/api/appointment/reject/${id}`
    );
    fetchAppointments();
  };

  const rescheduleAppointment = async (id) => {
    const newDate = prompt("Enter new date (YYYY-MM-DD)");
    const newTime = prompt("Enter new time (HH:MM)");

    if (!newDate || !newTime) return;

    await axios.put(
      `http://localhost:5000/api/appointment/reschedule/${id}`,
      { date: newDate, time: newTime }
    );

    fetchAppointments();
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">
        Manage Appointments
      </h2>

      {appointments.map((appt) => (
        <div key={appt._id} className="border p-4 mb-4 rounded shadow">

          <p><strong>Patient:</strong> {appt.patientId?.name}</p>
          <p><strong>Date:</strong> {appt.date}</p>
          <p><strong>Time:</strong> {appt.time}</p>
          <p><strong>Status:</strong> {appt.status}</p>

          {appt.status === "rescheduled" && (
            <>
              <p><strong>New Date:</strong> {appt.rescheduledDate}</p>
              <p><strong>New Time:</strong> {appt.rescheduledTime}</p>
            </>
          )}

          {appt.status === "pending" && (
            <div className="flex gap-3 mt-3">
              <button
                onClick={() => acceptAppointment(appt._id)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Accept
              </button>

              <button
                onClick={() => rejectAppointment(appt._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Reject
              </button>

              <button
                onClick={() => rescheduleAppointment(appt._id)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Reschedule
              </button>
            </div>
          )}

        </div>
      ))}
    </div>
  );
}
