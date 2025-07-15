import axios from 'axios';

export default async function handler(req, res) {
  const { access_token, siteUrl, startDate, endDate } = req.body;

  if (!access_token || !siteUrl || !startDate || !endDate) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const response = await axios.post(
      `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      {
        startDate,
        endDate,
        dimensions: ["query", "page"],
        rowLimit: 50
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch GSC data", details: error.message });
  }
}
