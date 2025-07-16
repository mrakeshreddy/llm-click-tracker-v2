// 1. Create or replace this in `pages/index.js`

import { useEffect, useState } from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';

export default function Home() {
  const [user, setUser] = useState(null);
  const [gscData, setGscData] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      if (code) {
        fetch("/api/gsc-auth-callback?code=" + code)
          .then(res => res.json())
          .then(data => {
            if (data.access_token) {
              fetch('/api/fetch-gsc-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  access_token: data.access_token,
                  siteUrl: "https://yourdomain.com/",
                  startDate: "2024-07-01",
                  endDate: "2024-07-15"
                })
              })
              .then(res => res.json())
              .then(setGscData)
              .catch(err => console.error("Fetch GSC Error", err));
            }
          });
      }
    });
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login error", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial', maxWidth: '600px', margin: '0 auto' }}>
      <h1>LLM Click Tracker</h1>

      {!user ? (
        <button onClick={handleLogin}>Login with Google</button>
      ) : (
        <>
          <p>Welcome, {user.displayName}</p>
          <button onClick={handleLogout}>Logout</button>
          <br /><br />
          <a href="/api/gsc-auth-initiate">
            <button>Connect Google Search Console</button>
          </a>
        </>
      )}

      {gscData && (
        <div style={{ marginTop: '2rem', background: '#f6f6f6', padding: '1rem', borderRadius: '5px' }}>
          <h3>GSC Data:</h3>
          <pre>{JSON.stringify(gscData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
