import React, { useState } from 'react';
import { MessageSquare, Loader2, Type, Badge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { analyzeSentiment } from '../utils/sentimentApi';
import { SentimentResult } from '../types';

interface RedditAnalyzerProps {
  onResult: (result: SentimentResult) => void;
}

const RedditAnalyzer: React.FC<RedditAnalyzerProps> = ({ onResult }) => {
  const [textInput, setTextInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const exampleTexts = [
    "This product is absolutely amazing! Best purchase I've made all year!",
    "Terrible experience, completely disappointed with the service quality.",
    "It's okay, nothing special but gets the job done fine.",
    "I love Reddit! r/AskReddit always has interesting questions.",
    "The new update on Reddit is awesome!",
    "Why do people like pineapple on pizza?",
    "I think this subreddit is underrated."
  ];

  const handleAnalyzeText = async () => {
    if (!textInput.trim()) return;

    setIsAnalyzing(true);
    try {
      const analysis = await analyzeSentiment(textInput);
      
      const result: SentimentResult = {
        id: Date.now().toString(),
        text: textInput,
        sentiment: analysis.sentiment,
        confidence: analysis.confidence,
        compound: analysis.scores.compound,
        positive: analysis.scores.pos,
        neutral: analysis.scores.neu,
        negative: analysis.scores.neg,
        source: 'text',
        timestamp: new Date(),
      };

      onResult(result);
      setTextInput('');
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-br from-orange-50 to-red-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-orange-600" />
            Reddit Sentiment Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="mb-2 text-sm text-orange-700">
            Enter any Reddit comment, post text, or any random text you want to analyze for sentiment.
          </div>
          <div className="space-y-4">
            <div>
              <Textarea
                placeholder="Paste a Reddit comment, post, or any text to analyze sentiment..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="min-h-[120px] resize-none"
              />
              <div className="flex justify-between items-center mt-2 text-sm text-orange-500">
                <span>{textInput.length} characters</span>
                {textInput.length > 500 && (
                  <Badge variant="outline" className="text-orange-600">
                    Long text may affect accuracy
                  </Badge>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-orange-700">Try these examples:</p>
              <div className="space-y-1">
                {exampleTexts.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setTextInput(example)}
                    className="block w-full text-left p-2 text-sm bg-white rounded border hover:bg-orange-50 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
            <Button
              onClick={handleAnalyzeText}
              disabled={!textInput.trim() || isAnalyzing}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Sentiment'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RedditAnalyzer;
