// import React, { useState } from 'react';
// import { NavLink } from 'react-router';
// import axiosclient from '../utils/axiosclient';

// function InstructorPage() {
//     const [prompt, setPrompt] = useState("");
//     const [chatHistory, setChatHistory] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const QUICK_PROMPTS = [
//         "Explain Dynamic Programming with an approach framework.",
//         "Create a visual tracking checklist for Graph Traversals.",
//         "Dry run a quick logic check for a Red-Black Tree rotation."
//     ];

//     const handleSendMessage = async (e, customPrompt = null) => {
//         if (e) e.preventDefault();
//         const activePrompt = customPrompt || prompt;
//         if (!activePrompt.trim() || loading) return;

//         setPrompt(""); // Clear input quickly
        
//         setChatHistory(prev => [...prev, { role: 'user', parts: [{ text: activePrompt }] }]);
//         setLoading(true);

//         try {
//             const res = await axiosclient.post("/api/instructor/ask-instructor", {
//                 prompt: activePrompt,
//                 history: chatHistory 
//             });

//             setChatHistory(res.data.updatedHistory);
//         } catch (err) {
//             console.error("Instructor API Error:", err);
//             setChatHistory(prev => [...prev, { 
//                 role: 'model', 
//                 parts: [{ text: "❌ Code execution pipeline broken. Please check backend server status." }] 
//             }]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="flex flex-col h-screen bg-[#020c1b] text-slate-300 font-mono antialiased selection:bg-primary/20 selection:text-white">
//             {/* Top Navigation Control Console */}
//             <header className="p-4 bg-[#0a192f]/70 border-b border-primary/30 backdrop-blur-md flex justify-between items-center px-8 shadow-[0_4px_25px_rgba(0,0,0,0.5)] z-20">
//                 <div className="flex items-center gap-3">
//                     <span className="relative flex h-2 w-2">
//                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
//                         <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
//                     </span>
//                     <h1 className="text-xs font-bold tracking-[0.25em] text-primary uppercase flex items-center gap-1">
//                         Sankalp_Instructor
//                     </h1>
//                 </div>
//                 <NavLink 
//                     to="/" 
//                     className="px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase bg-transparent text-primary hover:bg-primary/10 border border-primary/40 hover:border-primary transition-all duration-300 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.3)]"
//                 >
//                     Exit_Terminal
//                 </NavLink>
//             </header>

//             {/* Main Interactive Interface Area */}
//             <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl w-full mx-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20 transition-all">
//                 {chatHistory.length === 0 ? (
//                     <div className="h-full flex flex-col items-center justify-center text-center px-4 max-w-2xl mx-auto space-y-8 animate-fade-in">
//                         <div className="space-y-4">
//                             <div className="inline-block px-4 py-1 rounded-md bg-primary/5 border border-primary/20 text-primary font-bold text-[10px] tracking-[0.2em] uppercase shadow-inner">
//                                 Core Engine Initialized
//                             </div>
//                             <h2 className="text-2xl font-black text-white tracking-wider uppercase">
//                                 Welcome to <span className="text-primary">Sankalp Code</span> Engine
//                             </h2>
//                             <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed font-sans">
//                                 Ask architecture questions, review dynamic paradigm state workflows, or safely request filesystem scripts to tracking patterns.
//                             </p>
//                         </div>

//                         {/* Prompt Vector Shell Arrays */}
//                         <div className="w-full space-y-3 pt-4">
//                             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] text-left px-1">Suggested Execution Vectors:</p>
//                             <div className="flex flex-col gap-2.5">
//                                 {QUICK_PROMPTS.map((qp, index) => (
//                                     <button
//                                         key={index}
//                                         onClick={() => handleSendMessage(null, qp)}
//                                         className="w-full text-left p-4 bg-[#0a192f]/40 hover:bg-primary/5 border border-primary/10 hover:border-primary/40 text-xs text-slate-400 hover:text-white rounded-xl transition-all duration-200 flex items-center gap-4 group shadow-[0_4px_12px_rgba(0,0,0,0.15)] transform hover:-translate-y-0.5"
//                                     >
//                                         <span className="text-primary/40 group-hover:text-primary font-bold transition-colors">0{index + 1}.</span>
//                                         <span className="flex-1 truncate text-left">{qp}</span>
//                                         <span className="text-primary opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 font-bold">&rarr;</span>
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 ) : (
//                     chatHistory.map((chat, idx) => (
//                         <div 
//                             key={idx} 
//                             className={`p-5 rounded-xl max-w-[85%] border backdrop-blur-sm transition-all duration-200 ${
//                                 chat.role === 'user' 
//                                     ? 'bg-primary/5 border-primary/30 ml-auto text-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.15)]' 
//                                     : 'bg-[#0a192f]/50 border-slate-800/80 mr-auto text-slate-300 shadow-[0_4px_20px_rgba(0,0,0,0.25)]'
//                             }`}
//                         >
//                             <div className="flex items-center gap-2 text-[10px] font-bold uppercase mb-3 tracking-[0.15em]">
//                                 {chat.role === 'user' ? (
//                                     <>
//                                         <span className="text-primary">✦</span>
//                                         <span className="text-primary/80">User_Shell</span>
//                                     </>
//                                 ) : (
//                                     <>
//                                         <span className="text-slate-400">⚡</span>
//                                         <span className="text-slate-400/80">Instructor_Core</span>
//                                     </>
//                                 )}
//                             </div>
//                             <p className="text-xs whitespace-pre-line leading-relaxed tracking-wide font-sans font-medium">{chat.parts?.[0]?.text}</p>
//                         </div>
//                     ))
//                 )}

//                 {/* Processing/Loading Matrix Overlay */}
//                 {loading && (
//                     <div className="p-4 bg-[#0a192f]/50 border border-primary/20 rounded-xl mr-auto max-w-xs flex items-center gap-3 shadow-[0_4px_15px_rgba(0,0,0,0.2)] animate-pulse">
//                         <span className="loading loading-spinner loading-xs text-primary"></span>
//                         <span className="text-[10px] text-primary uppercase tracking-widest font-bold">Running diagnostics...</span>
//                     </div>
//                 )}
//             </div>

//             {/* Consolidated Input Terminal Base */}
//             <footer className="p-4 bg-[#0a192f]/50 border-t border-primary/20 backdrop-blur-md shadow-[0_-8px_30px_rgba(0,0,0,0.5)] z-10">
//                 <form onSubmit={(e) => handleSendMessage(e)} className="max-w-4xl mx-auto flex gap-3 relative items-center">
//                     <div className="absolute left-4 text-primary/40 pointer-events-none text-xs font-bold">&gt;</div>
//                     <input 
//                         type="text"
//                         value={prompt}
//                         onChange={(e) => setPrompt(e.target.value)}
//                         placeholder="Request execution schema scripts or ask custom query..."
//                         className="flex-1 bg-[#020c1b]/95 border border-primary/20 focus:border-primary/60 rounded-xl pl-8 pr-4 py-3.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-primary/10 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] transition-all duration-200"
//                         disabled={loading}
//                     />
//                     <button 
//                         type="submit"
//                         disabled={loading || !prompt.trim()}
//                         className="bg-primary/10 hover:bg-primary/20 disabled:bg-transparent text-primary disabled:text-slate-700 border border-primary/30 disabled:border-slate-800/60 px-6 uppercase text-[10px] tracking-[0.2em] font-bold rounded-xl transition-all duration-200 h-full py-3.5 flex items-center justify-center min-w-[110px] shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
//                     >
//                         {loading ? "Busy" : "Execute"}
//                     </button>
//                 </form>
//             </footer>
//         </div>
//     );
// }

// export default InstructorPage;

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
        <div className="flex flex-col h-screen bg-[#070b13] text-slate-200 font-mono antialiased selection:bg-indigo-500/20 selection:text-indigo-300 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none -z-10" />

            {/* Top Navigation Control Console */}
            <header className="h-16 px-6 lg:px-10 bg-[#0d131f]/80 border-b border-slate-800/80 backdrop-blur-xl flex justify-between items-center z-20 sticky top-0 shadow-lg shadow-black/20">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                        </span>
                    </div>
                    <div>
                        <h1 className="text-xs font-black tracking-[0.2em] text-white uppercase flex items-center gap-1.5">
                            Sankalp<span className="text-indigo-400">_Instructor</span>
                        </h1>
                        <span className="text-[10px] text-slate-500 font-sans tracking-wide">Interactive AI Debugger & Logic Guide</span>
                    </div>
                </div>

                <NavLink 
                    to="/" 
                    className="px-4 py-1.5 text-xs font-semibold tracking-wider text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-500 transition-all duration-200 rounded-lg shadow-inner flex items-center gap-2"
                >
                    <span className="text-rose-400/80">⏻</span> Exit_Terminal
                </NavLink>
            </header>

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