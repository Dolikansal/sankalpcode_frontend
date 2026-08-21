import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router';
import Editor from '@monaco-editor/react';
import Editorial from '../components/edit.jsx';
import axiosclient from "../utils/axiosclient";
import {
  FiChevronLeft, FiPlay, FiSend, FiTerminal,
  FiFileText, FiCode, FiCheckCircle, FiClock, FiBookOpen
} from 'react-icons/fi';
const decodeBase64 = (str) => {
  if (!str) return "";
  try {
    return atob(str);
  } catch (e) {
    return str;
  }
};
const ProblemPage = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const isResizing = useRef(false);

  // Core Data States
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  // UI States ke section mein add karein
  const [selectedCase, setSelectedCase] = useState(0);
  // const [activeTab, setActiveTab] = useState('description');
  // Results States
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  // UI States
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeBottomTab, setActiveBottomTab] = useState('testcase');
  const [showConsole, setShowConsole] = useState(false);
  const [consoleHeight, setConsoleHeight] = useState(250);
  const [viewingSubmission, setViewingSubmission] = useState(null);

  const langConfig = {
    javascript: { id: 63, monaco: 'javascript', label: 'Javascript' },
    java: { id: 62, monaco: 'java', label: 'Java' },
    cpp: { id: 54, monaco: 'cpp', label: 'C++' }
  };

  // --- 1. Bulletproof Matching Logic (Solves the boilerplate glitch) ---
  const getMatchedCode = (startCodeArray, selectedLang) => {
    if (!startCodeArray || startCodeArray.length === 0) return null;

    const matched = startCodeArray.find(sc => {
      const dbLang = sc.language?.toLowerCase().trim();
      const current = selectedLang.toLowerCase().trim();

      if (current === 'cpp') return dbLang === 'cpp' || dbLang === 'c++';
      if (current === 'javascript') return dbLang === 'javascript' || dbLang === 'js';
      return dbLang === current;
    });

    // Dono keys check kar raha hoon: initialCode aur initialcode
    return matched ? (matched.initialcode || matched.initialCode) : null;
  };
  const fetchSubmissions = async () => {
    try {
      const url = `/problem/submittedproblem/${problemId}`; // Remove extra slash
      // console.log("Requesting URL:", url);
      const res = await axiosclient.get(url);

      // console.log("Response Data:", res.data);

      if (res.data && Array.isArray(res.data)) {
        setSubmissions(res.data);
      } else {
        console.warn("Expected array but got:", typeof res.data);
      }
    } catch (err) {
      console.error("Actual Error Message:", err.response?.data?.error || err.message);
    }
  };
  useEffect(() => {
    if (problemId) fetchSubmissions();
  }, [problemId]);
  // --- 2. Fetch Data ---
  useEffect(() => {
    const fetchProblem = async () => {
      if (!problemId) return;
      setLoading(true);
      try {
        const response = await axiosclient.get(`/problem/problemById/${problemId}`);
        // const data = response.data;
        // Backend response wrap handle karein (data, problem ya direct object)
        const data = response.data?.problem || response.data?.data || response.data;
        setProblem(data);

        const startCodeArray = data.startcode || data.startCode || [];
        const initialBoilerplate = getMatchedCode(startCodeArray, selectedLanguage);

        setCode(initialBoilerplate || '// Start coding...');
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [problemId]);

  // --- 3. UI Handlers ---
  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    if (!problem) return;

    const startCodeArray = problem.startcode || problem.startCode || [];
    const newBoilerplate = getMatchedCode(startCodeArray, lang);
    setCode(newBoilerplate || `// Start coding in ${lang}...`);
  };

  const startResizing = (e) => {
    isResizing.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResizing);
  };

  const handleMouseMove = (e) => {
    if (!isResizing.current) return;
    const newHeight = window.innerHeight - e.clientY;
    if (newHeight > 40 && newHeight < window.innerHeight * 0.8) {
      setConsoleHeight(newHeight);
      setShowConsole(true);
    }
  };

  const stopResizing = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResizing);
  };

  const handleRun = async () => {
    setLoading(true);
    setShowConsole(true);
    setActiveBottomTab('testcase');
    setRunResult(null);
    setSelectedCase(0);
    try {
      const res = await axiosclient.post(`/submission/runcode/${problemId}`, { code, language: selectedLanguage });
      setRunResult(res.data);
    } catch (err) {
      setRunResult({ success: false, error: "Execution Failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setShowConsole(true);
    setActiveBottomTab('result');
    setSubmitResult(null);

    try {
      const res = await axiosclient.post(`/submission/submit/${problemId}`, {
        code,
        language: selectedLanguage
      });

      // Logic improvement: Normalize result to ensure UI doesn't crash
      const data = res.data;
      setSubmitResult({
        accepted: data.status === 'accepted' || data.status?.id === 3,
        runtime: data.runtime || data.time || "0",
        memory: data.memory || "0",
        totalCases: data.totalTestCases || data.testCasesTotal || 0,
        passedCases: data.passedCount || 0,
        errorMessage: data.errorMessage || data.message || "Compilation Error",
        compileOutput: data.compile_output ? decodeBase64(data.compile_output) : null
      });
      fetchSubmissions();
    } catch (err) {
      setSubmitResult({
        accepted: false,
        error: true,
        errorMessage: "Server Connection Lost"
      });
    } finally {
      setLoading(false);
    }
  };
  if (loading && !problem) {
    return (
      <div className="h-screen bg-[#0A0A0A] flex items-center justify-center">
        <span className="loading loading-spinner text-indigo-500"></span>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0A0A0A] text-slate-300 font-sans overflow-hidden">
      {/* NAVBAR */}
      <nav className="h-12 border-b border-white/5 bg-[#111] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-white/5 rounded-md transition-colors">
            <FiChevronLeft size={18} />
          </button>
          <div className="h-4 w-[1px] bg-white/10"></div>
          <span className="text-xs font-bold tracking-widest uppercase text-slate-500">Problem List</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/instructor")}
            disabled={loading}
            className="btn btn-xs bg-green-900 hover:bg-green-600 border-none text-white font-bold gap-2"
          >
            Chat AI
          </button>
          {/* <button onClick={handleRun} disabled={loading} className="btn btn-xs bg-[#1A1A1A] border-white/5 hover:bg-[#252525] text-slate-300 lowercase font-normal gap-2">
            <FiPlay size={12} className="text-emerald-500" /> Run
          </button> */}
          <button
            onClick={handleRun}
            disabled={loading}
            className="btn btn-xs bg-[#1A1A1A] border-white/5 hover:bg-[#252525] text-slate-300 font-medium gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-xs text-emerald-400"></span>
                <span className="text-emerald-400 text-xs lowercase">running...</span>
              </>
            ) : (
              <>
                <FiPlay size={12} className="text-emerald-500" />
                <span className="lowercase">run</span>
              </>
            )}
          </button>
          <button onClick={handleSubmitCode} disabled={loading} className="btn btn-xs bg-indigo-600 hover:bg-indigo-500 border-none text-white lowercase font-bold gap-2">
            <FiSend size={12} /> Submit
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden p-2 gap-2">

        {/* LEFT PANEL (Now Fully Completed) */}
        <div className="w-[45%] bg-[#111] border border-white/5 rounded-xl flex flex-col overflow-hidden">
          {/* Left Tabs */}
          <div className="flex bg-[#1A1A1A] p-1 gap-1">
            {[
              { id: 'description', icon: <FiFileText />, label: 'Description' },
              { id: 'editorial', icon: <FiBookOpen />, label: 'Editorial' },
              { id: 'solutions', icon: <FiCode />, label: 'Solutions' },
              { id: 'submissions', icon: <FiClock />, label: 'Submissions' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveLeftTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeLeftTab === tab.id ? 'bg-[#252525] text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            {problem && (
              <div className="animate-in fade-in duration-500">
                {/* 1. Description Tab */}
                {activeLeftTab === 'description' && (
                  <>
                    <h1 className="text-xl font-bold text-white mb-2">{problem.title}</h1>
                    <div className="flex gap-2 mb-6">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase border ${problem.difficulty?.toLowerCase() === 'easy' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-amber-500 border-amber-500/20 bg-amber-500/5'}`}>
                        {problem.difficulty || problem.difficulty}
                      </span>
                      <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-400 border border-white/5">{problem.tags}</span>
                    </div>
                    <div className="text-sm text-slate-400 whitespace-pre-wrap mb-8 leading-relaxed">
                      {problem.description}
                    </div>
                    {/* Test Case Examples in Description */}
                    <div className="space-y-6">
                      {(problem.visibletestcase || problem.visibleTestCases)?.map((ex, i) => (
                        <div key={i} className="space-y-2">
                          <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">Example {i + 1}:</p>
                          <div className="bg-[#0A0A0A] border-l-2 border-indigo-500 p-4 rounded-r-lg font-mono text-xs space-y-2">
                            <p><span className="text-slate-500">Input:</span> {ex.input}</p>
                            <p><span className="text-slate-500">Output:</span> {ex.output}</p>
                            {ex.explanation && <p className="italic text-slate-500 mt-2">// {ex.explanation}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* 2. Editorial Tab */}
                {activeLeftTab === 'editorial' && (
                  <div className="prose prose-invert text-sm">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <FiBookOpen className="text-indigo-400" /> Editorial
                    </h2>
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <Editorial
                        secureurl={problem.secureurl}
                        thumbnail={problem.thumbnail}
                        duration={problem.duration}
                        editorial={problem.editorial}
                      />
                    </div>
                  </div>
                )}

                {/* 3. Solutions Tab */}

                {activeLeftTab === 'solutions' && (
                  <div className="space-y-6 animate-in fade-in duration-500 pb-8">
                    {/* Hum yahan referencesolution ko map karenge kyunki wahan completecode hai */}
                    {problem.referencesolution?.map((sol, index) => (
                      <div key={index} className="flex flex-col gap-3 group">

                        {/* Header Section */}
                        <div className="flex items-center justify-between px-1">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                            <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">
                              {sol.language} Implementation
                            </span>
                          </div>

                          {/* Professional Copy Button */}
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(sol.completecode);
                              // Aap yahan ek "Copied!" state ya toast bhi add kar sakte hain
                            }}
                            className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-all bg-indigo-500/5 hover:bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20"
                          >
                            <FiCode size={12} />
                            COPY CODE
                          </button>
                        </div>

                        {/* Code Block */}
                        <div className="relative rounded-2xl border border-white/5 bg-[#050505] overflow-hidden group-hover:border-white/10 transition-colors shadow-2xl">
                          {/* Subtle highlight bar on left */}
                          <div className="absolute left-0 top-0 w-[2px] h-full bg-indigo-500/40 group-hover:bg-indigo-500 transition-colors"></div>

                          <pre className="p-5 text-[12px] font-mono leading-relaxed text-emerald-400/90 overflow-x-auto scrollbar-hide">
                            <code>{sol.completecode}</code>
                          </pre>

                          {/* Background Label */}
                          <div className="absolute top-2 right-4 text-[9px] font-bold text-white/5 uppercase tracking-widest pointer-events-none">
                            Ref Solution
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Fallback if no solution found */}
                    {(!problem.referencesolution || problem.referencesolution.length === 0) && (
                      <div className="flex flex-col items-center justify-center py-20 bg-[#111] rounded-2xl border border-dashed border-white/5">
                        <FiCode size={40} className="text-slate-800 mb-4" />
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Official code not uploaded</p>
                      </div>
                    )}
                  </div>
                )}

                {activeLeftTab === 'submissions' && (
                  <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-left-4 duration-500 pb-10">
                    <div className="flex justify-between items-center px-1 mb-1">
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <FiClock className="text-indigo-500" /> Submission History
                      </h3>
                      <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full font-bold border border-indigo-500/20">
                        {submissions.length} Attempts
                      </span>
                    </div>

                    {submissions.length > 0 ? (
                      <div className="space-y-3 overflow-y-auto max-h-[75vh] pr-1 scrollbar-hide">
                        {submissions.map((sub, idx) => {
                          // Normalize status check
                          const isAccepted = sub.status === 'accepted' || sub.status?.id === 3 || sub.verdict === 'Accepted';

                          return (
                            <div
                              key={idx}
                              onClick={() => setViewingSubmission(sub)}
                              className={`group cursor-pointer relative bg-[#161616] border ${isAccepted ? 'border-emerald-500/10' : 'border-rose-500/10'} hover:border-white/10 rounded-2xl p-4 transition-all duration-300 hover:bg-[#1A1A1A] shadow-lg`}
                            >
                              {/* Vertical Indicator Line */}
                              <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${isAccepted ? 'bg-emerald-500' : 'bg-rose-500'}`} />

                              <div className="flex justify-between items-start pl-2">
                                <div className="flex flex-col gap-1.5">
                                  <div className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${isAccepted ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {isAccepted ? <FiCheckCircle /> : <FiClock />}
                                    {isAccepted ? 'Accepted' : (sub.status?.description || sub.status || 'Wrong Answer')}
                                  </div>

                                  <div className="flex items-center gap-4 mt-1">
                                    <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-md border border-white/5">
                                      <span className={`w-1.5 h-1.5 rounded-full ${sub.language === 'cpp' ? 'bg-blue-400' : sub.language === 'java' ? 'bg-orange-400' : 'bg-yellow-400'}`} />
                                      <span className="text-[10px] font-mono text-slate-300 uppercase">{sub.language}</span>
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-bold tracking-tight">
                                      <span className="text-slate-300">{sub.passedCases || 0}</span>/{sub.totalCases || 0} Testcases
                                    </span>
                                  </div>
                                </div>

                                <div className="text-right flex flex-col items-end gap-1">
                                  <p className="text-[10px] text-slate-300 font-bold bg-white/5 px-2 py-1 rounded">
                                    {new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </p>
                                  <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">
                                    {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              </div>

                              {/* Hover Details Footer */}
                              <div className="mt-3 pt-3 border-t border-white/5 flex gap-6 opacity-40 group-hover:opacity-100 transition-opacity pl-2">
                                <div className="flex flex-col">
                                  <span className="text-[8px] text-slate-500 uppercase font-black">Runtime</span>
                                  <span className="text-[10px] text-slate-300 font-mono">{sub.runtime || '0'}ms</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[8px] text-slate-500 uppercase font-black">Memory</span>
                                  <span className={`text-[10px] font-mono ${isAccepted ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {sub.memory || '0'} KB
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      /* Empty State with better styling */
                      <div className="flex flex-col items-center justify-center py-24 text-center bg-[#111] border-2 border-dashed border-white/5 rounded-[2rem]">
                        <div className="p-5 bg-white/5 rounded-full mb-4">
                          <FiClock size={32} className="text-slate-700" />
                        </div>
                        <h3 className="text-slate-400 font-black uppercase text-[11px] tracking-[0.2em]">No History Found</h3>
                        <p className="text-[10px] text-slate-600 mt-2 max-w-[180px] leading-relaxed">
                          Submit your solution to see your progress and past attempts.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL (Editor & Console) */}
        <div className="flex-1 flex flex-col gap-2 overflow-hidden">
          {/* Editor Container */}
          <div className="flex-1 bg-[#111] border border-white/5 rounded-xl flex flex-col overflow-hidden">
            <div className="h-10 bg-[#1A1A1A] border-b border-white/5 flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <FiCode className="text-indigo-400" size={14} />
                <select
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="bg-transparent text-[11px] font-bold text-slate-300 outline-none border-none cursor-pointer"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-hidden pt-2">
              <Editor
                theme="vs-dark"
                language={langConfig[selectedLanguage].monaco}
                value={code}
                onChange={(val) => setCode(val || '')}
                onMount={(editor) => (editorRef.current = editor)}
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  lineNumbers: 'on',
                  padding: { top: 10 }
                }}
              />
            </div>
          </div>

          {/* DRAGGABLE CONSOLE SECTION */}
          <div
            style={{ height: showConsole ? `${consoleHeight}px` : '40px' }}
            className="bg-[#111] border border-white/5 rounded-xl flex flex-col overflow-hidden relative transition-[height] duration-75"
          >
            {/* Invisbile Resize Handle */}
            <div
              onMouseDown={startResizing}
              className="absolute top-0 left-0 w-full h-1 cursor-ns-resize bg-transparent hover:bg-indigo-500/50 z-50 transition-colors"
            />

            {/* Console Header */}
            <div className="h-10 bg-[#1A1A1A] flex items-center justify-between px-4 shrink-0 border-b border-white/5">
              <div className="flex gap-4 items-center">
                <button onClick={() => setShowConsole(!showConsole)} className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <FiTerminal size={14} className={showConsole ? 'text-indigo-400' : ''} /> Console
                </button>
                {showConsole && (
                  <div className="flex gap-4 border-l border-white/10 pl-4 h-full">
                    <button
                      onClick={() => setActiveBottomTab('testcase')}
                      className={`text-[10px] font-bold uppercase py-2 border-b-2 transition-all ${activeBottomTab === 'testcase' ? 'text-indigo-400 border-indigo-500' : 'text-slate-500 border-transparent hover:text-slate-400'}`}
                    >
                      Testcase
                    </button>
                    <button
                      onClick={() => setActiveBottomTab('result')}
                      className={`text-[10px] font-bold uppercase py-2 border-b-2 transition-all ${activeBottomTab === 'result' ? 'text-indigo-400 border-indigo-500' : 'text-slate-500 border-transparent hover:text-slate-400'}`}
                    >
                      Result
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Console Content Area */}
            {showConsole && (
              <div className="flex-1 overflow-y-auto p-4 bg-[#0A0A0A] font-mono text-[11px] scrollbar-hide">
                {loading && (
      <div className="h-full flex flex-col items-center justify-center gap-3 py-8 text-slate-400 animate-in fade-in duration-200">
        <span className="loading loading-spinner loading-md text-indigo-500"></span>
        <span className="text-xs uppercase tracking-widest font-mono text-slate-500 animate-pulse">
          Executing Code & Running Testcases...
        </span>
      </div>
    )}
                {activeBottomTab === 'testcase' && runResult && (
                  <div className="flex flex-col h-full animate-in fade-in duration-300">
                    {/* Case Tabs */}
                    <div className="flex gap-2 mb-4 border-b border-white/5 pb-2">
                      {runResult.results?.map((res, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedCase(idx)}
                          className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all flex items-center gap-2 
            ${selectedCase === idx
                              ? 'bg-indigo-500/20 text-indigo-400 ring-1 ring-indigo-500/50'
                              : 'bg-[#1A1A1A] text-slate-500 hover:bg-[#252525]'}`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${res.status.id === 3 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          Case {idx + 1}
                        </button>
                      ))}
                    </div>

                    {/* Details for Selected Case */}
                    {runResult.results?.[selectedCase] && (
                      <div className="space-y-4">
                        <div className={`text-[10px] font-bold uppercase ${runResult.results[selectedCase].status.id === 3 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          Status: {runResult.results[selectedCase].status.description}
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <p className="text-slate-500 mb-1 text-[9px] uppercase font-bold tracking-wider">Input</p>
                            <div className="bg-[#1A1A1A] p-2 rounded border border-white/5 text-slate-300 font-mono">
                              {decodeBase64(runResult.results[selectedCase].stdin)}
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <p className="text-slate-500 mb-1 text-[9px] uppercase font-bold tracking-wider">Output</p>
                              <div className="bg-[#1A1A1A] p-2 rounded border border-white/5 text-emerald-400 font-mono">
                                {decodeBase64(runResult.results[selectedCase].stdout)}
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-slate-500 mb-1 text-[9px] uppercase font-bold tracking-wider">Expected</p>
                              <div className="bg-[#1A1A1A] p-2 rounded border border-white/5 text-slate-300 font-mono">
                                {decodeBase64(runResult.results[selectedCase].expected_output)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {activeBottomTab === 'result' && submitResult && (
                  <div className="h-full animate-in slide-in-from-bottom-4 duration-500">
                    {submitResult.accepted ? (
                      /* --- SUCCESS WINDOW --- */
                      <div className="max-w-2xl mx-auto py-6">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="bg-emerald-500/20 p-3 rounded-full">
                            <FiCheckCircle className="text-emerald-500" size={32} />
                          </div>
                          <div>
                            <h2 className="text-2xl font-black text-white">Accepted</h2>
                            <p className="text-emerald-500/80 text-[10px] uppercase tracking-[0.2em] font-bold">All Test Cases Passed Successfully</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-[#1A1A1A] border border-white/5 p-4 rounded-xl">
                            <p className="text-slate-500 text-[9px] uppercase mb-1 font-bold">Runtime</p>
                            <p className="text-white font-mono text-lg">{submitResult.runtime} <span className="text-xs text-slate-500">ms</span></p>
                          </div>
                          <div className="bg-[#1A1A1A] border border-white/5 p-4 rounded-xl">
                            <p className="text-slate-500 text-[9px] uppercase mb-1 font-bold">Memory</p>
                            <p className="text-white font-mono text-lg">{submitResult.memory} <span className="text-xs text-slate-500">KB</span></p>
                          </div>
                          <div className="bg-[#1A1A1A] border border-white/5 p-4 rounded-xl">
                            <p className="text-slate-500 text-[9px] uppercase mb-1 font-bold">Pass Rate</p>
                            <p className="text-white font-mono text-lg">100%</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* --- REJECTED / ERROR WINDOW (GFG Style) --- */
                      <div className="max-w-2xl mx-auto py-4">
                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl overflow-hidden">
                          <div className="bg-rose-500/20 px-4 py-2 border-b border-rose-500/20 flex justify-between items-center">
                            <span className="text-rose-500 font-black text-xs uppercase tracking-widest">Submission Failed</span>
                            <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold">
                              {submitResult.passedCases} / {submitResult.totalCases} Passed
                            </span>
                          </div>

                          <div className="p-5">
                            <h3 className="text-rose-400 text-sm font-bold mb-2">Error Message:</h3>
                            <div className="bg-black/40 rounded-lg p-4 font-mono text-rose-200/70 text-xs border border-white/5 whitespace-pre-wrap">
                              {submitResult.errorMessage}
                              {submitResult.compileOutput && (
                                <div className="mt-4 pt-4 border-t border-white/5 text-slate-400">
                                  <p className="text-rose-400 mb-2 font-bold uppercase text-[9px]">Compile Output:</p>
                                  {submitResult.compileOutput}
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => setActiveLeftTab('description')}
                              className="mt-4 text-[10px] font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1 uppercase"
                            >
                              <FiBookOpen size={12} /> Review problem description
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      </div>
      {/* SUBMISSION DETAIL MODAL (Enhanced Design) */}
      {viewingSubmission && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-[6px] p-4 animate-in fade-in duration-300"
          onClick={() => setViewingSubmission(null)}
        >
          <div
            className="bg-[#0D0D0D] border border-white/10 w-full max-w-4xl max-h-[85vh] rounded-3xl flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all scale-in-center"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#161616]/80">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.2em] mb-1">
                    Submission Details
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${viewingSubmission.status === 'accepted' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                    <h3 className="text-white font-bold text-sm uppercase tracking-tight">
                      {viewingSubmission.language} Implementation
                    </h3>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Copy Button */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(viewingSubmission.code);
                    // Optional: Add a "Copied" toast logic here
                  }}
                  className="flex items-center gap-2 text-[10px] font-bold text-slate-300 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10"
                >
                  <FiCode size={14} />
                  COPY CODE
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setViewingSubmission(null)}
                  className="p-2 hover:bg-rose-500/20 hover:text-rose-500 rounded-full text-slate-500 transition-all"
                >
                  <FiChevronLeft size={24} className="rotate-180" /> {/* Or FiX if imported */}
                </button>
              </div>
            </div>

            {/* Modal Body - Code Editor Style */}
            <div className="flex-1 overflow-auto bg-[#050505] p-2 custom-scrollbar">
              <div className="relative group">
                {/* Line numbers effect placeholder */}
                <div className="absolute left-0 top-0 w-12 h-full bg-[#080808] border-r border-white/5 flex flex-col items-center pt-6 text-[10px] text-slate-700 font-mono select-none">
                  {viewingSubmission.code?.split('\n').map((_, i) => (
                    <span key={i} className="leading-6">{i + 1}</span>
                  ))}
                </div>

                <pre className="pl-16 pr-6 py-6 text-[13px] font-mono leading-6 text-emerald-400/90 whitespace-pre overflow-x-auto">
                  <code>{viewingSubmission.code || "// No code available"}</code>
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-white/5 bg-[#161616]/50 flex justify-between items-center text-[10px] font-medium text-slate-500 uppercase tracking-widest">
              <span>Submitted on {new Date(viewingSubmission.createdAt).toLocaleDateString()}</span>
              <div className="flex gap-4">
                <span>Runtime: <b className="text-slate-300">{viewingSubmission.runtime || 0}ms</b></span>
                <span>Memory: <b className="text-slate-300">{viewingSubmission.memory || 0}KB</b></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemPage;