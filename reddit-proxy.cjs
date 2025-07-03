require('dotenv').config();
const express = require('express');
const cors = require('cors');
// Use dynamic import for fetch to support ESM/CommonJS
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

function getRedditCredentials() {
  return {
    clientId: process.env.VITE_REDDIT_CLIENT_ID,
    clientSecret: process.env.VITE_REDDIT_CLIENT_SECRET,
    username: process.env.VITE_REDDIT_USERNAME,
    password: process.env.VITE_REDDIT_PASSWORD,
    userAgent: process.env.VITE_REDDIT_USER_AGENT,
  };
}

let cachedToken = null;
let tokenExpiry = 0;

async function getRedditAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;
  const { clientId, clientSecret, username, password, userAgent } = getRedditCredentials();
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const params = new URLSearchParams({
    grant_type: 'password',
    username,
    password,
  });
  const response = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': userAgent,
    },
    body: params,
  });
  if (!response.ok) throw new Error('Failed to get Reddit access token');
  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken;
}

app.get('/api/reddit/:subreddit', async (req, res) => {
  const { subreddit } = req.params;
  const { sort = 'hot', limit = 10 } = req.query;
  try {
    const accessToken = await getRedditAccessToken();
    const { userAgent } = getRedditCredentials();
    const url = `https://oauth.reddit.com/r/${encodeURIComponent(subreddit)}/${sort}?limit=${limit}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': userAgent,
        'Accept': 'application/json',
      },
    });
    const contentType = response.headers.get('content-type');
    if (!response.ok) {
      let errorText = await response.text();
      // If HTML, strip tags for easier reading
      if (contentType && contentType.includes('text/html')) {
        errorText = errorText.replace(/<[^>]*>?/gm, '').slice(0, 500);
      }
      console.error(`Reddit API error (${response.status}):`, errorText);
      return res.status(response.status).json({ error: errorText });
    }
    // If not JSON, treat as error
    if (!contentType || !contentType.includes('application/json')) {
      let errorText = await response.text();
      errorText = errorText.replace(/<[^>]*>?/gm, '').slice(0, 500);
      console.error('Reddit API non-JSON response:', errorText);
      return res.status(502).json({ error: 'Reddit returned non-JSON response', details: errorText });
    }
    const json = await response.json();
    res.json(json);
  } catch (error) {
    console.error('Proxy server error:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

app.listen(PORT, () => {
  console.log(`Reddit proxy server running on port ${PORT}`);
});
