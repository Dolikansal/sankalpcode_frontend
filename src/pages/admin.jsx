import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  ShieldCheck,
  ChevronRight,
  LayoutDashboard,
  Database,
  LogOut,
  User,
  ChevronDown,
  Video,
  Terminal,
  Shield,
  Code2,
  Sparkles,
  Cpu,
  BarChart3
} from 'lucide-react';
import { NavLink } from 'react-router';
import { logoutuser } from '../authslice';
import ProblemTopicChart from '../components/problemchart';
function Admin() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handlelogout = () => {
    dispatch(logoutuser());
    setsolvedproblem([]);
  };

  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Architect new coding challenges with strict constraints and test case suites.',
      icon: <Plus size={22} />,
      badge: 'Creation',
      bgAccent: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      borderAccent: 'hover:border-indigo-500/40',
      btnStyle: 'hover:bg-indigo-600 hover:border-indigo-500 text-slate-200',
      route: '/admin/create'
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Refine problem descriptions, adjust time limits, or append test scenarios.',
      icon: <Edit size={22} />,
      badge: 'Editor',
      bgAccent: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      borderAccent: 'hover:border-blue-500/40',
      btnStyle: 'hover:bg-blue-600 hover:border-blue-500 text-slate-200',
      route: '/admin/update'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Safely decommission obsolete challenges and clean production datasets.',
      icon: <Trash2 size={22} />,
      badge: 'Danger',
      bgAccent: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      borderAccent: 'hover:border-rose-500/40',
      btnStyle: 'hover:bg-rose-600 hover:border-rose-500 text-slate-200',
      route: '/admin/delete'
    },
    {
      id: 'video',
      title: 'Video Solutions',
      description: 'Upload, manage, and attach video walkthroughs directly to problems.',
      icon: <Video size={22} />,
      badge: 'Media',
      bgAccent: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      borderAccent: 'hover:border-amber-500/40',
      btnStyle: 'hover:bg-amber-600 hover:border-amber-500 text-slate-200',
      route: '/admin/video'
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#090d16] text-slate-300 font-sans antialiased selection:bg-indigo-500/30">

      {/* Sidebar */}
      <aside className="w-64 bg-[#0d1322]/80 border-r border-slate-800/80 backdrop-blur-xl flex-col hidden md:flex sticky top-0 h-screen z-30">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800/60">
          <div className="h-10 w-10 bg-indigo-600/20 border border-indigo-500/30 rounded-xl flex items-center justify-center text-indigo-400 font-bold shadow-[0_0_20px_rgba(99,102,241,0.25)]">
            <Sparkles size={20} className="text-indigo-400" />
          </div>
          <NavLink to="/" className="text-xl font-black tracking-tight text-white flex items-center gap-1">
            SANKALP<span className="text-indigo-400">CODE</span>
          </NavLink>
        </div>

        <div className="px-4 py-5 flex-1">
          <p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase px-3 mb-2">Management</p>
          <nav className="space-y-1.5">
            <NavLink
              to="/admin"
              className={({ isActive }) => `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                  ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/admin/analytics"
              className={({ isActive }) => `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                  ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
            >
              <BarChart3 size={18} />
              <span>Analytics</span>
            </NavLink>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800/60 bg-[#0a0f1d]/50">
          <div className="flex items-center justify-between px-2 py-1 text-xs text-slate-500">
            <span>Terminal</span>
            <span className="font-mono text-indigo-400">v3.4.0</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="h-16 bg-[#090d16]/80 border-b border-slate-800/80 backdrop-blur-md flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-500">
            <span className="text-slate-400">Admin</span>
            <ChevronRight size={14} className="text-slate-600" />
            <span className="text-indigo-300 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">Control Center</span>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2.5 bg-slate-900/90 border border-slate-800/90 py-1.5 px-3 rounded-xl hover:border-indigo-500/40 hover:bg-slate-800/50 transition-all active:scale-95"
            >
              <div className="h-7 w-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
                <User size={15} />
              </div>
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Admin</span>
              <ChevronDown size={14} className={`text-slate-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-[#0e1626] border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <button className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-slate-300 hover:bg-indigo-500/10 hover:text-indigo-300 rounded-lg transition-colors">
                  <User size={15} /> Profile Info
                </button>
                <div className="h-[1px] bg-slate-800/80 my-1 mx-1"></div>
                <button onClick={handlelogout} className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                  <LogOut size={15} /> Log Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Dashboard Workspace */}
        <div className="p-6 md:p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-8">

          {/* Header Description */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/50">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Console</span>
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Manage problem statements, algorithms, and media solutions for SankalpCode.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl text-xs font-mono text-indigo-300">
              <Code2 size={14} />
              <span>Workspace: Coding Engine</span>
            </div>
          </div>

          {/* Contextual Badges Bar (Realistic & Operational) */}
          <div className="bg-[#0e1626]/60 border border-slate-800/80 rounded-2xl p-5 md:p-6 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
                  Admin Control Center
                </h2>
                <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  Real-time telemetry, database audit logging, and core access controls are actively running under production protocols.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                All Systems Operational
              </div>
            </div>
          </div>

          {/* Action Modules */}
          <div className="space-y-4">
            <h2 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Management Modules</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {adminOptions.map((option) => (
                <div
                  key={option.id}
                  className={`group relative bg-[#0e1626]/50 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 ${option.borderAccent}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${option.bgAccent} transition-transform duration-300 group-hover:scale-105`}>
                        {option.icon}
                      </div>
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400">
                        {option.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2 tracking-tight group-hover:text-indigo-300 transition-colors">
                      {option.title}
                    </h3>

                    <p className="text-slate-400 text-xs leading-relaxed mb-6">
                      {option.description}
                    </p>
                  </div>

                  <NavLink
                    to={option.route}
                    className={`w-full py-2.5 px-4 rounded-xl bg-slate-900/90 border border-slate-800 font-semibold text-xs flex items-center justify-between ${option.btnStyle} transition-all duration-200 group/btn`}
                  >
                    <span>Open Module</span>
                    <ChevronRight size={14} className="text-slate-500 group-hover/btn:text-white group-hover/btn:translate-x-0.5 transition-transform" />
                  </NavLink>
                </div>
              ))}
            </div>
          </div>

          {/* Security Banner */}
          <div className="p-6 bg-gradient-to-r from-indigo-950/20 via-[#0e1626]/80 to-slate-900/40 border border-indigo-500/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <ShieldCheck size={24} className="text-indigo-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">Security & Change Control</h4>
                <p className="text-slate-400 text-xs mt-0.5">Problem set modifications and file uploads are tagged with admin credentials.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono text-indigo-300">
                Role: Authenticated
              </span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Admin;