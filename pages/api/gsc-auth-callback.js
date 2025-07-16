import axios from 'axios';

export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Missing authorization code");
  }

  try {
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', new URLSearchParams({
      code,
      client_id: '764668315789-efimoblb025il5bab5kfud2s8lua9k0d.apps.googleusercontent.com',
      client_secret: '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',
      redirect_uri: 'https://llm-click-tracker-v2.vercel.app/api/gsc-auth-callback',
      grant_type: 'authorization_code'
    }));

    const { access_token, refresh_token, expires_in } = tokenRes.data;
    res.redirect(`/api/gsc-auth-final?access_token=${access_token}&refresh_token=${refresh_token}`);
  } catch (err) {
    res.status(500).json({ error: "OAuth failed", details: err.response?.data || err.message });
  }
}
