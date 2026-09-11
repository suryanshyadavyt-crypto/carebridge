import { useEffect, useState } from "react";
import "./App.css";
import Map from "./map";
import heroImage from "./assets/hero.png";

const guidanceResults = {
  "General Health":
    "For general concerns, note your symptoms and consider booking a routine medical appointment.",
  "Minor Injury":
    "For a minor injury, protect the area, rest it, and seek medical advice if pain or swelling worsens.",
  "Feeling Unwell":
    "Rest, drink fluids, and monitor your symptoms. Seek medical evaluation if they persist or worsen.",
  Emergency:
    "Call your local emergency number or go to the nearest emergency department now.",
};

const wellbeingResults = {
  Good: "That is encouraging. Keep supporting your well-being with regular rest, movement, and connection.",
  Okay: "Small steps can help: take a short break, hydrate, and check in with someone you trust.",
  Struggling:
    "You do not have to handle this alone. Consider contacting someone you trust or a mental health professional today.",
};

function App() {
  const [guidance, setGuidance] = useState("");
  const [wellbeing, setWellbeing] = useState("");
  const [locateRequest, setLocateRequest] = useState(0);
  const [saveStatus, setSaveStatus] = useState(
    "Saved automatically on this device.",
  );
  const [healthCard, setHealthCard] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("carebridge-health-card")) || {
          name: "",
          bloodGroup: "",
          emergencyContact: "",
          notes: "",
        }
      );
    } catch {
      return { name: "", bloodGroup: "", emergencyContact: "", notes: "" };
    }
  });

  useEffect(() => {
    localStorage.setItem("carebridge-health-card", JSON.stringify(healthCard));
  }, [healthCard]);

  const updateHealthCard = (event) => {
    const { name, value } = event.target;
    setHealthCard((current) => ({ ...current, [name]: value }));
    setSaveStatus("Unsaved changes");
  };

  const saveHealthCard = (event) => {
    event.preventDefault();
    localStorage.setItem("carebridge-health-card", JSON.stringify(healthCard));
    setSaveStatus("Health card saved on this device.");
  };

  return (
    <div className="app">
      {/* NAVIGATION */}
      <nav className="navbar" aria-label="Main navigation">
        <div className="logo">CareBridge</div>

        <ul className="nav-links">
          <li>
            <a href="#home">Home</a>
          </li>

          <li>
            <a href="#guidance">Health Guidance</a>
          </li>

          <li>
            <a href="#healthcare">Find Healthcare</a>
          </li>

          <li>
            <a href="#wellbeing">Well-being</a>
          </li>
        </ul>
      </nav>

      {/* HOME */}
      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <p className="eyebrow">YOUR EVERYDAY HEALTH COMPASS</p>
            <h1>Healthcare, made easier.</h1>

            <p>
              CareBridge helps you understand your next step, find healthcare
              resources and take better care of your well-being.
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#guidance">
                Get Started
              </a>
              <a className="text-link" href="#healthcare">
                Explore nearby care <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
          <div
            className="hero-art"
            aria-label="CareBridge health access illustration"
          >
            <span className="orbit orbit-one" aria-hidden="true"></span>
            <span className="orbit orbit-two" aria-hidden="true"></span>
            <img
              src={heroImage}
              alt="Layered CareBridge platform illustration"
            />
            <div className="hero-status">
              <span className="status-dot" aria-hidden="true"></span>
              Care, connected
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="features">
          <h2>How CareBridge Helps</h2>

          <div className="feature-grid">
            {/* HEALTH GUIDANCE */}
            <a href="#guidance" className="feature-card">
              <div className="feature-icon">🩺</div>

              <h3>Health Guidance</h3>

              <p>
                Get simple guidance about what you should consider doing next.
              </p>
            </a>

            {/* FIND HEALTHCARE */}
            <a href="#healthcare" className="feature-card">
              <div className="feature-icon">🏥</div>

              <h3>Find Healthcare</h3>

              <p>Find hospitals, clinics and other healthcare resources.</p>
            </a>

            {/* WELL-BEING */}
            <a href="#wellbeing" className="feature-card">
              <div className="feature-icon">❤️</div>

              <h3>Well-being</h3>

              <p>
                Check in with your mood, stress, sleep and overall well-being.
              </p>
            </a>

            {/* HEALTH CARD */}
            <a href="#healthcard" className="feature-card">
              <div className="feature-icon">📋</div>

              <h3>Health Card</h3>

              <p>Keep important emergency information easily accessible.</p>
            </a>
          </div>
        </section>

        {/* HEALTH GUIDANCE */}
        <section id="guidance" className="page-section">
          <h2>🩺 Health Guidance</h2>

          <p>Tell CareBridge what kind of help you need.</p>

          {Object.keys(guidanceResults).map((option) => (
            <button key={option} onClick={() => setGuidance(option)}>
              {option}
            </button>
          ))}

          {guidance && (
            <p className="result-message">{guidanceResults[guidance]}</p>
          )}
        </section>

        {/* FIND HEALTHCARE */}
        <section id="healthcare" className="page-section">
          <h2>🏥 Find Healthcare</h2>

          <p>Find hospitals, clinics and pharmacies near you.</p>

          <button
            type="button"
            onClick={() => setLocateRequest((request) => request + 1)}
          >
            Find Healthcare Near Me
          </button>

          <Map locateRequest={locateRequest} />
        </section>

        {/* WELL-BEING */}
        <section id="wellbeing" className="page-section">
          <h2>❤️ Well-being</h2>

          <p>Take a quick check-in with your well-being.</p>

          <p>How are you feeling today?</p>

          {Object.keys(wellbeingResults).map((option) => (
            <button key={option} onClick={() => setWellbeing(option)}>
              {option}
            </button>
          ))}

          {wellbeing && (
            <p className="result-message">{wellbeingResults[wellbeing]}</p>
          )}
        </section>

        {/* HEALTH CARD */}
        <section id="healthcard" className="page-section">
          <h2>📋 Health Card</h2>

          <p>Keep important health and emergency information in one place.</p>

          <form className="health-card-form" onSubmit={saveHealthCard}>
            <label>
              Full name
              <input
                autoComplete="name"
                name="name"
                value={healthCard.name}
                onChange={updateHealthCard}
              />
            </label>
            <label>
              Blood group
              <input
                name="bloodGroup"
                value={healthCard.bloodGroup}
                onChange={updateHealthCard}
                placeholder="e.g. O+"
              />
            </label>
            <label>
              Emergency contact
              <input
                autoComplete="tel"
                name="emergencyContact"
                value={healthCard.emergencyContact}
                onChange={updateHealthCard}
                placeholder="Name and phone number"
              />
            </label>
            <label>
              Important information
              <textarea
                name="notes"
                value={healthCard.notes}
                onChange={updateHealthCard}
                placeholder="Allergies, medicines, or other notes"
              />
            </label>
            <button type="submit">Save Health Card</button>
            <p className="saved-message">{saveStatus}</p>
          </form>
        </section>
      </main>
    </div>
  );
}

export default App;
