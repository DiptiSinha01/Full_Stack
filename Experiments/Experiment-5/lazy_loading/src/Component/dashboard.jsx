// import './dashboard.css'
import "../styles/Dashboard.css";

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

export default Dashboard;
