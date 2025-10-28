from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.login import router as login_router
from routes.register import router as register_router
from routes.quiz import router as quiz_router
from routes.quiz_quest import router as quiz_quest_router
from routes.result import router as result_router
from routes.check_result import router as check_result_router
from routes.chatboy import router as chatboy_router
from routes.dashborad import router as dashboard_router

app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(login_router, prefix="/api")
app.include_router(register_router, prefix="/api")
app.include_router(quiz_router, prefix="/api")
app.include_router(check_result_router, prefix="/api")
app.include_router(quiz_quest_router, prefix="/api")
app.include_router(result_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(chatboy_router, prefix="/api")
