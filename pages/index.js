
import { useEffect, useState } from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';

export default function Home() {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [gscData, setGscData] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
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

  const handleFetchGSCData = async () => {
    if (!accessToken || !siteUrl) {
      alert("Please fill in both Access Token and Site URL");
      return;
    }

    try {
      const response = await fetch('/api/fetch-gsc-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: accessToken,
          siteUrl: siteUrl,
          startDate: "2024-07-01",
          endDate: "2024-07-15"
        })
      });

      const data = await response.json();
      setGscData(data);
      console.log("GSC Data", data);
    } catch (err) {
      console.error("Fetch GSC Data Error", err);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial', maxWidth: '600px', margin: '0 auto' }}>
      <h1>LLM Click Tracker</h1>

      {!user ? (
        <button onClick={handleLogin} style={{ marginBottom: '1rem' }}>Login with Google</button>
      ) : (
        <>
          <p>Welcome, {user.displayName}</p>
          <button onClick={handleLogout} style={{ marginBottom: '1rem' }}>Logout</button>
        </>
      )}

      <div style={{ marginTop: '1rem' }}>
        <h2>Connect Google Search Console</h2>

        <label>
          Access Token:
          <input
            type="text"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }}
          />
        </label>

        <label>
          Site URL:
          <input
            type="text"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            placeholder="e.g., https://yourdomain.com/"
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
        </label>

        <button onClick={handleFetchGSCData}>Fetch GSC Data</button>
      </div>

      {gscData && (
        <div style={{ marginTop: '2rem', background: '#f6f6f6', padding: '1rem', borderRadius: '5px' }}>
          <h3>GSC Data:</h3>
          <pre>{JSON.stringify(gscData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
