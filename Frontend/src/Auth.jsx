import React, { useState } from 'react';

export default function Auth({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isLogin ? 'login' : 'register';
      const res = await fetch(`http://localhost:3000/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Auth failed');
      onAuth(data.user, data.token);
    } catch (err) {
      setError(err.message);
    }
  }

  // Add a background gradient to the page
  React.useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = 'linear-gradient(135deg, #232526 0%, #414345 100%)';
    document.body.style.fontFamily = 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif';
    return () => { document.body.style.background = prev; };
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 400, width: '100%', padding: 36, background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ marginBottom: 28, fontWeight: 700, fontSize: 28, color: '#232526', letterSpacing: 1 }}>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', marginBottom: 16, padding: 12, borderRadius: 8, border: '1px solid #d1d5db', fontSize: 16, background: '#f3f4f6', color: '#232526', outline: 'none', transition: 'border 0.2s' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', marginBottom: 16, padding: 12, borderRadius: 8, border: '1px solid #d1d5db', fontSize: 16, background: '#f3f4f6', color: '#232526', outline: 'none', transition: 'border 0.2s' }}
          />
          {error && <div style={{ color: '#ff4d4f', marginBottom: 16, fontWeight: 500, textAlign: 'center', background: '#fff0f0', borderRadius: 6, padding: 8 }}>{error}</div>}
          <button type="submit" style={{ width: '100%', padding: 12, borderRadius: 8, background: 'linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%)', color: '#fff', fontWeight: 700, border: 'none', fontSize: 18, marginBottom: 12, boxShadow: '0 2px 8px #0001', cursor: 'pointer', letterSpacing: 1, transition: 'background 0.2s' }}>
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: '#6a82fb', cursor: 'pointer', textDecoration: 'underline', fontSize: 16, marginTop: 4 }}>
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
} 