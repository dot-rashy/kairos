
import { useState } from "react";
import "./Auth.css";

function Auth({ onLogin, onClose }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setNotice("");

    if (mode === "register" && !name.trim()) {
      setNotice("Please enter your name. ♡");
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        mode === "register" ? "register" : "login";

      const response = await fetch(
        `http://localhost:5000/api/auth/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...(mode === "register" && { name: name.trim() }),
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      onLogin(data);
    } catch (error) {
      setNotice(
        error.message === "Failed to fetch"
          ? "KAIROS couldn't reach the server. Please check that your backend is running. ♡"
          : error.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <button className="auth-back" onClick={onClose}>
        ← Back to home
      </button>

      <section className="auth-card">
        <a className="auth-logo" href="#home">
          ✳ kairos
        </a>

        <span className="auth-flower">✿</span>

        <p className="auth-eyebrow">YOUR LITTLE CORNER OF TIME</p>

        <h1>
          {mode === "login"
            ? "Welcome back,"
            : "A new beginning,"}
          <br />
          <em>{mode === "login" ? "dear heart." : "dear heart."}</em>
        </h1>

        <p className="auth-description">
          {mode === "login"
            ? "Your letters are waiting for you."
            : "Make a little space for the words that matter."}
        </p>

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              <label htmlFor="auth-name">Your name</label>
              <input
                id="auth-name"
                type="text"
                placeholder="What shall we call you?"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={80}
                autoComplete="name"
                required
              />
            </>
          )}

          <label htmlFor="auth-email">Email address</label>
          <input
            id="auth-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />

          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            maxLength={128}
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            required
          />

          {notice && (
            <p className="auth-notice" role="alert">
              {notice}
            </p>
          )}

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "One little moment..."
              : mode === "login"
                ? "Sign in with love ♡"
                : "Create my little corner ♡"}
          </button>
        </form>

        <p className="auth-switch">
          {mode === "login"
            ? "New to KAIROS? "
            : "Already have an account? "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setNotice("");
            }}
          >
            {mode === "login" ? "Create an account" : "Sign in"}
          </button>
        </p>

        <p className="auth-footer">
          Your words deserve a little place of their own. ♡
        </p>
      </section>
    </main>
  );
}

export default Auth;
