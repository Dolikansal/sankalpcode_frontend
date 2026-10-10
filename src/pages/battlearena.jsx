import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Editor from '@monaco-editor/react';
import Editorial from '../components/edit.jsx';
import { toast } from 'react-toastify';
import axiosclient from "../utils/axiosclient";
import io from 'socket.io-client';
import { socket } from '../socket'; // ✅ Central socket instance import karein
import {
  FiChevronLeft, FiPlay, FiSend, FiTerminal,
  FiFileText, FiCode, FiAward, FiZap, FiLogOut
} from 'react-icons/fi';

const SOCKET_SERVER_URL = "http://localhost:3001"; // Socket Server Port
// Helper function to decode Base64 strings safely
const decodeBase64 = (str) => {
  if (!str) return "";
  try {
    return atob(str);
  } catch (e) {
    return str;
  }
};
const BattleArenaPage = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const socketRef = useRef(null);

  const initialRoom = location.state?.room || null;
  const initialProblem = location.state?.problem || null;

  const [roomCode, setRoomCode] = useState(initialRoom?.roomCode || '');
  const [problem, setProblem] = useState(initialProblem);
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [winnerInfo, setWinnerInfo] = useState(null);

  // UI Panels
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeBottomTab, setActiveBottomTab] = useState('testcase');
  const [showConsole, setShowConsole] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);

  const langConfig = {
    javascript: { monaco: 'javascript' },
    java: { monaco: 'java' },
    cpp: { monaco: 'cpp' }
  };

  const getBoilerplate = (startCodeArr, lang) => {
    if (!startCodeArr || !Array.isArray(startCodeArr)) return '';
    const matched = startCodeArr.find(sc => {
      const dbLang = sc.language?.toLowerCase().trim();
      const curr = lang.toLowerCase().trim();
      if (curr === 'cpp') return dbLang === 'cpp' || dbLang === 'c++';
      return dbLang === curr;
    });
    return matched ? (matched.initialcode || matched.initialCode) : '';
  };

  useEffect(() => {
    socketRef.current = socket;
    if (!roomCode) return;
  
    if (!socket.connected) {
      socket.connect();
    }
  
    // Socket join event
    socket.emit('join_room', {
      roomCode,
      user: { userId: user?._id || user?.id, username: user?.firstname }
    });
  
    const handleMatchClosed = ({ message }) => {
      console.log("🔴 MATCH CLOSED EVENT RECEIVED:", message);
      toast.warn(message || 'Match closed!');
      navigate('/battle-mode', { replace: true });
    };
  
    const handleBattleStarted = ({ problem: fetchedProblem }) => {
      if (fetchedProblem) setProblem(fetchedProblem);
    };
    const handleBattleOver = ({ winnerId, message, betAmount }) => {
      setWinnerInfo({
        winnerId,
        message: message || "Match Over! Problem Solved.",
        betAmount
      });

      toast.success(message || "Match Ended!");

      // Redirection buffer (taaki socket backend room safely clean kar paaye)
      setTimeout(() => {
        navigate('/battle-mode', { replace: true });
      }, 2000);
    };
    // Safe Listener Registration
    socket.off('match_closed').on('match_closed', handleMatchClosed);
    socket.off('battle_started').on('battle_started', handleBattleStarted);
    socket.off('battle_over').on('battle_over', handleBattleOver);
  
    return () => {
      socket.off('match_closed', handleMatchClosed);
      socket.off('battle_started', handleBattleStarted);
      socket.off('battle_over', handleBattleOver);
    };
  }, [roomCode, user, navigate]); // ONLY roomCode in dependency array!
  // Manual Exit Function
  const handleExitMatch = () => {
    if (window.confirm("Kya aap match exit karna chahte hain? Match end ho jayega.")) {
      const activeSocket = socketRef.current || socket;
      if (activeSocket && roomCode) {
        activeSocket.emit('leave_room', {
          roomCode: roomCode,
          userId: user?._id || user?.id || user?.userId
        });
      }
      navigate('/battle-mode', { replace: true });
    }
  };

  // Set Boilerplate Code
  useEffect(() => {
    if (problem) {
      const startArr = problem.startcode || problem.startCode || [];
      const bp = getBoilerplate(startArr, selectedLanguage);
      setCode(bp || `// Write your ${selectedLanguage} solution here...`);
    }
  }, [problem, selectedLanguage]);


 // Run Code Fix
 const handleRun = async () => {
  if (!problem?._id) return;
  setLoading(true);
  setShowConsole(true);
  setActiveBottomTab('testcase');
  setRunResult(null);
  try {
    const res = await axiosclient.post(`/submission/runcode/${problem._id}`, { code, language: selectedLanguage });
    
    const rawData = res.data;

    if (rawData?.results && rawData.results.length > 0) {
      const parsedResults = rawData.results.map((item, index) => ({
        caseNo: index + 1,
        status: item.status?.description || (item.status_id === 3 ? "Accepted" : "Wrong Answer"),
        input: decodeBase64(item.stdin),
        output: decodeBase64(item.stdout),
        expected: decodeBase64(item.expected_output),
        stderr: decodeBase64(item.stderr),
        compile_output: decodeBase64(item.compile_output),
        runtime: item.time,
        memory: item.memory
      }));

      setRunResult({ cases: parsedResults });
    } else {
      setRunResult(rawData);
    }
  } catch (err) {
    setRunResult({ error: "Code Execution Failed" });
  } finally {
    setLoading(false);
  }
};

 // Submit Code Fix
 const handleSubmitCode = async () => {
  if (!problem?._id) return;
  setLoading(true);
  setShowConsole(true);
  setActiveBottomTab('result');
  setSubmitResult(null);

  try {
    const res = await axiosclient.post(`/submission/submit/${problem._id}`, {
      code,
      language: selectedLanguage
    });

    const data = res.data;
    
    // Checking all possible success flags from backend
    const isAccepted = 
      data.status === 'accepted' || 
      data.status?.id === 3 || 
      data.success === true ||
      data.isPassed === true ||
      data.passRate === 100 ||
      (data.passedCount !== undefined && data.totalTestCases !== undefined && data.passedCount === data.totalTestCases);

    const passedCount = data.passedCount ?? data.passedCases ?? (isAccepted ? (data.totalTestCases || 1) : 0);
    const totalCases = data.totalTestCases ?? data.totalCases ?? 1;

    setSubmitResult({
      accepted: isAccepted,
      passedCases: passedCount,
      totalCases: totalCases,
      runtime: data.runtime || data.time || "0.003 ms",
      memory: data.memory || "1032 KB",
      errorMessage: data.errorMessage || data.message || "Wrong Answer / Testcases Failed"
    });

    // ✅ SAFE SOCKET RESOLUTION (No functionality loss)
    const activeSocket = socketRef.current || socket;
    const currentUserId = user?._id || user?.id || user?.userId;

    if (activeSocket && roomCode) {
      console.log("Emitting submit_solution event...", { roomCode, isAccepted, currentUserId });
      activeSocket.emit('submit_solution', {
        roomCode: roomCode,
        userId: currentUserId,
        isPassed: isAccepted,
        passedCases: passedCount,
        totalCases: totalCases
      });
    } else {
      console.error("Socket or RoomCode missing during submission!", { 
        roomCode, 
        hasSocketRef: !!socketRef.current,
        hasSocketImport: !!socket 
      });
    }

  } catch (err) {
    console.error("Submission Error:", err);
    setSubmitResult({
      accepted: false,
      errorMessage: err.response?.data?.message || "Server Error during submission"
    });
  } finally {
    setLoading(false);
  }
};
  const testCasesList = problem?.visibletestcase || problem?.visibleTestCases || [];

  return (
    <div className="h-screen flex flex-col bg-[#0A0A0A] text-slate-300 font-sans overflow-hidden">
      
      {/* NAVBAR */}
      <nav className="h-12 border-b border-white/5 bg-[#111] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={handleExitMatch} className="flex items-center gap-2 text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-md text-xs font-bold transition-all">
            <FiLogOut size={14} /> Exit Match
          </button>
          <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
            <FiZap className="text-indigo-400 animate-pulse" size={12} />
            <span className="text-xs font-bold text-indigo-300">Room: {roomCode}</span>
          </div>
        </div>

        {winnerInfo && (
          <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-4 py-1 rounded-full text-xs font-black flex items-center gap-2 animate-bounce">
            <FiAward /> {winnerInfo.message}
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={handleRun} disabled={loading || !!winnerInfo} className="btn btn-xs bg-[#1A1A1A] hover:bg-[#252525] text-slate-300 gap-2 border-white/10">
            <FiPlay size={12} className="text-emerald-500" /> Run
          </button>
          <button onClick={handleSubmitCode} disabled={loading || !!winnerInfo} className="btn btn-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold gap-2 border-none">
            <FiSend size={12} /> Submit
          </button>
        </div>
      </nav>

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex overflow-hidden p-2 gap-2">

        {/* LEFT PANEL: PROBLEM DETAILS */}
        <div className="w-[45%] bg-[#111] border border-white/5 rounded-xl flex flex-col overflow-hidden">
          <div className="flex bg-[#1A1A1A] p-1 gap-1">
            <button onClick={() => setActiveLeftTab('description')} className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold ${activeLeftTab === 'description' ? 'bg-[#252525] text-white' : 'text-slate-500'}`}>
              <FiFileText className="inline mr-1" /> Description
            </button>
            <button onClick={() => setActiveLeftTab('editorial')} className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold ${activeLeftTab === 'editorial' ? 'bg-[#252525] text-white' : 'text-slate-500'}`}>
              Editorial
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {problem ? (
              activeLeftTab === 'description' ? (
                <>
                  <h1 className="text-xl font-bold text-white mb-2">{problem.title}</h1>
                  <div className="flex gap-2 mb-6">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase border text-emerald-400 border-emerald-500/20 bg-emerald-500/10">
                      {problem.difficulty || 'Medium'}
                    </span>
                    {problem.tags && <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-400 border border-white/5">{problem.tags}</span>}
                  </div>

                  <div className="text-sm text-slate-300 whitespace-pre-wrap mb-6 leading-relaxed">
                    {problem.description}
                  </div>

                  <div className="space-y-4">
                    {testCasesList.map((ex, i) => (
                      <div key={i} className="space-y-1">
                        <p className="text-xs font-bold text-slate-400">Example {i + 1}:</p>
                        <div className="bg-[#0A0A0A] border-l-2 border-indigo-500 p-3 rounded-r font-mono text-xs space-y-1">
                          <p><span className="text-slate-500">Input:</span> {ex.input}</p>
                          <p><span className="text-slate-500">Output:</span> {ex.output}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <Editorial secureurl={problem.secureurl} thumbnail={problem.thumbnail} duration={problem.duration} editorial={problem.editorial} />
              )
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 font-mono text-xs">
                Fetching Problem Statement from MongoDB...
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: SINGLE USER WORKSTATION */}
        <div className="flex-1 flex flex-col gap-2 overflow-hidden">
          
          <div className="flex-1 bg-[#111] border border-white/5 rounded-xl flex flex-col overflow-hidden">
            <div className="h-9 bg-[#1A1A1A] border-b border-white/5 flex items-center justify-between px-4">
              <span className="text-xs font-bold text-indigo-400 flex items-center gap-2">
                <FiCode /> Your Code Workstation
              </span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-transparent text-[11px] font-bold text-slate-300 outline-none"
              >
                <option value="cpp">C++</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
              </select>
            </div>
            <div className="flex-1 overflow-hidden">
              <Editor
                theme="vs-dark"
                language={langConfig[selectedLanguage].monaco}
                value={code}
                onChange={(v) => setCode(v || '')}
                options={{ fontSize: 13, minimap: { enabled: false }, automaticLayout: true }}
              />
            </div>
          </div>

          {/* CONSOLE OUTPUT */}
          <div className={`bg-[#111] border border-white/5 rounded-xl flex flex-col overflow-hidden transition-all ${showConsole ? 'h-48' : 'h-9'}`}>
            <div className="h-9 bg-[#1A1A1A] flex items-center justify-between px-4 shrink-0 border-b border-white/5">
              <button onClick={() => setShowConsole(!showConsole)} className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2">
                <FiTerminal /> Output Console
              </button>
            </div>

            {showConsole && (
  <div className="flex-1 p-4 bg-[#0A0A0A] font-mono text-xs overflow-y-auto">
    {loading && <div className="text-slate-400 animate-pulse">Executing Code...</div>}

    {/* RUN CODE RESULT DISPLAY */}
    {activeBottomTab === 'testcase' && runResult && (
      <div>
        {runResult.cases ? (
          runResult.cases.map((c) => (
            <div key={c.caseNo} className="mb-4 bg-[#111] p-3 rounded-lg border border-white/5 space-y-2">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="font-bold text-white">Case {c.caseNo}</span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${c.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                  Status: {c.status}
                </span>
              </div>

              {c.input && (
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Input</span>
                  <div className="text-slate-300 bg-[#0A0A0A] p-1.5 rounded">{c.input}</div>
                </div>
              )}

              {c.output && (
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Output</span>
                  <div className="text-emerald-400 bg-[#0A0A0A] p-1.5 rounded">{c.output}</div>
                </div>
              )}

              {c.expected && (
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Expected</span>
                  <div className="text-indigo-400 bg-[#0A0A0A] p-1.5 rounded">{c.expected}</div>
                </div>
              )}

              {c.compile_output && (
                <div>
                  <span className="text-rose-400 text-[10px] uppercase font-bold block">Compilation Error</span>
                  <pre className="text-rose-400 bg-[#0A0A0A] p-1.5 rounded whitespace-pre-wrap">{c.compile_output}</pre>
                </div>
              )}
            </div>
          ))
        ) : (
          <pre className="text-slate-300">{JSON.stringify(runResult, null, 2)}</pre>
        )}
      </div>
    )}

    {/* SUBMIT CODE RESULT DISPLAY */}
    {activeBottomTab === 'result' && submitResult && (
      <div className="space-y-2 bg-[#111] p-4 rounded-lg border border-white/5">
        <div className={`font-black text-sm uppercase flex items-center gap-2 ${submitResult.accepted ? 'text-emerald-400' : 'text-rose-400'}`}>
          {submitResult.accepted ? 'Accepted' : 'Wrong Answer / Error'}
        </div>

        {submitResult.accepted ? (
          <div className="space-y-1 text-slate-300">
            <p className="text-emerald-400 font-bold">All Test Cases Passed Successfully</p>
            <div className="flex gap-4 text-[11px] text-slate-400 pt-2 border-t border-white/5">
              <p>Runtime: <span className="text-white font-bold">{submitResult.runtime}</span></p>
              <p>Memory: <span className="text-white font-bold">{submitResult.memory}</span></p>
              <p>Pass Rate: <span className="text-emerald-400 font-bold">100%</span></p>
            </div>
          </div>
        ) : (
          <div className="text-rose-400 text-xs">
            <p>{submitResult.errorMessage}</p>
            <p className="text-slate-500 text-[11px] mt-1">
              Passed: {submitResult.passedCases} / {submitResult.totalCases} testcases
            </p>
          </div>
        )}
      </div>
    )}
  </div>
)}
          </div>

        </div>

      </div>
    </div>
  );
};

export default BattleArenaPage;