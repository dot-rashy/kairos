
import { useState } from "react";
import "./LetterEditor.css";

const papers = [
  { name: "Ivory", color: "#fffaf0" },
  { name: "Rose", color: "#f7e5e1" },
  { name: "Sage", color: "#e8eddf" },
  { name: "Lilac", color: "#eee7f2" },
];

const stickers = ["♡", "🌷", "🦋", "✨", "🌸", "💌", "☁️", "🎀"];

function LetterEditor({ onClose, token }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("09:00");
  const [paper, setPaper] = useState(papers[0]);
  const [font, setFont] = useState("Caveat");
  const [decoration, setDecoration] = useState("♡");
  const [notice, setNotice] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  
  
async function saveLetter(status) {
  setNotice("");

  if (!title.trim() || !message.trim() || !recipient.trim()) {
    setNotice("Please fill in your letter and recipient. ♡");
    return;
  }

  if (status === "scheduled") {
    if (!deliveryDate || !deliveryTime) {
      setNotice("Please choose a delivery date and time. ♡");
      return;
    }

    const scheduledAt = new Date(`${deliveryDate}T${deliveryTime}`);

    if (scheduledAt <= new Date()) {
      setNotice("Choose a date and time in the future. 🌷");
      return;
    }
  }

  setIsSaving(true);

  try {
    const response = await fetch("http://localhost:5000/api/letters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: title.trim(),
        message: message.trim(),
        recipientEmail: recipient.trim(),
        paper: paper.name,
        font,
        decoration,
        deliveryDate:
          status === "scheduled"
            ? new Date(`${deliveryDate}T${deliveryTime}`).toISOString()
            : null,
        status,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Couldn't save your letter.");
    }

    setNotice(
      status === "draft"
        ? "Your letter has been safely saved as a draft! ♡"
        : "Your letter is saved for scheduled delivery! ✉"
    );
  } catch (error) {
    setNotice(
      error.message === "Failed to fetch"
        ? "Couldn't reach KAIROS. Please check that your backend is running. ♡"
        : error.message
    );
  } finally {
    setIsSaving(false);
  }
}


  
 


  return (
    <div className="editor-page">
      <header className="editor-header">
        <button className="editor-back" onClick={onClose}>
          ← Back to home
        </button>
        <a href="#home" className="editor-logo">✳ kairos</a>
        <span className="editor-label">YOUR LITTLE WRITING DESK</span>
      </header>

      <div className="editor-intro">
        <span className="editor-eyebrow">A MOMENT, PRESERVED</span>
        <h1>A letter from <em>the heart.</em></h1>
        <p>Take your time. Some words are worth keeping.</p>
      </div>

      <form className="editor-layout" onSubmit={(event) => event.preventDefault()}>
        <section className="writing-panel">
          <div className="panel-heading">
            <span>01 — YOUR LETTER</span>
            <span>✿</span>
          </div>

          <label className="field-label" htmlFor="letter-title">
            Give your letter a little title
          </label>
          <input
            id="letter-title"
            className="editor-input"
            placeholder="A little note for you..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />

          <label className="field-label" htmlFor="letter-message">
            Dear someone...
          </label>
          <textarea
            id="letter-message"
            className="letter-textarea"
            placeholder={"Write whatever your heart wants to say...\n\nDear you,\n\nI've been meaning to tell you..."}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={10000}
            rows={10}
          />
          <div className="character-count">{message.length}/10000</div>

          <div className="editor-divider" />

          <div className="panel-heading">
            <span>02 — LITTLE DETAILS</span>
            <span>♡</span>
          </div>

          <label className="field-label">Choose your paper</label>
          <div className="paper-options">
            {papers.map((option) => (
              <button
                key={option.name}
                type="button"
                className={`paper-swatch ${paper.name === option.name ? "selected" : ""}`}
                style={{ backgroundColor: option.color }}
                onClick={() => setPaper(option)}
                aria-label={`${option.name} paper`}
                aria-pressed={paper.name === option.name}
                title={option.name}
              />
            ))}
            <span className="option-caption">{paper.name}</span>
          </div>

          <label className="field-label" htmlFor="letter-font">
            Your handwriting
          </label>
          <select
            id="letter-font"
            className="editor-input font-select"
            value={font}
            onChange={(e) => setFont(e.target.value)}
          >
            <option value="Caveat">Handwritten — Caveat</option>
            <option value="Playfair Display">Classic — Playfair Display</option>
            <option value="DM Sans">Simple — DM Sans</option>
          </select>

          <label className="field-label">Add a tiny decoration</label>
          <div className="sticker-options">
            {stickers.map((sticker) => (
              <button
                type="button"
                key={sticker}
                className={`sticker-button ${decoration === sticker ? "selected" : ""}`}
                onClick={() => setDecoration(sticker)}
                aria-pressed={decoration === sticker}
              >
                {sticker}
              </button>
            ))}
          </div>

          <div className="editor-divider" />

          <div className="panel-heading">
            <span>03 — SEND IT INTO THE FUTURE</span>
            <span>✉</span>
          </div>

          <label className="field-label" htmlFor="recipient-email">
            Who's this little letter for?
          </label>
          <input
            id="recipient-email"
            className="editor-input"
            type="email"
            placeholder="someone@somewhere.com"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
          />

          <div className="schedule-fields">
            <div>
              <label className="field-label" htmlFor="delivery-date">
                The special day
              </label>
              <input
                id="delivery-date"
                className="editor-input"
                type="date"
                min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                  .toISOString().slice(0, 16).slice(0, 10)}
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="field-label" htmlFor="delivery-time">
                At this time
              </label>
              <input
                id="delivery-time"
                className="editor-input"
                type="time"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                
              />
            </div>
          </div>

          <p className="timezone-note">
            ♡ Delivery time uses your computer's local time zone.
          </p>

          {notice && <p className="editor-notice" role="status">{notice}</p>}

          
          
        
<div className="letter-actions">
  <button
    className="schedule-button"
    type="button"
    disabled={isSaving}
    onClick={() => saveLetter("draft")}
  >
    {isSaving ? "Saving your letter..." : "Save as Draft ♡"}
  </button>

  <button
    className="schedule-button"
    type="button"
    disabled={isSaving}
    onClick={() => saveLetter("scheduled")}
  >
    {isSaving ? "Saving your letter..." : "Schedule Delivery ✉"}
  </button>
</div>


          <p className="editor-footnote">
            Your letter deserves its own moment in time.
          </p>
        </section>

        <aside className="preview-panel">
          <div className="preview-topline">
            <span>A LITTLE SNEAK PEEK</span>
            <span>✧</span>
          </div>

          <div className="letter-preview" style={{ backgroundColor: paper.color }}>
            <div className="preview-decoration">{decoration}</div>
            <div className="preview-title">
              {title || "A little note for you"}
            </div>
            <div className="preview-rule">— ✿ —</div>
            <div className="preview-message" style={{ fontFamily: `"${font}", cursive` }}>
              {message || "Your beautiful words will live here...\n\nTake your time. Write from the heart."}
            </div>
            <div className="preview-signoff">with love, always ♡</div>
          </div>

          <div className="preview-envelope">
            <span>✉</span>
          </div>

          <p className="preview-caption">written today, delivered someday.</p>

          <div className="preview-summary">
            <span>YOUR LETTER IS FOR</span>
            <p>{recipient || "Someone special"}</p>
            <span>ITS LITTLE ARRIVAL DATE</span>
            <p>
              {deliveryDate
                ? new Date(`${deliveryDate}T${deliveryTime}`).toLocaleString([], {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "A day worth remembering"}
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}

export default LetterEditor;
