import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import { FaBrain, FaRobot, FaChartLine } from "react-icons/fa";

import profileImg from "./assets/profile.jpg";
import gestureImg from "./assets/gesture.png";
import trackerImg from "./assets/tracker.jpeg";
import resumeImg from "./assets/resume-ai.png";

/* ================= PROFILE ================= */
function Profile() {
  const projects = [
    {
      title: "Hand Gesture Volume Control",
      description:
        "Controls system volume using real-time hand gestures with OpenCV and MediaPipe.",
      image: gestureImg,
      techStack: ["OpenCV", "MediaPipe", "Python", "Computer Vision"],
    },
    {
      title: "Gamified Progress Tracker",
      description:
        "A React productivity app with XP, levels, heatmaps, and local storage.",
      image: trackerImg,
      techStack: ["React", "JavaScript", "Local Storage"],
    },
    {
      title: "AI Resume & Cover Letter Generator",
      description:
        "AI-powered tool to generate ATS-friendly resumes and cover letters.",
      image: resumeImg,
      techStack: ["AI", "NLP", "React"],
    },
  ];

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={profileImg} alt="Profile" className="profile-photo" />

        <div className="profile-info">
          <h1>Dipti Sinha</h1>
          <h3>CSE (AI/ML) Student</h3>
          <p>
            Computer Science student specializing in AI/ML with experience in
            machine learning projects, React apps, and real-world internships.
          </p>

          <div className="skills">
            <span>Python</span>
            <span>Machine Learning</span>
            <span>React</span>
            <span>OpenCV</span>
            <span>JavaScript</span>
          </div>
        </div>
      </div>

      <h2 className="section-title">Projects</h2>

      <div className="projects-grid">
        {projects.map((project, index) => (
          <div className="project-card" key={index}>
            <img
              src={project.image}
              alt={project.title}
              className="project-image"
            />
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="tech-stack">
              {project.techStack.map((tech, i) => (
                <span key={i} className="tech-tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= DASHBOARD ================= */
function Dashboard() {
  const sections = [
    {
      title: "Applied ML Projects",
      description:
        "Real-world ML implementations with computer vision & control systems",
      items: [
        {
          skill: "Hand Gesture Detection",
          level: "Advanced",
          impact:
            "Built a real-time gesture-based volume control system using OpenCV and MediaPipe.",
        },
        {
          skill: "Gesture-based Volume Control",
          level: "Advanced",
          impact: "Designed real-time hand gesture recognition for system control.",
        },
      ],
    },
    {
      title: "AI Tools",
      description:
        "Hands-on experience integrating LLM APIs into applications",
      items: [
        {
          skill: "Azure OpenAI (Free Tier)",
          level: "Intermediate",
          impact: "Leveraged Azure OpenAI for natural language processing tasks.",
        },
        {
          skill: "Hugging Face models",
          level: "Intermediate",
          impact: "Integrated pre-trained models for text classification and generation.",
        },
      ],
    },
    {
      title: "Data & Analytics",
      description:
        "Data analysis, feature selection, and visualization using Python",
      items: [
        {
          skill: "Data analysis & interpretation",
          level: "Intermediate",
          impact: "Extracted meaningful insights and trends from datasets.",
        },
        {
          skill: "Feature selection",
          level: "Intermediate",
          impact: "Optimized ML models by selecting relevant features.",
        },
        {
          skill: "Model comparison & optimization",
          level: "Intermediate",
          impact: "Fine-tuned models for better performance.",
        },
        {
          skill: "Visualization using Python (Matplotlib)",
          level: "Intermediate",
          impact:
            "Created insightful visualizations to communicate data findings.",
        },
      ],
    },
    {
      title: "Currently Learning",
      description:
        "Showcasing my growth mindset and ongoing learning journey",
      items: [
        {
          skill: "Advanced JavaScript",
          level: "Beginner",
          impact:
            "Exploring advanced concepts like closures, async/await, and ES6+ features.",
        },
        {
          skill: "DSA (Arrays, Strings, Recursion)",
          level: "Beginner",
          impact:
            "Strengthening problem-solving skills through data structures and algorithms.",
        },
        {
          skill: "Model Optimization Techniques",
          level: "Beginner",
          impact:
            "Learning techniques to improve machine learning model performance.",
        },
      ],
    },
  ];

  return (
    <div className="dashboard-root">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>AI & ML Engineer | Project-Driven Learner | 3rd-Year CSE</p>
      </div>

      {sections.map((section, index) => (
        <div key={index} className="dashboard-section">
          <h2 className="section-heading">
            <span className="accent-bar"></span>
            {section.title}
          </h2>
          <p>{section.description}</p>
          <div className="dashboard-grid">
            {section.items.map((item, i) => (
              <div key={i} className="dashboard-card">
                <h3>{item.skill}</h3>
                <span className={`skill-level ${item.level.toLowerCase()}`}>
                  {item.level === "Advanced" && "🟢"}
                  {item.level === "Intermediate" && "🟡"}
                  {item.level === "Beginner" && "🔴"} {item.level}
                </span>
                <p className="impact-statement">{item.impact}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ================= APP ================= */
function App() {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <div className="navbar">
            <div className="navbar-left">
              <Link to="/">My Profile</Link>
            </div>
            <div className="navbar-right">
              <button>
                <Link to="/">Profile</Link>
              </button>
              <button>
                <Link to="/dashboard">Dashboard</Link>
              </button>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
