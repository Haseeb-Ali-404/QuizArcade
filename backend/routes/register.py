# backend/routes/register.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from db.mongodb import users_collection, user_quizzes_collection
from passlib.context import CryptContext
from bson import ObjectId
from models.quiz import UserQuizDocument

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

@router.post("/register")
async def register(user: UserRegister):
    # Check if user already exists
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered.")

    # Hash the password
    hashed_password = pwd_context.hash(user.password)

    # Insert user record
    user_doc = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password
    }
    result = await users_collection.insert_one(user_doc)
    user_id = result.inserted_id

    # Insert initial quiz document
    quiz_doc = UserQuizDocument(
        user_id=str(user_id),
        user_email=user.email,
        quizzes=[]
    )
    await user_quizzes_collection.insert_one(quiz_doc.dict())

    return {"message": "User registered successfully!"}
