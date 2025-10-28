from fastapi import APIRouter, HTTPException
from bson import ObjectId
from db.mongodb import users_collection, user_quizzes_collection

router = APIRouter()

@router.get("/dashboard/{user_id}")
async def get_dashboard_data(user_id: str):
    try:
        # 1. Get user info
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # 2. Get user's quiz attempts
        quizzes_cursor = user_quizzes_collection.find({"user_id": ObjectId(user_id)})
        quizzes = await quizzes_cursor.to_list(length=100)

        quiz_history = []
        weak_topics = {}
        incorrect_count = {}

        for quiz in quizzes:
            score = quiz.get("result", {}).get("score", 0)
            total = quiz.get("result", {}).get("totalQuestions", 0)
            subject = quiz.get("subject", "Unknown")
            date = quiz.get("timestamp")
            quiz_id = str(quiz.get("_id"))

            quiz_history.append({
                "quizId": quiz_id,
                "subject": subject,
                "score": score,
                "total": total,
                "date": date
            })

            # Handle weak topics and incorrect questions using indexes
            incorrect_indexes = quiz.get("result", {}).get("incorrectQuestions", [])
            questions_array = quiz.get("questions", [])

            weak_topics[subject] = weak_topics.get(subject, 0) + len(incorrect_indexes)

            for idx in incorrect_indexes:
                if 0 <= idx < len(questions_array):
                    question_text = questions_array[idx].get("question", "Unknown Question")
                    incorrect_count[question_text] = incorrect_count.get(question_text, 0) + 1

        # Derive weak subject and topic
        weak_subject = max(weak_topics, key=weak_topics.get) if weak_topics else None
        most_incorrect_topic = max(incorrect_count, key=incorrect_count.get) if incorrect_count else None

        return {
            "user": {
                "name": user.get("name", "User"),
                "email": user.get("email"),
                "weakSubject": weak_subject,
                "mostIncorrectTopic": most_incorrect_topic
            },
            "history": quiz_history
        }

    except Exception as e:
        print("Error fetching dashboard:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")
