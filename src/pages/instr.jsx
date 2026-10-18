import React, { useState } from 'react';
import { useNavigate , NavLink , Link } from 'react-router';
import axiosclient from '../utils/axiosclient';
import { Sparkles } from 'lucide-react';

function InstructorPage() {
     const navigate = useNavigate();
    const [prompt, setPrompt] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
     const [isMenuOpen, setIsMenuOpen] = useState(false);
    

    const QUICK_PROMPTS = [
        "Explain Dynamic Programming with an approach framework.",
        "Create a visual tracking checklist for Graph Traversals.",
        "Dry run a quick logic check for a Red-Black Tree rotation."
    ];

    const handleSendMessage = async (e, customPrompt = null) => {
        if (e) e.preventDefault();
        const activePrompt = customPrompt || prompt;
        if (!activePrompt.trim() || loading) return;

        setPrompt(""); // Clear input quickly
        
        setChatHistory(prev => [...prev, { role: 'user', parts: [{ text: activePrompt }] }]);
        setLoading(true);

        try {
            const res = await axiosclient.post("/api/instructor/ask-instructor", {
                prompt: activePrompt,
                history: chatHistory 
            });

            setChatHistory(res.data.updatedHistory);
        } catch (err) {
            console.error("Instructor API Error:", err);
            setChatHistory(prev => [...prev, { 
                role: 'model', 
                parts: [{ text: "❌ Code execution pipeline broken. Please check backend server status." }] 
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#070b13] text-slate-200 font-mono antialiased selection:bg-indigo-500/20 selection:text-indigo-300 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none -z-10" />

            <nav className="w-full bg-slate-900/90 border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3.5 sticky top-0 z-50 backdrop-blur-md">
                            <div className="flex items-center justify-between">
                                {/* Left: Brand Logo */}
                                <NavLink to="/welcome" className="flex items-center gap-2 group shrink-0">
                                    <div className="h-9 w-9 sm:h-10 sm:w-10 bg-indigo-600/20 border border-indigo-500/30 rounded-xl flex items-center justify-center text-indigo-400 font-bold shadow-[0_0_20px_rgba(99,102,241,0.25)] group-hover:scale-105 transition-transform duration-200 shrink-0">
                                        <Sparkles size={18} className="text-indigo-400" />
                                    </div>
                                    <span className="text-base sm:text-xl font-black tracking-tight text-white truncate">
                                        SANKALP<span className="text-indigo-500">CODE</span>
                                    </span>
                                </NavLink>
                                
                                {/* Right: Desktop Links */}
                                <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                                    <Link to="/welcome" className="text-slate-300 hover:text-indigo-400 transition">
                                        Home
                                    </Link>
                                    <Link to="/battle-mode" className="text-slate-300 hover:text-indigo-400 transition">
                                        BattleRoom
                                    </Link>
                                    <Link to="/instructor" className="text-slate-300 hover:text-indigo-400 transition">
                                        Instructor
                                    </Link>
                                    <button
                                        onClick={() => navigate('/dashboard')}
                                        className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition duration-200 shrink-0"
                                    >
                                        Dashboard
                                    </button>
                                </div>
            
                                {/* Right: Mobile Menu Toggle Button */}
                                <div className="flex items-center gap-2 md:hidden">
                                    <button
                                        onClick={() => navigate('/dashboard')}
                                        className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 shrink-0"
                                    >
                                        Dashboard
                                    </button>
                                    <button 
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                                        aria-label="Toggle Menu"
                                    >
                                        {isMenuOpen ? '✕' : '☰'}
                                    </button>
                                </div>
                            </div>
            
                            {/* Mobile Dropdown Drawer */}
                            {isMenuOpen && (
                                <div className="md:hidden mt-3 pt-3 border-t border-slate-800/80 flex flex-col gap-3 text-xs font-medium bg-slate-900/95 p-4 rounded-xl border border-slate-800">
                                    <Link 
                                        to="/welcome" 
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-slate-300 hover:text-indigo-400 py-1 transition flex items-center justify-between"
                                    >
                                        <span>Home</span>
                                        <span>→</span>
                                    </Link>
                                    <Link 
                                        to="/battle-mode" 
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-slate-300 hover:text-indigo-400 py-1 transition flex items-center justify-between"
                                    >
                                        <span>BattleRoom</span>
                                        <span>→</span>
                                    </Link>
                                    <Link 
                                        to="/instructor" 
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-slate-300 hover:text-indigo-400 py-1 transition flex items-center justify-between"
                                    >
                                        <span>Instructor</span>
                                        <span>→</span>
                                    </Link>
                                </div>
                            )}
                        </nav>

            {/* Main Interactive Interface Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 max-w-4xl w-full mx-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-800 hover:scrollbar-thumb-slate-700 transition-all">
                {chatHistory.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center px-4 max-w-xl mx-auto space-y-8 my-auto py-12 animate-fade-in">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-medium text-[11px] tracking-wider uppercase">
                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                                Core Engine Active
                            </div>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                                Sankalp <span className="text-indigo-400">Code Engine</span>
                            </h2>
                            <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-sans font-normal">
                                Resolve complex algorithmic roadblocks, dry-run state transitions, or build structured execution frameworks effortlessly.
                            </p>
                        </div>

                        {/* Suggested Execution Vectors */}
                        <div className="w-full space-y-2.5 pt-2">
                            <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider text-left px-1 flex items-center gap-1.5">
                                <span className="text-indigo-400">›</span> Suggested Prompts
                            </p>
                            <div className="flex flex-col gap-2.5">
                                {QUICK_PROMPTS.map((qp, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSendMessage(null, qp)}
                                        className="w-full text-left p-3.5 bg-[#0f172a]/60 hover:bg-[#1e293b]/60 border border-slate-800 hover:border-indigo-500/40 text-xs text-slate-300 hover:text-indigo-200 rounded-xl transition-all duration-200 flex items-center justify-between group shadow-sm hover:shadow-cyan-500/5 hover:-translate-y-0.5"
                                    >
                                        <div className="flex items-center gap-3 truncate">
                                            <span className="text-slate-500 group-hover:text-indigo-400 font-mono text-[11px]">0{index + 1}</span>
                                            <span className="truncate font-sans font-medium text-slate-300 group-hover:text-white">{qp}</span>
                                        </div>
                                        <span className="text-indigo-400 opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 transition-all duration-200 pl-2">→</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-5 pb-6">
                        {chatHistory.map((chat, idx) => (
                            <div 
                                key={idx} 
                                className={`p-4 md:p-5 rounded-2xl max-w-[85%] border backdrop-blur-md transition-all duration-200 shadow-lg ${
                                    chat.role === 'user' 
                                        ? 'bg-cyan-950/20 border-indigo-500/30 ml-auto text-slate-100 shadow-cyan-950/20' 
                                        : 'bg-[#0f172a]/80 border-slate-800 mr-auto text-slate-200 shadow-black/20'
                                }`}
                            >
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase mb-2.5 tracking-wider">
                                    {chat.role === 'user' ? (
                                        <>
                                            <span className="h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"></span>
                                            <span className="text-indigo-400">You</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]"></span>
                                            <span className="text-slate-400">Instructor Core</span>
                                        </>
                                    )}
                                </div>
                                <div className="text-xs md:text-sm whitespace-pre-line leading-relaxed font-sans font-normal text-slate-300 selection:bg-indigo-500/30">
                                    {chat.parts?.[0]?.text}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Processing/Loading Matrix Overlay */}
                {loading && (
                    <div className="p-3.5 bg-[#0f172a]/90 border border-indigo-500/30 rounded-xl mr-auto max-w-xs flex items-center gap-3 shadow-lg shadow-black/30 backdrop-blur-md animate-pulse">
                        <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[11px] text-indigo-300 uppercase tracking-widest font-semibold">Running diagnostics...</span>
                    </div>
                )}
            </div>

            {/* Input Terminal Base */}
            <footer className="p-4 md:p-5 bg-[#0d131f]/90 border-t border-slate-800/80 backdrop-blur-xl z-20">
                <form onSubmit={(e) => handleSendMessage(e)} className="max-w-4xl mx-auto flex gap-3 relative items-center">
                    <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400/60 font-mono text-xs select-none">
                            &gt;_
                        </span>
                        <input 
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Type an algorithm query, pattern breakdown, or logic test..."
                            className="w-full bg-[#050811] border border-slate-800 focus:border-indigo-500/60 rounded-xl pl-9 pr-4 py-3 text-xs md:text-sm font-sans text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 shadow-inner transition-all duration-200 disabled:opacity-50"
                            disabled={loading}
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={loading || !prompt.trim()}
                        className="bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 font-bold uppercase text-[11px] tracking-wider px-5 py-3 rounded-xl transition-all duration-200 flex items-center justify-center min-w-[95px] shadow-md shadow-indigo-500/10 disabled:cursor-not-allowed"
                    >
                        {loading ? "Busy..." : "Execute"}
                    </button>
                </form>
            </footer>
        </div>
    );
}

export default InstructorPage;