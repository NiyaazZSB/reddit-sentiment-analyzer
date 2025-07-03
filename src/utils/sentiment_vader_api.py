from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

def analyze_sentiment(text):
    analyzer = SentimentIntensityAnalyzer()
    scores = analyzer.polarity_scores(text)
    return scores

# Example usage:
if __name__ == "__main__":
    sample_text = "VADER is smart, fast, and accurate!"
    print(analyze_sentiment(sample_text))
