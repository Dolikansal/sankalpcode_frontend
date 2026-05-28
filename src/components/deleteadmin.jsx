import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosclient';
import { useNavigate } from 'react-router';
import { Trash2, ArrowLeft, Code2, Hash, AlertTriangle, ShieldAlert } from 'lucide-react';

const AdminDelete = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      // Backend route ensure karna sahi ho: /problem/getAllProblem
      const { data } = await axiosClient.get('/problem/getallproblems');
      setProblems(data);
    } catch (err) {
      setError('System Failure: Unable to fetch problems from database.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('WARNING: Are you sure you want to permanently delete this engine core? This action cannot be undone.')) return;
    
    try {
      await axiosClient.delete(`/problem/delete/${id}`);
      setProblems(problems.filter(problem => problem._id !== id));
      alert("Core Terminated Successfully.");
    } catch (err) {
      alert("Deletion Failed: System access denied.");
      console.error(err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
        <p className="text-red-500 font-mono text-xs uppercase tracking-widest">Scanning Database...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-['Inter',sans-serif]">
      {/* Header - Matching Create/Update Style */}
      <header className="sticky top-0 z-50 bg-[#0d1117]/90 backdrop-blur-xl border-b border-red-900/30 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="font-black text-2xl tracking-tighter text-white uppercase italic">
            Sankalp<span className="text-primary not-italic">Code</span>
          </h1>
          <div className="h-6 w-[1px] bg-gray-800"></div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-[#161b22] rounded-full text-gray-500 hover:text-primary transition-all">
              <ArrowLeft size={18}/>
            </button>
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Destruction_Protocol :: Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-primary bg-primary-500/10 px-4 py-1.5 rounded border border-primary font-bold text-[10px] uppercase tracking-widest">
          <ShieldAlert size={14} /> Unrestricted Access
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-10">
        {/* Title Section */}
        <div className="mb-10">
          <h2 className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em] mb-2">Termination Dashboard</h2>
          <p className="text-2xl text-white font-light">Permanently <span className="text-primary font-bold">Delete</span> Problems</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400 text-sm font-mono">
            <AlertTriangle size={18} /> {error}
          </div>
        )}

        <div className="bg-[#0d1117] rounded-xl border border-[#161b22] overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#161b22]/50 text-[10px] text-gray-500 uppercase tracking-widest border-b border-[#30363d]">
                <th className="px-6 py-4 font-bold">#</th>
                <th className="px-6 py-4 font-bold">Problem Core</th>
                <th className="px-6 py-4 font-bold text-center">Difficulty</th>
                <th className="px-6 py-4 font-bold">Classification</th>
                <th className="px-6 py-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161b22]">
              {problems.map((problem, index) => (
                <tr key={problem._id} className="hover:bg-[#161b22]/30 transition-colors group">
                  <td className="px-6 py-5 text-gray-600 font-mono text-xs">{index + 1}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#050505] rounded flex items-center justify-center text-gray-500 border border-[#30363d]">
                        <Code2 size={14}/>
                      </div>
                      <span className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">{problem.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`text-[9px] uppercase font-black px-2.5 py-1 rounded ${
                      problem.difficulty?.toLowerCase() === 'easy' 
                        ? 'bg-green-500/10 text-green-500' 
                        : problem.difficulty?.toLowerCase() === 'medium' 
                          ? 'bg-yellow-500/10 text-yellow-500' 
                          : 'bg-red-500/10 text-red-500'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-2">
                        <span className="text-[10px] text-gray-500 flex items-center gap-1 font-mono">
                          <Hash size={10} className="text-red-500/50" /> {problem.tags}
                        </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={() => handleDelete(problem._id)}
                      className="inline-flex items-center gap-2 bg-red-950/30 hover:bg-red-600 text-red-500 hover:text-white p-2.5 rounded-lg transition-all border border-red-900/30 hover:border-red-500 group/btn"
                      title="Terminate Problem"
                    >
                      <Trash2 size={16} />
                      <span className="text-[10px] font-bold uppercase hidden group-hover/btn:block">Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
              {problems.length === 0 && !loading && (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-gray-600 font-mono text-sm tracking-widest">
                    NO_DATA_CORES_FOUND_IN_SYSTEM
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Internal Scrollbar Styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ef4444; }
      `}} />
    </div>
  );
};

export default AdminDelete;