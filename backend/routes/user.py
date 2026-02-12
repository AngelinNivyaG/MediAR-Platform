from fastapi import APIRouter, HTTPException
from database import users
from models import User, LoginUser
from auth import hash_password, verify_password
from bson import ObjectId

router = APIRouter()

# ==========================
# REGISTER
# ==========================
@router.post("/register")
def register(user: User):

    existing_user = users.find_one({"email": user.email})

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hash_password(user.password),
        "role": user.role
    }

    result = users.insert_one(new_user)

    return {
        "message": "User registered successfully",
        "user_id": str(result.inserted_id)
    }


# ==========================
# LOGIN
# ==========================
@router.post("/login")
def login(user: LoginUser):

    db_user = users.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=400, detail="User not found")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid password")

    return {
        "message": "Login successful",
        "user_id": str(db_user["_id"]),
        "role": db_user["role"],
        "name": db_user["name"]
    }
