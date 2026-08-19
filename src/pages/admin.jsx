import React, { useState } from 'react';
import { Plus, Edit, Trash2, ShieldCheck, ChevronRight, LayoutDashboard, Database, LogOut, User, ChevronDown , Video } from 'lucide-react';
import { NavLink } from 'react-router';

function Admin() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Architect a new coding challenge with precise constraints and test cases.',
      icon: <Plus size={22} />,
      accent: 'text-cyan-400',
      bgAccent: 'bg-cyan-500/10',
      route: '/admin/create'
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Refine problem logic, optimize descriptions, or update existing test data.',
      icon: <Edit size={22} />,
      accent: 'text-blue-400',
      bgAccent: 'bg-blue-500/10',
      route: '/admin/update'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Safely decommission and remove challenges from the production database.',
      icon: <Trash2 size={22} />,
      accent: 'text-rose-400',
      bgAccent: 'bg-rose-500/10',
      route: '/admin/delete'
    },
    {
      id: 'video',
      title: 'video solution of problems',
      description: 'Upload and Delete videos of problems.',
      icon: <Video size={22} />,
      accent: 'text-rose-400',
      bgAccent: 'bg-rose-500/10',
      route: '/admin/video'
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-300 font-sans antialiased">
      
      {/* Sidebar - Persistent Navigation */}
      <aside className="w-64 bg-[#0f172a]/50 border-r border-slate-800/50 backdrop-blur-xl flex flex-col hidden md:flex sticky top-0 h-screen">
        <div className="p-8 flex items-center gap-3">
          <div className="h-9 w-9 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          </div>
          {/* <span className="text-white font-bold tracking-tight text-xl">SankalpCode</span> */}
          <NavLink to="/" className="text-2xl font-bold text-primary tracking-tight">
                        SANKALP<span className="text-base-content">CODE</span>
                    </NavLink>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <NavLink 
            to="/admin" 
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-cyan-500/10 text-primary border border-priamry' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <LayoutDashboard size={18} />
            <span className="font-medium">Dashboard</span>
          </NavLink>

          <NavLink 
            to="/admin/problems" 
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-cyan-500/10 text-primary border border-primary' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <Database size={18} />
            <span className="font-medium">Problems</span>
          </NavLink>
        </nav>

        <div className="p-6 border-t border-slate-800/50 text-[10px] font-mono text-slate-600 uppercase tracking-widest text-center">
          Terminal v3.4.0 active
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 flex flex-col">
        
        {/* Header Bar */}
        <header className="h-20 bg-[#020617]/80 border-b border-slate-800/50 backdrop-blur-md flex items-center justify-between px-10 sticky top-0 z-50">
          <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
            <span className="hover:text-priamry cursor-pointer transition-colors">Admin</span>
            <ChevronRight size={14} />
            <span className="text-slate-100 font-semibold tracking-wide">Console</span>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 bg-slate-900 border border-slate-800 py-2 px-4 rounded-xl hover:border-slate-700 transition-all active:scale-95"
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-primary">
                <User size={18} />
              </div>
              <span className="text-sm font-bold text-slate-200 uppercase tracking-tight">Admin</span>
              <ChevronDown size={14} className={`text-slate-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in duration-200">
                <button className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 rounded-xl transition-colors">
                  <User size={16} /> Profile
                </button>
                <div className="h-[1px] bg-slate-800 my-1 mx-2"></div>
                <button className="flex items-center gap-3 w-full px-4 py-3 text-sm text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors">
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Dashboard Workspace */}
        <div className="p-10 max-w-7xl">
          <div className="mb-12">
            <h1 className="text-4xl font-black text-white mb-3 tracking-tighter">
              Admin <span className="text-primary uppercase">Dashboard</span>
            </h1>
            <p className="text-slate-500 max-w-2xl leading-relaxed">
              Platform status is <span className="text-green-500 font-mono">OPTIMAL</span>. Use the modules below to manage the core repository of SankalpCode challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {adminOptions.map((option) => (
              <div
                key={option.id}
                className="group relative bg-[#0f172a]/40 border border-slate-800 rounded-[2rem] p-1 transition-all duration-500 hover:border-cyan-500/30 overflow-hidden"
              >
                <div className="bg-[#020617]/60 rounded-[1.9rem] p-10 h-full flex flex-col backdrop-blur-sm">
                  {/* Icon Area */}
                  <div className={`${option.bgAccent} ${option.accent} w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border border-slate-800 group-hover:scale-110 transition-transform duration-500`}>
                    {option.icon}
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">
                    {option.title}
                  </h2>
                  
                  <p className="text-slate-500 text-sm mb-10 leading-relaxed">
                    {option.description}
                  </p>

                  <NavLink
                    to={option.route}
                    className="mt-auto flex items-center justify-between w-full py-4 px-6 rounded-2xl bg-slate-900 border border-slate-800 text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-primary hover:border-primary transition-all duration-300 group/btn"
                  >
                    Execute Module
                    <ChevronRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                  </NavLink>
                </div>
              </div>
            ))}
          </div>

          {/* Status Bar Card */}
          <div className="mt-12 p-8 bg-gradient-to-r from-cyan-900/20 to-blue-900/10 border border-cyan-500/10 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 bg-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-500/30 animate-pulse">
                <ShieldCheck size={32} className="text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">System Integrity: Secure</h3>
                <p className="text-slate-500 text-sm">All changes to the production database are logged and encrypted.</p>
              </div>
            </div>
            <div className="flex gap-4">
               <span className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-mono text-slate-400 tracking-tighter">
                 UPTIME: 100%
               </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Admin;