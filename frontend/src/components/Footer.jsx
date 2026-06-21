import React from 'react';
import { Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-tr from-sky-500 to-indigo-500 p-1.5 rounded-lg mr-2.5">
                <Sparkles className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-sky-400 bg-clip-text text-transparent">
                SkillBridge <span className="text-sky-500">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-xs">
              Empowering developers and tech professionals to bridge the skills gap, optimize their resumes, and land their dream jobs with real-time AI guidance.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase mb-4">Features</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>ATS Score Analysis</li>
              <li>Dynamic Skill Categorization</li>
              <li>AI Career Roadmap</li>
              <li>Interview Prep Simulator</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase mb-4">Platform Info</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Powered by Google Gemini 1.5 Pro</li>
              <li>100% Stateless & Secure</li>
              <li>No signup or storage required</li>
              <li>Designed for Modern Tech Careers</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <span>&copy; {new Date().getFullYear()} SkillBridge AI. All rights reserved.</span>
          <span className="mt-2 md:mt-0">Designed for developers, powered by intelligence.</span>
        </div>
      </div>
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none"></div>
    </footer>
  );
};

export default Footer;
