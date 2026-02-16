import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <div className="flex items-center justify-between px-16 py-20 bg-slate-50">
        <div className="max-w-xl">
          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
            AI-Powered Medical Analysis
          </span>

          <h1 className="text-5xl font-bold mt-6">
            Smart <span className="text-blue-600">Telemedicine</span> Platform
          </h1>

          <p className="mt-6 text-gray-600">
            Revolutionary healthcare platform combining AI-powered X-ray
            analysis, augmented reality visualization, and real-time
            consultation.
          </p>

          <button className="mt-8 px-6 py-3 bg-blue-600 text-white rounded">
            Start Diagnosis →
          </button>

          <div className="flex gap-10 mt-12">
            <div>
              <p className="text-xl font-bold">99.9%</p>
              <p className="text-gray-500 text-sm">Accuracy Rate</p>
            </div>
            <div>
              <p className="text-xl font-bold">2.5s</p>
              <p className="text-gray-500 text-sm">Analysis Time</p>
            </div>
            <div>
              <p className="text-xl font-bold">3D AR</p>
              <p className="text-gray-500 text-sm">Visualization</p>
            </div>
          </div>
        </div>

        <img
          src="https://itstrategy.tech/wp-content/uploads/2025/03/shutterstock_2267168307-1024x509.jpg"
          alt="medical"
          className="w-[480px] rounded-xl shadow"
        />
      </div>
    </>
  );
}
