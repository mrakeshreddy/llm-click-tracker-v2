import axios from 'axios';
import { OAUTH_CONFIG } from '../../utils/oauthConfig';

export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Missing code from Google");
  }

  try {
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: 764668315789-efimoblb025il5bab5kfud2s8lua9k0d.apps.googleusercontent.com,
      client_secret: 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,
      redirect_uri: http://localhost:3000/api/auth/callback,
      grant_type: 'authorization_code'
    });

    const { access_token, refresh_token, expires_in } = tokenRes.data;

    // For demo: store token in session or return it
    res.status(200).json({ access_token, refresh_token, expires_in });
  } catch (error) {
    res.status(500).json({ error: "Token exchange failed", details: error.message });
  }
}
