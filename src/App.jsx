
import { useState } from "react";
import "./App.css";
import LetterEditor from "./LetterEditor";
import Auth from "./Auth";
import Dashboard from "./Dashboard";

function App() {
  const [showNote, setShowNote] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
const [session, setSession] = useState(null);
const [showDashboard, setShowDashboard] = useState(false);
  

if (showAuth) {
  return (
    <Auth
      onClose={() => setShowAuth(false)}
      onLogin={(data) => {
        setSession(data);
        setShowAuth(false);
        setShowDashboard(true);
      }}
    />
  );
}

if (showEditor) {
  return (
    <LetterEditor
      token={session?.token}
      onClose={() => {
        setShowEditor(false);
        setShowDashboard(true);
      }}
    />
  );
}

if (showDashboard) {
  return (
    <Dashboard
      token={session?.token}
      onWriteLetter={() => {
        setShowDashboard(false);
        setShowEditor(true);
      }}
      onLogout={() => {
        setSession(null);
        setShowDashboard(false);
        setShowAuth(true);
      }}
    />
  );
}


  return (
    <div className="app">
      <nav className="navbar">
        <a className="logo" href="#home">
          <span className="logo-icon">✳</span> kairos
        </a>

        <div className="nav-links">
          <a href="#story">Our story</a>
          <a href="#how">How it works</a>
          <button
            className="nav-button"
            onClick={() => setShowAuth(true)}
          >
            Sign in ↗
          </button>
        </div>
      </nav>

      <main id="home">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span>✳</span> A LITTLE SOMETHING FOR LATER
            </div>

            <h1>
              Some feelings
              <br />
              deserve their
              <br />
              <em>own time.</em>
            </h1>

            <p className="description">
              Write a letter today. Send it tomorrow,
              next month, or on a day that means
              everything. We'll take care of the timing.
            </p>

            <button
              className="primary-button"
              onClick={() => {
  if (session?.token) {
    setShowEditor(true);
  } else {
    setShowAuth(true);
  }
}}
            >
              Write a letter <span>↗</span>
            </button>

            <div className="little-note">
              <span>♡</span> Made for the moments that matter.
            </div>
          </div>

          <div className="hero-art">
            <div className="sun-circle" />
            <span className="sparkle sparkle-one">✳</span>
            <span className="sparkle sparkle-two">✧</span>
            <span className="sparkle sparkle-three">✳</span>

            <div className="letter-paper">
              <div className="paper-top">
                <span>a letter for you</span>
                <span>♡</span>
              </div>

              <div className="paper-flower">❀</div>

              <p className="handwriting">
                To someone
                <br />
                who makes
                <br />
                the world softer...
              </p>

              <div className="paper-bottom">
                <span>with love, always</span>
                <span>xo</span>
              </div>
            </div>

            <div className="envelope">
              <div className="envelope-flap" />
              <div className="wax-seal">k</div>
            </div>

            <div className="floating-note note-left">
              <span>♡</span> a little love
            </div>

            <div className="floating-note note-right">
              <span>✉</span> sent with care
            </div>

            <span className="art-caption">
              written today, felt tomorrow
            </span>
          </div>
        </section>

        <section className="bottom-strip" id="how">
          <div>
            <span className="strip-icon">01</span>
            <p>
              <strong>Write from the heart</strong>
              <br />
              <span>Every word is yours.</span>
            </p>
          </div>

          <span className="strip-divider">✳</span>

          <div>
            <span className="strip-icon">02</span>
            <p>
              <strong>Choose your moment</strong>
              <br />
              <span>Today, or a day in the future.</span>
            </p>
          </div>

          <span className="strip-divider">✳</span>

          <div>
            <span className="strip-icon">03</span>
            <p>
              <strong>Let time do its thing</strong>
              <br />
              <span>Your words arrive right on time.</span>
            </p>
          </div>
        </section>

        <section className="story" id="story">
          <span>♡ A NOTE FROM US</span>
          <h2>
            Because not every
            <br />
            <em>important moment</em> is today.
          </h2>
          <p>
            Kairos is a little place for words you want someone
            to receive at just the right moment.
          </p>
        </section>
      </main>

      {showNote && (
        <div
          className="modal-backdrop"
          onClick={() => setShowNote(false)}
        >
          <div
            className="modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="close-button"
              onClick={() => setShowNote(false)}
              aria-label="Close"
            >
              ×
            </button>

            <span className="modal-flower">✿</span>
            <h2>Every letter starts somewhere.</h2>
            <p>
              Your little corner of Kairos is coming together.
              Soon, you'll be able to write, decorate, and
              schedule letters for the people you love.
            </p>
            <button
              className="primary-button"
              onClick={() => setShowNote(false)}
            >
              I'll be here ♡
            </button>
          </div>
        </div>
      )}

      <footer>
        <a className="logo footer-logo" href="#home">
          ✳ kairos
        </a>
        <span>A little time capsule for your heart. ♡</span>
        <span>Made with love</span>
      </footer>
    </div>
  );
}

export default App;
