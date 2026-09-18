import React, { useEffect, useState, useMemo } from "react";
import { NavLink, Link } from "react-router";
import axiosclient from "../utils/axiosclient"; 
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import {
  Code2,
  Database,
  BarChart3,
  LayoutDashboard,
  Layers,
  Flame,
  Sparkles,
  FileCode2,
  ArrowUpRight,
  Home,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

// Sleek Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 px-4 py-3 rounded-xl shadow-2xl">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
          <p className="text-base font-bold text-white">
            {payload[0].value} <span className="text-xs font-normal text-slate-400">Problems</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function ProblemTopicChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosclient.get("/problem/topic-stats");
        const formatted = res.data.map((item) => ({
          topic: item._id,
          count: item.count
        }));
        setData(formatted);
      } catch (err) {
        console.error("Failed to load topic stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Top metric calculations
  const statsSummary = useMemo(() => {
    const total = data.reduce((acc, curr) => acc + curr.count, 0);
    const topCategory = data.length > 0 ? data[0].topic : "N/A";
    const topCount = data.length > 0 ? data[0].count : 0;
    return {
      total,
      categoriesCount: data.length,
      topCategory,
      topCount
    };
  }, [data]);

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      
      {/* ================= 1. TOP HEADER ================= */}
      <header className="sticky top-0 z-50 h-16 border-b border-slate-800/80 bg-[#0B0F19]/80 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800/60">
          <div className="h-10 w-10 bg-indigo-600/20 border border-indigo-500/30 rounded-xl flex items-center justify-center text-indigo-400 font-bold shadow-[0_0_20px_rgba(99,102,241,0.25)]">
            <Sparkles size={20} className="text-indigo-400" />
          </div>
          <NavLink to="/" className="text-xl font-black tracking-tight text-white flex items-center gap-1">
            SANKALP<span className="text-indigo-400">CODE</span>
          </NavLink>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-8 w-px bg-slate-800 mx-1 hidden sm:block"></div>

          <div className="flex items-center gap-2.5 pl-1">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 text-xs font-bold">
              <ShieldCheck size={16} />
            </div>
            <span className="text-xs font-semibold text-slate-300 hidden md:block">Root Admin</span>
          </div>
        </div>
      </header>

      {/* ================= BODY WRAPPER ================= */}
      <div className="flex flex-1 relative">
        
        {/* ================= 2. STICKY SIDEBAR ================= */}
        <aside className="w-64 border-r border-slate-800/80 bg-[#0B0F19]/50 backdrop-blur-lg p-4 hidden md:flex flex-col justify-between sticky top-16 h-[calc(100vh-4rem)]">
          <div className="space-y-1.5">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Management
            </p>


            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`
              }
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink> 
            
            <NavLink
              to="/admin/analytics"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`
              }
            >
              <BarChart3 size={18} />
              <span>Analytics</span>
            </NavLink>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>Sankalp v2.4</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          </div>
        </aside>

        {/* ================= 3. MAIN ANALYTICS VIEW ================= */}
        <main className="flex-1 p-5 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
          
          {/* Page Heading */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
              <span>Admin Console</span>
              <ChevronRight size={12} className="text-slate-600" />
              <span>Metrics & Charts</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Topic Analysis Overview
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Track problem population and topic distributions across SankalpCode.
            </p>
          </div>

          {/* ================= TOP 3 STAT CARDS ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            
            {/* Card 1: Total Uploaded */}
            

            {/* Card 2: Active Topics */}
            <div className="relative overflow-hidden bg-[#0B0F19] border border-slate-800/80 rounded-2xl p-5 shadow-lg group hover:border-cyan-500/40 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all"></div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
                  Active Topics
                </span>
                <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Layers size={18} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white tracking-tight">
                  {loading ? "..." : statsSummary.categoriesCount}
                </span>
                <span className="text-xs text-cyan-400 font-medium">Distinct Tags</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Arrays, DP, Graphs, etc.</p>
            </div>

            {/* Card 3: Top Category */}
            <div className="relative overflow-hidden bg-[#0B0F19] border border-slate-800/80 rounded-2xl p-5 shadow-lg group hover:border-rose-500/40 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-all"></div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
                  Dominant Topic
                </span>
                <div className="h-9 w-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <Flame size={18} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white truncate max-w-[180px]">
                  {loading ? "..." : statsSummary.topCategory}
                </span>
                <span className="text-xs text-rose-400 font-medium">
                  ({statsSummary.topCount} items)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Most saturated problem pool</p>
            </div>

          </div>

          {/* ================= 4. MAIN VISUALIZATION CHART ================= */}
          <div className="bg-[#0B0F19] border border-slate-800/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800/70">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  Distribution Frequency
                </h3>
                <p className="text-xs text-slate-400">
                  Comparison of available problems sorted by frequency
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg w-fit">
                <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                <span>Bar height = Total count</span>
              </div>
            </div>

            {loading ? (
              <div className="h-80 flex items-center justify-center">
                <div className="flex items-center gap-3 text-slate-400 text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping"></span>
                  Fetching database metrics...
                </div>
              </div>
            ) : data.length === 0 ? (
              <div className="py-20 text-center text-slate-500 text-sm">
                No problems found in the platform database.
              </div>
            ) : (
              <div style={{ width: "100%", height: 380 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data}
                    margin={{ top: 20, right: 10, left: -20, bottom: 40 }}
                  >
                    <defs>
                      <linearGradient id="barIndigoGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#818CF8" stopOpacity={1} />
                        <stop offset="100%" stopColor="#4338CA" stopOpacity={0.4} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#1E293B"
                      opacity={0.6}
                    />

                    <XAxis
                      dataKey="topic"
                      stroke="#64748B"
                      tick={{ fill: "#94A3B8", fontSize: 12 }}
                      tickLine={false}
                      interval={0}
                      angle={-30}
                      textAnchor="end"
                      dy={10}
                    />

                    <YAxis
                      stroke="#64748B"
                      tick={{ fill: "#94A3B8", fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />

                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "rgba(99, 102, 241, 0.05)" }}
                    />

                    <Bar
                      dataKey="count"
                      fill="url(#barIndigoGradient)"
                      radius={[8, 8, 2, 2]}
                      barSize={32}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}