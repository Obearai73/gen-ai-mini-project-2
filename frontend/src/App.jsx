import { useState } from "react";
import "./App.css";

const topics = [
  "Explain a difficult concept step by step",
  "Give me a practice problem in algebra",
  "Help me study for a biology exam",
  "Show a real-world example of this topic",
  "Give me memorization tips for chemistry",
];

function App() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "You are a friendly AI study chatbot. Help the user learn with clear explanations, study tips, and examples. Use simple language and offer study strategies when appropriate.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async (event) => {
    event?.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    const userMessage = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setQuery("");
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Backend request failed.");
      }

      const result = await response.json();
      const assistantMessage = {
        role: "assistant",
        content: result.message || "Sorry, I could not generate a response. Please try again.",
      };
      setMessages((current) => [...current, assistantMessage]);
    } catch (err) {
      setError(err.message || "Unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const addSample = (text) => {
    setQuery(text);
  };

  const visibleMessages = messages.filter((message) => message.role !== "system");

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Study assistant</p>
          <h1>AI study chatbot for smarter learning</h1>
          <p className="hero-copy">
            Ask your questions, get clear explanations, study tips, and example problems tailored to your subject.
          </p>
        </div>
      </header>

      <div className="content-grid">
        <aside className="sidebar">
          <div className="sidebar-card">
            <h2>Try a sample prompt</h2>
            <p>Select one and edit it for your subject.</p>
            <div className="topic-list">
              {topics.map((topic) => (
                <button key={topic} type="button" onClick={() => addSample(topic)}>
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-card sidebar-help">
            <h2>How to ask</h2>
            <ul>
              <li>Ask about specific concepts or problems</li>
              <li>Request examples or study strategies</li>
              <li>Use a topic like physics, math, history, or language</li>
            </ul>
          </div>
        </aside>

        <main className="chat-panel">
          <div className="chat-window">
            {visibleMessages.length === 0 && (
              <div className="empty-state">
                Start by asking a question about your study topic.
              </div>
            )}

            {visibleMessages.map((message, index) => (
              <div key={index} className={`chat-message ${message.role}`}>
                <div className="message-role">{message.role === "user" ? "You" : "Tutor"}</div>
                <div className="message-content">{message.content}</div>
              </div>
            ))}

            {loading && (
              <div className="chat-message assistant loading">
                <div className="message-role">Tutor</div>
                <div className="message-content">Generating a helpful study response...</div>
              </div>
            )}
          </div>

          {error && <div className="error-banner">{error}</div>}

          <form className="chat-form" onSubmit={sendMessage}>
            <textarea
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Type a study question, e.g. 'Explain photosynthesis step by step.'"
              disabled={loading}
              rows={3}
            />
            <button type="submit" disabled={loading || !query.trim()}>
              {loading ? "Thinking..." : "Send Question"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default App;
