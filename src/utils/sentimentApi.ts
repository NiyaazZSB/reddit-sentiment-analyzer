// VADER Sentiment Analysis Utility
// This provides local sentiment analysis without external API dependencies
import vader from 'vader-sentiment';

export function analyzeText(text: string) {
  if (!text || text.trim().length === 0) {
    return { compound: 0, pos: 0, neu: 1, neg: 0 };
  }

  const scores = vader.SentimentIntensityAnalyzer.polarity_scores(text);

  return {
    compound: Number(scores.compound.toFixed(4)),
    pos: Number(scores.pos.toFixed(3)),
    neu: Number(scores.neu.toFixed(3)),
    neg: Number(scores.neg.toFixed(3)),
  };
}

export async function analyzeSentiment(text: string): Promise<{
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  scores: {
    compound: number;
    pos: number;
    neu: number;
    neg: number;
  };
}> {
  // Simulate API delay for better UX
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));

  const scores = vader.SentimentIntensityAnalyzer.polarity_scores(text);

  let sentiment: 'positive' | 'negative' | 'neutral';
  let confidence: number;

  if (scores.compound >= 0.05) {
    sentiment = 'positive';
    confidence = Math.min(0.95, 0.5 + Math.abs(scores.compound) * 0.5);
  } else if (scores.compound <= -0.05) {
    sentiment = 'negative';
    confidence = Math.min(0.95, 0.5 + Math.abs(scores.compound) * 0.5);
  } else {
    sentiment = 'neutral';
    confidence = Math.min(0.95, 0.6 + (1 - Math.abs(scores.compound)) * 0.3);
  }

  return {
    sentiment,
    confidence: Number(confidence.toFixed(3)),
    scores: {
      compound: Number(scores.compound.toFixed(4)),
      pos: Number(scores.pos.toFixed(3)),
      neu: Number(scores.neu.toFixed(3)),
      neg: Number(scores.neg.toFixed(3)),
    }
  };
}
