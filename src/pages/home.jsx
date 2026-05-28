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
                setproblem(problemsRes.data);
                if (user) {
                    const solvedRes = await axiosclient.get("/problem/problemsolvedbyuser");
                    setsolvedproblem(solvedRes.data);
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
                ? p.tags.some(t => t.toLowerCase() === filters.tag.toLowerCase()) // Array ke andar check karega
                : p.tags?.toLowerCase() === filters.tag.toLowerCase() // Single string fallback
        );
        const isSolved = solvedproblem.some(sp => sp._id === p._id);
        const statusmatch = filters.status === "all" || (filters.status === "solved" ? isSolved : !isSolved);
        return difficultymatch && tagmatch && statusmatch;
    });

    return (
        <div className="flex h-screen bg-base-200">
            {/* LEFT SIDEBAR */}
            <aside className="w-72 bg-base-100 border-r border-base-300 flex flex-col">
                <div className="p-6 border-b border-base-300">
                    <NavLink to="/" className="text-2xl font-bold text-primary tracking-tight">
                        SANKALP<span className="text-base-content">CODE</span>
                    </NavLink>
                </div>

                {/* Filters Section in Sidebar */}
                <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                    <div>
                        <label className="label-text font-bold text-xs uppercase opacity-60">Status</label>
                        <select
                            className="select select-bordered select-sm w-full mt-2 focus:ring-1 ring-primary"
                            value={filters.status}
                            onChange={(e) => setfilters({ ...filters, status: e.target.value })}
                        >
                            <option value="all">All Problems</option>
                            <option value="solved">Solved</option>
                            <option value="unsolved">Unsolved</option>
                        </select>
                    </div>

                    <div>
                        <label className="label-text font-bold text-xs uppercase opacity-60">Difficulty</label>
                        <select
                            className="select select-bordered select-sm w-full mt-2"
                            value={filters.difficulty}
                            onChange={(e) => setfilters({ ...filters, difficulty: e.target.value })}
                        >
                            <option value="all">All Difficulties</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                    <div>
                        <label className="label-text font-bold text-xs uppercase opacity-60">Topics</label>
                        <select
                            className="select select-bordered select-sm w-full mt-2 focus:ring-1 ring-primary"
                            value={filters.tag}
                            onChange={(e) => setfilters({ ...filters, tag: e.target.value })}
                        >
                            <option value="all">All Tags</option>
                            {ALL_TAGS.map(tag => (
                                <option key={tag} value={tag.toLowerCase()}>{tag}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mt-8">
                    <NavLink to="/instructor" className="btn btn-sm w-full bg-[#0a192f]/60 hover:bg-cyan-500/20 text-primary hover:text-cyan-300 border border-primary hover:border-cyan-400/80  font-semibold tracking-wide shadow-[0_0_10px_rgba(6,182,212,0.15)] hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] backdrop-blur-md transition-all duration-300 ease-out flex items-center justify-center gap-2 group uppercase text-[11px]">
                            {/* Futuristic Code Bracket Icons */}
                            <span className="text-primary group-hover:text-cyan-400 transition-colors font-mono">&lt;</span>
                            DSA Instructor
                            <span className="text-primary group-hover:text-cyan-400 transition-colors font-mono">&gt;</span>
                            </NavLink>
                    </div>
                </div>
                {/* Bottom Profile Section */}
                <div className="p-4 border-t border-base-300 bg-base-200/50">
                    {user ? (
                        <div className="dropdown dropdown-top w-full">
                            {/* Clickable Area */}
                            <div
                                tabIndex={0}
                                role="button"
                                className="flex items-center justify-between w-full hover:bg-base-300 p-2 rounded-xl transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="avatar placeholder">
                                        <div className="bg-primary text-primary-content rounded-lg w-10">
                                            <span className="text-xl font-bold">{user?.firstName?.[0]}</span>
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm leading-tight">{user.firstName}</p>
                                        <p className="text-[10px] opacity-50 uppercase">Student</p>
                                    </div>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                                </svg>
                            </div>

                            {/* Dropdown Menu */}
                            <ul tabIndex={0} className="dropdown-content z-1 menu p-2 shadow-2xl bg-base-100 rounded-box w-full mb-2 border border-base-300">
                                <li>
                                    <NavLink to="/profile" className="flex justify-between">
                                        My Profile
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </NavLink>
                                </li>

                                {/* Conditional Admin Button - Only visible if user is admin */}
                                {user?.role === "admin" && (
                                    <>
                                        <div className="divider my-0 opacity-50"></div>
                                        <li>
                                            <NavLink to="/admin" className="flex justify-between">
                                                Admin
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </NavLink>
                                        </li>
                                    </>
                                )}

                                <div className="divider my-0 opacity-50"></div>
                                <li>
                                    <button onClick={handlelogout} className="text-error flex justify-between">
                                        Logout
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <NavLink to="/login" className="btn btn-primary btn-sm w-full">Login</NavLink>
                    )}
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 overflow-y-auto p-8 bg-base-200">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-3xl font-extrabold">Problems</h1>
                        <p className="text-base-content/60">Practice makes progress. Pick a challenge and start coding.</p>
                    </header>

                    <div className="space-y-3">
                        {filteredproblems.length > 0 ? (
                            filteredproblems.map((p, index) => (
                                <div key={p._id} className="flex items-center justify-between bg-base-100 p-5 rounded-xl border border-base-300 hover:border-primary/50 transition-all shadow-sm group">
                                    <div className="flex items-center gap-5">
                                        <div className="text-base-content/30 font-mono text-sm">{index + 1}</div>
                                        <div>
                                            <NavLink to={`/problem/${p._id}`} className="font-bold text-lg hover:text-primary transition-all">
                                                {p.title}
                                            </NavLink>
                                            <div className="flex gap-3 mt-1 items-center">
                                                <span className={`text-[11px] font-bold uppercase tracking-wider ${getDifficultyColor(p.difficulty)}`}>
                                                    {p.difficulty}
                                                </span>
                                                <span className="h-1 w-1 rounded-full bg-base-content/20"></span>
                                                <span className="text-[11px] text-base-content/50 uppercase">
                                                    {Array.isArray(p.tags) ? p.tags.join(", ") : (p.tags || 'No Tags')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {solvedproblem.some(sp => sp._id === p._id) && (
                                            <div className="badge badge-success badge-sm py-3 px-3 gap-1 font-bold text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                Solved
                                            </div>
                                        )}
                                        <NavLink to={`/problem/${p._id}`} className="btn btn-sm btn-outline btn-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                            Solve
                                        </NavLink>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="card bg-base-100 border-2 border-dashed border-base-300 py-16 text-center">
                                <p className="opacity-40 font-medium italic">No problems found for these filters.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

const getDifficultyColor = (difficulty) => {
    console.log("Difficulty:", difficulty); // Debugging log
    switch (difficulty?.toLowerCase()) {
        case 'easy': return 'text-success';
        case 'medium': return 'text-warning';
        case 'hard': return 'text-error';
        default: return 'text-base-content/50';
    }
};

export default Home;