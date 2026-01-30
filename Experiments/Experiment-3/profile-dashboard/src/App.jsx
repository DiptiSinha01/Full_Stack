import{BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css';
import profileImg from "./assets/profile.jpg";
import gestureImg from "./assets/gesture.png";
import trackerImg from "./assets/tracker.jpeg";
import resumeImg from "./assets/resume-ai.png";

function Profile() {
  const projects = [
    {
      title: "Hand Gesture Volume Control",
      description:
        "Controls system volume using real-time hand gestures with OpenCV and MediaPipe.",
      image: gestureImg,
    },
    {
      title: "Gamified Progress Tracker",
      description:
        "A React productivity app with XP, levels, heatmaps, and local storage.",
      image: trackerImg,
    },
    {
      title: "AI Resume & Cover Letter Generator",
      description:
        "AI-powered tool to generate ATS-friendly resumes and cover letters.",
      image: resumeImg,
    },
  ];

  return (
    <div className="profile-container">
      {/* ===== Profile Section ===== */}
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

      {/* ===== Projects Section ===== */}
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
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard() {
  const skills = {
    Programming: ["Python", "JavaScript", "C++"],
    "Web Development": ["HTML", "CSS", "React"],
    "Machine Learning": ["NumPy", "Pandas", "Scikit-learn", "OpenCV"],
    "Tools": ["Git", "GitHub", "VS Code"],
    "Soft Skills": ["Problem Solving", "Communication", "Teamwork"],
  };

  return (
    <div className="atlys-root">
      {/* Header */}
      <div className="atlys-header">
        <h1>Dashboard</h1>
        <p>My skills & capabilities overview</p>
      </div>

      {/* Content */}
      <div className="atlys-grid">
        {Object.entries(skills).map(([title, items], index) => (
          <div className="atlys-card" key={index}>
            <h3>{title}</h3>
            <div className="atlys-tags">
              {items.map((skill, i) => (
                <span key={i}>{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* This is the new top bar */}
      <nav className="top-bar" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '10px 20px', 
        background: '#f4f4f4',
        borderBottom: '1px solid #ddd'
      }}>
        {/* Clicking this text goes to Profile */}
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h2 style={{ margin: 0, cursor: 'pointer' }}>My Profile</h2>
        </Link>

        <div>
          <Link to="/">
            <button style={{ marginRight: '10px' }}>Profile</button>
          </Link>
          <Link to="/dashboard">
            <button>Dashboard</button>
          </Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;