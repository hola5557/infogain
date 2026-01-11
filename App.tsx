import React, { useState, useRef } from 'react';
import { generateExplanation, generateTopicImage, getRelatedResources } from './services/geminiService';
import { ExplanationData, LoadingState as LoadStatus, SearchResult } from './types';
import { StepCard } from './components/StepCard';
import { DiagramViewer } from './components/DiagramViewer';
import { ConceptGraph } from './components/ConceptGraph';
import { Quiz } from './components/Quiz';
import { TopicStats } from './components/TopicStats';
import { ResourceList } from './components/ResourceList';
import { VideoList } from './components/VideoList';
import { VeoVideo } from './components/VeoVideo';
import { LoadingState } from './components/LoadingState';
import { SAMPLE_TOPICS } from './constants';
import { Search, Upload, BookOpen, Sparkles, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [status, setStatus] = useState<LoadStatus>(LoadStatus.IDLE);
  const [data, setData] = useState<ExplanationData | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [resources, setResources] = useState<SearchResult[]>([]);
  const [videos, setVideos] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setStatus(LoadStatus.LOADING);
    setError(null);
    setData(null);
    setGeneratedImage(null);
    setResources([]);
    setVideos([]);

    try {
        // Execute requests in parallel for better performance
        const explPromise = generateExplanation(topic);
        const imgPromise = generateTopicImage(topic);
        const searchPromise = getRelatedResources(topic, 'web');
        const videoPromise = getRelatedResources(topic, 'video');

        const [explResult, imgResult, searchResult, videoResult] = await Promise.allSettled([
            explPromise,
            imgPromise,
            searchPromise,
            videoPromise
        ]);

        // The explanation is critical. If it fails, we error out.
        if (explResult.status === 'rejected') {
            throw explResult.reason;
        }

        setData(explResult.value);

        // Image and resources are enhancing features. If they fail, we just don't show them.
        if (imgResult.status === 'fulfilled') {
            setGeneratedImage(imgResult.value);
        }
        
        if (searchResult.status === 'fulfilled') {
            setResources(searchResult.value);
        }

        if (videoResult.status === 'fulfilled') {
            setVideos(videoResult.value);
        }

        setStatus(LoadStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setError("Failed to generate explanation. Please check your connection and try again.");
      setStatus(LoadStatus.ERROR);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setTopic(text.slice(0, 50) + (text.length > 50 ? "..." : ""));
        const processedTopic = text.length > 200 ? "Summarize and explain: " + text.slice(0, 500) : text;
        setTopic(processedTopic);
      }
    };
    reader.readAsText(file);
  };

  const resetState = () => {
    setStatus(LoadStatus.IDLE); 
    setTopic(''); 
    setData(null);
    setGeneratedImage(null);
    setResources([]);
    setVideos([]);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-100">
      {/* Header */}
      <header className="glass-panel sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={resetState}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <BookOpen size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-100">ti dà una spiegazione</span>
          </div>
          
          {/* Search Bar in Header (Visible only when content is shown) */}
          {status === LoadStatus.SUCCESS && (
             <form onSubmit={handleSearch} className="hidden md:flex items-center bg-slate-800/50 rounded-full px-4 py-1.5 border border-white/10 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/30 transition-all w-96">
                <Search size={16} className="text-slate-400 mr-2" />
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="What do you want to learn?"
                  className="bg-transparent border-none focus:ring-0 text-sm w-full text-slate-200 placeholder:text-slate-500"
                />
             </form>
          )}
        </div>
      </header>

      <main className="flex-grow flex flex-col relative z-10">
        {/* Hero Section (Only Visible on IDLE) */}
        {status === LoadStatus.IDLE && (
          <div className="flex-grow flex flex-col justify-center items-center px-4 py-20">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-block py-1 px-4 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm font-semibold mb-6 backdrop-blur-sm">
                AI-Powered Tutor
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-xl">
                Understand any topic.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Step by step.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Don't just read explanations—visualize them. Enter any complex subject, and we'll break it down with simple steps, interactive charts, and concept maps.
              </p>
              
              <div className="w-full max-w-xl mx-auto relative">
                <form onSubmit={handleSearch} className="relative z-10">
                  <div className="flex items-center bg-slate-800/80 backdrop-blur-xl p-2 rounded-2xl shadow-2xl shadow-indigo-900/20 border border-white/10 focus-within:border-indigo-500/50 transition-colors">
                    <Search className="text-slate-400 ml-3" size={24} />
                    <input 
                      type="text" 
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="E.g., Photosynthesis, Quantum Mechanics..." 
                      className="flex-grow px-4 py-3 text-lg bg-transparent border-none focus:ring-0 text-slate-100 placeholder:text-slate-500 outline-none"
                    />
                    <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-colors mr-2"
                        title="Upload text file"
                    >
                        <Upload size={20} />
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept=".txt,.md"
                        onChange={handleFileUpload}
                    />
                    <button 
                      type="submit"
                      disabled={!topic.trim()}
                      className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-500 transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 disabled:shadow-none"
                    >
                      Explain <Sparkles size={18} />
                    </button>
                  </div>
                </form>
                
                {/* Sample Topics */}
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {SAMPLE_TOPICS.map((t) => (
                    <button 
                      key={t}
                      onClick={() => { setTopic(t); handleSearch(); }}
                      className="px-4 py-2 bg-slate-800/40 border border-white/5 rounded-full text-sm text-slate-400 hover:border-indigo-500/50 hover:text-indigo-300 hover:bg-slate-800/60 transition-all backdrop-blur-sm"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {status === LoadStatus.LOADING && (
          <div className="px-4 py-12">
            <LoadingState />
            <p className="text-center text-slate-400 mt-8 animate-pulse font-light">Connecting nodes of knowledge...</p>
          </div>
        )}

        {/* Error State */}
        {status === LoadStatus.ERROR && (
          <div className="flex-grow flex items-center justify-center px-4">
            <div className="bg-red-900/20 border border-red-500/30 backdrop-blur-md rounded-2xl p-8 text-center max-w-md">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-red-200 mb-2">Oops! Something went wrong.</h3>
              <p className="text-red-300/80 mb-6">{error || "We couldn't generate that explanation. Please try again."}</p>
              <button 
                onClick={() => setStatus(LoadStatus.IDLE)}
                className="bg-red-500/20 text-red-300 border border-red-500/30 font-semibold px-6 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Success / Content State */}
        {status === LoadStatus.SUCCESS && data && (
          <div className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto w-full">
            
            <div className="mb-10">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 capitalize tracking-tight">{data.topic}</h1>
              <p className="text-xl text-slate-300 max-w-4xl leading-relaxed mb-10 font-light">{data.summary}</p>
              
              {/* Generated Header Image */}
              {generatedImage && (
                  <div className="w-full h-56 md:h-96 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 relative group">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10"></div>
                      <img src={generatedImage} alt={`AI generated illustration of ${data.topic}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                        <Sparkles size={12} className="text-indigo-400"/>
                        <span className="text-xs text-white/90">Generated with Gemini Nano</span>
                      </div>
                  </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Left Column: Steps */}
              <div className="lg:col-span-7 space-y-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">📖</span> The Breakdown
                </h2>
                <div className="pl-2 space-y-6">
                    {data.steps.map((step, index) => (
                    <StepCard 
                        key={index}
                        number={index + 1}
                        title={step.title}
                        description={step.description}
                        icon={step.icon}
                    />
                    ))}
                </div>
                
                <Quiz questions={data.quiz} />
              </div>

              {/* Right Column: Visuals */}
              <div className="lg:col-span-5 space-y-8">
                <div className="lg:sticky lg:top-24 space-y-8">
                    
                    {/* Veo Video Section */}
                    <VeoVideo topic={data.topic} />

                    {/* External Resources (Videos) */}
                    {videos.length > 0 && (
                        <VideoList videos={videos} />
                    )}

                    {/* External Resources (Web) */}
                    {resources.length > 0 && (
                        <ResourceList resources={resources} />
                    )}

                    <div>
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span>👁️</span> Visual Diagram
                        </h2>
                        <DiagramViewer svgContent={data.svgDiagram} />
                    </div>

                    <div>
                         <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span>🕸️</span> Knowledge Graph
                        </h2>
                        <ConceptGraph data={data.conceptGraph} />
                    </div>

                    <div>
                         <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span>📊</span> Key Data
                        </h2>
                        <TopicStats data={data.relatedStats} />
                    </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
