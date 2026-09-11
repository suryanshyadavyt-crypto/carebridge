import { useEffect, useState } from "react";
import "./App.css";
import Map from "./map";
import heroImage from "./assets/hero.png";

const guidanceResults = {
  "General Health": {
    summary: "A simple starting point for a new or ongoing health concern.",
    steps: [
      "Write down when the concern started and what makes it better or worse.",
      "Check your temperature if relevant and note any medicines you already take.",
      "Arrange a routine appointment if the concern continues or affects daily life.",
    ],
    help: "Seek urgent care if symptoms become severe, sudden, or rapidly worsen.",
  },
  "Minor Injury": {
    summary:
      "For small bumps, strains, cuts, or bruises that do not appear severe.",
    steps: [
      "Rest the area and avoid activity that increases pain.",
      "For swelling, use a wrapped cold pack for short periods and keep the area raised.",
      "Keep cuts clean and covered, and monitor pain, swelling, or skin changes.",
    ],
    help: "Get medical help for heavy bleeding, a deep wound, a deformity, numbness, or inability to move.",
  },
  "Feeling Unwell": {
    summary:
      "A gentle plan for mild symptoms such as tiredness, nausea, or a low fever.",
    steps: [
      "Rest, drink small amounts of water regularly, and choose light food if you can eat.",
      "Keep track of your symptoms and whether they are improving over the next 24 hours.",
      "Ask a healthcare professional or pharmacist about suitable over-the-counter options.",
    ],
    help: "Seek care if symptoms persist, you cannot keep fluids down, or you are getting worse.",
  },
  "Headache or Migraine": {
    summary:
      "A calm first step for a common headache while you monitor how you feel.",
    steps: [
      "Rest somewhere quiet, reduce bright screens, and drink water.",
      "Note possible triggers such as missed meals, poor sleep, stress, or dehydration.",
      "Use only medicines you normally take safely and follow their label instructions.",
    ],
    help: "Get emergency help for a sudden worst-ever headache, confusion, weakness, vision loss, or a stiff neck with fever.",
  },
  "Fever or Cold": {
    summary:
      "Supportive care can help while your body recovers from many common infections.",
    steps: [
      "Rest and drink fluids; dress comfortably rather than overheating.",
      "Wash your hands and consider staying home while you have a fever or feel contagious.",
      "Contact a clinician if the fever is persistent, very high, or concerns a young child or vulnerable person.",
    ],
    help: "Seek urgent care for breathing trouble, blue lips, severe drowsiness, or signs of dehydration.",
  },
  "Stomach Trouble": {
    summary: "For mild stomach pain, nausea, indigestion, or diarrhea.",
    steps: [
      "Take frequent small sips of water or an oral rehydration drink.",
      "When ready, choose bland foods and avoid alcohol or foods that clearly worsen symptoms.",
      "Track pain, vomiting, bowel changes, fever, and how often you urinate.",
    ],
    help: "Get urgent help for severe pain, blood in vomit or stool, a swollen abdomen, or inability to drink.",
  },
  "Stress or Sleep": {
    summary:
      "Small repeatable habits can help when stress or poor sleep is affecting your routine.",
    steps: [
      "Try a slow breathing exercise, short walk, or screen-free wind-down period.",
      "Keep a regular sleep and wake time, even after a difficult night.",
      "Talk with someone you trust and consider professional support if this continues.",
    ],
    help: "If you feel unsafe or might harm yourself, contact local emergency services or a crisis support line now.",
  },
  Emergency: {
    summary:
      "This option is for symptoms that may need immediate medical attention.",
    steps: [
      "Call your local emergency number or go to the nearest emergency department now.",
      "Do not drive yourself if you feel faint, confused, severely unwell, or unable to travel safely.",
      "If possible, keep your medicines, allergies, and emergency contact information ready.",
    ],
    help: "For immediate danger, severe breathing trouble, chest pressure, stroke signs, or uncontrolled bleeding, call emergency services now.",
  },
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
            <a href="#guidance" className="feature-card feature-guidance">
              <div className="feature-icon">🩺</div>

              <h3>Health Guidance</h3>

              <p>
                Get simple guidance about what you should consider doing next.
              </p>
            </a>

            {/* FIND HEALTHCARE */}
            <a href="#healthcare" className="feature-card feature-healthcare">
              <div className="feature-icon">🏥</div>

              <h3>Find Healthcare</h3>

              <p>Find hospitals, clinics and other healthcare resources.</p>
            </a>

            {/* WELL-BEING */}
            <a href="#wellbeing" className="feature-card feature-wellbeing">
              <div className="feature-icon">❤️</div>

              <h3>Well-being</h3>

              <p>
                Check in with your mood, stress, sleep and overall well-being.
              </p>
            </a>

            {/* HEALTH CARD */}
            <a href="#healthcard" className="feature-card feature-card-info">
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

          <div className="guidance-options">
            {Object.keys(guidanceResults).map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => setGuidance(option)}
              >
                {option}
              </button>
            ))}
          </div>

          {guidance && (
            <div className="guidance-result" aria-live="polite">
              <h3>{guidance}</h3>
              <p>{guidanceResults[guidance].summary}</p>
              <h4>Try this first</h4>
              <ul>
                {guidanceResults[guidance].steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
              <p className="help-note">
                <strong>When to get help:</strong>{" "}
                {guidanceResults[guidance].help}
              </p>
            </div>
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

          <p className="mood-prompt">
            Take a moment. How are you feeling today?
          </p>

          {Object.keys(wellbeingResults).map((option) => (
            <button
              className="mood-button"
              key={option}
              onClick={() => setWellbeing(option)}
            >
              {option === "Good" && "😊 "}
              {option === "Okay" && "🙂 "}
              {option === "Struggling" && "🫶 "}
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
