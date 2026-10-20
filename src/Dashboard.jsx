
import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard({ token, onWriteLetter, onLogout }) {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    let active = true;

    async function loadLetters() {
      try {
        const response = await fetch("http://localhost:5000/api/letters", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Couldn't load your letters.");
        }

        const savedLetters = Array.isArray(data)
          ? data
          : data.letters || [];

        if (active) {
          setLetters(savedLetters);
        }
      } catch (error) {
        if (active) {
          setNotice(error.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadLetters();

    return () => {
      active = false;
    };
  }, [token]);

  const filters = ["All", "Draft", "Scheduled", "Sent", "Failed"];

  const visibleLetters = letters.filter((letter) => {
    if (filter === "All") return true;
    return letter.status?.toLowerCase() === filter.toLowerCase();
  });

  function formatDate(date) {
    if (!date) return "Not set yet";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "Not set yet";

    return parsed.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function prettyStatus(status) {
    if (!status) return "Draft";

    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <a className="dashboard-logo" href="#home">
          ✳ kairos
        </a>

        <div className="dashboard-header-actions">
          <span className="dashboard-header-note">
            YOUR LITTLE CORNER OF TIME
          </span>
          <button className="dashboard-logout" onClick={onLogout}>
            Sign out
          </button>
        </div>
      </header>

      <section className="dashboard-welcome">
        <span className="dashboard-eyebrow">A LITTLE SPACE FOR YOUR WORDS</span>

        <h1>
          Your letters,
          <br />
          <em>your moments.</em>
        </h1>

        <p>
          Every letter holds a feeling. Keep them safe until
          their moment arrives.
        </p>

        <button className="dashboard-create" onClick={onWriteLetter}>
          Write a new letter <span>↗</span>
        </button>
      </section>

      <section className="dashboard-collection">
        <div className="dashboard-section-heading">
          <div>
            <span className="dashboard-eyebrow">YOUR COLLECTION</span>
            <h2>My Letters <span>♡</span></h2>
          </div>

          <span className="dashboard-count">
            {letters.length} {letters.length === 1 ? "letter" : "letters"}
          </span>
        </div>

        <div className="dashboard-filters">
          {filters.map((item) => (
            <button
              key={item}
              className={`dashboard-filter ${filter === item ? "active" : ""}`}
              onClick={() => setFilter(item)}
              aria-pressed={filter === item}
            >
              {item}
              {item === "All" ? ` (${letters.length})` : ""}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="dashboard-message">
            Gathering your letters... ♡
          </div>
        ) : notice ? (
          <div className="dashboard-message">
            <p>{notice}</p>
            <button
              className="dashboard-create"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        ) : visibleLetters.length === 0 ? (
          <div className="dashboard-empty">
            <span className="dashboard-empty-flower">✿</span>
            <h3>
              {filter === "All"
                ? "Your story starts here."
                : `No ${filter.toLowerCase()} letters just yet.`}
            </h3>
            <p>
              {filter === "All"
                ? "Write your first letter and give your words a little home."
                : "Your letters will appear here when they match this status."}
            </p>
            {filter === "All" && (
              <button className="dashboard-create" onClick={onWriteLetter}>
                Write your first letter ♡
              </button>
            )}
          </div>
        ) : (
          <div className="dashboard-grid">
            {visibleLetters.map((letter) => (
              <article className="dashboard-letter" key={letter._id}>
                <div
                  className="dashboard-letter-paper"
                  style={{
                    backgroundColor:
                      {
                        Ivory: "#fffaf0",
                        Rose: "#f7e5e1",
                        Sage: "#e8eddf",
                        Lilac: "#eee7f2",
                      }[letter.paper] || "#fffaf0",
                  }}
                >
                  <span className="dashboard-letter-decoration">
                    {letter.decoration || "♡"}
                  </span>
                  <h3>{letter.title}</h3>
                  <p>
                    {letter.message?.length > 115
                      ? `${letter.message.slice(0, 115)}...`
                      : letter.message}
                  </p>
                  <span className="dashboard-letter-signoff">
                    with love, always ♡
                  </span>
                </div>

                <div className="dashboard-letter-info">
                  <span
                    className={`dashboard-status status-${letter.status || "draft"}`}
                  >
                    {prettyStatus(letter.status)}
                  </span>

                  <p className="dashboard-recipient">
                    To: {letter.recipientEmail}
                  </p>

                  <p className="dashboard-date">
                    {letter.status === "scheduled"
                      ? `Arrives ${formatDate(letter.deliveryDate)}`
                      : `Created ${formatDate(letter.createdAt)}`}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="dashboard-footer">
        Made with love, kept with care ♡
      </footer>
    </main>
  );
}

export default Dashboard;
