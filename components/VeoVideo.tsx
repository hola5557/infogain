import React, { useState, useEffect } from 'react';
import { generateTopicVideo } from '../services/geminiService';
import { Play, Loader2, Film, AlertCircle, KeyRound } from 'lucide-react';

interface VeoVideoProps {
  topic: string;
}

export const VeoVideo: React.FC<VeoVideoProps> = ({ topic }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean>(true);

  useEffect(() => {
    checkKey();
  }, []);

  useEffect(() => {
    // Reset when topic changes
    setVideoUrl(null);
    setError(null);
    setIsLoading(false);
  }, [topic]);

  const checkKey = async () => {
    if (window.aistudio?.hasSelectedApiKey) {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    }
  };

  const handleGenerate = async () => {
    // Ensure key is selected if method exists
    if (window.aistudio?.hasSelectedApiKey) {
      const selected = await window.aistudio.hasSelectedApiKey();
      if (!selected) {
        await window.aistudio.openSelectKey();
        // Optimistically assume they selected it or try again
        setHasKey(true);
        // Small delay to let state settle
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = await generateTopicVideo(topic);
      if (url) {
        setVideoUrl(url);
      } else {
        setError("Could not generate video.");
      }
    } catch (err) {
      setError("Failed to generate video. Ensure you have the correct API key permissions.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full glass-panel rounded-xl overflow-hidden shadow-lg mb-6">
      <div className="bg-white/5 px-4 py-3 border-b border-white/10 flex justify-between items-center backdrop-blur-md">
        <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wide flex items-center gap-2">
          <Film size={16} /> AI Video Summary (Veo)
        </h3>
        {isLoading && <span className="text-xs text-indigo-400 animate-pulse">Generating...</span>}
      </div>

      <div className="p-1 bg-slate-900/50 min-h-[200px] flex items-center justify-center relative">
        
        {videoUrl ? (
          <video 
            src={videoUrl} 
            controls 
            className="w-full h-auto rounded-lg shadow-2xl"
            autoPlay
            loop
          />
        ) : (
          <div className="text-center p-8">
            {isLoading ? (
              <div className="flex flex-col items-center text-indigo-200">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-500" />
                <p className="text-sm font-medium">Dreaming up a video...</p>
                <p className="text-xs text-slate-400 mt-2">This takes about 1-2 minutes.</p>
              </div>
            ) : error ? (
               <div className="flex flex-col items-center text-red-300">
                <AlertCircle className="w-10 h-10 mb-3 opacity-80" />
                <p className="text-sm mb-4">{error}</p>
                <button 
                  onClick={handleGenerate}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 border border-indigo-500/30">
                   <Film className="w-8 h-8 text-indigo-400" />
                </div>
                <p className="text-slate-300 text-sm mb-6 max-w-xs mx-auto">
                  Generate a short AI video abstract summarizing "{topic}" using the Veo model.
                </p>
                
                {!hasKey ? (
                  <button
                    onClick={handleGenerate}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg shadow-amber-900/20"
                  >
                    <KeyRound size={18} /> Select Key & Generate
                  </button>
                ) : (
                  <button 
                    onClick={handleGenerate}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg shadow-indigo-900/20 hover:scale-105"
                  >
                    <Play size={18} fill="currentColor" /> Generate Video
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};