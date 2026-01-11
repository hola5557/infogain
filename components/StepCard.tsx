import React from 'react';

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  icon: string;
}

export const StepCard: React.FC<StepCardProps> = ({ number, title, description, icon }) => {
  return (
    <div className="relative pl-8 pb-8 border-l-2 border-indigo-100 last:border-l-0 last:pb-0 group">
      <div className="absolute -left-[17px] top-0 flex items-center justify-center w-9 h-9 rounded-full bg-indigo-50 border-2 border-indigo-500 text-xl shadow-sm group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Step {number}</span>
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        </div>
        <p className="text-slate-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};
