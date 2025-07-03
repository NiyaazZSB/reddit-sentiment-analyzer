import { RedditPost, SubredditData } from '../types';

// Use the backend proxy for Reddit API requests
const BACKEND_BASE_URL = 'https://reddit-pulse-dashboard.onrender.com';

export async function fetchSubredditPosts(
  subreddit: string,
  sort: 'hot' | 'new' | 'top' = 'hot',
  limit: number = 10
): Promise<SubredditData> {
  try {
    const url = `${BACKEND_BASE_URL}/api/reddit/${encodeURIComponent(subreddit)}?sort=${sort}&limit=${limit}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch subreddit posts');
    const json = await response.json();
    const posts: RedditPost[] = (json.data.children || []).map((c: any) => {
      const p = c.data;
      return {
        id: p.id,
        title: p.title,
        selftext: p.selftext,
        author: p.author,
        subreddit: p.subreddit,
        score: p.score,
        num_comments: p.num_comments,
        created_utc: p.created_utc,
        url: p.url,
        permalink: p.permalink,
      };
    });
    return { subreddit, posts };
  } catch (error: any) {
    return { subreddit, posts: [], error: error.message };
  }
}
