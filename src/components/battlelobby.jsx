import React, { useState, useEffect } from 'react';
import { useNavigate , Link , NavLink } from 'react-router';
import { socket } from '../socket';
import { Sparkles } from 'lucide-react';

const BattleModePage = ({ user, onBattleStart }) => {
  const navigate = useNavigate();
  const [view, setView] = useState('MAIN'); // 'MAIN', 'CREATE', 'JOIN', 'WAITING'
  const [betAmount, setBetAmount] = useState(20);
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [activeRoom, setActiveRoom] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
 const [isMenuOpen, setIsMenuOpen] = useState(false);
    
  const userBalance = user?.points ?? 1000;

  // 1. User Log Check
  useEffect(() => {
    if (user) {
      console.log("Current User in BattleModePage:", user);
    }
  }, [user?._id || user?.id]);

  // 2. Socket Listeners & Safe Cleanup Lifecycle
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const handleRoomCreated = (room) => {
      setActiveRoom(room);
      setView('WAITING');
      setErrorMessage('');
    };

    const handlePlayerJoined = (room) => {
      setActiveRoom(room);
      setView('WAITING'); // FIX: Guest player ko bhi waiting view par shift karna zaroori hai
      setErrorMessage('');
    };

    const handleBattleStarted = ({ room, problem }) => {
      if (onBattleStart) {
        onBattleStart({ room, problem });
      } else {
        navigate('/battle-arena', { state: { room, problem, user } });
      }
    };

    const handleErrorMessage = (msg) => {
      setErrorMessage(msg);
    };

    socket.on('room_created', handleRoomCreated);
    socket.on('player_joined', handlePlayerJoined);
    socket.on('battle_started', handleBattleStarted);
    socket.on('error_message', handleErrorMessage);

    // FIX: Clean ONLY listeners on unmount. DO NOT call socket.disconnect()!
    return () => {
      socket.off('room_created', handleRoomCreated);
      socket.off('player_joined', handlePlayerJoined);
      socket.off('battle_started', handleBattleStarted);
      socket.off('error_message', handleErrorMessage);
    };
  }, [navigate, onBattleStart, user]);

  // Helper function to handle leaving room
  const handleLeaveRoom = () => {
    if (activeRoom) {
      socket.emit('leave_room', { 
        roomCode: activeRoom.roomCode, 
        userId: user?._id || user?.id 
      });
      setActiveRoom(null);
    }
    setErrorMessage('');
    setView('MAIN');
  };

  const handleCreateRoom = () => {
    const uId = user?._id || user?.id;
    if (!uId) {
      setErrorMessage('User session missing! Please log in again.');
      return;
    }
    const numBet = Number(betAmount);
    if (isNaN(numBet) || numBet <= 0) {
      setErrorMessage('Please enter a valid amount of coins!');
      return;
    }
    if (numBet < 10) {
      setErrorMessage('Minimum bet amount is 10 coins!');
      return;
    }
    if (userBalance < numBet) {
      setErrorMessage(`Insufficient coins! You have ${userBalance} coins.`);
      return;
    }

    socket.emit('create_room', { 
      user: { userId: uId, firstName: user?.firstName }, 
      betAmount: numBet 
    });
  };

  const handleJoinRoom = () => {
    const uId = user?._id || user?.id;
    if (!uId) {
      setErrorMessage('User session missing! Please log in again.');
      return;
    }
    if (!roomCodeInput.trim()) {
      setErrorMessage('Please enter a valid Room OTP!');
      return;
    }

    socket.emit('join_room', { 
      roomCode: roomCodeInput.trim(), 
      user: { userId: uId, firstName: user?.firstName } 
    });
  };

  const handleStartGame = () => {
    if (activeRoom) {
      socket.emit('start_battle', { roomCode: activeRoom.roomCode });
    }
  };

  return (
    <div>
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
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      {/* Background Animated Glow Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/15 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Glassmorphic Card */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.6)] relative z-10 transition-all">
        
        {/* Gaming Header Banner */}
        <div className="text-center mb-8 relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400 mb-3 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            LIVE 1v1 ARENA
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            CODE BATTLE
          </h2>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/40 text-red-300 text-sm p-3.5 rounded-xl mb-6 text-center animate-shake flex items-center justify-center gap-2 shadow-inner">
            <span>⚠️</span> {errorMessage}
          </div>
        )}

        {/* VIEW 1: MAIN SELECTION */}
        {view === 'MAIN' && (
          <div className="space-y-4">
            <button
              onClick={() => {
                setErrorMessage('');
                setView('CREATE');
              }}
              className="group relative w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 rounded-2xl font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(79,70,229,0.35)] transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-between"
            >
              <span className="flex items-center gap-3">
                <span className="text-xl">⚔️</span>
                <span>Create Battle Room</span>
              </span>
              <span className="text-indigo-200 group-hover:translate-x-1 transition-transform">➔</span>
            </button>

            <button
              onClick={() => {
                setErrorMessage('');
                setView('JOIN');
              }}
              className="group relative w-full py-4 px-6 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-between shadow-md"
            >
              <span className="flex items-center gap-3">
                <span className="text-xl">🔑</span>
                <span>Join with Room OTP</span>
              </span>
              <span className="text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-transform">➔</span>
            </button>

            <button
              onClick={() => {
                handleLeaveRoom();
                navigate('/');
              }}
              className="w-full pt-2 text-slate-500 hover:text-slate-300 text-xs font-semibold tracking-wider hover:underline text-center block transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        )}

        {/* VIEW 2: CREATE ROOM */}
        {view === 'CREATE' && (
          <div className="space-y-6">
            <div className="bg-slate-950/70 border border-slate-800/90 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Enter Bet Coins:
                </label>
                <span className="text-[10px] text-slate-400 font-medium">
                  Min: 10 | Max: {userBalance}
                </span>
              </div>

              <div className="relative flex items-center">
                <span className="absolute left-4 text-2xl">🪙</span>
                
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={betAmount === '' ? '' : betAmount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    if (val === '') {
                      setBetAmount('');
                    } else {
                      const cleanNum = parseInt(val, 10);
                      setBetAmount(cleanNum);
                    }
                  }}
                  onBlur={() => {
                    if (betAmount === '' || Number(betAmount) < 10) {
                      setBetAmount(10);
                    } else if (Number(betAmount) > userBalance) {
                      setBetAmount(userBalance);
                    }
                  }}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl py-3.5 pl-14 pr-10 text-2xl font-extrabold text-amber-400 focus:outline-none focus:border-amber-400/90 focus:ring-2 focus:ring-amber-400/20 transition-all font-mono"
                  placeholder="50"
                />

                {betAmount !== '' && (
                  <button
                    type="button"
                    onClick={() => setBetAmount('')}
                    className="absolute right-3.5 text-slate-500 hover:text-slate-200 text-xs font-bold bg-slate-800 hover:bg-slate-700 w-6 h-6 rounded-full flex items-center justify-center transition-all"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                {[25, 50, 100, 250].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setBetAmount(preset)}
                    className={`flex-1 py-2 rounded-xl text-xs font-extrabold border transition-all duration-200 ${
                      Number(betAmount) === preset
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    +{preset}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setBetAmount(userBalance)}
                  className="py-2 px-3 rounded-xl text-xs font-extrabold bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30 transition-all shadow-inner"
                >
                  MAX
                </button>
              </div>
            </div>

            <button
              onClick={handleCreateRoom}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.35)] transform hover:scale-[1.01]"
            >
              Generate Room OTP
            </button>

            <button
              onClick={handleLeaveRoom}
              className="w-full text-slate-500 hover:text-slate-300 text-xs font-semibold tracking-wider text-center block transition-colors"
            >
              ← Cancel
            </button>
          </div>
        )}

        {/* VIEW 3: JOIN ROOM */}
        {view === 'JOIN' && (
          <div className="space-y-6">
            <div className="bg-slate-950/70 border border-slate-800/90 p-5 rounded-2xl space-y-3">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Room OTP Code:
              </label>
              <input
                type="text"
                maxLength={6}
                value={roomCodeInput}
                onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                placeholder="6-DIGIT OTP"
                className="w-full text-center text-3xl font-mono font-extrabold tracking-widest py-3.5 bg-slate-900 border border-slate-700 rounded-xl text-cyan-400 focus:outline-none focus:border-cyan-400 uppercase transition-all shadow-inner"
              />
            </div>

            <button
              onClick={handleJoinRoom}
              className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl transition-all duration-200 shadow-[0_0_20px_rgba(6,182,212,0.35)] transform hover:scale-[1.01]"
            >
              Join Room Now
            </button>

            <button
              onClick={handleLeaveRoom}
              className="w-full text-slate-500 hover:text-slate-300 text-xs font-semibold tracking-wider text-center block transition-colors"
            >
              ← Cancel
            </button>
          </div>
        )}

        {/* VIEW 4: WAITING LOUNGE */}
        {view === 'WAITING' && activeRoom && (
          <div className="space-y-6 text-center">
            <div className="bg-slate-950/80 border border-amber-500/30 p-6 rounded-2xl relative overflow-hidden shadow-inner">
              <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase rounded-bl-xl border-l border-b border-amber-500/30">
                Prize Pool: {(activeRoom.betAmount * 2).toLocaleString()} Coins
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Share this OTP Code:</p>
              <p className="text-4xl sm:text-5xl font-mono font-black text-amber-400 tracking-widest selection:bg-amber-400 selection:text-black">
                {activeRoom.roomCode}
              </p>
            </div>

            <div className="space-y-3 bg-slate-950/40 p-4 rounded-2xl text-left border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Host</span>
                <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-indigo-300">{activeRoom.host?.firstName || 'Host'}</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">READY</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Opponent</span>
                {activeRoom.guest ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-indigo-300">{activeRoom.guest?.firstName || 'Opponent'}</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">JOINED</span>
                  </div>
                ) : (
                  <span className="text-xs text-amber-400 animate-pulse font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    Waiting for player...
                  </span>
                )}
              </div>
            </div>

            {/* Leave / Cancel Button in Waiting Screen */}
            <button
              onClick={handleLeaveRoom}
              className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase rounded-xl transition-all"
            >
              Exit Battle Lounge
            </button>

            {/* Start Button */}
            {String(activeRoom.host?.userId || activeRoom.host?._id) === String(user?._id || user?.id) && (
              <button
                disabled={!activeRoom.guest}
                onClick={handleStartGame}
                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 ${
                  activeRoom.guest
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)] transform hover:scale-[1.01]'
                    : 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700/60'
                }`}
              >
                🚀 Start Battle Match
              </button>
            )}

            {String(activeRoom.guest?.userId || activeRoom.guest?._id) === String(user?._id || user?.id) && (
              <p className="text-xs text-amber-400 font-bold animate-pulse tracking-wide">
                ⏳ Host will start the match shortly...
              </p>
            )}
          </div>
        )}

      </div>
    </div></div>
  );
};

export default BattleModePage;