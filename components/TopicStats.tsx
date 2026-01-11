import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface TopicStatsProps {
  data: { label: string; value: number }[];
}

export const TopicStats: React.FC<TopicStatsProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm mt-6">
       <div className="bg-white px-4 py-2 border-b border-slate-200">
        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Related Data & Scale</h3>
      </div>
      <div className="h-64 w-full p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={{fontSize: 12}} interval={0} />
            <YAxis tick={{fontSize: 12}} />
            <Tooltip
              cursor={{fill: '#f1f5f9'}}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
               {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#6366f1', '#8b5cf6', '#ec4899', '#10b981'][index % 4]} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
