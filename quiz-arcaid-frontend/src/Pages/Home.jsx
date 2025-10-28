import React from 'react';
import '../CSS/Home.css';
import { FaPlay} from 'react-icons/fa';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const Home = () => {
  return (
    <>
    <Navbar/>
      <section className="hero-sec">
        <div className="hero-bg">
          <h2>Challenge Minds. Fuel Curiosity. Welcome to Quiz Arcade!</h2>
          <div className="hero-opt">
            <button onClick={() => window.location.href = '/create-quiz'} className="Conduct ripple">Take Quiz</button>
            <button onClick={() => window.location.href = '/dashboard'} className="Attempt ripple">View Dashboard</button>
          </div>
        </div>
        <div className="hero-img">
          <div className="img">
            <img src="https://i.pinimg.com/originals/60/d5/50/60d550868486cc31bd11562379125d27.png" alt="Quiz Icon" className="hero-img-icon" />
          </div>
        </div>
      </section>

      <section className="hero-animation-div">
        <div className="hero-animation-v2">
          <iframe style={{ border: '6px solid #6447bc', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }} width="730" height="484" src="https://rive.app/s/SqJ8CRKHKUCiFw8l1z76dQ/embed" allowFullScreen></iframe>
          <h1>Compete. Learn. Grow.</h1>
        </div>
      </section>

      <section className="impback">
        <div className="importance">
          <h2>Why Use AI-Powered Quizzes?</h2>
          <p>
            <strong>Personalized Experience:</strong> Quiz Arcade generates questions based on your subject interests, offering a tailored learning experience.<br /><br />
            <strong>Instant Feedback:</strong> AI helps deliver immediate results and feedback to guide your learning path.<br /><br />
            <strong>Skill Growth:</strong> Track your progress, identify weak areas, and get recommendations for improvement.<br /><br />
          </p>
        </div>
      </section>

      <section className="customize">
        <div className="customizepic">
          <img src="https://storage.googleapis.com/support-kms-prod/FkDnogRqKe0qVQwAbDcQSLC0aFxnTWh8pZir" alt="Customization" />
        </div>
        <div className="cuscontent">
          <p className="custh2">Customize Your Quiz</p>
          <p><FaPlay /> Choose subjects and difficulty level to match your goals.</p>
          <p><FaPlay /> Set quiz duration and scoring preferences.</p>
          <p><FaPlay /> Review answers after completion or instantly.</p>
        </div>
      </section>

      <section className="dashboard">
        <div className="dashcontent">
          <p className="custh2">Your Smart Dashboard</p>
          <p><FaPlay /> View quiz history, scores, and feedback in one place.</p>
          <p><FaPlay /> Get AI-based performance analysis and study suggestions.</p>
        </div>
        <div className="dashpic">
          <img src="https://images.prismic.io/edapp-website/d4e3d102-4dc0-409c-bd9b-de82814c340c_how-to-make-a-free-quiz-with-edapp-features+1.png?auto=format,compress" alt="Dashboard Overview" />
        </div>
      </section>

      <Footer/>         
    </>
  );
};

export default Home;
