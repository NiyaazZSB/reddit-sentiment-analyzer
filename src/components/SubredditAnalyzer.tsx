import React, { useState } from 'react';
import { MessageCircle, Loader2, AlertCircle, CheckCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchSubredditPosts } from '../utils/redditApiBackend';
import { analyzeSentiment } from '../utils/sentimentApi';
import { SentimentResult } from '../types';

interface SubredditAnalyzerProps {
  onResults: (results: SentimentResult[]) => void;
}

const SubredditAnalyzer: React.FC<SubredditAnalyzerProps> = ({ onResults }) => {
  const [subreddit, setSubreddit] = useState('');
  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top'>('hot');
  const [postCount, setPostCount] = useState('10');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'fallback'>('idle');

  const popularSubreddits = [
    'AskReddit', 'funny', 'worldnews', 'todayilearned', 'pics',
    'gaming', 'movies', 'technology', 'science', 'sports'
  ];

  const handleAnalyzeSubreddit = async () => {
    if (!subreddit.trim()) return;

    setIsAnalyzing(true);
    setConnectionStatus('connecting');
    setStatus('Connecting to Reddit API via backend...');

    try {
      const cleanSubreddit = subreddit.replace(/^r\//, '');
      const limit = Math.min(parseInt(postCount) || 10, 25);
      
      const subredditData = await fetchSubredditPosts(cleanSubreddit, sortBy, limit);
      
      if (subredditData.error) {
        setConnectionStatus('fallback');
        setStatus('Error: ' + (subredditData.error || 'Subreddit not found or unavailable.'));
        // Optionally, clear results if error
        onResults([]);
        return;
      } else {
        setConnectionStatus('connected');
        setStatus('Successfully connected to Reddit via backend');
      }

      const results: SentimentResult[] = [];
      
      for (let i = 0; i < subredditData.posts.length; i++) {
        const post = subredditData.posts[i];
        setStatus(`Analyzing post ${i + 1} of ${subredditData.posts.length}...`);
        
        // Analyze post title and text
        const textToAnalyze = post.selftext || post.title;
        const analysis = await analyzeSentiment(textToAnalyze);
        
        const result: SentimentResult = {
          id: post.id,
          text: textToAnalyze,
          sentiment: analysis.sentiment,
          confidence: analysis.confidence,
          compound: analysis.scores.compound,
          positive: analysis.scores.pos,
          neutral: analysis.scores.neu,
          negative: analysis.scores.neg,
          source: 'reddit',
          postTitle: post.title,
          author: post.author,
          subreddit: post.subreddit,
          score: post.score,
          timestamp: new Date(),
          url: `https://reddit.com${post.permalink}`,
        };

        results.push(result);
        
        // Add results progressively for better UX
        if (i % 3 === 0 || i === subredditData.posts.length - 1) {
          onResults([...results]);
        }
        
        // Small delay between analyses
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      setStatus(`Analysis complete! Processed ${results.length} posts from r/${cleanSubreddit}`);
      
    } catch (error) {
      console.error('Subreddit analysis failed:', error);
      setStatus('Analysis failed. Please try again.');
      setConnectionStatus('idle');
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => {
        setStatus('');
        setConnectionStatus('idle');
      }, 3000);
    }
  };

  const getConnectionBadge = () => {
    switch (connectionStatus) {
      case 'connecting':
        return <Badge variant="outline" className="text-yellow-600"><Loader2 className="mr-1 h-3 w-3 animate-spin" />Connecting</Badge>;
      case 'connected':
        return <Badge variant="outline" className="text-green-600"><CheckCircle className="mr-1 h-3 w-3" />Connected</Badge>;
      case 'fallback':
        return <Badge variant="outline" className="text-orange-600"><AlertCircle className="mr-1 h-3 w-3" />Mock Data</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-br from-orange-50 to-red-100 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-orange-600" />
              Subreddit Analyzer
            </CardTitle>
            {getConnectionBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Subreddit</label>
              <Input
                placeholder="Enter subreddit name (e.g., AskReddit)"
                value={subreddit}
                onChange={(e) => setSubreddit(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Posts to Analyze</label>
              <Select value={postCount} onValueChange={setPostCount}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 posts</SelectItem>
                  <SelectItem value="10">10 posts</SelectItem>
                  <SelectItem value="15">15 posts</SelectItem>
                  <SelectItem value="25">25 posts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Sort by:</span>
            </div>
            <div className="flex gap-2">
              {(['hot', 'new', 'top'] as const).map((sort) => (
                <Button
                  key={sort}
                  variant={sortBy === sort ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy(sort)}
                >
                  {sort.charAt(0).toUpperCase() + sort.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Popular subreddits:</p>
            <div className="flex flex-wrap gap-2">
              {popularSubreddits.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSubreddit(sub)}
                  className="px-3 py-1 text-sm bg-white rounded-full border hover:bg-gray-50 transition-colors"
                >
                  r/{sub}
                </button>
              ))}
            </div>
          </div>

          {status && (
            <div className={`bg-blue-50 border rounded-lg p-3 ${status.startsWith('Error:') ? 'border-red-200 bg-red-50' : 'border-blue-200'}`}>
              <div className="flex items-center gap-2">
                {status.startsWith('Error:') ? (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                ) : isAnalyzing ? (
                  <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                )}
                <span className={`text-sm ${status.startsWith('Error:') ? 'text-red-800' : 'text-blue-800'}`}>{status}</span>
              </div>
            </div>
          )}

          <Button
            onClick={handleAnalyzeSubreddit}
            disabled={!subreddit.trim() || isAnalyzing}
            className="w-full"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Subreddit...
              </>
            ) : (
              'Analyze Subreddit'
            )}
          </Button>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">CORS Notice</p>
                <p className="text-yellow-700">
                  Reddit blocks direct browser requests. If connection fails, we'll use realistic mock data for demonstration.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubredditAnalyzer;
