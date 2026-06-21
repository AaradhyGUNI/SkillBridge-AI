import React from 'react';
import { 
  FileText, Sparkles, Cpu, Target, BookOpen, 
  HelpCircle, ArrowRight, ShieldCheck, Zap, Award 
} from 'lucide-react';

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="relative overflow-hidden">
      {/* Decorative Glow Elements */}
      <div className="hero-glow top-10 left-10"></div>
      <div className="hero-glow top-1/3 -right-20"></div>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-32 md:pb-24 z-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-semibold text-sky-400 mb-8 animate-pulse-subtle">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next-Gen AI Resume Intelligence</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 max-w-4xl mx-auto leading-tight">
            Bridge the Gap Between Your Resume and Your <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Dream Job</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your resume, specify your target tech role, and let our advanced Gemini-powered AI analyze skill gaps, calculate ATS scores, and build your personalized learning roadmap in seconds.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-sky-500 to-indigo-500 text-white px-8 py-4 rounded-2xl font-bold text-base hover:from-sky-600 hover:to-indigo-600 transition-all duration-300 shadow-xl shadow-sky-500/15 hover:shadow-sky-500/25 active:scale-95 group"
            >
              <span>Analyze Your Resume Now</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#features"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-2xl border border-slate-800 bg-slate-900/40 text-slate-300 font-semibold text-base hover:bg-slate-900/80 hover:text-white transition-all duration-300"
            >
              Learn More
            </a>
          </div>

          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 md:gap-12 text-slate-500 text-sm font-semibold border-t border-slate-900 pt-8 max-w-3xl mx-auto">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <span>100% Stateless & Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              <span>Real-time Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-500" />
              <span>Gemini 1.5 Powered</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 border-t border-slate-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Everything you need to benchmark your capabilities and guide your professional path.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass-panel glass-panel-hover p-8 rounded-3xl flex flex-col items-start">
            <div className="bg-sky-500/10 p-3.5 rounded-2xl text-sky-400 mb-6 border border-sky-500/20">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">ATS Score Breakdown</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Get an overall ATS compliance score with individual metrics for education, formatting, project completeness, and skills representation.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel glass-panel-hover p-8 rounded-3xl flex flex-col items-start">
            <div className="bg-indigo-500/10 p-3.5 rounded-2xl text-indigo-400 mb-6 border border-indigo-500/20">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Dynamic Skill Categorization</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Our analyzer extracts programming languages, databases, frameworks, tools, and cloud tech, presenting them in stylized, interactive cards.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel glass-panel-hover p-8 rounded-3xl flex flex-col items-start">
            <div className="bg-emerald-500/10 p-3.5 rounded-2xl text-emerald-400 mb-6 border border-emerald-500/20">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Target Role Gap Analysis</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Compare your current resume dynamically with ANY tech role. Identify matching skills, missing technologies, and clear resume weaknesses.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-panel glass-panel-hover p-8 rounded-3xl flex flex-col items-start">
            <div className="bg-purple-500/10 p-3.5 rounded-2xl text-purple-400 mb-6 border border-purple-500/20">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI Professional Summary</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Receive a concise summary describing your career focus, technical strengths, and core highlights customized for your next application.
            </p>
          </div>

          {/* Card 5 */}
          <div className="glass-panel glass-panel-hover p-8 rounded-3xl flex flex-col items-start">
            <div className="bg-amber-500/10 p-3.5 rounded-2xl text-amber-400 mb-6 border border-amber-500/20">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Learning Roadmaps</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Obtain a prioritized list of technologies to learn, recommended projects, industry certifications, and free courses/resources.
            </p>
          </div>

          {/* Card 6 */}
          <div className="glass-panel glass-panel-hover p-8 rounded-3xl flex flex-col items-start">
            <div className="bg-pink-500/10 p-3.5 rounded-2xl text-pink-400 mb-6 border border-pink-500/20">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Interview Simulator Prep</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Get 10 technical questions and 5 HR questions scaled by difficulty (beginner to advanced) mapped directly to your profile and target role.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="workflow" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 border-t border-slate-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Optimize your application flow in four quick steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="relative p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center text-lg font-bold mb-6">1</div>
            <h3 className="text-lg font-bold text-white mb-2">Upload Resume</h3>
            <p className="text-sm text-slate-400">Select and upload your resume PDF securely. No data is stored.</p>
          </div>
          <div className="relative p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center text-lg font-bold mb-6">2</div>
            <h3 className="text-lg font-bold text-white mb-2">Enter Job Role</h3>
            <p className="text-sm text-slate-400">Type in any target role (e.g. Frontend Developer, ML Engineer).</p>
          </div>
          <div className="relative p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-lg font-bold mb-6">3</div>
            <h3 className="text-lg font-bold text-white mb-2">Real-time Analysis</h3>
            <p className="text-sm text-slate-400">Our Flask backend parses the text and Gemini runs detailed analysis.</p>
          </div>
          <div className="relative p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center text-lg font-bold mb-6">4</div>
            <h3 className="text-lg font-bold text-white mb-2">Build Your Career</h3>
            <p className="text-sm text-slate-400">Use structured results, question banks, and roadmaps to prepare.</p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 border-t border-slate-900 bg-slate-950/20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
              A Resume Analyzer Built for Modern Tech Professionals
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8">
              Generic resume scanners fail to capture technical nuance. SkillBridge AI utilizes Google's state-of-the-art language models to dynamically analyze technical skills, understand code context, and offer personalized career suggestions.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-sky-500/10 p-1.5 rounded-lg text-sky-400 mt-0.5 border border-sky-500/20">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Save Hours of Searching</h4>
                  <p className="text-xs text-slate-400">Get specific resource recommendations and certifications, bypassing generic searches.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-emerald-500/10 p-1.5 rounded-lg text-emerald-400 mt-0.5 border border-emerald-500/20">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Optimize for ATS Algorithms</h4>
                  <p className="text-xs text-slate-400">Align your project details and experience terms to match modern automated HR tools.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-slate-900 to-slate-800 p-8 border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-6 border-b border-slate-800">
              <span className="text-sm font-bold text-slate-300">Resume Compliance Check</span>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 font-semibold">Ready</span>
            </div>
            <div className="py-6 space-y-4">
              <div className="w-full bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                <div className="flex justify-between mb-1.5 text-xs font-semibold">
                  <span className="text-slate-300">Skill Alignment</span>
                  <span className="text-sky-400">82%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>
              <div className="w-full bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                <div className="flex justify-between mb-1.5 text-xs font-semibold">
                  <span className="text-slate-300">Format & Structure</span>
                  <span className="text-emerald-400">95%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
              <div className="w-full bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                <div className="flex justify-between mb-1.5 text-xs font-semibold">
                  <span className="text-slate-300">Quantifiable Metrics</span>
                  <span className="text-rose-400">45%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
            <div className="bg-sky-500/10 rounded-2xl border border-sky-500/20 p-4 text-xs text-slate-300">
              💡 **AI Tip:** "Include metric counts in project descriptions (e.g. optimized queries reducing latency by 20%)."
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 z-10">
        <div className="bg-gradient-to-tr from-sky-950 via-slate-900 to-indigo-950 rounded-[2.5rem] border border-slate-800/80 p-8 md:p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 leading-tight">
            Ready to Take Your Resume to the Next Level?
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base mb-8">
            Get an instant PDF evaluation, target job analysis, technical roadmap, and questions custom-tailored for your success.
          </p>
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-sky-500 to-indigo-500 text-white px-8 py-4 rounded-2xl font-bold hover:from-sky-600 hover:to-indigo-600 transition-all duration-300 shadow-xl shadow-sky-500/10 hover:shadow-sky-500/20 active:scale-95 mx-auto group"
          >
            <span>Analyze My Resume</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
