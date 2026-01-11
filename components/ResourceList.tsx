import React from 'react';
import { ExternalLink, Video, BookOpen } from 'lucide-react';
import { SearchResult } from '../types';

interface ResourceListProps {
  resources: SearchResult[];
}

export const ResourceList: React.FC<ResourceListProps> = ({ resources }) => {
  if (!resources || resources.length === 0) return null;

  return (
    <div className="w-full border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm mb-6">
      <div className="bg-white px-4 py-2 border-b border-slate-200 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Learn More (Web)</h3>
        <span className="text-xs text-blue-500 flex items-center gap-1">
           Powered by Google Search
        </span>
      </div>
      <div className="p-4 space-y-3">
        {resources.map((res, idx) => {
            // Simple heuristic to pick icon
            const isVideo = res.url.includes('youtube') || res.url.includes('video') || res.title.toLowerCase().includes('video');
            return (
                <a 
                    key={idx} 
                    href={res.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-100"
                >
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shrink-0">
                        {isVideo ? <Video size={16} /> : <BookOpen size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-slate-800 truncate group-hover:text-indigo-700">{res.title}</h4>
                        <p className="text-xs text-slate-400 truncate">{new URL(res.url).hostname}</p>
                    </div>
                    <ExternalLink size={14} className="text-slate-300 group-hover:text-indigo-400" />
                </a>
            );
        })}
      </div>
    </div>
  );
};