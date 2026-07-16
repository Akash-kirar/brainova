import React, { useMemo } from 'react';
import { ChevronLeft, MoreVertical, BrainCircuit, Activity } from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';
import { useProgress } from '../hooks/useProgress';

export default function AiAnalysisPage({ onBack }: { onBack: () => void }) {
  const { stats } = useProgress();

  const data = useMemo(() => {
    const calculateScore = (score: number) => {
      // Scale from 0 to max 100 based on score
      // Suppose a good score is around 1500, so 1500 / 15 = 100
      if (!score) return 0;
      return Math.min(100, Math.round(score / 15));
    };

    return [
      { subject: 'Memory', A: calculateScore(stats.highScores.memory), color: '#c084fc', fullMark: 100 },
      { subject: 'Focus', A: calculateScore(stats.highScores.focus), color: '#f472b6', fullMark: 100 },
      { subject: 'Speed', A: calculateScore(stats.highScores.speed), color: '#c084fc', fullMark: 100 },
      { subject: 'Language', A: calculateScore(stats.highScores.language), color: '#60a5fa', fullMark: 100 },
      { subject: 'Logic', A: calculateScore(stats.highScores.logic), color: '#c084fc', fullMark: 100 },
      { subject: 'Math', A: calculateScore(stats.highScores.math), color: '#f472b6', fullMark: 100 },
      { subject: 'Visual', A: calculateScore(stats.highScores.visual), color: '#34d399', fullMark: 100 },
      { subject: 'Observation', A: calculateScore(stats.highScores.observation), color: '#fcd34d', fullMark: 100 },
      { subject: 'Executive', A: calculateScore(stats.highScores.executive), color: '#fb923c', fullMark: 100 },
      { subject: 'Creativity', A: calculateScore(stats.highScores.creativity), color: '#a78bfa', fullMark: 100 },
    ];
  }, [stats]);

  // Determine strengths and weaknesses
  const { strengths, weaknesses } = useMemo(() => {
    const sorted = [...data].sort((a, b) => b.A - a.A);
    const nonZeroData = sorted.filter(d => d.A > 0);

    if (nonZeroData.length === 0) {
      return {
        strengths: 'Play games to discover your strengths!',
        weaknesses: 'Play games to identify areas for improvement!'
      };
    }

    return {
      strengths: nonZeroData.slice(0, 2).map(d => d.subject).join(', '),
      weaknesses: sorted.slice(-2).filter(d => d.A < nonZeroData[0].A).map(d => d.subject).join(', ') || 'None yet!'
    };
  }, [data]);

  // Custom label for polar angle axis to match the image format
  const CustomPolarAngleAxisTick = ({ payload, x, y, textAnchor, stroke, radius, ...rest }: any) => {
    // Determine subject and value based on payload.value
    const dataItem = data.find(d => d.subject === payload.value);
    
    return (
      <g className="recharts-layer recharts-polar-angle-axis-tick">
        <text 
          radius={radius} 
          stroke={stroke} 
          x={x} 
          y={y - 14} 
          className="recharts-text recharts-polar-angle-axis-tick-value" 
          textAnchor={textAnchor}
          fill="white"
          fontSize={12}
          fontWeight={500}
        >
          {payload.value.split(' ').length > 1 ? (
             <>
               <tspan x={x} dy="0">{payload.value.split(' ')[0]}</tspan>
               <tspan x={x} dy="1em">{payload.value.split(' ').slice(1).join(' ')}</tspan>
             </>
          ) : (
             <tspan x={x} dy="0.5em">{payload.value}</tspan>
          )}
        </text>
        <text
          x={x}
          y={y + 12}
          textAnchor={textAnchor}
          fill={dataItem?.color || '#c084fc'}
          fontSize={14}
          fontWeight="bold"
        >
           <tspan x={x} dy="0">{dataItem?.A}</tspan>
        </text>
      </g>
    );
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[#050505] font-sans text-white relative z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 shrink-0 bg-[#050505] z-10">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2 text-white">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="font-bold text-[18px]">AI Analysis</span>
        <button className="w-10 h-10 flex items-center justify-center -mr-2 text-white/70">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-4">
        
        {/* Radar Chart Card */}
        <div className="pt-2 pb-6 flex flex-col items-center">
          <h2 className="text-[17px] font-bold text-white mb-1 tracking-tight">Your Cognitive Overview</h2>
          <p className="text-[13px] text-white/50 mb-4 font-medium">Updated today</p>
          
          <div className="w-full h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
                <defs>
                  <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f472b6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <PolarGrid stroke="#ffffff" strokeOpacity={0.15} />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={<CustomPolarAngleAxisTick />}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                   name="Cognitive"
                   dataKey="A"
                   stroke="url(#radarGradient)"
                   strokeWidth={2}
                   fill="url(#radarGradient)"
                   fillOpacity={0.5}
                   dot={{ r: 4, fill: '#f472b6', strokeWidth: 0 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strengths */}
        <div className="bg-[#121217] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#22c55e]/80 to-[#10b981]/10 rounded-l-2xl"></div>
          <div className="flex items-center gap-3 mb-2">
            <BrainCircuit className="w-5 h-5 text-[#22c55e]" />
            <span className="font-bold text-[#22c55e] text-[15px]">Strengths</span>
          </div>
          <p className="text-[#a1a1aa] text-[15px] font-medium leading-relaxed">
            {strengths}
          </p>
        </div>

        {/* Needs Improvement */}
        <div className="bg-[#121217] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#ef4444]/80 to-[#f43f5e]/10 rounded-l-2xl"></div>
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-[#ef4444]" />
            <span className="font-bold text-[#ef4444] text-[15px]">Needs Improvement</span>
          </div>
          <p className="text-[#a1a1aa] text-[15px] font-medium leading-relaxed">
            {weaknesses}
          </p>
        </div>

        <div className="bg-[#121217] border border-white/5 rounded-2xl p-5 mt-4">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-[#8b5cf6]" />
            <span className="font-bold text-[#8b5cf6] text-[15px]">Detailed Scores</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {data.map((item, index) => (
              <div key={index} className="flex flex-col bg-[#1c1c24] p-3 rounded-xl border border-white/5">
                <span className="text-[12px] font-medium text-white/50 mb-1">{item.subject}</span>
                <span className="text-[16px] font-bold text-white flex items-baseline gap-1">
                  {stats.highScores[(item.subject === 'Math Solving' ? 'math' : item.subject === 'Recall' ? 'language' : item.subject.toLowerCase())] || 0}
                  <span className="text-[10px] text-white/40 font-normal">XP</span>
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
