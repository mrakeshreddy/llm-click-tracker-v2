export default function handler(req, res) {
  const redirect_uri = encodeURIComponent("https://llm-click-tracker-v2.vercel.app/api/gsc-auth-callback");

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=764668315789-efimoblb025il5bab5kfud2s8lua9k0d.apps.googleusercontent.com&redirect_uri=${redirect_uri}&scope=https://www.googleapis.com/auth/webmasters.readonly&access_type=offline&prompt=consent`;

  res.redirect(authUrl);
}
