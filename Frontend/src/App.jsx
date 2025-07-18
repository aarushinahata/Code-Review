import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import './App.css'
import Auth from './Auth';

function App() {
  const [code, setCode] = useState(` function sum() {\n  return 1 + 1\n}`)
  const [review, setReview] = useState("")
  const [error, setError] = useState("")
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("reviewHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [model, setModel] = useState('gemini-2.0-flash');
  // Add expanded state for each history entry
  const [expanded, setExpanded] = useState({});
  function toggleExpand(key) {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  }

  useEffect(() => {
    prism.highlightAll();
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Auth handler
  function handleAuth(user, token) {
    setUser(user);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  }
  function handleLogout() {
    setUser(null);
    setToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  // Fetch review history from backend if logged in
  useEffect(() => {
    if (token) {
      axios.get('http://localhost:3000/review/history', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setHistory(res.data);
      }).catch(() => {});
    }
  }, [token]);

  // Save review to backend if logged in
  async function saveReviewCloud(code, review, model) {
    if (!token) return;
    try {
      await axios.post('http://localhost:3000/review/save', { code, review, model }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {}
  }

  async function reviewCode() {
    setError("");
    try {
      const response = await axios.post('http://localhost:3000/ai/get-review', { code, model })
    setReview(response.data)
      const newEntry = { code, review: response.data, date: new Date().toISOString() };
      const updatedHistory = [newEntry, ...history].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem("reviewHistory", JSON.stringify(updatedHistory));
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data)
      } else {
        setError("An unexpected error occurred. Please try again later.")
      }
      setReview("")
    }
  }

  function clearHistory() {
    setHistory([]);
    localStorage.removeItem("reviewHistory");
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
  }

  // Filter history by search
  const filteredHistory = history.filter(item =>
    item.code.toLowerCase().includes(search.toLowerCase()) ||
    item.review.toLowerCase().includes(search.toLowerCase()) ||
    new Date(item.date).toLocaleString().toLowerCase().includes(search.toLowerCase())
  );

  // Custom Markdown components for review history
  const markdownComponents = {
    code({node, inline, className, children, ...props}) {
      return (
        <pre style={{
          background: theme === 'dark' ? "#282c34" : "#ededed",
          color: theme === 'dark' ? "#f8f8f2" : "#222",
          padding: "1em",
          borderRadius: "7px",
          fontSize: "1.05em",
          margin: '0.5em 0',
          fontFamily: "Fira Mono, monospace",
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
          lineHeight: "1.6",
          overflowX: "auto"
        }}>
          <code className={className} {...props}>{children}</code>
        </pre>
      );
    },
    ul({children}) {
      return <ul style={{margin: '0.5em 0 0.5em 1.5em', lineHeight: '1.7'}}>{children}</ul>;
    },
    ol({children}) {
      return <ol style={{margin: '0.5em 0 0.5em 1.5em', lineHeight: '1.7'}}>{children}</ol>;
    },
    li({children}) {
      return <li style={{marginBottom: '0.3em'}}>{children}</li>;
    },
    p({children}) {
      return <p style={{margin: '0.5em 0'}}>{children}</p>;
    },
    strong({children}) {
      return <strong style={{fontWeight: 700}}>{children}</strong>;
    }
  };

  if (!user) {
    return <Auth onAuth={handleAuth} />;
  }

  return (
    <div className={`app-root ${theme}`}> 
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem 0 2rem' }}>
        <h2>AI Code Review</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            style={{
              background: theme === 'dark' ? '#181a1f' : '#fff',
              color: theme === 'dark' ? '#fff' : '#222',
              border: '2px solid #222',
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 20,
              padding: '8px 22px',
              cursor: 'pointer',
              boxShadow: theme === 'dark' ? undefined : '0 2px 8px #0001',
            }}
          >{theme === 'dark' ? '🌞 Light Mode' : '🌙 Dark Mode'}</button>
          {user && (
            <button onClick={handleLogout}
              style={{
                background: '#ff4d4f',
                color: '#fff',
                border: '2px solid #ff4d4f',
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 20,
                padding: '8px 22px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px #0001',
              }}
            >Logout</button>
          )}
        </div>
      </div>
      <main>
        <div className="left">
          <div style={{ marginBottom: '1em' }}>
            <label style={{ marginRight: 8 }}>AI Model:</label>
            <select value={model} onChange={e => setModel(e.target.value)}>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
              <option value="gemini-pro">Gemini Pro</option>
              <option value="openai-gpt-3.5">OpenAI GPT-3.5</option>
            </select>
          </div>
          <div className="code">
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%",
                color: theme === 'light' ? '#fff' : undefined
              }}
            />
          </div>
          <div onClick={reviewCode} className="review">Review</div>
        </div>
        <div className="right" style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          height: 'auto',
          overflowY: 'visible',
          background: theme === 'dark' ? '#343434' : '#fff',
          padding: '1rem 2rem',
          fontSize: '1rem',
          borderRadius: '0.7rem',
          boxShadow: theme === 'dark' ? undefined : '0 2px 12px #0001',
        }}>
          <div style={{flex: '0 0 auto', marginBottom: '2em'}}>
            {error && (
              <div style={{ color: 'red', marginBottom: '1rem', fontWeight: 'bold' }}>{error}</div>
            )}
            <Markdown rehypePlugins={[ rehypeHighlight ]}>{review}</Markdown>
          </div>
          <div className="history" style={{
            flex: '1 1 auto',
            minHeight: '300px',
            maxHeight: 'none',
            overflowY: 'visible', // Let history grow
            marginTop: '2rem',
            borderTop: '1px solid #444',
            paddingTop: '1rem'
          }}>
            <h3 style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span>Review History</span>
              <button onClick={clearHistory} style={{marginBottom: '0'}}>Clear</button>
            </h3>
            <input
              type="text"
              placeholder="Search history..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{width: '100%', marginBottom: '1rem', padding: '0.5em', borderRadius: '4px', border: '1px solid #ccc'}}
            />
            {filteredHistory.length === 0 && <div>No previous reviews.</div>}
            {filteredHistory.map((item) => {
              const key = item.date + '_' + (item.code ? item.code.slice(0, 20) : '');
              let mainPoint = item.review;
              const match = item.review.match(/(❌[^\n]+|🔍 Issues:[^\n]*|^.+)/);
              if (match) mainPoint = match[0];
              return (
                <div key={key} style={{
                  marginBottom: "1em",
                  border: theme === 'dark' ? "1px solid #888" : "1px solid #bbb",
                  borderRadius: "10px",
                  background: theme === 'dark' ? "#23272f" : "#f3f4f8",
                  boxShadow: theme === 'dark' ? "0 2px 8px #1118" : "0 2px 8px #bbb8",
                  padding: '0.7em',
                  overflow: 'hidden',
                  fontSize: '0.98em',
                }}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3em', color: theme === 'dark' ? undefined : '#222', fontWeight: 'bold', fontSize: '1em'}}>
                    <span>Date:</span> <span>{new Date(item.date).toLocaleString()}</span>
                  </div>
                  <div><b>Code:</b> <pre style={{
                    background: theme === 'dark' ? "#282c34" : "#ededed",
                    color: theme === 'dark' ? "#f8f8f2" : "#222",
                    padding: "0.5em",
                    borderRadius: "6px",
                    fontSize: "0.95em",
                    marginTop: "0.2em",
                    fontFamily: "Fira Mono, monospace",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                    lineHeight: "1.4",
                    overflowX: "auto"
                  }}>{item.code}</pre></div>
                  <div><b>Review:</b>
                    <div style={{
                      background: expanded[key] ? (theme === 'dark' ? "#181a1f" : "#fff") : (theme === 'dark' ? "#2a2d36" : "#eaf6ff"),
                      color: theme === 'dark' ? "#eee" : "#222",
                      padding: expanded[key] ? "0.5em" : "0.7em 0.7em 0.7em 1em",
                      borderRadius: expanded[key] ? "6px" : "8px",
                      marginTop: "0.2em",
                      fontFamily: "inherit",
                      fontSize: '0.97em',
                      minHeight: 30,
                      borderLeft: expanded[key] ? undefined : `4px solid ${theme === 'dark' ? '#ff4d4f' : '#007bff'}`,
                      boxShadow: expanded[key] ? undefined : (theme === 'dark' ? '0 1px 4px #0002' : '0 1px 4px #007bff22'),
                      marginBottom: expanded[key] ? 0 : 6
                    }}>
                      {expanded[key] ? (
                        <Markdown rehypePlugins={[rehypeHighlight]}>{item.review}</Markdown>
                      ) : (
                        <Markdown rehypePlugins={[rehypeHighlight]}>{mainPoint}</Markdown>
                      )}
                      <button onClick={() => toggleExpand(key)} style={{marginTop: 8, fontSize: '0.95em', background: theme === 'dark' ? '#222' : '#e0e0e0', border: 'none', color: theme === 'dark' ? '#fff' : '#007bff', cursor: 'pointer', borderRadius: 5, padding: '2px 12px', fontWeight: 500, boxShadow: '0 1px 4px #0001'}}>
                        {expanded[key] ? 'Show Less' : 'Show More'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <style>{`
        .app-root.dark {
          background: #242424;
          color: #fff;
        }
        .app-root.light {
          background: #fff;
          color: #222;
        }
        @media (max-width: 900px) {
          main {
            flex-direction: column;
            padding: 0.5rem;
          }
          .left, .right {
            flex-basis: 100%;
            width: 100%;
            min-width: 0;
          }
        }
        @media (max-width: 600px) {
          main {
            padding: 0.2rem;
          }
          .left, .right {
            padding: 0.5rem !important;
          }
          .history {
            padding: 0.5rem 0 0 0 !important;
          }
        }
      `}</style>
    </div>
  )
}

export default App
