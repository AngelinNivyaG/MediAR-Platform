from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import numpy as np
import tensorflow as tf
import os
from pymongo import MongoClient
from passlib.hash import bcrypt
from bson import ObjectId
from datetime import datetime
from routes import user
# =========================================================
# ===================== APP INIT ==========================
# =========================================================

app = FastAPI()

app.include_router(user.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # For production restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================================
# ===================== DATABASE ==========================
# =========================================================

client = MongoClient("mongodb://127.0.0.1:27017/")
db = client["ai_medical_db"]

users_collection = db["users"]
appointments_collection = db["appointments"]
reports_collection = db["reports"]

# =========================================================
# ===================== MODEL LOAD ========================
# =========================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "chest_xray.tflite")

interpreter = tf.lite.Interpreter(model_path=MODEL_PATH)
interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

class_names = ['Covid', 'Viral Pneumonia', 'Normal']

# =========================================================
# ===================== MODELS ============================
# =========================================================

class RegisterModel(BaseModel):
    name: str
    email: str
    password: str
    role: str
    specialization: str | None = None


class LoginModel(BaseModel):
    email: str
    password: str


class AppointmentModel(BaseModel):
    patient_id: str
    doctor_id: str
    date: str


class UpdateAppointmentModel(BaseModel):
    status: str


class ReportModel(BaseModel):
    patient_id: str
    prediction: str
    confidence: float


# =========================================================
# ===================== AUTH APIs =========================
# =========================================================

@app.post("/register")
def register(user: RegisterModel):

    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = {
        "name": user.name,
        "email": user.email,
        "password": bcrypt.hash(user.password),
        "role": user.role,
        "specialization": user.specialization if user.role == "doctor" else None
    }

    users_collection.insert_one(new_user)

    return {"message": "User registered successfully"}


@app.post("/login")
def login(user: LoginModel):

    db_user = users_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=400, detail="User not found")

    if not bcrypt.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid password")

    return {
        "message": "Login successful",
        "user_id": str(db_user["_id"]),
        "role": db_user["role"],
        "name": db_user["name"]
    }

# =========================================================
# ===================== AI PREDICT ========================
# =========================================================

@app.post("/predict")
async def predict(file: UploadFile = File(...), patient_id: str = None):

    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    image = Image.open(file.file).convert("RGB")
    image = image.resize((256, 256))
    img_array = np.array(image, dtype=np.float32) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    interpreter.set_tensor(input_details[0]['index'], img_array)
    interpreter.invoke()

    predictions = interpreter.get_tensor(output_details[0]['index'])

    predicted_index = int(np.argmax(predictions))
    predicted_class = class_names[predicted_index]
    confidence = float(predictions[0][predicted_index]) * 100

    # Auto Save Report if patient_id provided
    if patient_id:
        report = {
            "patient_id": patient_id,
            "prediction": predicted_class,
            "confidence": round(confidence, 2),
            "date": datetime.utcnow()
        }
        reports_collection.insert_one(report)

    return {
        "prediction": predicted_class,
        "confidence": round(confidence, 2)
    }

# =========================================================
# ===================== REPORT SYSTEM =====================
# =========================================================

@app.get("/reports/{patient_id}")
def get_reports(patient_id: str):

    reports = list(reports_collection.find({"patient_id": patient_id}))

    for report in reports:
        report["_id"] = str(report["_id"])

    return reports

# =========================================================
# ================= APPOINTMENT SYSTEM ====================
# =========================================================

@app.post("/book-appointment")
def book_appointment(data: AppointmentModel):

    appointment = {
        "patient_id": data.patient_id,
        "doctor_id": data.doctor_id,
        "date": data.date,
        "status": "pending"
    }

    appointments_collection.insert_one(appointment)

    return {"message": "Appointment booked successfully"}


@app.put("/update-appointment/{appointment_id}")
def update_appointment(appointment_id: str, data: UpdateAppointmentModel):

    appointments_collection.update_one(
        {"_id": ObjectId(appointment_id)},
        {"$set": {"status": data.status}}
    )

    return {"message": "Appointment updated successfully"}


@app.get("/doctor-appointments/{doctor_id}")
def get_doctor_appointments(doctor_id: str):

    appointments = list(
        appointments_collection.find({"doctor_id": doctor_id})
    )

    for appt in appointments:
        appt["_id"] = str(appt["_id"])

    return appointments


@app.get("/patient-appointments/{patient_id}")
def get_patient_appointments(patient_id: str):

    appointments = list(
        appointments_collection.find({"patient_id": patient_id})
    )

    for appt in appointments:
        appt["_id"] = str(appt["_id"])

    return appointments
