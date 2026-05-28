import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router';
import { Edit3, ChevronRight, Hash, Layout, Eye, EyeOff, Code2, Save, ArrowLeft, Trash2, Box } from 'lucide-react';
import axiosclient from '../utils/axiosclient';

const ALL_TAGS = ['Array', 'String', 'Linked List', 'Dynamic Programming', 'Graph', 'Tree', 'Hash Table', 'Math', 'Backtracking', 'Design', 'Sorting', 'Greedy', 'Bit Manipulation', 'Two Pointers', 'Divide and Conquer'];

const SubmissionHistory = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLangTab, setActiveLangTab] = useState(0);

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm();

  const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({ control, name: 'visibletestcase' });
  const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({ control, name: 'hiddentestcase' });

  // 1. Fetch All Problems
  useEffect(() => {
    if (!problemId) {
      const fetchAll = async () => {
        try {
          setLoading(true);
          const res = await axiosclient.get('/problem/getallproblems');
          setProblems(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
      };
      fetchAll();
    }
  }, [problemId]);

  // 2. Fetch Single Problem Data (Pre-fill form)
  useEffect(() => {
    if (problemId && problemId !== "undefined") {
      const fetchOne = async () => {
        try {
          setLoading(true);
          const res = await axiosclient.get(`/problem/problembyid/${problemId}`);
          reset(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
      };
      fetchOne();
    }
  }, [problemId, reset]);

  const onUpdate = async (data) => {
    try {
      await axiosclient.put(`/problem/update/${problemId}`, data);
      alert("Problem Sync Successful!");
      navigate('/admin/update');
    } catch (err) {
      alert("Update Failed: " + (err.response?.data?.error || err.message));
    }
  };

  const inputClasses = "w-full bg-[#0d1117] border border-[#30363d] focus:border-primary focus:ring-1 focus:ring-primary text-sm rounded-md p-2.5 outline-none text-gray-200 transition-all";
  const sectionTitle = "flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-4";

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-primary rounded-full animate-spin"></div>
        <p className="text-primary font-mono text-xs uppercase tracking-widest">Initialising System...</p>
      </div>
    </div>
  );

  // --- UI PART 1: Selection List (Single Row Layout) ---
  if (!problemId) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col">
        <header className="bg-[#0d1117] border-b border-primary px-10 py-6 shrink-0">
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
            Sankalp<span className="text-primary not-italic">Code</span>
          </h1>
        </header>

        <main className="flex-1 p-10 max-w-5xl mx-auto w-full">
          <div className="mb-10">
            <h2 className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mb-2">Database Management</h2>
            <p className="text-2xl text-white font-light">Select a <span className="text-primary font-bold">Problem</span> to edit</p>
          </div>

          <div className="space-y-3">
            {problems.map(p => (
              <div
                key={p._id}
                onClick={() => navigate(`/admin/update/${p._id}`)}
                className="bg-[#0d1117] p-5 rounded-lg border border-[#161b22] hover:border-primary cursor-pointer transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-6">
                  <div className="w-10 h-10 bg-[#161b22] rounded flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                    <Code2 size={18} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg group-hover:text-primary transition-colors">{p.title}</h3>
                    <div className="flex gap-3 mt-1">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${p.difficulty?.toLowerCase() === 'easy'
                          ? 'bg-green-500/10 text-green-500'
                          : p.difficulty?.toLowerCase() === 'medium'
                            ? 'bg-yellow-500/10 text-yellow-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}>
                        {p.difficulty}
                      </span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-1">
                        <Hash size={10} /> {p.tags}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="text-gray-600 group-hover:text-primary group-hover:translate-x-1 transition-all" size={20} />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // --- UI PART 2: Full Update UI (Form View) ---
  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-['Inter'] overflow-hidden h-screen flex flex-col">
      <header className="bg-[#0d1117] border-b border-primary px-8 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-6">
          <h1 className="font-black text-2xl tracking-tighter text-white uppercase italic">
            Sankalp<span className="text-primary not-italic">Code</span>
          </h1>
          <div className="h-6 w-[1px] bg-gray-800"></div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/admin/update')} className="p-2 hover:bg-[#161b22] rounded-full text-gray-500 hover:text-primary transition-all">
              <ArrowLeft size={18} />
            </button>
            <span className="text-xs font-mono text-gray-500 tracking-wider">UPDATING::{problemId.slice(-6)}</span>
          </div>
        </div>
        <button
          onClick={handleSubmit(onUpdate)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-2.5 rounded-md text-xs font-black transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-95"
        >
          <Save size={14} /> SYNC CHANGES
        </button>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left: Metadata & Test Cases */}
        <div className="w-[45%] h-full overflow-y-auto p-8 border-r border-[#161b22] space-y-10 custom-scrollbar bg-[#080808]">
          <section>
            <p className={sectionTitle}><Layout size={14} /> Core Information</p>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 ml-1">PROBLEM TITLE</label>
                <input {...register('title')} className={inputClasses} placeholder="Enter problem title..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 ml-1">DIFFICULTY</label>
                  <select {...register('difficulty')} className={inputClasses}>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 ml-1">PRIMARY TAG</label>
                  <select {...register('tags')} className={inputClasses}>
                    {ALL_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 ml-1">PROBLEM DESCRIPTION</label>
                <textarea {...register('description')} rows={12} className={`${inputClasses} font-mono text-xs leading-relaxed`} />
              </div>
            </div>
          </section>

          <section>
            <p className={sectionTitle}><Eye size={14} /> Public Examples</p>
            <div className="space-y-4">
              {visibleFields.map((field, index) => (
                <div key={field.id} className="p-4 bg-[#0d1117] border border-[#30363d] rounded-lg relative group">
                  <button type="button" onClick={() => removeVisible(index)} className="absolute top-3 right-3 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={14} />
                  </button>
                  <div className="space-y-3">
                    <textarea {...register(`visibletestcase.${index}.input`)} className="bg-transparent border-b border-[#30363d] w-full text-xs py-1 outline-none text-cyan-200" placeholder="Example Input" />
                    <textarea {...register(`visibletestcase.${index}.output`)} className="bg-transparent border-b border-[#30363d] w-full text-xs py-1 outline-none text-emerald-400" placeholder="Example Output" />
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => appendVisible({ input: '', output: '', explanation: '' })} className="w-full py-3 border border-dashed border-[#30363d] text-[10px] text-gray-500 hover:text-cyan-500 hover:border-cyan-500 transition-all font-bold uppercase">
                + Add Example Case
              </button>
            </div>
          </section>

          <section className="pb-10">
            <p className={sectionTitle}><EyeOff size={14} /> System Test Cases</p>
            <div className="space-y-4">
              {hiddenFields.map((field, index) => (
                <div key={field.id} className="p-4 bg-[#0d1117] border border-dashed border-purple-900/30 rounded-lg group">
                  <div className="flex justify-between mb-2">
                    <span className="text-[9px] text-purple-500 font-mono">INTERNAL_TEST_{index + 1}</span>
                    <button type="button" onClick={() => removeHidden(index)} className="text-purple-900 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={12} /></button>
                  </div>
                  <textarea {...register(`hiddentestcase.${index}.input`)} className="bg-transparent border-b border-[#30363d] w-full text-xs py-1 outline-none text-gray-400" placeholder="Hidden Input" />
                  <textarea {...register(`hiddentestase.${index}.output`)} className="bg-transparent border-b border-[#30363d] w-full text-xs py-1 outline-none text-gray-400 mt-2" placeholder="Hidden Output" />
                </div>
              ))}
              <button type="button" onClick={() => appendHidden({ input: '', output: '' })} className="w-full py-3 border border-dashed border-purple-900/20 text-[10px] text-gray-600 hover:text-purple-500 hover:border-purple-500 transition-all font-bold uppercase">
                + Add System Case
              </button>
            </div>
          </section>
        </div>

        {/* Right: Code Logic (55%) */}
        <div className="w-full lg:w-[55%] h-full flex flex-col bg-[#010101] overflow-y-auto custom-scrollbar">

          {['C++', 'Java', 'JavaScript'].map((lang, index) => (
            <div key={lang} className="flex flex-col border-b border-[#161b22] min-h-[400px]">
              {/* Language Header */}
              <div className="flex items-center justify-between bg-[#0d1117] px-6 py-2 border-b border-[#30363d]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div>
                  <span className="text-[11px] font-black text-white uppercase tracking-tighter italic">
                    {lang} <span className="text-gray-600 not-italic ml-2">ENVIRONMENT</span>
                  </span>
                </div>
                <span className="text-[9px] text-gray-500 font-mono">0{index + 1}_VIRTUAL_CORE</span>
              </div>

              {/* Editor Windows for the specific language */}
              <div className="flex flex-col flex-1 divide-y divide-[#161b22]">
                {/* Window 1: Start Template */}
                <div className="flex-1 flex flex-col">
                  <div className="px-6 py-1.5 bg-[#080808] text-[9px] text-primary/60 font-bold uppercase tracking-widest border-b border-[#161b22]">
                    Start_Template
                  </div>
                  <textarea
                    {...register(`startcode.${index}.initialcode`)}
                    className="flex-1 w-full bg-transparent p-5 font-mono text-xs leading-relaxed outline-none text-primary/90 resize-none"
                    spellCheck="false"
                    placeholder={`// Skeleton for ${lang}...`}
                  />
                </div>

                {/* Window 2: Reference Solution */}
                <div className="flex-1 flex flex-col">
                  <div className="px-6 py-1.5 bg-[#080808] text-[9px] text-emerald-500/40 font-bold uppercase tracking-widest border-b border-[#161b22]">
                    Complete_Solution
                  </div>
                  <textarea
                    {...register(`referencesolution.${index}.completecode`)}
                    className="flex-1 w-full bg-[#030303] p-5 font-mono text-xs leading-relaxed outline-none text-emerald-100/50 resize-none"
                    spellCheck="false"
                    placeholder={`// Full solution for ${lang}...`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; } 
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #0891b2; }
      ` }} />
    </div>
  );
};

export default SubmissionHistory;