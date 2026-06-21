import React from 'react';

const ProgressBar = ({ label, value, max = 100, showValue = true }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const getBarColor = (val) => {
    if (val < 50) return 'bg-gradient-to-r from-red-500 to-rose-600';
    if (val < 75) return 'bg-gradient-to-r from-amber-500 to-yellow-500';
    if (val < 90) return 'bg-gradient-to-r from-emerald-500 to-teal-500';
    return 'bg-gradient-to-r from-sky-500 to-indigo-500';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5 text-xs font-semibold">
        <span className="text-slate-300 capitalize">{label.replace(/_/g, ' ')}</span>
        {showValue && <span className="text-slate-400">{value}%</span>}
      </div>
      <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${getBarColor(value)}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
