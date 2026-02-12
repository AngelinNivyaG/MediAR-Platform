import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "aframe";

const ARViewer = () => {
  const { state } = useLocation();

  const rawImage = state?.imageBase64; // ✅ correct
  const result = state?.result;        // "Normal", "Covid", etc.

  const entityRef = useRef(null);
  const [showHotspots, setShowHotspots] = useState(false);
  const [hotspots, setHotspots] = useState([]);

  // ✅ Convert Base64 to image source
  const image =
    rawImage?.startsWith("data:image")
      ? rawImage
      : rawImage
      ? `data:image/png;base64,${rawImage}`
      : null;

  /* -------------------- ROTATION -------------------- */
  useEffect(() => {
    const el = entityRef.current;
    if (!el) return;

    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const onMouseDown = (e) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onMouseUp = () => (dragging = false);

    const onMouseMove = (e) => {
      if (!dragging) return;

      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;

      el.object3D.rotation.y += dx * 0.005;
      el.object3D.rotation.x += dy * 0.005;

      lastX = e.clientX;
      lastY = e.clientY;
    };

    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  /* -------------------- RANDOM HOTSPOTS -------------------- */
  useEffect(() => {
    if (!result || result.toLowerCase() === "normal") {
      setHotspots([]); // ❌ no hotspots
      return;
    }

    const count = Math.floor(Math.random() * 3) + 2; // 2–4 spots

    const generated = Array.from({ length: count }).map(() => ({
      x: (Math.random() * 1.2 - 0.6).toFixed(2),
      y: (Math.random() * 1.6 - 0.8).toFixed(2),
      z: 0.26,
    }));

    setHotspots(generated);
  }, [image, result]);

  if (!image) return <h2>No image provided</h2>;

  return (
    <>
      {/* 🔘 BUTTON */}
      <button
        onClick={() => setShowHotspots((p) => !p)}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 10,
          padding: "10px 16px",
          background: "#16a34a",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {showHotspots ? "Hide Hotspots" : "Show Hotspots"}
      </button>

      {/* 🌌 SCENE */}
      <a-scene
        embedded
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
        style={{ width: "100vw", height: "100vh", background: "black" }}
      >
        <a-camera
          position="0 0 6"
          look-controls="enabled: false"
          wasd-controls="enabled: false"
        ></a-camera>

        <a-entity ref={entityRef} position="0 0 -2" scale="1.6 1.6 1.6">
          <a-box
            width="2.4"
            height="3.2"
            depth="0.5"
            src={image}
            material="shader: flat; side: double"
          ></a-box>

          {/* 🔴 HOTSPOTS */}
          {showHotspots &&
            hotspots.map((spot, i) => (
              <a-sphere
                key={i}
                position={`${spot.x} ${spot.y} ${spot.z}`}
                radius="0.08"
                color="red"
                animation="property: scale; dir: alternate; dur: 800; to: 1.4 1.4 1.4; loop: true"
              ></a-sphere>
            ))}
        </a-entity>

        <a-text
          value={`Diagnosis: ${result}`}
          position="0 -3.6 -2.6"
          align="center"
          color="yellow"
          width="7"
        ></a-text>
      </a-scene>
    </>
  );
};

export default ARViewer;
