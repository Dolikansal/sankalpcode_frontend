import React, { useState } from 'react';
import { NavLink } from 'react-router';
import axiosclient from '../utils/axiosclient';

function InstructorPage() {
    const [prompt, setPrompt] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);

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
        <div className="flex flex-col h-screen bg-[#020c1b] text-slate-300 font-mono antialiased selection:bg-primary/20 selection:text-white">
            {/* Top Navigation Control Console */}
            <header className="p-4 bg-[#0a192f]/70 border-b border-primary/30 backdrop-blur-md flex justify-between items-center px-8 shadow-[0_4px_25px_rgba(0,0,0,0.5)] z-20">
                <div className="flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <h1 className="text-xs font-bold tracking-[0.25em] text-primary uppercase flex items-center gap-1">
                        Sankalp_Instructor
                    </h1>
                </div>
                <NavLink 
                    to="/" 
                    className="px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase bg-transparent text-primary hover:bg-primary/10 border border-primary/40 hover:border-primary transition-all duration-300 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.3)]"
                >
                    Exit_Terminal
                </NavLink>
            </header>

            {/* Main Interactive Interface Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl w-full mx-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20 transition-all">
                {chatHistory.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center px-4 max-w-2xl mx-auto space-y-8 animate-fade-in">
                        <div className="space-y-4">
                            <div className="inline-block px-4 py-1 rounded-md bg-primary/5 border border-primary/20 text-primary font-bold text-[10px] tracking-[0.2em] uppercase shadow-inner">
                                Core Engine Initialized
                            </div>
                            <h2 className="text-2xl font-black text-white tracking-wider uppercase">
                                Welcome to <span className="text-primary">Sankalp Code</span> Engine
                            </h2>
                            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed font-sans">
                                Ask architecture questions, review dynamic paradigm state workflows, or safely request filesystem scripts to tracking patterns.
                            </p>
                        </div>

                        {/* Prompt Vector Shell Arrays */}
                        <div className="w-full space-y-3 pt-4">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] text-left px-1">Suggested Execution Vectors:</p>
                            <div className="flex flex-col gap-2.5">
                                {QUICK_PROMPTS.map((qp, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSendMessage(null, qp)}
                                        className="w-full text-left p-4 bg-[#0a192f]/40 hover:bg-primary/5 border border-primary/10 hover:border-primary/40 text-xs text-slate-400 hover:text-white rounded-xl transition-all duration-200 flex items-center gap-4 group shadow-[0_4px_12px_rgba(0,0,0,0.15)] transform hover:-translate-y-0.5"
                                    >
                                        <span className="text-primary/40 group-hover:text-primary font-bold transition-colors">0{index + 1}.</span>
                                        <span className="flex-1 truncate text-left">{qp}</span>
                                        <span className="text-primary opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 font-bold">&rarr;</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    chatHistory.map((chat, idx) => (
                        <div 
                            key={idx} 
                            className={`p-5 rounded-xl max-w-[85%] border backdrop-blur-sm transition-all duration-200 ${
                                chat.role === 'user' 
                                    ? 'bg-primary/5 border-primary/30 ml-auto text-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.15)]' 
                                    : 'bg-[#0a192f]/50 border-slate-800/80 mr-auto text-slate-300 shadow-[0_4px_20px_rgba(0,0,0,0.25)]'
                            }`}
                        >
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase mb-3 tracking-[0.15em]">
                                {chat.role === 'user' ? (
                                    <>
                                        <span className="text-primary">✦</span>
                                        <span className="text-primary/80">User_Shell</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-slate-400">⚡</span>
                                        <span className="text-slate-400/80">Instructor_Core</span>
                                    </>
                                )}
                            </div>
                            <p className="text-xs whitespace-pre-line leading-relaxed tracking-wide font-sans font-medium">{chat.parts?.[0]?.text}</p>
                        </div>
                    ))
                )}

                {/* Processing/Loading Matrix Overlay */}
                {loading && (
                    <div className="p-4 bg-[#0a192f]/50 border border-primary/20 rounded-xl mr-auto max-w-xs flex items-center gap-3 shadow-[0_4px_15px_rgba(0,0,0,0.2)] animate-pulse">
                        <span className="loading loading-spinner loading-xs text-primary"></span>
                        <span className="text-[10px] text-primary uppercase tracking-widest font-bold">Running diagnostics...</span>
                    </div>
                )}
            </div>

            {/* Consolidated Input Terminal Base */}
            <footer className="p-4 bg-[#0a192f]/50 border-t border-primary/20 backdrop-blur-md shadow-[0_-8px_30px_rgba(0,0,0,0.5)] z-10">
                <form onSubmit={(e) => handleSendMessage(e)} className="max-w-4xl mx-auto flex gap-3 relative items-center">
                    <div className="absolute left-4 text-primary/40 pointer-events-none text-xs font-bold">&gt;</div>
                    <input 
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Request execution schema scripts or ask custom query..."
                        className="flex-1 bg-[#020c1b]/95 border border-primary/20 focus:border-primary/60 rounded-xl pl-8 pr-4 py-3.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-primary/10 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] transition-all duration-200"
                        disabled={loading}
                    />
                    <button 
                        type="submit"
                        disabled={loading || !prompt.trim()}
                        className="bg-primary/10 hover:bg-primary/20 disabled:bg-transparent text-primary disabled:text-slate-700 border border-primary/30 disabled:border-slate-800/60 px-6 uppercase text-[10px] tracking-[0.2em] font-bold rounded-xl transition-all duration-200 h-full py-3.5 flex items-center justify-center min-w-[110px] shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
                    >
                        {loading ? "Busy" : "Execute"}
                    </button>
                </form>
            </footer>
        </div>
    );
}

export default InstructorPage;