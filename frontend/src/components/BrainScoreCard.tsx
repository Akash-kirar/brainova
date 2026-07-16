import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

interface BrainScoreCardProps {
  stats?: any;
  onClick?: () => void;
}

export default function BrainScoreCard({ onClick, stats }: BrainScoreCardProps) {
  // Calculate average of high scores
  const score = stats && stats.highScores 
    ? Math.round((
        (stats.highScores.memory || 0) + 
        (stats.highScores.focus || 0) + 
        (stats.highScores.logic || 0) + 
        (stats.highScores.math || 0) + 
        (stats.highScores.speed || 0) + 
        (stats.highScores.language || 0)
      ) / 6)
    : 0;
    
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  // Normalize score to maximum of 1500 for stroke dash offset, similar to AiAnalysisPage
  const strokeDashoffset = circumference - (Math.min(100, Math.round(score / 15)) / 100) * circumference;

  // Calculate stats for today vs yesterday
  const { diffPercent, trendMessage, chartData } = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

    const todayScore = stats?.weeklyPerformance?.find((p: any) => p.date === todayStr)?.score || 0;
    const yesterdayScore = stats?.weeklyPerformance?.find((p: any) => p.date === yesterdayStr)?.score || 0;
    
    let percent = 0;
    if (yesterdayScore > 0) {
      percent = Math.round(((todayScore - yesterdayScore) / yesterdayScore) * 100);
    } else if (todayScore > 0) {
      percent = 100;
    }

    let message = "Let's play!";
    const totalScoreAllTime = stats?.highScores ? (Object.values(stats.highScores) as number[]).reduce((a, b) => a + b, 0) : 0;
    
    if (totalScoreAllTime === 0) {
      message = "Start training!";
    } else if (percent > 0) {
      message = "Good job!";
    } else if (percent < 0) {
      message = "Keep trying!";
    } else if (todayScore > 0) {
      message = "Consistent!";
    }

    // Prepare chart data for the last 7 days
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    const points = last7Days.map((dateStr, i) => {
      const perf = stats?.weeklyPerformance?.find((p: any) => p.date === dateStr);
      return { 
        x: -10 + (420 * i) / 6, 
        score: perf ? perf.score : 0,
        date: dateStr
      };
    });

    const maxScore = Math.max(...points.map(p => p.score), 100);
    const height = 100;
    const paddingY = 20;

    const mappedPoints = points.map(p => ({
      ...p,
      y: height - paddingY - ((p.score / maxScore) * (height - 2 * paddingY))
    }));

    let pathD = '';
    if (mappedPoints.length > 0) {
      pathD = `M ${mappedPoints[0].x},${mappedPoints[0].y}`;
      for (let i = 0; i < mappedPoints.length - 1; i++) {
        const curr = mappedPoints[i];
        const next = mappedPoints[i + 1];
        const controlX = (curr.x + next.x) / 2;
        pathD += ` C ${controlX},${curr.y} ${controlX},${next.y} ${next.x},${next.y}`;
      }
    }

    return { 
      diffPercent: percent, 
      trendMessage: message, 
      chartData: { points: mappedPoints, pathD } 
    };
  }, [stats]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={`relative w-full rounded-[24px] overflow-hidden p-6 shadow-xl border border-white/5 ${onClick ? 'cursor-pointer hover:shadow-2xl transition-all' : ''}`}
      style={{
        background: 'linear-gradient(135deg, #2A1154 0%, #0F0822 100%)'
      }}
    >
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="flex items-center gap-6">
          {/* Progress Circle */}
          <div className="relative flex items-center justify-center">
            <svg width="110" height="110" className="transform -rotate-90">
              <defs>
                <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
              {/* Background circle */}
              <circle
                cx="55"
                cy="55"
                r={radius}
                className="stroke-indigo-900/40"
                strokeWidth="12"
                fill="none"
              />
              {/* Foreground circle */}
              <circle
                cx="55"
                cy="55"
                r={radius}
                stroke="url(#score-gradient)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset,
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-white">{score}</span>
            </div>
          </div>

          <div className="flex flex-col">
            <h3 className="text-[22px] font-bold text-white mb-2 leading-none">Brain Score</h3>
            <p className="text-[#B9A3D6] text-[15px] font-medium mb-1">{trendMessage}</p>
            {stats?.highScores && (Object.values(stats.highScores) as number[]).reduce((a, b) => a + b, 0) > 0 ? (
              <p className={`text-[15px] font-semibold ${diffPercent > 0 ? 'text-[#4ADE80]' : diffPercent < 0 ? 'text-rose-400' : 'text-white/40'}`}>
                {diffPercent > 0 ? `+${diffPercent}%` : diffPercent < 0 ? `${diffPercent}%` : '0%'} from yesterday
              </p>
            ) : (
              <p className="text-white/40 text-[15px] font-semibold">Ready to start</p>
            )}
          </div>
        </div>

        <div className="self-start mt-2">
          <ChevronRight className="w-5 h-5 text-white/50" />
        </div>
      </div>

      {/* Background Decorative Graph */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none opacity-80">
        <svg width="100%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none">
          <path
            d={chartData.pathD}
            fill="none"
            stroke="#6366F1"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Scatter dots */}
          {chartData.points.map((p, i) => (
            p.score > 0 && <circle key={i} cx={p.x} cy={p.y} r={i === chartData.points.length - 1 ? 5 : 3} fill={i === chartData.points.length - 1 ? "#3B82F6" : "#8B5CF6"} />
          ))}
        </svg>
      </div>
    </motion.div>
  );
}
