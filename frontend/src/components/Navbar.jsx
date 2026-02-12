import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-10 py-4 bg-white shadow">
      <h1 className="text-2xl font-bold text-blue-600">MediAR</h1>

      <div className="flex gap-6 text-gray-700 font-medium">
        <Link to="/doctor">For Doctors</Link>
        <Link to="/patient">For Patients</Link>
        <Link to="/analysis">AI Analysis</Link>
        <Link to="/ar-viewer">AR Viewer</Link>

      </div>

      <div className="flex gap-3">
        <Link to="/login" className="px-4 py-2 border rounded">
          Login
        </Link>
        <Link
          to="/register"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}
