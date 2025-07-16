import { useEffect, useState } from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';

export default function Home() {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [startDate, setStartDate] = useState('2024-07-01');
  const [endDate, setEndDate] = useState('2024-07-15');
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
      alert("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch('/api/fetch-gsc-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: accessToken,
          siteUrl: siteUrl,
          startDate,
          endDate
        })
      });

      const data = await response.json();
      setGscData(data);
    } catch (err) {
      console.error("Fetch GSC Data Error", err);
    }
  };

  const handleExportCSV = () => {
    if (!gscData?.rows?.length) return;

    const headers = ['Query', 'Clicks', 'Impressions', 'CTR (%)', 'Position'];
    const rows = gscData.rows.map(row => [
      row.keys?.[0] || '-',
      row.clicks,
      row.impressions,
      (row.ctr * 100).toFixed(2),
      row.position.toFixed(2)
    ]);

    const csvContent = [headers, ...rows]
      .map(e => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "gsc_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const thStyle = {
    padding: '10px',
    textAlign: 'left',
    fontWeight: 'bold',
    borderBottom: '1px solid #ddd',
    background: '#f9f9f9'
  };

  const tdStyle = {
    padding: '10px',
    borderBottom: '1px solid #eee',
    fontSize: '14px'
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial', maxWidth: '1000px', margin: '0 auto' }}>
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

        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ marginRight: '1rem', padding: '0.5rem' }}
          />
        </label>

        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ padding: '0.5rem' }}
          />
        </label>

        <div style={{ marginTop: '1rem' }}>
          <button onClick={handleFetchGSCData} style={{ marginRight: '1rem' }}>Fetch GSC Data</button>
          <button onClick={handleExportCSV}>Export to CSV</button>
        </div>
      </div>

      {gscData?.rows?.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Search Analytics</h3>
          <div style={{ overflowX: 'auto', maxHeight: '400px', border: '1px solid #ccc', borderRadius: '6px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Query</th>
                  <th style={thStyle}>Clicks</th>
                  <th style={thStyle}>Impressions</th>
                  <th style={thStyle}>CTR (%)</th>
                  <th style={thStyle}>Position</th>
                </tr>
              </thead>
              <tbody>
                {gscData.rows.map((row, idx) => (
                  <tr key={idx}>
                    <td style={tdStyle}>{row.keys?.[0] || '-'}</td>
                    <td style={tdStyle}>{row.clicks}</td>
                    <td style={tdStyle}>{row.impressions}</td>
                    <td style={tdStyle}>{(row.ctr * 100).toFixed(2)}</td>
                    <td style={tdStyle}>{row.position.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
