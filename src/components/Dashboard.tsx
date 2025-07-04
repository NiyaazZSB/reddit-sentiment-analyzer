import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Activity, Users, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SentimentResult } from '../types';
import ManualLabeling from './ManualLabeling';

interface DashboardProps {
  results: SentimentResult[];
}

const Dashboard: React.FC<DashboardProps> = ({ results }) => {
  const analytics = useMemo(() => {
    if (results.length === 0) {
      return {
        total: 0,
        positive: 0,
        negative: 0,
        neutral: 0,
        positivePercentage: 0,
        negativePercentage: 0,
        neutralPercentage: 0,
        averageConfidence: 0,
        averageCompound: 0,
        topSubreddits: [],
        recentActivity: []
      };
    }

    const total = results.length;
    const positive = results.filter(r => r.sentiment === 'positive').length;
    const negative = results.filter(r => r.sentiment === 'negative').length;
    const neutral = results.filter(r => r.sentiment === 'neutral').length;

    const positivePercentage = (positive / total) * 100;
    const negativePercentage = (negative / total) * 100;
    const neutralPercentage = (neutral / total) * 100;

    const averageConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / total;
    const averageCompound = results.reduce((sum, r) => sum + r.compound, 0) / total;

    // Top subreddits
    const subredditCounts: Record<string, number> = {};
    results.forEach(r => {
      if (r.subreddit) {
        subredditCounts[r.subreddit] = (subredditCounts[r.subreddit] || 0) + 1;
      }
    });

    const topSubreddits = Object.entries(subredditCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([subreddit, count]) => ({ subreddit, count }));

    // Recent activity
    const recentActivity = results
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 5);

    return {
      total,
      positive,
      negative,
      neutral,
      positivePercentage,
      negativePercentage,
      neutralPercentage,
      averageConfidence,
      averageCompound,
      topSubreddits,
      recentActivity
    };
  }, [results]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (results.length === 0) {
    return (
      <Card className="border-0 bg-gradient-to-br from-indigo-50 to-blue-100 shadow-lg">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center text-gray-500">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No data to analyze</p>
            <p className="text-sm">Start analyzing content to see insights and statistics here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-8 space-y-8 bg-[#f4f8fd] rounded-2xl">
      {/* Title */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-4">
          <img src="/free-reddit-logo-icon-2436-thumb.png" alt="Reddit Logo" className="w-14 h-14 rounded-2xl shadow-lg bg-primary" />
          <span className="font-extrabold text-4xl md:text-5xl text-primary tracking-tight">Reddit Sentiment Dashboard</span>
        </div>
        <div className="text-muted-foreground text-lg md:text-xl mt-3 font-normal text-center max-w-2xl">
          Analyze sentiment from Reddit posts and comments using advanced AI-powered natural language processing
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-xl h-full flex flex-col justify-center">
          <CardContent className="p-8 flex flex-col items-center justify-center">
            <Activity className="h-10 w-10 text-blue-500 mb-2" />
            <p className="text-sm font-semibold text-blue-600">Total Analyzed</p>
            <p className="text-3xl font-extrabold text-blue-900 mt-1">{analytics.total}</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 shadow-xl h-full flex flex-col justify-center">
          <CardContent className="p-8 flex flex-col items-center justify-center">
            <TrendingUp className="h-10 w-10 text-green-500 mb-2" />
            <p className="text-sm font-semibold text-green-600">Positive</p>
            <p className="text-3xl font-extrabold text-green-900 mt-1">{analytics.positive}</p>
            <p className="text-xs text-green-700 mt-1">{analytics.positivePercentage.toFixed(1)}%</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-red-50 to-red-100 shadow-xl h-full flex flex-col justify-center">
          <CardContent className="p-8 flex flex-col items-center justify-center">
            <TrendingDown className="h-10 w-10 text-red-500 mb-2" />
            <p className="text-sm font-semibold text-red-600">Negative</p>
            <p className="text-3xl font-extrabold text-red-900 mt-1">{analytics.negative}</p>
            <p className="text-xs text-red-700 mt-1">{analytics.negativePercentage.toFixed(1)}%</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl h-full flex flex-col justify-center">
          <CardContent className="p-8 flex flex-col items-center justify-center">
            <MessageSquare className="h-10 w-10 text-gray-500 mb-2" />
            <p className="text-sm font-semibold text-gray-600">Neutral</p>
            <p className="text-3xl font-extrabold text-gray-900 mt-1">{analytics.neutral}</p>
            <p className="text-xs text-gray-700 mt-1">{analytics.neutralPercentage.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sentiment Distribution */}
        <Card className="border-0 bg-gradient-to-br from-purple-50 to-pink-100 shadow-xl h-full flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Sentiment Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 flex-1 flex flex-col justify-center">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-green-700 font-medium">Positive</span>
                <span className="font-semibold">{analytics.positivePercentage.toFixed(1)}%</span>
              </div>
              <Progress value={analytics.positivePercentage} className="h-3 bg-green-100" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700 font-medium">Neutral</span>
                <span className="font-semibold">{analytics.neutralPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={analytics.neutralPercentage} className="h-3 bg-gray-100" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-red-700 font-medium">Negative</span>
                <span className="font-semibold">{analytics.negativePercentage.toFixed(1)}%</span>
              </div>
              <Progress value={analytics.negativePercentage} className="h-3 bg-red-100" />
            </div>
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Average Confidence</span>
                <span className="font-semibold">{(analytics.averageConfidence * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Average Compound Score</span>
                <span className="font-semibold">{analytics.averageCompound.toFixed(3)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Subreddits */}
        <Card className="border-0 bg-gradient-to-br from-orange-50 to-yellow-100 shadow-xl h-full flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Users className="h-5 w-5 text-orange-600" />
              Top Subreddits
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            {analytics.topSubreddits.length > 0 ? (
              <div className="space-y-4">
                {analytics.topSubreddits.map(({ subreddit, count }) => (
                  <div key={subreddit} className="flex items-center justify-between">
                    <span className="text-base font-medium">r/{subreddit}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{count} posts</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(count / analytics.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No subreddit data available
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-0 bg-gradient-to-br from-teal-50 to-cyan-100 shadow-xl">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <Activity className="h-5 w-5 text-teal-600" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.recentActivity.map((result) => (
              <div key={result.id} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                <div className={`w-3 h-3 rounded-full mt-2 ${
                  result.sentiment === 'positive' ? 'bg-green-500' :
                  result.sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                }`} />
                <div className="flex-1 min-w-0">
                  {result.postTitle && (
                    <p className="text-base font-semibold text-gray-900 truncate">
                      {result.postTitle}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 truncate">
                    {result.text.length > 100 ? `${result.text.substring(0, 100)}...` : result.text}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    {result.subreddit && (
                      <span className="text-xs text-gray-500">r/{result.subreddit}</span>
                    )}
                    <span className="text-xs text-gray-400">{formatTime(result.timestamp)}</span>
                  </div>
                </div>
                <div className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100">
                  {Math.round(result.confidence * 100)}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Manual Labeling Section */}
      <Card className="border-0 bg-gradient-to-br from-yellow-50 to-orange-100 shadow-xl mt-8">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <span role="img" aria-label="label">🏷️</span>
            Manual Labeling & Accuracy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ManualLabeling results={results} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
