import React, { useState } from 'react';
import { 
  UploadCloud, FileText, AlertCircle, Sparkles, Cpu, 
  BookOpen, TrendingUp, HelpCircle, Briefcase, Award, 
  Check, ExternalLink, RefreshCw, X, ChevronRight 
} from 'lucide-react';
import { uploadResumeFile, analyzeResumeDetails, getInterviewQuestions } from '../services/api';
import AtsScoreRing from '../components/AtsScoreRing';
import ProgressBar from '../components/ProgressBar';

const Dashboard = () => {
  // Input states
  const [file, setFile] = useState(null);
  const [role, setRole] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Status/Progress states
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusStep, setStatusStep] = useState(''); // 'uploading', 'extracting', 'analyzing', 'questions', ''
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Extracted text & result states
  const [extractedText, setExtractedText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [interviewResult, setInterviewResult] = useState(null);

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState('ats'); // 'ats', 'summary', 'skills', 'roadmap', 'interview'

  // Difficulty filter for interview questions
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setError(null);
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endswith('.pdf')) {
      setError('Invalid file format. Only PDF files are allowed.');
      setFile(null);
      return;
    }

    if (selectedFile.size === 0) {
      setError('The selected file is empty.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadProgress(0);
    setExtractedText('');
  };

  // Run the full pipeline
  const handleStartAnalysis = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select or upload a resume PDF.');
      return;
    }
    if (!role.trim()) {
      setError('Please enter a target job role.');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null);
    setInterviewResult(null);

    try {
      // Step 1: Upload and Extract Text
      setStatusStep('uploading');
      const uploadData = await uploadResumeFile(file, (progress) => {
        setUploadProgress(progress);
        if (progress === 100) {
          setStatusStep('extracting');
        }
      });
      
      const parsedText = uploadData.text;
      setExtractedText(parsedText);

      // Step 2: Analyze Resume
      setStatusStep('analyzing');
      const analysisData = await analyzeResumeDetails(parsedText, role);
      setAnalysisResult(analysisData);

      // Step 3: Generate Interview Questions
      setStatusStep('questions');
      const questionsData = await getInterviewQuestions(parsedText, role);
      setInterviewResult(questionsData);

      setStatusStep('');
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred during analysis.');
      setLoading(false);
      setStatusStep('');
    }
  };

  const handleReset = () => {
    setFile(null);
    setRole('');
    setUploadProgress(0);
    setExtractedText('');
    setAnalysisResult(null);
    setInterviewResult(null);
    setActiveTab('ats');
  };

  // Tech roles quick list
  const sampleRoles = [
    'Software Engineer', 'Frontend Developer', 'Backend Developer', 
    'Full Stack Developer', 'Data Scientist', 'DevOps Engineer', 
    'AI Engineer', 'Cyber Security Analyst', 'Solutions Architect'
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] dashboard-glow p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Error Notification */}
        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-start gap-3 shadow-lg">
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
            <div className="flex-1">
              <h4 className="font-bold text-sm">Action Failed</h4>
              <p className="text-xs text-red-300 mt-1">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-950/40 rounded-[2.5rem] border border-slate-900/60 backdrop-blur-sm min-h-[500px]">
            <div className="relative mb-8">
              <div className="w-16 h-16 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
              <Sparkles className="h-6 w-6 text-sky-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">Analyzing Resume...</h3>
            
            <div className="max-w-md w-full px-6">
              {/* Progress Steps UI */}
              <div className="space-y-4 text-sm mt-6">
                <div className="flex items-center justify-between">
                  <span className={statusStep === 'uploading' ? 'text-sky-400 font-semibold' : 'text-slate-500'}>
                    Uploading Resume
                  </span>
                  {statusStep === 'uploading' && <span className="text-xs text-sky-400">{uploadProgress}%</span>}
                  {(statusStep !== 'uploading' && uploadProgress === 100) && <Check className="h-4 w-4 text-emerald-500" />}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={statusStep === 'extracting' ? 'text-sky-400 font-semibold' : 'text-slate-500'}>
                    Extracting Text Content (pdfplumber)
                  </span>
                  {statusStep === 'extracting' && <span className="text-xs text-sky-400 animate-pulse">Running...</span>}
                  {['analyzing', 'questions', ''].includes(statusStep) && statusStep !== 'extracting' && <Check className="h-4 w-4 text-emerald-500" />}
                </div>

                <div className="flex items-center justify-between">
                  <span className={statusStep === 'analyzing' ? 'text-sky-400 font-semibold text-lg' : 'text-slate-500'}>
                    Executing Gemini AI Deep Analysis
                  </span>
                  {statusStep === 'analyzing' && <span className="text-xs text-sky-400 animate-pulse">Processing...</span>}
                  {['questions', ''].includes(statusStep) && statusStep !== 'analyzing' && <Check className="h-4 w-4 text-emerald-500" />}
                </div>

                <div className="flex items-center justify-between">
                  <span className={statusStep === 'questions' ? 'text-sky-400 font-semibold' : 'text-slate-500'}>
                    Generating Contextual Questions & Roadmap
                  </span>
                  {statusStep === 'questions' && <span className="text-xs text-sky-400 animate-pulse">Creating...</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* INPUT PANELS (Shown when no results available) */}
        {!loading && !analysisResult && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left/Main Column: Form */}
            <div className="lg:col-span-2 glass-panel p-6 sm:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <h2 className="text-3xl font-extrabold text-white mb-2">Resume Analyzer</h2>
              <p className="text-slate-400 text-sm mb-8">
                Upload your latest resume in PDF format and define your target role. We'll run a full evaluation.
              </p>

              <form onSubmit={handleStartAnalysis} className="space-y-6">
                {/* Target Role Input */}
                <div>
                  <label htmlFor="target-role" className="block text-sm font-semibold text-slate-300 mb-2">
                    Target Job Role
                  </label>
                  <input
                    type="text"
                    id="target-role"
                    placeholder="e.g. Frontend Developer, Machine Learning Engineer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                  {/* Quick Suggestions */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {sampleRoles.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          role === r 
                            ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' 
                            : 'bg-slate-900/40 text-slate-400 border-slate-800/80 hover:border-slate-700 hover:text-slate-300'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* PDF File Upload Zone */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Upload Resume (PDF only)
                  </label>
                  
                  {!file ? (
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${
                        dragActive 
                          ? 'border-sky-500 bg-sky-500/5' 
                          : 'border-slate-800 bg-slate-900/20 hover:border-slate-700 hover:bg-slate-900/40'
                      }`}
                    >
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="bg-sky-500/10 p-4 rounded-2xl text-sky-400 mb-4 border border-sky-500/20">
                        <UploadCloud className="h-8 w-8" />
                      </div>
                      <p className="text-white font-bold text-base mb-1">
                        Drag and drop your file here
                      </p>
                      <p className="text-slate-400 text-xs">
                        Limit 10MB • PDF format only
                      </p>
                      <span className="mt-4 text-xs font-semibold text-sky-400 border border-sky-500/20 px-3 py-1 rounded-full bg-sky-500/5 hover:bg-sky-500/10 transition-colors">
                        Browse Files
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
                      <div className="bg-sky-500/10 p-3 rounded-xl text-sky-400 border border-sky-500/20">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white text-sm truncate">{file.name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-sky-500 to-indigo-500 text-white py-4 rounded-2xl font-bold hover:from-sky-600 hover:to-indigo-600 transition-all duration-300 shadow-xl shadow-sky-500/15 hover:shadow-sky-500/25 active:scale-[0.98]"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Analyze Suitability</span>
                </button>
              </form>
            </div>

            {/* Right Column: Information/Sidebar */}
            <div className="glass-panel p-6 sm:p-8 rounded-[2.5rem] border border-slate-900 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Security & Privacy</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  SkillBridge AI runs completely **stateless**. This means your resume information and documents are read in memory, processed immediately with Google Gemini, and instantly discarded. We store no files, database entries, or analytics logs.
                </p>
                <div className="space-y-4 border-t border-slate-900 pt-6">
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-500"></div>
                    <span>Instant circular ATS scores</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-500"></div>
                    <span>Complete skill gap assessment</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-500"></div>
                    <span>Actionable resume tweaks</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-500"></div>
                    <span>Difficulty-scaled question bank</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 bg-sky-500/5 border border-sky-500/10 rounded-2xl p-4 text-xs text-sky-400">
                🚀 **Portfolio Project:** This software demonstrates real-time document parsing, robust AI service boundaries, and interactive full-stack coordination.
              </div>
            </div>
          </div>
        )}

        {/* RESULTS DASHBOARD (Shown when analysis completes) */}
        {!loading && analysisResult && (
          <div>
            {/* Dashboard Header Banner */}
            <div className="glass-panel p-6 sm:p-8 rounded-[2.5rem] mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-slate-900 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">
                  <Sparkles className="h-4 w-4" />
                  <span>Analysis Report</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Dashboard for <span className="text-sky-500">{role}</span>
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">
                  Evaluated resume: <span className="text-slate-300 font-semibold">{file?.name || 'resume.pdf'}</span>
                </p>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 border border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all shrink-0"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Upload Another</span>
              </button>
            </div>

            {/* Dashboard Layout: Tabs + Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Tabs Navigation */}
              <div className="lg:col-span-1 flex flex-col gap-2">
                <button
                  onClick={() => setActiveTab('ats')}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl text-left border font-semibold text-sm transition-all ${
                    activeTab === 'ats'
                      ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                      : 'bg-slate-900/20 text-slate-400 border-slate-800/80 hover:bg-slate-900/40 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5" />
                    <span>ATS Report</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setActiveTab('summary')}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl text-left border font-semibold text-sm transition-all ${
                    activeTab === 'summary'
                      ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                      : 'bg-slate-900/20 text-slate-400 border-slate-800/80 hover:bg-slate-900/40 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5" />
                    <span>AI Profile Summary</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setActiveTab('skills')}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl text-left border font-semibold text-sm transition-all ${
                    activeTab === 'skills'
                      ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                      : 'bg-slate-900/20 text-slate-400 border-slate-800/80 hover:bg-slate-900/40 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Cpu className="h-5 w-5" />
                    <span>Skill Analytics</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setActiveTab('roadmap')}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl text-left border font-semibold text-sm transition-all ${
                    activeTab === 'roadmap'
                      ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                      : 'bg-slate-900/20 text-slate-400 border-slate-800/80 hover:bg-slate-900/40 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5" />
                    <span>Learning Roadmap</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setActiveTab('interview')}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl text-left border font-semibold text-sm transition-all ${
                    activeTab === 'interview'
                      ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                      : 'bg-slate-900/20 text-slate-400 border-slate-800/80 hover:bg-slate-900/40 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5" />
                    <span>Interview Prep</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-3">
                {/* 1. ATS COMPLIANCE TAB */}
                {activeTab === 'ats' && (
                  <div className="space-y-6">
                    <div className="glass-panel p-6 sm:p-8 rounded-[2.5rem] border border-slate-900 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                      <div className="flex justify-center">
                        <AtsScoreRing score={analysisResult.ats_score} />
                      </div>
                      <div className="md:col-span-2 space-y-4">
                        <h3 className="text-xl font-bold text-white">ATS Metric Scorecard</h3>
                        <p className="text-slate-400 text-xs sm:text-sm">
                          This scorecard displays how compliant your resume is across key tracking parameters. Aim for a target score of **80+** for competitive tech roles.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          {Object.entries(analysisResult.score_breakdown || {}).map(([key, val]) => (
                            <ProgressBar key={key} label={key} value={val} />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-3xl">
                        <h4 className="text-base font-bold text-emerald-400 flex items-center gap-2 mb-4">
                          <Check className="h-5 w-5 shrink-0" />
                          <span>Identified Strengths</span>
                        </h4>
                        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                          {analysisResult.strengths?.map((str, idx) => (
                            <li key={idx} className="flex gap-2">
                              <span className="text-emerald-500 select-none">•</span>
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-rose-500/5 border border-rose-500/10 p-6 rounded-3xl">
                        <h4 className="text-base font-bold text-rose-400 flex items-center gap-2 mb-4">
                          <AlertCircle className="h-5 w-5 shrink-0" />
                          <span>Key Weaknesses</span>
                        </h4>
                        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                          {analysisResult.weaknesses?.map((weak, idx) => (
                            <li key={idx} className="flex gap-2">
                              <span className="text-rose-500 select-none">•</span>
                              <span>{weak}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Recommendations / Tips */}
                    <div className="glass-panel p-6 sm:p-8 rounded-[2.5rem] border border-slate-900">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                        <Sparkles className="text-sky-400 h-5 w-5" />
                        <span>ATS Optimization Recommendations</span>
                      </h3>
                      <div className="space-y-3">
                        {analysisResult.recommendations?.map((rec, idx) => (
                          <div key={idx} className="flex items-start gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-sky-500/10 text-sky-400 text-xs font-bold border border-sky-500/20 shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <p className="text-sm text-slate-300">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. SUMMARY TAB */}
                {activeTab === 'summary' && (
                  <div className="glass-panel p-6 sm:p-8 rounded-[2.5rem] border border-slate-900 space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">AI Professional Summary</h3>
                      <p className="text-slate-400 text-sm">
                        This summary is dynamically generated to highlight your suitability for **{role}**.
                      </p>
                    </div>

                    <div className="space-y-6 border-t border-slate-900 pt-6">
                      <div>
                        <h4 className="text-xs uppercase font-bold tracking-wider text-sky-400 mb-2">Candidate Profile</h4>
                        <p className="text-sm sm:text-base text-slate-200 leading-relaxed bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
                          {analysisResult.summary?.candidate_profile}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xs uppercase font-bold tracking-wider text-sky-400 mb-2">Technical Strengths</h4>
                        <p className="text-sm sm:text-base text-slate-200 leading-relaxed bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
                          {analysisResult.summary?.technical_strengths}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xs uppercase font-bold tracking-wider text-sky-400 mb-2">Career Focus</h4>
                        <p className="text-sm sm:text-base text-slate-200 leading-relaxed bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
                          {analysisResult.summary?.career_focus}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xs uppercase font-bold tracking-wider text-sky-400 mb-2">Key Highlights</h4>
                        <p className="text-sm sm:text-base text-slate-200 leading-relaxed bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
                          {analysisResult.summary?.key_highlights}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. SKILL ANALYTICS TAB */}
                {activeTab === 'skills' && (
                  <div className="space-y-6">
                    {/* Extracted Skills Categorization */}
                    <div className="glass-panel p-6 sm:p-8 rounded-[2.5rem] border border-slate-900">
                      <h3 className="text-lg font-bold text-white mb-6">Extracted Skills</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(analysisResult.extracted_skills || {}).map(([category, skills]) => (
                          <div key={category} className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl">
                            <h4 className="text-sm font-bold text-sky-400 capitalize mb-3 border-b border-slate-800 pb-2">
                              {category.replace(/_/g, ' ')}
                            </h4>
                            {skills && skills.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {skills.map((s) => (
                                  <span key={s} className="text-xs bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-slate-300 font-medium">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-slate-500 italic">None identified in resume</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Skill Match / Gap Analysis */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Matching Skills */}
                      <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-3xl">
                        <h4 className="text-base font-bold text-emerald-400 flex items-center gap-2 mb-4">
                          <Check className="h-5 w-5 shrink-0" />
                          <span>Matching Tech Stack</span>
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.matching_skills?.map((ms) => (
                            <span key={ms} className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-xl font-semibold">
                              {ms}
                            </span>
                          ))}
                          {(!analysisResult.matching_skills || analysisResult.matching_skills.length === 0) && (
                            <span className="text-xs text-slate-500 italic">No matching skills identified for this role</span>
                          )}
                        </div>
                      </div>

                      {/* Missing Skills */}
                      <div className="bg-rose-500/5 border border-rose-500/10 p-6 rounded-3xl">
                        <h4 className="text-base font-bold text-rose-400 flex items-center gap-2 mb-4">
                          <AlertCircle className="h-5 w-5 shrink-0" />
                          <span>Missing Key Skills</span>
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.missing_skills?.map((mis) => (
                            <span key={mis} className="text-xs bg-rose-500/10 border border-rose-500/20 text-rose-300 px-3 py-1.5 rounded-xl font-semibold">
                              {mis}
                            </span>
                          ))}
                          {(!analysisResult.missing_skills || analysisResult.missing_skills.length === 0) && (
                            <span className="text-xs text-slate-500 italic">No major missing skills! Excellent alignment.</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Skill Gap Analysis Narrative */}
                    <div className="glass-panel p-6 sm:p-8 rounded-[2.5rem] border border-slate-900">
                      <h3 className="text-lg font-bold text-white mb-3">AI Skill Gap Assessment</h3>
                      <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                        {analysisResult.skill_gap_analysis}
                      </p>
                    </div>
                  </div>
                )}

                {/* 4. LEARNING ROADMAP TAB */}
                {activeTab === 'roadmap' && (
                  <div className="space-y-6">
                    {/* Skills to Learn Priority */}
                    <div className="glass-panel p-6 sm:p-8 rounded-[2.5rem] border border-slate-900">
                      <h3 className="text-lg font-bold text-white mb-6">Skills Priority Matrix</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                              <th className="pb-3 pr-4">Skill</th>
                              <th className="pb-3 px-4">Priority</th>
                              <th className="pb-3 pl-4">Target Timeframe</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-900 text-slate-200">
                            {analysisResult.learning_roadmap?.skills_to_learn?.map((item, idx) => (
                              <tr key={idx}>
                                <td className="py-3.5 pr-4 font-semibold text-white">{item.skill}</td>
                                <td className="py-3.5 px-4">
                                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                                    item.priority === 'High' 
                                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                  }`}>
                                    {item.priority}
                                  </span>
                                </td>
                                <td className="py-3.5 pl-4 text-slate-400">{item.timeframe}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Resources & Certifications */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="glass-panel p-6 rounded-3xl border border-slate-900">
                        <h4 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                          <BookOpen className="h-5 w-5 text-sky-400" />
                          <span>Curated Study Resources</span>
                        </h4>
                        <div className="space-y-3.5">
                          {analysisResult.learning_roadmap?.free_resources?.map((res, idx) => (
                            <a
                              key={idx}
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-start justify-between gap-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-sky-500/30 hover:bg-slate-900 transition-all group"
                            >
                              <div>
                                <h5 className="text-xs font-bold text-white group-hover:text-sky-400 transition-colors">
                                  {res.name}
                                </h5>
                                <span className="text-[10px] text-slate-500 break-all">{res.url}</span>
                              </div>
                              <ExternalLink className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                            </a>
                          ))}
                        </div>
                      </div>

                      <div className="glass-panel p-6 rounded-3xl border border-slate-900">
                        <h4 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                          <Award className="h-5 w-5 text-indigo-400" />
                          <span>Recommended Certifications</span>
                        </h4>
                        <ul className="space-y-3">
                          {analysisResult.learning_roadmap?.recommended_certifications?.map((cert, idx) => (
                            <li key={idx} className="flex gap-2 text-sm text-slate-300 bg-slate-900/40 p-3.5 rounded-xl border border-slate-800">
                              <span className="text-indigo-400 font-bold">•</span>
                              <span>{cert}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Recommended Projects & Career Path */}
                    <div className="glass-panel p-6 sm:p-8 rounded-[2.5rem] border border-slate-900 space-y-6">
                      <div>
                        <h4 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                          <Briefcase className="h-5 w-5 text-emerald-400" />
                          <span>Recommended Portfolio Projects</span>
                        </h4>
                        <div className="space-y-3">
                          {analysisResult.learning_roadmap?.recommended_projects?.map((proj, idx) => (
                            <div key={idx} className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl border border-slate-800/80 flex gap-3 text-sm text-slate-300">
                              <span className="text-emerald-500 select-none font-bold">#</span>
                              <span>{proj}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-slate-900 pt-6">
                        <h4 className="text-xs uppercase font-bold tracking-wider text-sky-400 mb-2">Recommended Career Path</h4>
                        <p className="text-sm font-semibold text-slate-200">
                          {analysisResult.learning_roadmap?.career_growth_path}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. INTERVIEW PREP TAB */}
                {activeTab === 'interview' && (
                  <div className="space-y-6">
                    {/* Header + Difficulty Filter */}
                    <div className="glass-panel p-6 rounded-3xl border border-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">Interactive Prep Simulator</h3>
                        <p className="text-slate-400 text-xs mt-0.5">
                          Questions mapped directly to the {role} requirements and your background.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                          <button
                            key={diff}
                            onClick={() => setSelectedDifficulty(diff)}
                            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                              selectedDifficulty === diff 
                                ? 'bg-sky-500/10 text-sky-400 border-sky-500/30 font-bold' 
                                : 'bg-slate-900/40 text-slate-400 border-slate-850 hover:border-slate-700 hover:text-slate-300'
                            }`}
                          >
                            {diff}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Question List */}
                    {interviewResult ? (
                      <div className="space-y-6">
                        {/* Technical Questions Section */}
                        <div className="space-y-4">
                          <h4 className="text-base font-bold text-white border-l-4 border-sky-500 pl-3">
                            Technical Questions (10 Questions)
                          </h4>
                          <div className="space-y-4">
                            {interviewResult.technical_questions
                              ?.filter(q => selectedDifficulty === 'All' || q.difficulty === selectedDifficulty)
                              .map((q, idx) => (
                                <div key={q.id || idx} className="glass-panel p-6 rounded-3xl border border-slate-900 space-y-3">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs text-sky-400 font-bold uppercase tracking-wider">
                                      Question {idx + 1}
                                    </span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                                      q.difficulty === 'Advanced' 
                                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                                        : q.difficulty === 'Intermediate'
                                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    }`}>
                                      {q.difficulty}
                                    </span>
                                  </div>
                                  <h5 className="text-sm sm:text-base font-semibold text-white">
                                    {q.question}
                                  </h5>
                                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 mt-2">
                                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Suggested Answer Outline</span>
                                    <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                                      {q.answer_outline}
                                    </p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* HR Questions Section */}
                        <div className="space-y-4 pt-4">
                          <h4 className="text-base font-bold text-white border-l-4 border-indigo-500 pl-3">
                            HR & Behavioral Questions (5 Questions)
                          </h4>
                          <div className="space-y-4">
                            {interviewResult.hr_questions
                              ?.filter(q => selectedDifficulty === 'All' || q.difficulty === selectedDifficulty)
                              .map((q, idx) => (
                                <div key={q.id || idx} className="glass-panel p-6 rounded-3xl border border-slate-900 space-y-3">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">
                                      Behavioral Question {idx + 1}
                                    </span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                                      q.difficulty === 'Advanced' 
                                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                                        : q.difficulty === 'Intermediate'
                                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    }`}>
                                      {q.difficulty}
                                    </span>
                                  </div>
                                  <h5 className="text-sm sm:text-base font-semibold text-white">
                                    {q.question}
                                  </h5>
                                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 mt-2">
                                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Behavioral Answer Tips</span>
                                    <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                                      {q.answer_outline}
                                    </p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-12 bg-slate-900/20 border border-slate-900 rounded-3xl min-h-[200px]">
                        <span className="text-slate-400 text-sm">Generating interview preparation suite...</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
