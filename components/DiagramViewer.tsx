import React from 'react';

interface DiagramViewerProps {
  svgContent: string;
}

export const DiagramViewer: React.FC<DiagramViewerProps> = ({ svgContent }) => {
  return (
    <div className="w-full border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm mb-6">
      <div className="bg-white px-4 py-2 border-b border-slate-200 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Visual Diagram</h3>
        <span className="text-xs text-slate-400">AI Generated</span>
      </div>
      <div
        className="w-full p-4 flex items-center justify-center bg-slate-50 min-h-[300px]"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  );
};
