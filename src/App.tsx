import React, { useState } from 'react';
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

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            {activeTab !== 'dashboard' && (
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="p-3 bg-primary rounded-xl shadow-lg">
                    <img src="/free-reddit-logo-icon-2436-thumb.png" alt="Reddit Logo" className="h-8 w-8" />
                  </div>
                  <h1 className="text-4xl font-bold text-primary">
                    Reddit Sentiment Dashboard
                  </h1>
                </div>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Analyze sentiment from Reddit posts and comments using advanced AI-powered natural language processing
                </p>
              </div>
            )}

            {/* Main Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 lg:w-[600px] mx-auto">
                <TabsTrigger value="analyzer" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Text Analysis</span>
                  <span className="sm:hidden">Text</span>
                </TabsTrigger>
                <TabsTrigger value="subreddit" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Subreddit</span>
                  <span className="sm:hidden">Sub</span>
                </TabsTrigger>
                <TabsTrigger value="results" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Results</span>
                  <span className="sm:hidden">Results</span>
                  {results.length > 0 && (
                    <span className="ml-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {results.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                  <span className="sm:hidden">Stats</span>
                </TabsTrigger>
              </TabsList>

              {activeTab === 'dashboard' ? (
                <div className="flex justify-center w-full">
                  <TabsContent value="dashboard" className="mt-0 w-full flex justify-center">
                    <Dashboard results={results} />
                  </TabsContent>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
                  <div className="lg:col-span-2">
                    <TabsContent value="analyzer" className="mt-0">
                      <RedditAnalyzer onResult={handleNewResult} />
                    </TabsContent>

                    <TabsContent value="subreddit" className="mt-0">
                      <SubredditAnalyzer onResults={handleNewResults} />
                    </TabsContent>

                    <TabsContent value="results" className="mt-0 flex justify-center">
                      <div className="w-full max-w-2xl">
                        <SentimentResults results={results} onClear={handleClearResults} />
                      </div>
                    </TabsContent>
                  </div>

                  {activeTab !== 'dashboard' && activeTab !== 'results' && (
                    <div className="lg:col-span-1">
                      <SentimentResults results={results.slice(0, 5)} onClear={handleClearResults} />
                      {results.length > 5 && (
                        <p className="text-center text-sm text-gray-500 mt-2">
                          Showing latest 5 results. View all in Results tab.
                        </p>
                      )}
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
