import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const AIAnalysis = () => {
  const [file, setFile] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  /* ---------- FILE UPLOAD ---------- */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  /* ---------- API CALL ---------- */
  const handleUpload = async () => {
    if (!file) {
      alert("Upload an X-ray image");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/predict",
        formData
      );
      setResult(res.data);
    } catch (err) {
      alert("Backend error");
    }
  };

  /* ---------- MULTI-CLASS CONFIDENCE LOGIC ---------- */
  const getClassConfidences = () => {
    if (!result) return [0, 0, 0];

    const confidence = result.confidence; // 0–100
    const remaining = 100 - confidence;

    let normal = 0;
    let covid = 0;
    let pneumonia = 0;

    switch (result.prediction) {
      case "Normal":
        normal = confidence;
        covid = remaining / 2;
        pneumonia = remaining / 2;
        break;

      case "Covid":
        covid = confidence;
        normal = remaining / 2;
        pneumonia = remaining / 2;
        break;

      case "Viral Pneumonia":
      case "Pneumonia":
        pneumonia = confidence;
        normal = remaining / 2;
        covid = remaining / 2;
        break;

      default:
        normal = 33.3;
        covid = 33.3;
        pneumonia = 33.3;
    }

    return [
      normal.toFixed(2),
      covid.toFixed(2),
      pneumonia.toFixed(2),
    ];
  };

  const [normal, covid, pneumonia] = getClassConfidences();

  /* ---------- CHART DATA ---------- */
  const chartData = result && {
    labels: ["Normal", "Covid", "Pneumonia"],
    datasets: [
      {
        label: "Class Confidence (%)",
        data: [normal, covid, pneumonia],
        backgroundColor: [
          "#22c55e", // green
          "#f97316", // orange
          "#ef4444", // red
        ],
      },
    ],
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        AI X-Ray Analysis
      </h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      <br /><br />

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Analyze
      </button>

      <button
        onClick={() =>
          navigate("/ar-viewer", {
            state: {
              imageBase64,
              result: result?.prediction,
            },
          })
        }
        disabled={!imageBase64 || !result}
        className="bg-green-600 text-white px-6 py-2 rounded ml-4"
      >
        View 3D Visualization
      </button>

      {/* ---------- RESULT ---------- */}
      {result && (
        <div className="mt-8">
          <p className="text-lg font-semibold">
            Prediction: {result.prediction}
          </p>

          <p className="text-md mt-1">
            Confidence: {result.confidence.toFixed(2)}%
          </p>

          {/* ---------- MULTI-CLASS GRAPH ---------- */}
          <div className="mt-6 w-2/3">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    min: 0,
                    max: 100,
                    ticks: {
                      callback: (value) => `${value}%`,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAnalysis;
