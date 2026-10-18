import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { NavLink } from 'react-router';
import { Sparkles } from 'lucide-react';
function Welcome() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  // Dynamic Tech Stack Data Categorized
  const techStackData = [
    { name: "React 18 & Vite", category: "frontend", role: "Lightning-fast SPA UI & Virtual DOM state sync", badge: "UI Core", status: "Active" },
    { name: "Tailwind CSS", category: "frontend", role: "Utility-first modern dark design & animations", badge: "Design", status: "Active" },
    { name: "Redux Toolkit", category: "frontend", role: "Centralized state & JWT authentication stream", badge: "State", status: "Active" },
    { name: "Node.js & Express", category: "backend", role: "Non-blocking event loop REST API backend", badge: "Server", status: "Active" },
    { name: "MongoDB", category: "backend", role: "Document schema for user submissions & problems", badge: "Database", status: "Active" },
    { name: "Socket.io Engine", category: "engine", role: "Bi-directional WebSocket channel for 1v1 live duels", badge: "Realtime", status: "Live" },
    { name: "Judge0 Compiler", category: "engine", role: "Isolated multi-language execution sandbox", badge: "Execution", status: "Live" },
    { name: "Redis Caching", category: "infra", role: "In-memory caching for low-latency session store", badge: "Memory", status: "Fast" },
    { name: "Cloudinary CDN", category: "infra", role: "On-demand HD editorial video streaming pipeline", badge: "Media", status: "Active" }
  ];

  const filteredTech = activeTab === 'all'
    ? techStackData
    : techStackData.filter(t => t.category === activeTab);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">

      {/* 1. NAVBAR */}
      <nav className="w-full bg-slate-900/80 border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
        {/* Left: Brand Logo */}
        <NavLink to="/welcome" className="flex items-center gap-2 group">
          <div className="h-10 w-10 bg-indigo-600/20 border border-indigo-500/30 rounded-xl flex items-center justify-center text-indigo-400 font-bold shadow-[0_0_20px_rgba(99,102,241,0.25)] group-hover:scale-105 transition-transform duration-200">
            <Sparkles size={20} className="text-indigo-400" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            SANKALP<span className="text-indigo-500">CODE</span>
          </span>
        </NavLink>
        {/* Right: Actions & Links */}
        <div className="flex items-center gap-3 sm:gap-6 text-sm font-medium">
          <Link to="/welcome" className="text-slate-300 hover:text-indigo-400 transition hidden sm:block">
            Home
          </Link>
          <Link to="/battle-mode" className="text-slate-300 hover:text-indigo-400 transition">
             BattleRoom
          </Link>
          <Link to="/instructor" className="text-slate-300 hover:text-indigo-400 transition hidden md:block">
            Instructor
          </Link>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 sm:px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition duration-200"
          >
            Dashboard
          </button>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <header className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-24 max-w-6xl mx-auto text-center flex flex-col items-center">
        {/* Background Radial Glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-6 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-indigo-400"></span>
          Next-Gen DSA & Competitive Arena
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
          Sharpen Your DSA Skills & <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-500 bg-clip-text text-transparent">
            Compete Live Head-to-Head
          </span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-lg max-w-2xl mb-8 leading-relaxed">
          SankalpCode combines real-time 1v1 algorithmic duels, sandboxed multi-language code execution, and high-quality video editorials in one platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-600/25 transition"
          >
            Open Dashboard
          </button>
          <button
            onClick={() => navigate('/battle-mode')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm sm:text-base transition"
          >
            Enter 1v1 Battle Arena
          </button>
        </div>

        {/* Quick Platform Metrics */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8 w-full max-w-2xl border-t border-slate-800/80 pt-8 text-center">
          <div>
            <h4 className="text-xl sm:text-2xl font-black text-slate-100">100+</h4>
            <p className="text-xs text-slate-400">DSA Questions</p>
          </div>
          <div>
            <h4 className="text-xl sm:text-2xl font-black text-indigo-400">Real-Time</h4>
            <p className="text-xs text-slate-400">1v1 WebSockets</p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-xl sm:text-2xl font-black text-slate-100">Judge0</h4>
            <p className="text-xs text-slate-400">Compiler Sandbox</p>
          </div>
        </div>
      </header>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-6xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">How SankalpCode Works</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">Master algorithms in 3 simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 relative">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-mono">Step 01</span>
            <h3 className="text-lg font-bold text-slate-100 mt-2 mb-2">Pick a Topic</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Select questions categorized by Arrays, DP, Trees, and Graphs based on difficulty levels.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 relative">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-mono">Step 02</span>
            <h3 className="text-lg font-bold text-slate-100 mt-2 mb-2">Code & Execute</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Write code in C++, Java, Python, or JS and execute instantly against hidden test cases using Judge0.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 relative">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-mono">Step 03</span>
            <h3 className="text-lg font-bold text-slate-100 mt-2 mb-2">1v1 Battle & Learn</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Duel peers in synchronized timed rooms or watch Cloudinary video solution editorials.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CORE USE CASES & FEATURES */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-6xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">Core Use Cases</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">Built for interview prep and high-speed competitive programming</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-2xl hover:border-indigo-500/40 transition">
            <div className="w-9 h-9 rounded-lg bg-indigo-950 border border-indigo-800/80 flex items-center justify-center text-indigo-400 font-bold text-sm mb-4">
              ⚔️
            </div>
            <h3 className="text-lg font-bold text-indigo-400 mb-2">Live Peer Duels</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Instant matchmaking rooms powered by Socket.io to challenge friends with live status and time updates.
            </p>
          </div>

          <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-2xl hover:border-indigo-500/40 transition">
            <div className="w-9 h-9 rounded-lg bg-indigo-950 border border-indigo-800/80 flex items-center justify-center text-indigo-400 font-bold text-sm mb-4">
              📹
            </div>
            <h3 className="text-lg font-bold text-indigo-400 mb-2">Video Solution Hub</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Integrated Cloudinary video stream inside problem pages to quickly understand optimal solutions.
            </p>
          </div>

          <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-2xl hover:border-indigo-500/40 transition">
            <div className="w-9 h-9 rounded-lg bg-indigo-950 border border-indigo-800/80 flex items-center justify-center text-indigo-400 font-bold text-sm mb-4">
              ⚡
            </div>
            <h3 className="text-lg font-bold text-indigo-400 mb-2">Multi-Lang Sandbox</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Sandboxed code execution environment running Judge0 and Redis caching for near-zero delay feedback.
            </p>
          </div>
        </div>
      </section>

      {/* 5. DYNAMIC TECH STACK SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-6xl mx-auto w-full relative">
        <div className="text-center mb-10">
          <span className="px-3 py-1 rounded-full bg-slate-900 text-indigo-400 text-[11px] font-mono border border-indigo-800/40 uppercase tracking-widest font-bold">
            Architecture Breakdown
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 mt-3">Tech Stack & Infrastructure</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">Full-stack system architecture designed for speed and reliability</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { id: 'all', label: 'All Layers' },
            { id: 'frontend', label: 'Frontend' },
            { id: 'backend', label: 'Backend' },
            { id: 'engine', label: 'Engines' },
            { id: 'infra', label: 'Infrastructure' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition duration-200 ${
                activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)] scale-105' 
                  : 'bg-[#0f1524] text-slate-400 border border-slate-800/80 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Tech Grid with Glowing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filteredTech.map((item, idx) => (
            <div 
              key={idx} 
              className="group relative p-5 rounded-2xl bg-[#0a0e17]/80 border border-slate-800/90 hover:border-indigo-500/60 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[0_0_20px_rgba(79,70,229,0.15)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{item.icon}</span>
                    <h4 className="text-slate-100 font-bold text-base group-hover:text-indigo-300 transition">
                      {item.name}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-950/80 text-indigo-400 border border-indigo-800/50">
                    {item.badge}
                  </span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed mt-2">
                  {item.role}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                <span className="text-slate-500 font-mono">Status</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. RESPONSIVE FOOTER */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-900/40 py-10 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-xs">
          <div>
            <h3 className="text-indigo-400 font-bold text-sm mb-3">SankalpCode</h3>
            <p className="text-slate-400 leading-relaxed">
              Interactive coding workspace featuring real-time 1v1 battle mode and multi-language compilation.
            </p>
          </div>

          <div>
            <h4 className="text-slate-200 font-bold mb-3">Navigation</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/welcome" className="hover:text-indigo-400 transition">Welcome Home</Link></li>
              <li><Link to="/dashboard" className="hover:text-indigo-400 transition">Main Dashboard</Link></li>
              <li><Link to="/battle-mode" className="hover:text-indigo-400 transition">1v1 Battle Room</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-200 font-bold mb-3">Features</h4>
            <ul className="space-y-2 text-slate-400">
              <li><span className="text-slate-400">Judge0 Execution</span></li>
              <li><span className="text-slate-400">Socket.io Matchmaking</span></li>
              <li><span className="text-slate-400">Cloudinary Video Guides</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-200 font-bold mb-3">Project Info</h4>
            <p className="text-slate-400 leading-relaxed">
              Built with MERN Stack, Redis, & WebSockets.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} SankalpCode. All rights reserved.</p>
          <p>Designed for performance and competitive programming.</p>
        </div>
      </footer>

    </div>
  );
}

export default Welcome;