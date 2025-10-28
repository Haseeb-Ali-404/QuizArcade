// src/components/GeminiChatbot.js
import React, { useState, useRef, useEffect } from "react";
import "../CSS/Chatbot.css";
import { FiSend } from "react-icons/fi";
import Footer from "../Components/Footer";
import ReactMarkdown from "react-markdown";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: "model", content: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);
  const navigate = useNavigate();

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();
      const reply = data.reply || "Sorry, I couldn't understand that.";

      setMessages([
        ...newMessages,
        { role: "model", content: <ReactMarkdown>{reply}</ReactMarkdown> },
      ]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { role: "model", content: "Error from chatbot." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSend();
    }
  };

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <>
      <Navbar />
      <div className="chatbot-page">
        <div className="chatbot-info">
          <h2>Increase your knowledge<br />via chatting <span className="highlight">AI</span></h2>
          <p>Ask academic, fun, or curiosity questions. Your learning partner is always ready.</p>
        </div>

        <div className="chatbot-wrapper">
          <div className="chatbot-box">
            <div className="chatbox" ref={chatRef}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`chat-message ${msg.role}`}>
                  {msg.content}
                </div>
              ))}
              {loading && (
                <div className="chat-message model typing">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              )}
            </div>

            <div className="chat-input">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
              />
              <button onClick={handleSend} disabled={loading}>
                <FiSend size={18} />
              </button>
              <button onClick={() => navigate(`/create-quiz`)} disabled={loading}>
                Take Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Chatbot;
