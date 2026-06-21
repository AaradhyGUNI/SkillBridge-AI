import React, { useEffect, useState } from 'react';

const AtsScoreRing = ({ score = 0, size = 160, strokeWidth = 14 }) => {
  const [offset, setOffset] = useState(0);
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    // Animate the progress ring
    const progressOffset = circumference - (score / 100) * circumference;
    const timer = setTimeout(() => {
      setOffset(progressOffset);
    }, 100);
    return () => clearTimeout(timer);
  }, [score, circumference]);

  // Color mapping based on score
  const getColor = (val) => {
    if (val < 50) return 'stroke-red-500';
    if (val < 70) return 'stroke-amber-500';
    if (val < 85) return 'stroke-emerald-500';
    return 'stroke-sky-500';
  };

  const getTextColor = (val) => {
    if (val < 50) return 'text-red-400';
    if (val < 70) return 'text-amber-400';
    if (val < 85) return 'text-emerald-400';
    return 'text-sky-400';
  };

  const getBgGlow = (val) => {
    if (val < 50) return 'shadow-red-500/10';
    if (val < 70) return 'shadow-amber-500/10';
    if (val < 85) return 'shadow-emerald-500/10';
    return 'shadow-sky-500/10';
  };

  return (
    <div className={`relative flex items-center justify-center rounded-full p-2 bg-slate-900/50 border border-slate-800/80 shadow-inner ${getBgGlow(score)}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track circle */}
        <circle
          className="stroke-slate-800"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={center}
          cy={center}
        />
        {/* Progress circle */}
        <circle
          className={`transition-all duration-1000 ease-out ${getColor(score)}`}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={radius}
          cx={center}
          cy={center}
        />
      </svg>
      {/* Absolute center text overlay */}
      <div className="absolute flex flex-col items-center">
        <span className={`text-4xl font-extrabold tracking-tight ${getTextColor(score)}`}>
          {score}
        </span>
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
          ATS Score
        </span>
      </div>
    </div>
  );
};

export default AtsScoreRing;
