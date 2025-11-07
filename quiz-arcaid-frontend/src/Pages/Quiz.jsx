import React, { useState } from "react";
import "../CSS/Quiz.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaBook, FaListOl, FaClock, FaTachometerAlt } from "react-icons/fa"; // Icons
import Spinner from "../Components/Spinner";

const Quiz = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [questionForm, setquestionForm] = useState({
    subject: "",
    numQuestions: 0,
    difficulty: "",
    timer: 0,
  });

  const user_id = localStorage.getItem("User");

  const handleChange = (e) => {
    setquestionForm({ ...questionForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      questionForm.subject &&
      questionForm.numQuestions <= 15 &&
      questionForm.difficulty &&
      questionForm.timer <= 15
    ) {
      const payload = {
        user_id,
        subject: questionForm.subject,
        numQuestions: parseInt(questionForm.numQuestions, 10),
        difficulty: questionForm.difficulty,
        timer: questionForm.timer,
      };

      try {
        setLoading(true);
        const res = await axios.post(
          "http://localhost:8000/api/create-quiz-questions",
          payload
        );
        setLoading(false);

        if (res.data?.questions?.Error === 400) {
          return alert("Invalid Topic");
        } else {
          navigate(`/QUIZTEST?topic=${questionForm.subject}&q_id=${res.data?.quiz_id}`);
        }
      } catch (error) {
        setLoading(false);
        alert("Something went Wrong");
        console.log(error);
      }
    } else {
      alert("Please fill in all fields & ensure values are <= 15");
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="quizpref-container">
        <div className="quizpref-box">
          <h2>Customize Your Quiz</h2>
          <form onSubmit={handleSubmit} className="quizpref-form">

            <div className="input-icon">
              <FaBook />
              <input
                type="text"
                placeholder="Enter Subject Interest"
                name="subject"
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-icon">
              <FaListOl />
              <input
                type="number"
                placeholder="Number of Questions (max 15)"
                name="numQuestions"
                onChange={handleChange}
                min={1}
                max={15}
                required
              />
            </div>

            <div className="input-icon">
              <FaTachometerAlt />
              <select onChange={handleChange} name="difficulty" required>
                <option value="">Select Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="input-icon">
              <FaClock />
              <input
                type="number"
                placeholder="Timer (in minutes, max 15)"
                name="timer"
                onChange={handleChange}
                min={1}
                max={15}
                required
              />
            </div>

            <button type="submit" className="quizpref-button" disabled={loading}>
              {loading ? (
                <Spinner/>
              ) : (
                "Start Quiz"
              )}
            </button>
          </form>
        </div>
      </div>
      
    </>
  );
};

export default Quiz;
