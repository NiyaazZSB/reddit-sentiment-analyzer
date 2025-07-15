import React, { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RedditAnalyzer from './components/RedditAnalyzer';
import SubredditAnalyzer from './components/SubredditAnalyzer';
import SentimentResults from './components/SentimentResults';
import Dashboard from './components/Dashboard';
import { SentimentResult } from './types';
import { MessageSquare, BarChart3, MessageCircle } from 'lucide-react';

const queryClient = new QueryClient();

function App() {
  const [results, setResults] = useState<SentimentResult[]>([]);
  const [activeTab, setActiveTab] = useState('analyzer');

  const handleNewResult = (result: SentimentResult) => {
    setResults(prev => [result, ...prev]);
  };

  const handleNewResults = (newResults: SentimentResult[]) => {
    setResults(prev => {
      // Merge new results, avoiding duplicates
      const existingIds = new Set(prev.map(r => r.id));
      const uniqueNewResults = newResults.filter(r => !existingIds.has(r.id));
      return [...uniqueNewResults, ...prev];
    });
  };

  const handleClearResults = () => {
    setResults([]);
  };

  // Set up the animated Reddit background on the body
  useEffect(() => {
    const TILE_SIZE = 120;
    const LOGO_SIZE = 64;
    const BG_COLOR = '#f6f7f8';
    const LOGO_SRC = '/free-reddit-logo-icon-2436-thumb.png';
    const body = document.body;
    // Create a pattern tile
    const canvas = document.createElement('canvas');
    canvas.width = TILE_SIZE;
    canvas.height = TILE_SIZE;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
      const img = new window.Image();
      img.src = LOGO_SRC;
      img.onload = () => {
        ctx.globalAlpha = 0.18;
        ctx.drawImage(
          img,
          (TILE_SIZE - LOGO_SIZE) / 2,
          (TILE_SIZE - LOGO_SIZE) / 2,
          LOGO_SIZE,
          LOGO_SIZE
        );
        body.style.backgroundImage = `url('${canvas.toDataURL()}')`;
        body.style.backgroundRepeat = 'repeat';
        body.style.backgroundSize = `${TILE_SIZE}px ${TILE_SIZE}px`;
      };
    }
    body.style.backgroundColor = BG_COLOR;
    body.style.animation = 'reddit-diagonal-move 18s linear infinite';
    // Add keyframes to the document
    const style = document.createElement('style');
    style.innerHTML = `@keyframes reddit-diagonal-move { 0% { background-position: 0 0; } 100% { background-position: ${TILE_SIZE}px ${TILE_SIZE}px; } }`;
    document.head.appendChild(style);
    return () => {
      // Clean up
      body.style.backgroundImage = '';
      body.style.backgroundRepeat = '';
      body.style.backgroundSize = '';
      body.style.backgroundColor = '';
      body.style.animation = '';
      document.head.removeChild(style);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen relative z-10">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            {activeTab !== 'dashboard' && (
              <div className="text-center mb-8 bg-white/90 backdrop-blur-sm rounded-2xl p-8 mx-4 shadow-xl border border-white/20">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="p-3 bg-primary rounded-xl shadow-lg">
                    <img src="/free-reddit-logo-icon-2436-thumb.png" alt="Reddit Logo" className="h-8 w-8" />
                  </div>
                  <h1 className="text-4xl font-bold text-primary">
                    Reddit Sentiment Dashboard
                  </h1>
                </div>
                <p className="text-gray-700 text-lg max-w-2xl mx-auto">
                  Analyze sentiment from Reddit posts and comments using advanced AI-powered natural language processing
                </p>
              </div>
            )}

            {/* Main Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 lg:w-[600px] mx-auto bg-white/95 backdrop-blur-sm shadow-lg border border-white/30">
                <TabsTrigger value="analyzer" className="flex items-center gap-2 data-[state=active]:bg-primary/10">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Text Analysis</span>
                  <span className="sm:hidden">Text</span>
                </TabsTrigger>
                <TabsTrigger value="subreddit" className="flex items-center gap-2 data-[state=active]:bg-primary/10">
                  <MessageCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Subreddit</span>
                  <span className="sm:hidden">Sub</span>
                </TabsTrigger>
                <TabsTrigger value="results" className="flex items-center gap-2 data-[state=active]:bg-primary/10">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Results</span>
                  <span className="sm:hidden">Results</span>
                  {results.length > 0 && (
                    <span className="ml-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {results.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-primary/10">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                  <span className="sm:hidden">Stats</span>
                </TabsTrigger>
              </TabsList>

              {activeTab === 'dashboard' ? (
                <div className="flex justify-center w-full">
                  <TabsContent value="dashboard" className="mt-0 w-full flex justify-center">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 w-full">
                      <Dashboard results={results} />
                    </div>
                  </TabsContent>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
                  <div className="lg:col-span-2">
                    <TabsContent value="analyzer" className="mt-0">
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                        <RedditAnalyzer onResult={handleNewResult} />
                      </div>
                    </TabsContent>

                    <TabsContent value="subreddit" className="mt-0">
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                        <SubredditAnalyzer onResults={handleNewResults} />
                      </div>
                    </TabsContent>

                    <TabsContent value="results" className="mt-0 flex justify-center">
                      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                        <SentimentResults results={results} onClear={handleClearResults} />
                      </div>
                    </TabsContent>
                  </div>

                  {activeTab !== 'dashboard' && activeTab !== 'results' && (
                    <div className="lg:col-span-1">
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                        <SentimentResults results={results.slice(0, 5)} onClear={handleClearResults} />
                        {results.length > 5 && (
                          <p className="text-center text-sm text-gray-500 mt-2">
                            Showing latest 5 results. View all in Results tab.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Tabs>
          </div>
        </div>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
