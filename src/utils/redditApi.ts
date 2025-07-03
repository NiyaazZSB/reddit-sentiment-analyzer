
import { RedditPost, SubredditData } from '../types';

// Reddit API configuration
const REDDIT_CONFIG = {
  CLIENT_ID: "kEuamOKkniKVEBa7mPBazg",
  CLIENT_SECRET: "5tZftSAOyVoOJ12dGhmE66MSOckQ1A",
  USERNAME: "Wrong-Show-3833",
  PASSWORD: "Niyaaz@010302",
  USER_AGENT: "SentimentDashboard/0.1 by Wrong-Show-3833"
};

// CORS proxy for Reddit API requests
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const REDDIT_BASE_URL = 'https://www.reddit.com';

let accessToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    const auth = btoa(`${REDDIT_CONFIG.CLIENT_ID}:${REDDIT_CONFIG.CLIENT_SECRET}`);
    
    const response = await fetch(`${CORS_PROXY}https://www.reddit.com/api/v1/access_token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': REDDIT_CONFIG.USER_AGENT,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: new URLSearchParams({
        grant_type: 'password',
        username: REDDIT_CONFIG.USERNAME,
        password: REDDIT_CONFIG.PASSWORD
      })
    });

    if (!response.ok) {
      throw new Error(`Token request failed: ${response.status}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Refresh 1 minute early

    return accessToken;
  } catch (error) {
    console.warn('Failed to get Reddit access token:', error);
    throw error;
  }
}

async function makeRedditRequest(endpoint: string): Promise<any> {
  try {
    const token = await getAccessToken();
    
    const response = await fetch(`${CORS_PROXY}https://oauth.reddit.com${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': REDDIT_CONFIG.USER_AGENT,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    if (!response.ok) {
      throw new Error(`Reddit API request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn('Reddit API request failed:', error);
    throw error;
  }
}

export async function fetchSubredditPosts(
  subreddit: string,
  sort: 'hot' | 'new' | 'top' = 'hot',
  limit: number = 10
): Promise<SubredditData> {
  try {
    console.log(`Fetching posts from r/${subreddit}`);
    
    const endpoint = `/r/${subreddit}/${sort}.json?limit=${limit}`;
    const data = await makeRedditRequest(endpoint);
    
    const posts: RedditPost[] = data.data.children.map((child: any) => ({
      id: child.data.id,
      title: child.data.title,
      selftext: child.data.selftext || '',
      author: child.data.author,
      subreddit: child.data.subreddit,
      score: child.data.score,
      num_comments: child.data.num_comments,
      created_utc: child.data.created_utc,
      url: child.data.url,
      permalink: child.data.permalink
    }));

    return {
      subreddit,
      posts,
    };
  } catch (error) {
    console.warn(`Failed to fetch r/${subreddit}, using mock data:`, error);
    
    // Fallback to realistic mock data
    return {
      subreddit,
      posts: generateMockPosts(subreddit, limit),
      error: 'Using mock data - Reddit API unavailable'
    };
  }
}

export async function extractRedditPost(url: string): Promise<{ title: string; text: string; metadata: any } | null> {
  try {
    // Extract post ID from Reddit URL
    const urlMatch = url.match(/reddit\.com\/r\/\w+\/comments\/(\w+)/);
    if (!urlMatch) {
      throw new Error('Invalid Reddit URL format');
    }

    const postId = urlMatch[1];
    const endpoint = `/comments/${postId}.json`;
    
    const data = await makeRedditRequest(endpoint);
    const post = data[0].data.children[0].data;
    
    return {
      title: post.title,
      text: post.selftext || post.title,
      metadata: {
        author: post.author,
        subreddit: post.subreddit,
        score: post.score,
        created_utc: post.created_utc
      }
    };
  } catch (error) {
    console.warn('Failed to extract Reddit post:', error);
    return null;
  }
}

function generateMockPosts(subreddit: string, count: number): RedditPost[] {
  const mockTitles = [
    "This amazing discovery will change everything!",
    "Can't believe how terrible this experience was",
    "Just sharing some neutral information here",
    "Absolutely love this new feature everyone should try",
    "Having mixed feelings about this recent update",
    "This is the worst thing I've ever encountered",
    "Pretty standard stuff, nothing special really",
    "Incredible breakthrough in technology today!",
    "Disappointed with the quality of service",
    "Moderately interesting development worth noting"
  ];

  const mockTexts = [
    "This is honestly the best thing that's happened to me all year. Highly recommend to anyone looking for quality!",
    "Terrible experience from start to finish. Completely disappointed and frustrated with everything.",
    "It's okay I guess. Nothing particularly exciting but gets the job done fine.",
    "Amazing quality and fantastic customer service! Will definitely be using this again soon.",
    "Mixed feelings about this. Some good points but also several concerning issues to consider.",
    "Absolutely horrible. Worst decision I've made in a long time. Avoid at all costs!",
    "Pretty average experience overall. Met expectations but nothing beyond that really.",
    "Outstanding results! Exceeded all my expectations and more. Couldn't be happier with this.",
    "Poor quality and overpriced. Many better alternatives available in the market today.",
    "Decent option for what it is. Fair value and reasonable quality for the price point."
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `mock_${subreddit}_${i}`,
    title: mockTitles[i % mockTitles.length],
    selftext: mockTexts[i % mockTexts.length],
    author: `user_${Math.floor(Math.random() * 1000)}`,
    subreddit: subreddit,
    score: Math.floor(Math.random() * 500) + 1,
    num_comments: Math.floor(Math.random() * 100),
    created_utc: Date.now() / 1000 - Math.random() * 86400,
    url: `https://reddit.com/r/${subreddit}/comments/mock_${i}`,
    permalink: `/r/${subreddit}/comments/mock_${i}`
  }));
}
