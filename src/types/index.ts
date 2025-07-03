
export interface SentimentResult {
  id: string;
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  compound: number;
  positive: number;
  neutral: number;
  negative: number;
  source: 'reddit' | 'text';
  postTitle?: string;
  author?: string;
  subreddit?: string;
  score?: number;
  timestamp: Date;
  url?: string;
}

export interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  author: string;
  subreddit: string;
  score: number;
  num_comments: number;
  created_utc: number;
  url: string;
  permalink: string;
}

export interface SubredditData {
  subreddit: string;
  posts: RedditPost[];
  error?: string;
}
