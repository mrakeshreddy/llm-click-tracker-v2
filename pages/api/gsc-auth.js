import { OAUTH_CONFIG } from '../../utils/oauthConfig';

export default function handler(req, res) {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${OAUTH_CONFIG.client_id}&` +
    `redirect_uri=${OAUTH_CONFIG.redirect_uri}&` +
    `response_type=code&` +
    `scope=https://www.googleapis.com/auth/webmasters.readonly&` +
    `access_type=offline&` +
    `prompt=consent`;

  res.redirect(authUrl);
}
