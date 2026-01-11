import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto animate-pulse mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 opacity-60">
      <div className="space-y-6">
        <div className="h-8 bg-slate-700/50 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-slate-700/50 rounded w-full"></div>
        <div className="h-4 bg-slate-700/50 rounded w-5/6 mb-8"></div>

        <div className="space-y-8">
            {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-700/50 flex-shrink-0"></div>
                    <div className="flex-1 space-y-3">
                        <div className="h-5 bg-slate-700/50 rounded w-1/3"></div>
                        <div className="h-20 bg-slate-700/50 rounded w-full"></div>
                    </div>
                </div>
            ))}
        </div>
      </div>
      
      <div className="space-y-6">
         <div className="h-64 bg-slate-700/50 rounded-xl w-full"></div>
         <div className="h-48 bg-slate-700/50 rounded-xl w-full"></div>
      </div>
    </div>
  );
};