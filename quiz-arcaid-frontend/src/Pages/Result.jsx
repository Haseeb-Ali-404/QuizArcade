import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../CSS/Result.css";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import Spinner from "../Components/Spinner";

const Result = () => {
  const [searchParams] = useSearchParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExplanations, setShowExplanations] = useState({});

  const userId = searchParams.get("userId");
  const quizId = searchParams.get("q_Id");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/results?userId=${userId}&quizId=${quizId}`
        );
        const data = await res.json();
        setResult(data);
        console.log(data);
        
      } catch (error) {
        console.error("Error fetching result:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
    
  }, [userId, quizId]);

  const toggleExplanation = (index) => {
    setShowExplanations((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (loading) {
    return (
      <>
      
      <div className="result-container">
        <Spinner/>
        <div className="text-lg font-semibold">Loading your result...</div>
      </div>
      </>
    );
  }

  if (!result) {
    return (
      <>
    
      <div className="result-container">
        <div className="text-lg font-semibold">No result found.</div>
      </div>
     
      </>
    );
  }

  const {
    score,
    totalQuestions,
    correctAnswers,
    incorrectQuestions = [],
  } = result;
  const incorrect = totalQuestions - correctAnswers;
  const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);

  return (
    <>
  
    <div className="result-container">
      <div className="result-box">
        <h2>🎉 Quiz Completed!</h2>
        <div className="result-grid">
          <p>
            <strong>Total Questions:</strong> {totalQuestions}
          </p>
          <p>
            <strong>Correct Answers:</strong> {correctAnswers}
          </p>
          <p>
            <strong>Incorrect Answers:</strong> {incorrect}
          </p>
          <p>
            <strong>Your Score:</strong> {score}/{totalQuestions}
          </p>
          <p>
            <strong>Percentage:</strong> {percentage}%
          </p>
        </div>
        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="result-button"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {incorrectQuestions.length > 0 && (
        <div className="review-box">
          <h3>🔍 Review Incorrect Answers</h3>
          <div className="review-grid">
            {incorrectQuestions.map((item, index) => (
              <div key={index} className="review-card">
                <p className="question-text">Q: {item.question}</p>
                <p className="user-answer">Your Answer: {item.userAnswer}</p>
                <p className="correct-answer">
                  Correct Answer: {item.correctAnswer}
                </p>
                <button
                  onClick={() => toggleExplanation(index)}
                  className="explain-button"
                >
                  {showExplanations[index]
                    ? "Hide Explanation"
                    : "Show Explanation"}
                </button>
                <div
                  className={`explanation ${
                    showExplanations[index] ? "show" : ""
                  }`}
                >
                  <p>{item.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
   
    </>
  );
};

export default Result;
