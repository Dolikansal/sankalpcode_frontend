import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axiosclient from '../utils/axiosclient';
import { logoutuser } from '../authslice';

function Home() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [problem, setproblem] = useState([]);
    const [solvedproblem, setsolvedproblem] = useState([]);
    const [filters, setfilters] = useState({
        difficulty: "all",
        status: "all",
        tag: "all"
    });

    const ALL_TAGS = ['Array', 'String', 'Linked List', 'Dynamic Programming', 'Graph', 'Tree', 'Hash Table', 'Math', 'Backtracking', 'Design', 'Sorting', 'Greedy', 'Bit Manipulation', 'Two Pointers', 'Divide and Conquer'];

    useEffect(() => {
        const fetchdata = async () => {
            try {
                const problemsRes = await axiosclient.get("/problem/getallproblems");
                setproblem(problemsRes.data || []);
                if (user) {
                    const solvedRes = await axiosclient.get("/problem/problemsolvedbyuser");
                    setsolvedproblem(solvedRes.data || []);
                }
            } catch (err) {
                console.log("Error fetching data:", err);
            }
        };
        fetchdata();
    }, [user]);

    const handlelogout = () => {
        dispatch(logoutuser());
        setsolvedproblem([]);
    };

    const filteredproblems = problem.filter(p => {
        const difficultymatch = filters.difficulty === "all" || p.difficulty.toLowerCase() === filters.difficulty.toLowerCase();
        const tagmatch = filters.tag === "all" || (
            Array.isArray(p.tags)
                ? p.tags.some(t => t.toLowerCase() === filters.tag.toLowerCase())
                : p.tags?.toLowerCase() === filters.tag.toLowerCase()
        );
        const isSolved = solvedproblem.some(sp => sp._id === p._id);
        const statusmatch = filters.status === "all" || (filters.status === "solved" ? isSolved : !isSolved);
        return difficultymatch && tagmatch && statusmatch;
    });

    const totalCount = problem.length;
    const solvedCount = problem.filter(p => solvedproblem.some(sp => sp._id === p._id)).length;
    const easyCount = problem.filter(p => p.difficulty?.toLowerCase() === 'easy').length;
    const mediumCount = problem.filter(p => p.difficulty?.toLowerCase() === 'medium').length;
    const hardCount = problem.filter(p => p.difficulty?.toLowerCase() === 'hard').length;

    return (
        <div className="flex flex-col h-screen bg-[#0d1117] text-slate-200 overflow-hidden font-sans">
            
            {/* TOP HEADER NAVBAR */}
            <header className="h-16 bg-[#161b22] border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 z-30 shrink-0 shadow-md">
                <div className="flex items-center gap-6">
                    <NavLink to="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center font-black text-white text-base shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                            S
                        </div>
                        <span className="text-xl font-black tracking-tight text-white">
                            SANKALP<span className="text-indigo-500">CODE</span>
                        </span>
                    </NavLink>

                    <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-800 text-xs text-slate-400">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                            Explore
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-800/50 hover:bg-slate-800 text-slate-400 font-medium transition-colors">
                            Problems
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {user ? (
                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="flex items-center gap-3 p-1.5 pr-3 rounded-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/40 transition-all cursor-pointer shadow-sm"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-slate-900">
                                    {user?.firstName?.[0]?.toUpperCase()}
                                </div>
                                <div className="text-left hidden sm:block">
                                    <p className="font-semibold text-xs text-white leading-tight">{user.firstName}</p>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                                        {user?.role === "admin" ? "Admin" : "Student"}
                                    </p>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-400 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>

                            <ul tabIndex={0} className="dropdown-content z-50 menu p-2 mt-3 shadow-2xl bg-[#161b22] rounded-xl w-52 border border-slate-800 space-y-1">
                                <li>
                                    <NavLink to="/profile" className="flex justify-between py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg">
                                        My Profile
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </NavLink>
                                </li>

                                {user?.role === "admin" && (
                                    <>
                                        <div className="divider my-1 border-slate-800"></div>
                                        <li>
                                            <NavLink to="/admin" className="flex justify-between py-2 text-xs text-indigo-400 hover:bg-indigo-500/10 rounded-lg">
                                                Admin Dashboard
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                </svg>
                                            </NavLink>
                                        </li>
                                    </>
                                )}

                                <div className="divider my-1 border-slate-800"></div>
                                <li>
                                    <button onClick={handlelogout} className="text-rose-400 hover:bg-rose-500/10 flex justify-between py-2 text-xs rounded-lg">
                                        Logout
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <NavLink to="/login" className="px-4 py-1.5 rounded-lg bg-indigo-500 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm">
                            Sign In
                        </NavLink>
                    )}
                </div>
            </header>

            {/* BODY LAYOUT: SIDEBAR + CONTENT */}
            <div className="flex flex-1 overflow-hidden">
                
                {/* PRO LEFT SIDEBAR */}
                <aside className="w-64 bg-[#161b22] border-r border-slate-800 hidden md:flex flex-col justify-between p-4 shrink-0 overflow-y-auto">
                    <div className="space-y-6">
                        
                        {/* Instructor Banner */}
                        <NavLink 
                            to="/instructor" 
                            className="group relative flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-indigo-950/40 to-slate-900 border border-indigo-500/30 hover:border-indigo-400 transition-all shadow-inner overflow-hidden"
                        >
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-bold text-sm">
                                    &lt;/&gt;
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">DSA Instructor</p>
                                    <p className="text-[10px] text-slate-400">AI Assistant</p>
                                </div>
                            </div>
                            <span className="text-indigo-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-xs font-mono">→</span>
                        </NavLink>

                        {/* Filters Header */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                                <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Filters</span>
                                <button 
                                    onClick={() => setfilters({ difficulty: "all", status: "all", tag: "all" })}
                                    className="text-[10px] text-indigo-400 hover:underline"
                                >
                                    Reset
                                </button>
                            </div>

                            {/* Status Filter */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-semibold text-slate-400">Status</label>
                                <select
                                    className="w-full bg-[#0d1117] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-all"
                                    value={filters.status}
                                    onChange={(e) => setfilters({ ...filters, status: e.target.value })}
                                >
                                    <option value="all">All Status</option>
                                    <option value="solved">Solved</option>
                                    <option value="unsolved">Unsolved</option>
                                </select>
                            </div>

                            {/* Difficulty Filter */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-semibold text-slate-400">Difficulty</label>
                                <select
                                    className="w-full bg-[#0d1117] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-all"
                                    value={filters.difficulty}
                                    onChange={(e) => setfilters({ ...filters, difficulty: e.target.value })}
                                >
                                    <option value="all">All Difficulties</option>
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>

                            {/* Topics Filter */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-semibold text-slate-400">Topics & Tags</label>
                                <select
                                    className="w-full bg-[#0d1117] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-all"
                                    value={filters.tag}
                                    onChange={(e) => setfilters({ ...filters, tag: e.target.value })}
                                >
                                    <option value="all">All Topics</option>
                                    {ALL_TAGS.map(tag => (
                                        <option key={tag} value={tag.toLowerCase()}>{tag}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Progress Summary Card */}
                    <div className="p-3 bg-[#0d1117] border border-slate-800 rounded-xl space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-400">Solved</span>
                            <span className="text-indigo-400">{solvedCount} / {totalCount}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                                style={{ width: `${totalCount ? (solvedCount / totalCount) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>
                </aside>

                {/* MAIN CONTENT AREA */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
                    
                    {/* Top Stat Highlights */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        <div className="p-4 rounded-xl bg-[#161b22] border border-slate-800 flex flex-col justify-between">
                            <span className="text-xs font-medium text-slate-400">Total Problems</span>
                            <p className="text-2xl font-bold text-white mt-1">{totalCount}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-[#161b22] border border-slate-800 flex flex-col justify-between">
                            <span className="text-xs font-medium text-emerald-400">Easy</span>
                            <p className="text-2xl font-bold text-white mt-1">{easyCount}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-[#161b22] border border-slate-800 flex flex-col justify-between">
                            <span className="text-xs font-medium text-amber-400">Medium</span>
                            <p className="text-2xl font-bold text-white mt-1">{mediumCount}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-[#161b22] border border-slate-800 flex flex-col justify-between">
                            <span className="text-xs font-medium text-rose-400">Hard</span>
                            <p className="text-2xl font-bold text-white mt-1">{hardCount}</p>
                        </div>
                    </div>

                    {/* Mobile Filters Horizontal Bar */}
                    <div className="md:hidden flex flex-wrap gap-2 p-3 bg-[#161b22] border border-slate-800 rounded-xl">
                        <select
                            className="bg-[#0d1117] border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 flex-1"
                            value={filters.status}
                            onChange={(e) => setfilters({ ...filters, status: e.target.value })}
                        >
                            <option value="all">Status: All</option>
                            <option value="solved">Solved</option>
                            <option value="unsolved">Unsolved</option>
                        </select>
                        <select
                            className="bg-[#0d1117] border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 flex-1"
                            value={filters.difficulty}
                            onChange={(e) => setfilters({ ...filters, difficulty: e.target.value })}
                        >
                            <option value="all">Diff: All</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>

                    {/* Problem Table List */}
                    <div className="bg-[#161b22] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                        
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-2 px-5 py-3.5 bg-slate-900/60 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            <div className="col-span-1 text-center">Status</div>
                            <div className="col-span-6 sm:col-span-7">Title</div>
                            <div className="col-span-3 sm:col-span-2 text-center">Difficulty</div>
                            <div className="col-span-2 text-right hidden sm:block">Action</div>
                        </div>

                        {/* Problem Rows */}
                        <div className="divide-y divide-slate-800/60">
                            {filteredproblems.length > 0 ? (
                                filteredproblems.map((p, index) => {
                                    const isSolved = solvedproblem.some(sp => sp._id === p._id);
                                    return (
                                        <div 
                                            key={p._id} 
                                            className="grid grid-cols-12 gap-2 px-5 py-4 items-center hover:bg-slate-800/40 transition-colors group"
                                        >
                                            {/* Status Icon */}
                                            <div className="col-span-1 flex justify-center">
                                                {isSolved ? (
                                                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </span>
                                                ) : (
                                                    <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                                                )}
                                            </div>

                                            {/* Title & Tags */}
                                            <div className="col-span-6 sm:col-span-7 space-y-1">
                                                <NavLink 
                                                    to={`/problem/${p._id}`} 
                                                    className="text-sm sm:text-base font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1"
                                                >
                                                    {p.title}
                                                </NavLink>
                                                
                                                {p.tags && (
                                                    <div className="flex flex-wrap gap-1.5 items-center">
                                                        {(Array.isArray(p.tags) ? p.tags : [p.tags]).slice(0, 3).map((tag, tIdx) => (
                                                            <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/50">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Difficulty */}
                                            <div className="col-span-3 sm:col-span-2 text-center">
                                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getDifficultyBadge(p.difficulty)}`}>
                                                    {p.difficulty}
                                                </span>
                                            </div>

                                            {/* Action Button */}
                                            <div className="col-span-2 text-right hidden sm:block">
                                                <NavLink 
                                                    to={`/problem/${p._id}`} 
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-500 text-slate-300 hover:text-white border border-slate-700 hover:border-indigo-400 text-xs font-semibold transition-all duration-200 shadow-sm"
                                                >
                                                    Solve
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </NavLink>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-16 text-center text-slate-500 text-xs space-y-2">
                                    <p className="font-semibold text-slate-400 text-sm">No problems found</p>
                                    <p>Try clearing your difficulty or tag filters.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

const getDifficultyBadge = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
        case 'easy':
            return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
        case 'medium':
            return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
        case 'hard':
            return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
        default:
            return 'bg-slate-800 text-slate-400 border border-slate-700';
    }
};

export default Home;