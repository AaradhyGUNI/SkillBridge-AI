import React from 'react';
import { Sparkles, Briefcase } from 'lucide-react';

const Navbar = ({ onReset }) => {
  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={onReset}>
            <div className="bg-gradient-to-tr from-sky-500 to-indigo-500 p-2 rounded-xl mr-3 shadow-lg shadow-sky-500/10">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-sky-400 bg-clip-text text-transparent">
              SkillBridge <span className="text-sky-500">AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-sky-400 transition-colors">Features</a>
            <a href="#workflow" className="hover:text-sky-400 transition-colors">How It Works</a>
            <a href="#benefits" className="hover:text-sky-400 transition-colors">Benefits</a>
          </div>

          <button
            onClick={onReset}
            className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:from-sky-600 hover:to-indigo-600 transition-all duration-300 shadow-md shadow-sky-500/10 hover:shadow-lg hover:shadow-sky-500/20 active:scale-95"
          >
            <Briefcase className="h-4 w-4" />
            <span>Analyze Resume</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
