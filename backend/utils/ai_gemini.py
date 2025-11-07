import os
import google.generativeai as genai
import json
import re

genai.configure(api_key="AIzaSyDQQsQdOjXYxCpVIYFoQ9J1yP0c546BE08")


def AI_response(prompt):
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)
    content = response.text.strip()
    
    return  content



def is_eligible(topic: str) -> bool:
    
    prompt = f"Check whether you can generate questions on the topic '{topic}'. Answer only with 0 or 1."
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)
    try:
        content = int(response.text.strip())
        return content == 1
    except ValueError:
        print(f"Eligibility response invalid: {response.text}")
        return False

async def generate_quiz_questions(interest: str, num_questions: int, difficulty: str, timer: int) -> list:
    """
    Generates quiz questions on a given topic with specified number, difficulty, and timer.
    Returns a list of questions or a dict message if topic is not eligible.
    """

    if not is_eligible(interest):
        return {"message": "Not Eligible Topic", "Error":400}

    prompt = (
        f"Generate {num_questions} quiz MCQ questions on '{interest}' topic "
        f"at '{difficulty}' difficulty to be solved in {timer} minutes. "
        "Provide the output strictly in JSON format without any extra formatting or code blocks."
    )

    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)
    content = response.text.strip()

    questions = []

    # 1️⃣ Attempt to parse the JSON normally
    try:
        data = json.loads(content)
        quiz_items = data.get("quiz") or data.get("questions") or []
        for item in quiz_items:
            questions.append({
                "question": item["question"],
                "options": item["options"],
                "answer": item["answer"]
            })
    except json.JSONDecodeError:
        print("JSON parsing failed, attempting to fix quotes and retry...")

        # 2️⃣ Attempt to fix common JSON issues (e.g., single quotes) and retry
        fixed_content = content.replace("'", '"')
        try:
            data = json.loads(fixed_content)
            quiz_items = data.get("quiz") or data.get("questions") or []
            for item in quiz_items:
                questions.append({
                    "question": item["question"],
                    "options": item["options"],
                    "answer": item["answer"]
                })
        except Exception:
            print("Fixed JSON parsing failed, falling back to regex parsing...")

            # 3️⃣ Fallback: Extract question blocks with regex and parse individually
            question_blocks = re.findall(r'\{[^{}]*"question"[^{}]*\}', content, re.DOTALL)
            if not question_blocks:
                print("No valid question blocks found using regex.")

            for block in question_blocks:
                try:
                    block_fixed = block.replace("'", '"').rstrip(', \n')
                    if block_fixed.count("{") != block_fixed.count("}"):
                        print(f"Skipping unbalanced block:\n{block_fixed}")
                        continue
                    item = json.loads(block_fixed)
                    questions.append({
                        "question": item["question"],
                        "options": item["options"],
                        "answer": item["answer"]
                    })
                except Exception as e:
                    print(f"Failed to parse question block with regex: {e}")

    # Limit number of questions to requested amount
    questions = questions[:num_questions]

    if not questions:
        print("No questions could be parsed from the AI response.")
        return {"message": "Failed to generate questions"}

    return questions
