from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from db.mongodb import users_collection
from utils.security import verify_password
from bson import ObjectId
from utils.jwt_handler import create_access_token  # Import your token function

router = APIRouter()

class UserLogin(BaseModel):
    email: EmailStr
    password: str

@router.post("/login")
async def login(user: UserLogin):
    user_doc = await users_collection.find_one({"email": user.email})
    if not user_doc:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not verify_password(user.password, user_doc["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    # Generate JWT token with user's ID and email
    token_data = {
        "user_id": str(user_doc["_id"]),
        "email": user_doc["email"]
    }
    access_token = create_access_token(data=token_data)

    return {
        "message": "Login successful",
        "access_token": access_token,
        "userId": str(user_doc["_id"]),
        "name": user_doc.get("name", "User")
    }
