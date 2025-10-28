import React, { useEffect, useState } from "react";
import NavBar from '../Components/Navbar'
import Footer from '../Components/Footer'
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "../CSS/Dashboard.css";
import Spinner from "../Components/Spinner";

const Dashboard = () => {
  const userId = localStorage.getItem("User");
  const [userData, setUserData] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/dashboard/${userId}`
        );
        const data = await res.json();
        setUserData(data.user || []);
        setQuizHistory(
          data.history.sort((a, b) => new Date(b.date) - new Date(a.date)) || []
        );
        
        // Filter and format for chart
        const formatted = data.history
          .filter((quiz) => quiz.total > 0 && quiz.date)
          .map((quiz, idx) => ({
            name: `${quiz.subject} ${idx + 1}`,
            score: Math.round((quiz.score / quiz.total) * 100), // % format
            date: new Date(quiz.date),
          }))
          .sort((a, b) => a.date - b.date); // sort by date

        setChartData(formatted);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () =>{
    localStorage.removeItem('token')
    localStorage.removeItem('User')
    navigate('/')
    window.location.reload()
  }

  if (loading)
    return <Spinner/>;
  
  console.log(quizHistory);

  return (
    <>
    <NavBar/>
    <div className="dashboard-container">
      <h2>Welcome back, {userData?.name || "User"} 👋</h2>

      <div className="dashboard-buttons">
        <button onClick={() => navigate("/join-quiz")}>Join Quiz</button>
        <button onClick={() => navigate(`/result?userId=${userId}&q_Id=${quizHistory[0]?.quizId}`)}>View Last Result</button>
      </div>

      <div className="dashboard-history">
        <h3>Your Quiz History</h3>
        {quizHistory?.length === 0 ? (
          <p>No quizzes attempted yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>S No.</th>
                <th>Quiz ID</th>
                <th>Subject</th>
                <th>Score</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {quizHistory.map((quiz, idx) => (
                <tr key={idx}>
                  <td>{++idx}</td>
                  <td>{quiz.quizId}</td>
                  <td>{quiz.subject}</td>
                  <td>
                    {quiz.total > 0 ? `${quiz.score}/${quiz.total}` : "N/A"}
                  </td>
                  <td>
                    {quiz.date
                      ? new Date(quiz.date).toLocaleDateString()
                      : "Unknown"}
                  </td>
                  <td>
                    <button
                      className="view-result-button"
                      onClick={() =>
                        navigate(`/result?userId=${userId}&q_Id=${quiz.quizId}`)
                      }
                    >
                      View Result
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="dashboard-chart">
        <h3>Your Score Trend</h3>
        {chartData?.length === 0 ? (
          <p>No valid quiz data available to plot.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#6447bc"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="dashboard-recommendations">
        <h3>🎯 Recommended For You</h3>
        <ul>
          <li>
            Try a quiz on{" "}
            <strong>{userData?.weakSubject || "General Knowledge"}</strong>
          </li>
          <li>
            Explore topics from <strong>last week’s mistakes</strong>
          </li>
          <li>
            Improve accuracy in{" "}
            <strong>{userData?.mostIncorrectTopic || "Reasoning"}</strong>
          </li>
        </ul>
      </div>

      <div className="profile-card">
        <h3>Your Profile</h3>
        <p>
          <strong>Name:</strong> {userData?.name}
        </p>
        <p>
          <strong>Weak Area:</strong> {userData?.weakSubject}
        </p>
        <button onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Dashboard;
