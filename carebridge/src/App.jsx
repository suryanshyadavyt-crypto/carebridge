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

const guidanceIcons = {
  "General Health": "🩺",
  "Minor Injury": "🩹",
  "Feeling Unwell": "🌡️",
  "Headache or Migraine": "🧠",
  "Fever or Cold": "🤧",
  "Stomach Trouble": "🍵",
  "Stress or Sleep": "🌙",
  Emergency: "🚨",
};

const wellbeingResults = {
  Good: "That is encouraging. Protect what is working by keeping a steady routine, making time for movement, and staying connected to people who help you feel grounded.",
  Okay: "Small steps can help today: take a short break, drink some water, eat something nourishing, and check in with someone you trust before the day gets too full.",
  Struggling:
    "You do not have to handle this alone. Tell someone you trust how you are feeling, reduce the pressure on your next task, and consider reaching out to a mental health professional today.",
};

const cheerfulSlogans = [
  "Small steps still move you forward.",
  "You deserve a little care today.",
  "A calmer moment can start right here.",
  "You are doing something good by checking in.",
  "Take a breath; there is no need to solve everything at once.",
];

const languageOptions = [
  ["en", "English"],
  ["as", "অসমীয়া"],
  ["bn", "বাংলা"],
  ["brx", "बड़ो"],
  ["doi", "डोगरी"],
  ["gu", "ગુજરાતી"],
  ["hi", "हिन्दी"],
  ["kn", "ಕನ್ನಡ"],
  ["ks", "कॉशुर"],
  ["kok", "कोंकणी"],
  ["mai", "मैथिली"],
  ["ml", "മലയാളം"],
  ["mni", "মৈতৈলোন"],
  ["mr", "मराठी"],
  ["ne", "नेपाली"],
  ["or", "ଓଡ଼ିଆ"],
  ["pa", "ਪੰਜਾਬੀ"],
  ["sa", "संस्कृतम्"],
  ["sat", "संथाली"],
  ["sd", "سنڌي"],
  ["ta", "தமிழ்"],
  ["te", "తెలుగు"],
  ["ur", "اردو"],
];

const translations = {
  en: {
    home: "Home",
    guidance: "Health Guidance",
    healthcare: "Find Healthcare",
    wellbeing: "Well-being",
    healthCard: "Health Card",
    heroEyebrow: "YOUR EVERYDAY HEALTH COMPASS",
    heroTitle: "Healthcare, made easier.",
    heroDescription:
      "CareBridge helps you understand your next step, find healthcare resources and take better care of your well-being.",
    getStarted: "Get Started",
    exploreCare: "Explore nearby care",
    calmEyebrow: "A CALMER WAY FORWARD",
    nextStep: "Know what to do next.",
    nextStepDescription:
      "CareBridge brings everyday health support into one thoughtful place. Start with a simple check-in, find nearby care, or keep the information your family may need in an emergency.",
    toolGuidance: "Health guidance",
    toolCare: "Find nearby care",
    toolWellbeing: "Well-being check-in",
    toolCard: "Your health card",
    helps: "How CareBridge Helps",
  },
  hi: {
    home: "होम",
    guidance: "स्वास्थ्य मार्गदर्शन",
    healthcare: "स्वास्थ्य सेवा खोजें",
    wellbeing: "मानसिक स्वास्थ्य",
    healthCard: "स्वास्थ्य कार्ड",
    heroEyebrow: "आपका रोज़ाना स्वास्थ्य साथी",
    heroTitle: "स्वास्थ्य सेवा, अब आसान।",
    heroDescription:
      "CareBridge आपको अगला कदम समझने, स्वास्थ्य संसाधन खोजने और अपने स्वास्थ्य का बेहतर ध्यान रखने में मदद करता है।",
    getStarted: "शुरू करें",
    exploreCare: "पास की स्वास्थ्य सेवा देखें",
    calmEyebrow: "एक शांत और आसान रास्ता",
    nextStep: "जानें कि अगला कदम क्या है।",
    nextStepDescription:
      "CareBridge रोज़मर्रा की स्वास्थ्य सहायता को एक सरल जगह पर लाता है। छोटा चेक-इन करें, पास की सेवा खोजें या ज़रूरी स्वास्थ्य जानकारी सुरक्षित रखें।",
    toolGuidance: "स्वास्थ्य मार्गदर्शन",
    toolCare: "पास की सेवा खोजें",
    toolWellbeing: "मानसिक स्वास्थ्य चेक-इन",
    toolCard: "आपका स्वास्थ्य कार्ड",
    helps: "CareBridge आपकी कैसे मदद करता है",
  },
};

const hospitalReviews = [
  ["Aarav", 5, "Helpful staff and a clean reception area."],
  [
    "Meera",
    4,
    "The doctors were attentive. Calling ahead helped reduce waiting.",
  ],
  [
    "Kabir",
    4,
    "Good option for routine care. Emergency availability may vary.",
  ],
];

function createSupportPlan(symptoms, mood) {
  const concern = symptoms.trim() || "the way you have been feeling";
  const moodContext =
    mood === "Struggling"
      ? "Because you selected Struggling, please lower the pressure on yourself and involve someone you trust."
      : mood === "Okay"
        ? "Because you selected Okay, a few small adjustments and a short check-in later may help you notice whether things are improving."
        : "Because you selected Good, use that steadier feeling as a chance to notice what habits are helping you. It is still worth paying attention if symptoms change.";

  return [
    `You described ${concern}. This guide is a calm starting point, not a diagnosis. Many everyday symptoms can have several possible causes, and the right next step depends on how long they have been present, how intense they are, and what else is happening in your body. Begin by noting when the problem started, whether it is getting better or worse, and anything that seems to trigger or relieve it. If you can, record your temperature, sleep, food and fluids, medicines taken, and any relevant medical conditions.`,
    `For the next few hours, choose the gentlest helpful action. Rest if you feel tired, drink water in small regular amounts, and eat something simple if you can tolerate food. Avoid alcohol and activities that clearly increase pain, dizziness, breathlessness, or nausea. Keep your usual medicines within reach, but do not start a new medicine or change a prescribed dose based only on this message. A pharmacist or clinician can help you choose an appropriate option, especially if you are pregnant, caring for a child, or managing a long-term condition.`,
    `Give yourself a clear review point rather than checking every minute. Reassess after a few hours for a short-lived concern, or over the next day for mild symptoms. Look for practical changes such as improved comfort, better hydration, lower temperature, easier movement, or a return of normal energy. If the symptom is persistent, keeps returning, interferes with sleep or daily activities, or worries you, arrange advice from a healthcare professional. Take your notes with you so the conversation is more useful.`,
    `${moodContext} A trusted person can help you remember details, collect supplies, or notice changes you might miss when you feel unwell. If stress is part of the picture, try one slow minute of breathing, put one manageable task aside, and choose a quiet place to recover. You do not need to solve every part of the problem at once; the aim is to make the next safe decision clear.`,
    `Get urgent medical help now for severe or rapidly worsening symptoms, trouble breathing, chest pressure, fainting, new confusion, a seizure, signs of a stroke, uncontrolled bleeding, severe dehydration, or a sudden extreme pain. If you feel unsafe or might harm yourself, contact local emergency services or a crisis support line immediately and stay with someone you trust. Otherwise, use this plan as a prompt for observation and follow-up, not as a replacement for an examination or professional medical advice.`,
  ];
}

const getInitialPath = () => {
  const legacyPath = window.location.hash.replace("#", "");
  const validPaths = [
    "guidance",
    "healthcare",
    "wellbeing",
    "healthcard",
    "hospital",
  ];
  return validPaths.includes(legacyPath)
    ? `/${legacyPath}`
    : window.location.pathname || "/";
};

function App() {
  const [authMode, setAuthMode] = useState("login");
  const [authError, setAuthError] = useState("");
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("carebridge-session")) || null;
    } catch {
      return null;
    }
  });
  const [currentPath, setCurrentPath] = useState(getInitialPath);
  const [language, setLanguage] = useState(
    () => localStorage.getItem("carebridge-language") || "en",
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(() => {
    try {
      return (
        JSON.parse(sessionStorage.getItem("carebridge-selected-hospital")) ||
        null
      );
    } catch {
      return null;
    }
  });
  const [landingTool, setLandingTool] = useState("guidance");
  const [landingGuidance, setLandingGuidance] = useState("General Health");
  const [landingMood, setLandingMood] = useState("Okay");
  const [selectedGuidance, setSelectedGuidance] = useState([]);
  const [symptomQuery, setSymptomQuery] = useState("");
  const [symptomResponse, setSymptomResponse] = useState([]);
  const [wellbeing, setWellbeing] = useState("");
  const [wellbeingResponse, setWellbeingResponse] = useState([]);
  const [wellbeingSlogan, setWellbeingSlogan] = useState("");
  const [locateRequest, setLocateRequest] = useState(0);
  const [saveStatus, setSaveStatus] = useState(
    "Saved automatically on this device.",
  );
  const [healthCard, setHealthCard] = useState(() => {
    try {
      const session = JSON.parse(localStorage.getItem("carebridge-session"));
      const storageKey = session
        ? `carebridge-health-card-${session.email}`
        : "carebridge-health-card";
      return (
        JSON.parse(localStorage.getItem(storageKey)) || {
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
  const copy = translations[language] || translations.en;

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        `carebridge-health-card-${currentUser.email}`,
        JSON.stringify(healthCard),
      );
    }
  }, [currentUser, healthCard]);

  useEffect(() => {
    localStorage.setItem("carebridge-language", language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const handlePopState = () =>
      setCurrentPath(window.location.pathname || "/");
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [currentPath]);

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openHospitalPage = (hospital) => {
    setSelectedHospital(hospital);
    sessionStorage.setItem(
      "carebridge-selected-hospital",
      JSON.stringify(hospital),
    );
    navigate("/hospital");
  };

  const updateAuthForm = (event) => {
    const { name, value } = event.target;
    setAuthForm((current) => ({ ...current, [name]: value }));
    setAuthError("");
  };

  const submitAuth = (event) => {
    event.preventDefault();
    const email = authForm.email.trim().toLowerCase();

    if (!email || !email.includes("@")) {
      setAuthError("Enter a valid email address.");
      return;
    }
    if (authForm.password.length < 8) {
      setAuthError("Your password must be at least 8 characters.");
      return;
    }

    const accounts = JSON.parse(
      localStorage.getItem("carebridge-accounts") || "{}",
    );
    const account = accounts[email];

    if (authMode === "signup") {
      if (account) {
        setAuthError("An account with this email already exists.");
        return;
      }
      accounts[email] = { password: authForm.password };
      localStorage.setItem("carebridge-accounts", JSON.stringify(accounts));
    } else if (!account || account.password !== authForm.password) {
      setAuthError("The email or password is incorrect.");
      return;
    }

    const session = { email };
    localStorage.setItem("carebridge-session", JSON.stringify(session));
    const savedHealthCard = localStorage.getItem(
      `carebridge-health-card-${email}`,
    );
    setHealthCard(
      savedHealthCard
        ? JSON.parse(savedHealthCard)
        : { name: "", bloodGroup: "", emergencyContact: "", notes: "" },
    );
    setCurrentUser(session);
    setAuthForm({ email: "", password: "" });
    setAuthError("");
  };

  const signOut = () => {
    localStorage.removeItem("carebridge-session");
    setCurrentUser(null);
  };

  const updateHealthCard = (event) => {
    const { name, value } = event.target;
    setHealthCard((current) => ({ ...current, [name]: value }));
    setSaveStatus("Unsaved changes");
  };

  const saveHealthCard = (event) => {
    event.preventDefault();
    localStorage.setItem(
      `carebridge-health-card-${currentUser.email}`,
      JSON.stringify(healthCard),
    );
    setSaveStatus("Health card saved on this device.");
  };

  const generateSymptomGuidance = (event) => {
    event.preventDefault();
    if (symptomQuery.trim().length < 3) return;
    setSymptomResponse(createSupportPlan(symptomQuery, wellbeing || "Okay"));
  };

  const toggleGuidance = (option) => {
    setSelectedGuidance((current) =>
      current.includes(option)
        ? current.filter((selected) => selected !== option)
        : [...current, option],
    );
  };

  const selectWellbeing = (option) => {
    setWellbeing(option);
    setWellbeingSlogan(
      cheerfulSlogans[Math.floor(Math.random() * cheerfulSlogans.length)],
    );
    setWellbeingResponse(createSupportPlan("my current well-being", option));
  };

  if (!currentUser) {
    return (
      <main className="auth-page">
        <section className="auth-panel" aria-labelledby="auth-title">
          <div className="auth-brand">CareBridge</div>
          <p className="auth-kicker">YOUR EVERYDAY HEALTH COMPASS</p>
          <h1 id="auth-title">
            {authMode === "login" ? "Welcome back." : "Create your account."}
          </h1>
          <p className="auth-intro">
            {authMode === "login"
              ? "Sign in to keep your care tools close and your health card ready."
              : "Start a private space for your everyday health information."}
          </p>

          <form className="auth-form" onSubmit={submitAuth}>
            <label>
              Email address
              <input
                autoComplete="email"
                name="email"
                type="email"
                value={authForm.email}
                onChange={updateAuthForm}
                placeholder="you@example.com"
                required
              />
            </label>
            <label>
              Password
              <input
                autoComplete={
                  authMode === "login" ? "current-password" : "new-password"
                }
                name="password"
                type="password"
                value={authForm.password}
                onChange={updateAuthForm}
                placeholder="At least 8 characters"
                minLength="8"
                required
              />
            </label>
            {authError && (
              <p className="auth-error" role="alert">
                {authError}
              </p>
            )}
            <button className="auth-submit" type="submit">
              {authMode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="auth-switch">
            {authMode === "login"
              ? "New to CareBridge?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === "login" ? "signup" : "login");
                setAuthError("");
              }}
            >
              {authMode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
          <p className="auth-note">
            This preview stores account data in this browser only. Connect a
            secure auth service before production use.
          </p>
        </section>
      </main>
    );
  }

  return (
    <div className="app">
      {/* NAVIGATION */}
      <nav className="navbar" aria-label="Main navigation">
        <div className="logo">CareBridge</div>

        <button
          type="button"
          className="menu-toggle"
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
          onClick={() => {
            setMenuOpen((open) => !open);
            setProfileOpen(false);
          }}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>

        <div className="account-actions">
          <button
            type="button"
            className="profile-toggle"
            aria-label={`Open account menu for ${currentUser.email}`}
            aria-expanded={profileOpen}
            onClick={() => {
              setProfileOpen((open) => !open);
              setMenuOpen(false);
            }}
          >
            {currentUser.email.charAt(0).toUpperCase()}
          </button>
          {profileOpen && (
            <div className="profile-popover">
              <strong>{currentUser.email}</strong>
              <label className="language-picker">
                <span>Select language</span>
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  aria-label="Select language"
                >
                  {languageOptions.map(([value, label]) => (
                    <option value={value} key={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                className="sign-out-button"
                onClick={signOut}
              >
                Sign out
              </button>
            </div>
          )}
        </div>

        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li>
            <a
              href="/"
              onClick={(event) => {
                event.preventDefault();
                navigate("/");
              }}
            >
              {copy.home}
            </a>
          </li>

          <li>
            <a
              href="/guidance"
              onClick={(event) => {
                event.preventDefault();
                navigate("/guidance");
              }}
            >
              {copy.guidance}
            </a>
          </li>

          <li>
            <a
              href="/healthcare"
              onClick={(event) => {
                event.preventDefault();
                navigate("/healthcare");
              }}
            >
              {copy.healthcare}
            </a>
          </li>

          <li>
            <a
              href="/wellbeing"
              onClick={(event) => {
                event.preventDefault();
                navigate("/wellbeing");
              }}
            >
              {copy.wellbeing}
            </a>
          </li>
        </ul>
      </nav>

      <main>
        {currentPath === "/" && (
          <>
            <section className="hero" id="home">
              <div className="hero-copy">
                <p className="eyebrow">{copy.heroEyebrow}</p>
                <h1>{copy.heroTitle}</h1>

                <p>{copy.heroDescription}</p>

                <div className="hero-actions">
                  <a
                    className="primary-button"
                    href="/guidance"
                    onClick={(event) => {
                      event.preventDefault();
                      navigate("/guidance");
                    }}
                  >
                    {copy.getStarted}
                  </a>
                  <a
                    className="text-link"
                    href="/healthcare"
                    onClick={(event) => {
                      event.preventDefault();
                      navigate("/healthcare");
                    }}
                  >
                    {copy.exploreCare} <span aria-hidden="true">↗</span>
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

            <section
              className="landing-experience"
              aria-labelledby="experience-title"
            >
              <div className="landing-experience-copy">
                <p className="eyebrow">{copy.calmEyebrow}</p>
                <h2 id="experience-title">{copy.nextStep}</h2>
                <p>{copy.nextStepDescription}</p>
              </div>

              <div
                className="landing-tool-tabs"
                role="tablist"
                aria-label="CareBridge tools"
              >
                {[
                  ["guidance", copy.toolGuidance],
                  ["care", copy.toolCare],
                  ["wellbeing", copy.toolWellbeing],
                  ["card", copy.toolCard],
                ].map(([tool, label]) => (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={landingTool === tool}
                    className={landingTool === tool ? "active" : ""}
                    key={tool}
                    onClick={() => setLandingTool(tool)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="landing-tool-preview">
                {landingTool === "guidance" && (
                  <div className="preview-content">
                    <span className="preview-icon">🩺</span>
                    <div>
                      <h3>Start with a simple concern</h3>
                      <p>
                        Choose a topic to see the kind of practical next steps
                        CareBridge can offer.
                      </p>
                      <div className="preview-options">
                        {Object.keys(guidanceResults)
                          .slice(0, 3)
                          .map((option) => (
                            <button
                              type="button"
                              className={
                                landingGuidance === option ? "selected" : ""
                              }
                              key={option}
                              onClick={() => setLandingGuidance(option)}
                            >
                              {option}
                            </button>
                          ))}
                      </div>
                      <p className="preview-result">
                        {guidanceResults[landingGuidance].summary}
                      </p>
                    </div>
                  </div>
                )}

                {landingTool === "care" && (
                  <div className="preview-content">
                    <span className="preview-icon">🏥</span>
                    <div>
                      <h3>Find care around you</h3>
                      <p>
                        Use your location to discover hospitals, clinics, and
                        pharmacies nearby.
                      </p>
                      <button
                        type="button"
                        className="preview-action"
                        onClick={() => navigate("/healthcare")}
                      >
                        Open care finder <span aria-hidden="true">↗</span>
                      </button>
                    </div>
                  </div>
                )}

                {landingTool === "wellbeing" && (
                  <div className="preview-content preview-content-centered">
                    <span className="preview-icon">❤️</span>
                    <div>
                      <h3>Make space for how you feel</h3>
                      <p>
                        A quick check-in can help you notice what kind of
                        support you need today.
                      </p>
                      <div className="preview-options">
                        {Object.keys(wellbeingResults).map((option) => (
                          <button
                            type="button"
                            className={landingMood === option ? "selected" : ""}
                            key={option}
                            onClick={() => setLandingMood(option)}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                      <p className="preview-result">
                        <strong>{landingMood}:</strong>{" "}
                        {wellbeingResults[landingMood]}
                      </p>
                    </div>
                  </div>
                )}

                {landingTool === "card" && (
                  <div className="preview-content">
                    <span className="preview-icon">📋</span>
                    <div>
                      <h3>Keep important details ready</h3>
                      <p>
                        Save allergies, medicines, blood group, and an emergency
                        contact in one accessible health card.
                      </p>
                      <button
                        type="button"
                        className="preview-action"
                        onClick={() => navigate("/healthcard")}
                      >
                        Set up your health card{" "}
                        <span aria-hidden="true">↗</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="features">
              <h2>{copy.helps}</h2>

              <div className="feature-grid">
                {/* HEALTH GUIDANCE */}
                <a
                  href="/guidance"
                  onClick={(event) => {
                    event.preventDefault();
                    navigate("/guidance");
                  }}
                  className="feature-card feature-guidance"
                >
                  <div className="feature-icon">🩺</div>

                  <h3>{copy.guidance}</h3>

                  <p>
                    Get simple guidance about what you should consider doing
                    next.
                  </p>
                </a>

                {/* FIND HEALTHCARE */}
                <a
                  href="/healthcare"
                  onClick={(event) => {
                    event.preventDefault();
                    navigate("/healthcare");
                  }}
                  className="feature-card feature-healthcare"
                >
                  <div className="feature-icon">🏥</div>

                  <h3>{copy.healthcare}</h3>

                  <p>Find hospitals, clinics and other healthcare resources.</p>
                </a>

                {/* WELL-BEING */}
                <a
                  href="/wellbeing"
                  onClick={(event) => {
                    event.preventDefault();
                    navigate("/wellbeing");
                  }}
                  className="feature-card feature-wellbeing"
                >
                  <div className="feature-icon">❤️</div>

                  <h3>{copy.wellbeing}</h3>

                  <p>
                    Check in with your mood, stress, sleep and overall
                    well-being.
                  </p>
                </a>

                {/* HEALTH CARD */}
                <a
                  href="/healthcard"
                  onClick={(event) => {
                    event.preventDefault();
                    navigate("/healthcard");
                  }}
                  className="feature-card feature-card-info"
                >
                  <div className="feature-icon">📋</div>

                  <h3>{copy.healthCard}</h3>

                  <p>Keep important emergency information easily accessible.</p>
                </a>
              </div>
            </section>
          </>
        )}

        {currentPath === "/guidance" && (
          <section className="page-section feature-page">
            <button
              className="back-button"
              type="button"
              onClick={() => navigate("/")}
            >
              ← Back to home
            </button>
            <h2>🩺 {copy.guidance}</h2>

            <p>Tell CareBridge what kind of help you need.</p>

            <form className="symptom-search" onSubmit={generateSymptomGuidance}>
              <label htmlFor="symptom-query">
                What symptoms are you facing?
              </label>
              <div className="symptom-search-row">
                <input
                  id="symptom-query"
                  type="search"
                  value={symptomQuery}
                  onChange={(event) => setSymptomQuery(event.target.value)}
                  placeholder="e.g. headache and feeling tired since yesterday"
                  aria-describedby="symptom-search-note"
                />
                <button type="submit">Get guidance</button>
              </div>
              <p id="symptom-search-note" className="search-note">
                Share a few details. CareBridge will offer a calm,
                non-diagnostic starting plan.
              </p>
            </form>

            <div
              className="guidance-options"
              aria-label="Choose one or more guidance topics"
            >
              {Object.keys(guidanceResults).map((option) => (
                <button
                  type="button"
                  className={`guidance-flash-card ${selectedGuidance.includes(option) ? "selected" : ""}`}
                  aria-pressed={selectedGuidance.includes(option)}
                  key={option}
                  onClick={() => toggleGuidance(option)}
                >
                  <span className="flash-card-icon" aria-hidden="true">
                    {guidanceIcons[option]}
                  </span>
                  <span>{option}</span>
                  <small>
                    {selectedGuidance.includes(option) ? "Selected" : "Choose"}
                  </small>
                </button>
              ))}
            </div>

            {selectedGuidance.map((option) => (
              <div className="guidance-result" aria-live="polite" key={option}>
                <h3>
                  {guidanceIcons[option]} {option}
                </h3>
                <p>{guidanceResults[option].summary}</p>
                <h4>Try this first</h4>
                <ul>
                  {guidanceResults[option].steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
                <p className="help-note">
                  <strong>When to get help:</strong>{" "}
                  {guidanceResults[option].help}
                </p>
              </div>
            ))}

            {symptomResponse.length > 0 && (
              <div className="guidance-result ai-response" aria-live="polite">
                <h3>Your CareBridge support plan</h3>
                {symptomResponse.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            )}
          </section>
        )}

        {currentPath === "/hospital" && selectedHospital && (
          <section className="page-section feature-page hospital-page">
            <button
              className="back-button"
              type="button"
              onClick={() => navigate("/healthcare")}
            >
              ← Back to healthcare search
            </button>
            <p className="details-label">Selected hospital</p>
            <h2>🏥 {selectedHospital.name}</h2>
            <p>{selectedHospital.address}</p>

            <div className="hospital-profile-grid">
              <div className="hospital-profile-panel">
                <h3>Visit information</h3>
                <p>
                  <strong>Distance:</strong>{" "}
                  {selectedHospital.distance.toFixed(1)} km away
                </p>
                <p>
                  <strong>Hours:</strong> {selectedHospital.hours}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedHospital.phone}
                </p>
                <div className="appointment-slots">
                  <strong>Available time slots</strong>
                  <div>
                    {selectedHospital.slots.map((slot) => (
                      <span key={slot}>{slot}</span>
                    ))}
                  </div>
                </div>
                <a
                  className="route-button"
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.position[0]},${selectedHospital.position[1]}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Show route to hospital ↗
                </a>
              </div>

              <div className="hospital-profile-panel reviews-panel">
                <h3>Patient reviews</h3>
                <p className="review-summary">
                  <strong>4.3 / 5</strong> based on community feedback
                </p>
                {hospitalReviews.map(([name, rating, review]) => (
                  <article className="hospital-review" key={name}>
                    <div>
                      <strong>{name}</strong>
                      <span>{"★".repeat(rating)}</span>
                    </div>
                    <p>{review}</p>
                  </article>
                ))}
                <p className="review-note">
                  Reviews are illustrative guidance for this preview. Confirm
                  current services directly with the hospital.
                </p>
              </div>
            </div>
          </section>
        )}

        {currentPath === "/healthcare" && (
          <section className="page-section feature-page">
            <button
              className="back-button"
              type="button"
              onClick={() => navigate("/")}
            >
              ← Back to home
            </button>
            <h2>🏥 {copy.healthcare}</h2>

            <p>Find hospitals, clinics and pharmacies near you.</p>

            <button
              type="button"
              onClick={() => setLocateRequest((request) => request + 1)}
            >
              Find Healthcare Near Me
            </button>

            <Map
              locateRequest={locateRequest}
              onHospitalSelect={openHospitalPage}
            />
          </section>
        )}

        {currentPath === "/wellbeing" && (
          <section className="page-section feature-page">
            <button
              className="back-button"
              type="button"
              onClick={() => navigate("/")}
            >
              ← Back to home
            </button>
            <h2>❤️ {copy.wellbeing}</h2>

            <p>Take a quick check-in with your well-being.</p>

            <p className="mood-prompt">
              Take a moment. How are you feeling today?
            </p>

            {Object.keys(wellbeingResults).map((option) => (
              <button
                className="mood-button"
                key={option}
                onClick={() => selectWellbeing(option)}
              >
                {option === "Good" && "😊 "}
                {option === "Okay" && "🙂 "}
                {option === "Struggling" && "🫶 "}
                {option}
              </button>
            ))}

            {wellbeing && (
              <div
                className="guidance-result wellbeing-response"
                aria-live="polite"
              >
                <p className="wellbeing-slogan">{wellbeingSlogan}</p>
                <h3>{wellbeing} support plan</h3>
                {wellbeingResponse.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            )}
          </section>
        )}

        {currentPath === "/healthcard" && (
          <section className="page-section feature-page">
            <button
              className="back-button"
              type="button"
              onClick={() => navigate("/")}
            >
              ← Back to home
            </button>
            <h2>📋 {copy.healthCard}</h2>

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
        )}

        {![
          "/",
          "/guidance",
          "/healthcare",
          "/wellbeing",
          "/healthcard",
          "/hospital",
        ].includes(currentPath) && (
          <section className="page-section feature-page">
            <h2>Page not found</h2>
            <p>That CareBridge page does not exist.</p>
            <button type="button" onClick={() => navigate("/")}>
              Return home
            </button>
          </section>
        )}

        {currentPath === "/hospital" && !selectedHospital && (
          <section className="page-section feature-page">
            <h2>Hospital details unavailable</h2>
            <p>
              Select a hospital from the healthcare search to view its details.
            </p>
            <button type="button" onClick={() => navigate("/healthcare")}>
              Return to healthcare search
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
