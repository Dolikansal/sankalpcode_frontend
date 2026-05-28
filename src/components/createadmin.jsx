import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import axiosClient from '../utils/axiosclient';
import { useNavigate } from 'react-router';
import { Plus, Trash2, Code2, Microscope, Tag, Layout, Send, Eye, EyeOff } from 'lucide-react';

const ALL_TAGS = ['Array', 'String', 'Linked List', 'Dynamic Programming', 'Graph', 'Tree', 'Hash Table', 'Math', 'Backtracking', 'Design', 'Sorting', 'Greedy', 'Bit Manipulation', 'Two Pointers', 'Divide and Conquer'];

const problemSchema = z.object({
  title: z.string().min(1, 'Required'),
  description: z.string().min(1, 'Required'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  // tags: z.string().min(1, 'Required'),
  tags: z.array(z.string()).min(1, 'At least one tag required'),
  visibletestcase: z.array(z.object({ input: z.string(), output: z.string(), explanation: z.string() })),
  hiddentestcase: z.array(z.object({ input: z.string(), output: z.string() })),
  startcode: z.array(z.object({ language: z.string(), initialcode: z.string() })),
  referencesolution: z.array(z.object({ language: z.string(), completecode: z.string() }))
});

function AdminPanel() {
  const navigate = useNavigate();
  const [activeLangTab, setActiveLangTab] = useState(0); 
  
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      difficulty: 'Easy',
      tags: ['Array'],
      startcode: [{ language: 'C++', initialcode: '' }, { language: 'Java', initialcode: '' }, { language: 'JavaScript', initialcode: '' }],
      referencesolution: [{ language: 'C++', completecode: '' }, { language: 'Java', completecode: '' }, { language: 'JavaScript', completecode: '' }],
      visibletestcase: [{ input: '', output: '', explanation: '' }],
      hiddentestcase: [{ input: '', output: '' }]
    }
  });

  const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({ control, name: 'visibletestcase' });
  const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({ control, name: 'hiddentestcase' });

  const onSubmit = async (data) => {
    try {
      await axiosClient.post('/problem/create', data);
      navigate('/');
    } catch (error) {
      console.error("Deploy Error:", error);
    }
  };

  const inputClasses = "w-full bg-[#0d1117] border border-[#30363d] focus:border-primary focus:ring-1 focus:ring-primary text-sm rounded-md p-2.5 transition-all outline-none text-gray-200 placeholder:text-gray-600";
  const sectionTitle = "flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-4";

  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-['Inter',sans-serif]">
      {/* Navbar */}
      <div className="sticky top-0 z-50 bg-[#0d1117]/90 backdrop-blur-xl border-b border-primary px-8 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-primary border text-primary rounded-lg">
            <Code2 size={20} className="text-white" />
          </div>
          <h1 className="font-black text-xl tracking-tighter text-white uppercase italic">
            Sankalp<span className="text-primary not-italic">Code</span>
          </h1>
        </div>
        <button 
          onClick={handleSubmit(onSubmit)} 
          className="flex items-center gap-2 bg-primary hover:bg-primary text-white px-6 py-2 rounded-md text-xs font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] active:scale-95"
        >
          <Send size={14} /> PUBLISH PROBLEM
        </button>
      </div>

      <main className="flex flex-wrap h-[calc(100vh-64px)] overflow-hidden">
        
        {/* Left Column (45% Width) */}
        <div className="w-full lg:w-[45%] h-full overflow-y-auto custom-scrollbar border-r border-[#161b22] p-8 space-y-10 bg-[#080808]">
          
          {/* Metadata Section */}
          <section>
            <p className={sectionTitle}><Layout size={14}/> Core Configuration</p>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="text-xs text-primary font-medium block mb-2 uppercase tracking-tight">Problem Title</label>
                <input {...register('title')} className={inputClasses} placeholder="Enter unique title..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-primary font-medium block mb-2 uppercase tracking-tight">Difficulty</label>
                  <select {...register('difficulty')} className={inputClasses}>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-primary font-medium block mb-2 uppercase tracking-tight">Classification</label>
                  <select {...register('tags')} className={inputClasses}>
                    {ALL_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-primary font-medium block mb-2 uppercase tracking-tight">Problem Statement</label>
                <textarea {...register('description')} rows={6} className={`${inputClasses} resize-none font-mono text-xs`} placeholder="Describe the problem, constraints, and examples..." />
              </div>
            </div>
          </section>

          {/* Visible Test Cases Portion */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <p className={sectionTitle}><Eye size={14}/> Visible Test Cases</p>
              <button type="button" onClick={() => appendVisible({input:'', output:'', explanation:''})} className="text-primary hover:text-primary text-[10px] font-black border border-primary px-2 py-1 rounded transition">+ ADD NEW</button>
            </div>
            <div className="space-y-4">
              {visibleFields.map((item, index) => (
                <div key={item.id} className="p-4 bg-[#0d1117] border border-[#30363d] rounded-lg relative">
                  <button onClick={() => removeVisible(index)} className="absolute top-3 right-3 text-gray-600 hover:text-red-500 transition"><Trash2 size={14}/></button>
                  <div className="grid gap-3">
                    <input {...register(`visibletestcase.${index}.input`)} placeholder="Input Data" className="bg-transparent border-b border-[#30363d] w-full text-xs py-1 outline-none focus:border-primary" />
                    <input {...register(`visibletestcase.${index}.output`)} placeholder="Expected Output" className="bg-transparent border-b border-[#30363d] w-full text-xs py-1 outline-none focus:border-primary" />
                    <input {...register(`visibletestcase.${index}.explanation`)} placeholder="Explanation (Optional)" className="bg-transparent text-[10px] w-full py-1 outline-none italic text-gray-500" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Hidden Test Cases Portion */}
          <section className="pb-10">
            <div className="flex justify-between items-center mb-4">
              <p className={sectionTitle}><EyeOff size={14}/> Hidden Test Cases</p>
              <button type="button" onClick={() => appendHidden({input:'', output:''})} className="text-primary hover:text-primary text-[10px] font-black border border-purple-500/30 px-2 py-1 rounded transition">+ ADD HIDDEN</button>
            </div>
            <div className="space-y-4">
              {hiddenFields.map((item, index) => (
                <div key={item.id} className="p-4 bg-[#0d1117] border border-purple-900/20 rounded-lg relative border-dashed">
                  <button onClick={() => removeHidden(index)} className="absolute top-3 right-3 text-gray-600 hover:text-red-500 transition"><Trash2 size={14}/></button>
                  <div className="grid gap-3">
                    <input {...register(`hiddentestcase.${index}.input`)} placeholder="Secret Input" className="bg-transparent border-b border-[#30363d] w-full text-xs py-1 outline-none focus:border-purple-500" />
                    <input {...register(`hiddentestcase.${index}.output`)} placeholder="Secret Output" className="bg-transparent border-b border-[#30363d] w-full text-xs py-1 outline-none focus:border-purple-500" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (55% Width) */}

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

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #0891b2; }
      `}} />
    </div>
  );
}

export default AdminPanel;