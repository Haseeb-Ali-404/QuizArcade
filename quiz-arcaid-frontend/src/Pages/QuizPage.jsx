import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "../CSS/QuizPage.css";
import Spinner from "../Components/Spinner";

const QuizPage = () => {
  const [searchParams] = useSearchParams();
  const quizId = searchParams.get("q_id");
  const userId = localStorage.getItem("User");
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!quizId) {
        setError("Quiz ID missing from URL.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:8000/api/quiz_test/${quizId}`
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setQuestions(data.questions || []);
        setTimeLeft((data.timer || 10) * 60);
      } catch (err) {
        setError("Failed to load quiz. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleFinish();
    }
    if (!userId) {
      localStorage.removeItem("token");
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSelect = (opt) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [currentQuestion]: opt,
    }));
  };

  const handleNext = async() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleFinish = async () => {
    if (quizCompleted) return;
    alert("Quiz Completed!");

    // console.log(questions);

    const resultData = questions.map((question, index) => ({
      question: question.question, // question text
      options: question.options, // array of options
      correctOption: question.answer, // correct answer
      selectedOption: selectedOptions[index] || null, // user's answer
    }));

    const totalQuestions = questions.length;
    let score = 0;
    let correctAnswers = 0;
    let incorrectQuestions = [];
    let correctQuestions = [];
    let unSelected = [];

    questions.forEach((question, index) => {
      const selected = selectedOptions[index];
      // console.log(questions);
      
      if (!questions) {
        unSelected.push(index);
      } else if (selected === question.answer) {
        correctAnswers++;
        score++;
        correctQuestions.push(index);
      } else {
        incorrectQuestions.push(index);
      }
    });

    const result = {
      score,
      totalQuestions,
      correctAnswers,
      incorrectQuestions,
      correctQuestions,
      unSelected,
    };

    const payload = {
      quizId,
      userId,
      resultScore: result,
      questions: resultData,
    };
    console.log(payload);
    

    try {
      let res = await axios.post("http://localhost:8000/api/store_result", payload)
      let data = await res.data
      if (data?.response !== 200) {
        alert("Something Went Wrong, Please try Later")
        return navigate("/")    
      }
      navigate(`/result?userId=${userId}&q_Id=${quizId}`)
    } catch (error) {
      console.log(error);
      alert("something went wrong")
    }

    console.log("Result Data:", resultData, result);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  if (loading) {
    return <Spinner/>
  }

  if (error) {
    return <div className="quizpage-container">{error}</div>;
  }

  return (
    <div className="quizpage-container">
      <div className="quiz-header">
        <span>
          Question {currentQuestion + 1} of {questions.length}
        </span>
        <span className="timer">⏱ {formatTime(timeLeft)}</span>
      </div>

      <div className="quiz-question-box">
        <h3>{questions[currentQuestion]?.question}</h3>
        <div className="options">
          {questions[currentQuestion]?.options.map((opt, idx) => (
            <button
              key={idx}
              className={`option-button ${
                selectedOptions[currentQuestion] === opt ? "selected" : ""
              }`}
              onClick={() => handleSelect(opt)}
              disabled={quizCompleted || timeLeft === 0}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="next-prev-container">
        <button
          className="prev-button"
          onClick={handlePrevious}
          disabled={currentQuestion === 0 || quizCompleted || timeLeft === 0}
        >
          Previous
        </button>
        <button
          className="next-button"
          onClick={handleNext}
          disabled={quizCompleted || timeLeft === 0}
        >
          {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>

      {quizCompleted && result && (
        <div className="quiz-result">
          <h3>Quiz Result:</h3>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
