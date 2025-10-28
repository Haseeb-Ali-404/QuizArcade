# routes/chatbot.py
from fastapi import APIRouter
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import google.generativeai as genai

router = APIRouter()

genai.configure(api_key="AIzaSyDQQsQdOjXYxCpVIYFoQ9J1yP0c546BE08")


model = genai.GenerativeModel("gemini-1.5-flash")

class ChatInput(BaseModel):
    prompt: str

@router.post("/chatbot")
async def chatbot(data: ChatInput):
    try:
        response = model.generate_content(data.prompt)
        return JSONResponse({"reply": response.text})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
