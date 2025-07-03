import React from 'react';
import { TrendingUp, TrendingDown, Minus, ExternalLink, Trash2, User, Calendar, ThumbsUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SentimentResult } from '../types';

interface SentimentResultsProps {
  results: SentimentResult[];
  onClear: () => void;
}

const SentimentResults: React.FC<SentimentResultsProps> = ({ results, onClear }) => {
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (results.length === 0) {
    return (
      <Card className="border-0 bg-gradient-to-br from-gray-50 to-slate-100 shadow-lg">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center text-gray-500">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No results yet</p>
            <p className="text-sm">Start analyzing text or subreddits to see sentiment results here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-purple-50 to-pink-100 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Results ({results.length})
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="bg-white rounded-lg border p-4 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getSentimentIcon(result.sentiment)}
                    <Badge className={getSentimentColor(result.sentiment)}>
                      {result.sentiment.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">
                      {Math.round(result.confidence * 100)}% confident
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {formatDate(result.timestamp)}
                  </div>
                </div>

                {result.postTitle && (
                  <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                    {result.postTitle}
                  </h4>
                )}

                <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                  {result.text}
                </p>

                <div className="flex flex-wrap gap-2 mb-3">
                  <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                    Positive: {Math.round(result.positive * 100)}%
                  </div>
                  <div className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded">
                    Neutral: {Math.round(result.neutral * 100)}%
                  </div>
                  <div className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded">
                    Negative: {Math.round(result.negative * 100)}%
                  </div>
                  <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    Compound: {result.compound.toFixed(3)}
                  </div>
                </div>

                {result.source === 'reddit' && (
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 pt-2 border-t">
                    {result.author && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        u/{result.author}
                      </div>
                    )}
                    {result.subreddit && (
                      <div className="flex items-center gap-1">
                        <span className="font-medium">r/{result.subreddit}</span>
                      </div>
                    )}
                    {result.score !== undefined && (
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {result.score} points
                      </div>
                    )}
                    {result.url && (
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View Post
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SentimentResults;
