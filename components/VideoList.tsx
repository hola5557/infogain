import React from 'react';
import { ExternalLink, PlayCircle } from 'lucide-react';
import { SearchResult } from '../types';

interface VideoListProps {
  videos: SearchResult[];
}

export const VideoList: React.FC<VideoListProps> = ({ videos }) => {
  if (!videos || videos.length === 0) return null;

  return (
    <div className="w-full border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm mb-6">
      <div className="bg-white px-4 py-2 border-b border-slate-200 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Watch & Learn</h3>
        <span className="text-xs text-red-500 flex items-center gap-1 font-medium">
           Video Resources
        </span>
      </div>
      <div className="p-4 space-y-3">
        {videos.map((video, idx) => (
          <a 
            key={idx} 
            href={video.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-100"
          >
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-100 group-hover:text-red-600 transition-colors shrink-0">
              <PlayCircle size={20} />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <h4 className="text-sm font-medium text-slate-800 line-clamp-2 group-hover:text-indigo-700 leading-snug">
                {video.title}
              </h4>
              <p className="text-xs text-slate-400 mt-1 truncate">{new URL(video.url).hostname}</p>
            </div>
            <ExternalLink size={14} className="text-slate-300 group-hover:text-indigo-400 mt-1" />
          </a>
        ))}
      </div>
    </div>
  );
};