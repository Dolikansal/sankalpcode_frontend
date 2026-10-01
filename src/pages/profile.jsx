// import React, { useState, useEffect } from 'react';
// import { NavLink } from 'react-router';
// import axiosclient from '../utils/axiosclient';

// function ProfilePage() {
//     const [profileData, setProfileData] = useState({
//         name: "",
//         role: "",
//         email: "",
//         mobile: "", 
//         location: "",
//         systemObjective: "",
//         education: [""], 
//         skills: "",       
//         achievements: [""] ,
//         score: 0
//     });

//     const [solvedCount, setSolvedCount] = useState(0);
//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);
//     const [systemMsg, setSystemMsg] = useState({ type: "", text: "" });

//     useEffect(() => {
//         const fetchEngineIdentity = async () => {
//             try {
//                 setLoading(true);
//                 const res = await axiosclient.get("/user/getprofile"); 
//                 if (res.data) {
//                     let parsedEd = [""];
//                     if (res.data.education) {
//                         parsedEd = Array.isArray(res.data.education) 
//                             ? res.data.education 
//                             : res.data.education.split(",").map(e => e.trim()).filter(Boolean);
//                     }
                    
//                     let parsedAch = [""];
//                     if (res.data.achievements) {
//                         parsedAch = Array.isArray(res.data.achievements)
//                             ? res.data.achievements
//                             : res.data.achievements.split(",").map(a => a.trim()).filter(Boolean);
//                     }

//                     setProfileData({
//                         name: res.data.name || "Anonymous Developer",
//                         role: res.data.role || "Software Engineer",
//                         email: res.data.email || "",
//                         mobile: res.data.mobile || "", 
//                         location: res.data.location || "",
//                         systemObjective: res.data.systemObjective || "",
//                         education: parsedEd.length ? parsedEd : [""],
//                         skills: Array.isArray(res.data.skills) ? res.data.skills.join(", ") : res.data.skills || "",
//                         achievements: parsedAch.length ? parsedAch : [""],
//                         score: res.data.score || 0
//                     });
//                     setSolvedCount(Array.isArray(res.data.problemsolved) ? res.data.problemsolved.length : 0);
//                 }
//             } catch (err) {
//                 console.error("DB Execution Error:", err);
//                 setSystemMsg({ type: "error", text: "Failed to connect to SankalpCode user services." });
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchEngineIdentity();
//     }, []);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setProfileData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleEducationChange = (index, value) => {
//         const updatedEd = [...profileData.education];
//         updatedEd[index] = value;
//         setProfileData(prev => ({ ...prev, education: updatedEd }));
//     };

//     const addEducationField = () => {
//         setProfileData(prev => ({ ...prev, education: [...prev.education, ""] }));
//     };

//     const removeEducationField = (index) => {
//         if (profileData.education.length > 1) {
//             const updatedEd = profileData.education.filter((_, i) => i !== index);
//             setProfileData(prev => ({ ...prev, education: updatedEd }));
//         }
//     };

//     const handleAchievementChange = (index, value) => {
//         const updatedAch = [...profileData.achievements];
//         updatedAch[index] = value;
//         setProfileData(prev => ({ ...prev, achievements: updatedAch }));
//     };

//     const addAchievementField = () => {
//         setProfileData(prev => ({ ...prev, achievements: [...prev.achievements, ""] }));
//     };

//     const removeAchievementField = (index) => {
//         if (profileData.achievements.length > 1) {
//             const updatedAch = profileData.achievements.filter((_, i) => i !== index);
//             setProfileData(prev => ({ ...prev, achievements: updatedAch }));
//         }
//     };

//     const handleCommitChanges = async (e) => {
//         e.preventDefault();
//         try {
//             setSaving(true);
//             setSystemMsg({ type: "", text: "" });

//             const arraySkills = profileData.skills.split(",").map(s => s.trim()).filter(Boolean);
//             const cleanEducationArray = profileData.education.map(e => e.trim()).filter(Boolean);
//             const cleanAchievementsArray = profileData.achievements.map(a => a.trim()).filter(Boolean);

//             const payload = {
//                 name: profileData.name,
//                 mobile: profileData.mobile,
//                 location: profileData.location,
//                 systemObjective: profileData.systemObjective,
//                 education: cleanEducationArray.join(", "),
//                 skills: arraySkills,
//                 achievements: cleanAchievementsArray.join(", ")
//             };

//             await axiosclient.put("/user/getprofile/update", payload);
            
//             setProfileData(prev => ({
//                 ...prev,
//                 ...payload,
//                 education: cleanEducationArray.length ? cleanEducationArray : [""],
//                 skills: profileData.skills,
//                 achievements: cleanAchievementsArray.length ? cleanAchievementsArray : [""]
//             }));

//             setSystemMsg({ type: "success", text: "Profile updated successfully!" });
//             setIsEditing(false);
//         } catch (err) {
//             console.error("Update Exception:", err);
//             setSystemMsg({ type: "error", text: "Failed to save profile modifications." });
//         } finally {
//             setSaving(false);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-[#020c1b] flex flex-col items-center justify-center text-[#64ffda] gap-4">
//                 <div className="w-12 h-12 border-2 border-[#64ffda]/20 border-t-[#64ffda] rounded-full animate-spin"></div>
//                 <span className="text-xs tracking-widest font-mono uppercase">Fetching SankalpCode Profile...</span>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-[#0d1117] text-slate-200 font-sans antialiased pb-16 selection:bg-[#64ffda]/20 selection:text-[#64ffda]">
            
//             {/* Navigation Header */}
//             <header className="p-4 bg-[#0d1117] border-b border-indigo-500 backdrop-blur-md sticky top-0 z-30 shadow-md">
//                 <div className="max-w-7xl mx-auto flex justify-between items-center">
//                     <div className="flex items-center gap-3">
//                         <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse"></div>
//                         <span className="font-mono text-sm font-bold tracking-wider text-indigo-500 uppercase">
//                             SankalpCode - Developer Space
//                         </span>
//                     </div>

//                     <div className="flex items-center gap-3 font-mono text-xs">
//                         {!isEditing ? (
//                             <button 
//                                 type="button"
//                                 onClick={() => setIsEditing(true)}
//                                 className="px-4 py-2 bg-[#0d1117] hover:bg-[#64ffda]/20 text-indigo-500 border border-indigo-500 rounded-lg font-bold transition-all"
//                             >
//                                 Edit Profile
//                             </button>
//                         ) : (
//                             <button 
//                                 type="button"
//                                 onClick={() => setIsEditing(false)}
//                                 className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg font-bold transition-all"
//                             >
//                                 Cancel
//                             </button>
//                         )}
//                         <NavLink 
//                             to="/" 
//                             className="px-4 py-2 bg-transparent text-slate-400 hover:text-indigo-500 border border-slate-800 hover:border-indigo-500 rounded-lg transition-all"
//                         >
//                             Dashboard
//                         </NavLink>
//                     </div>
//                 </div>
//             </header>

//             {/* Notification Alert */}
//             {systemMsg.text && (
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
//                     <div className={`p-3 text-xs text-center rounded-lg border font-mono ${
//                         systemMsg.type === "error" 
//                             ? "bg-red-950/30 border-red-500/30 text-red-400" 
//                             : "bg-emerald-950/30 border-indigo-500/30 text-indigo-400"
//                     }`}>
//                         {systemMsg.text}
//                     </div>
//                 </div>
//             )}

//             <form onSubmit={handleCommitChanges} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
                
//                 {/* Header Banner & User Identity Card */}
//                 <div className="bg-[#0a192f] border border-indigo-500/20 rounded-2xl overflow-hidden shadow-xl">
//                     <div className="h-32 sm:h-44 bg-gradient-to-r from-[#020c1b] via-[#0a192f] to-[#112240] relative border-b border-indigo-500/10">
//                         <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#64ffda_1px,transparent_1px)] [background-size:16px_16px]"></div>
//                     </div>

//                     <div className="px-6 pb-6 relative flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-16 sm:-mt-20">
//                         <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
//                             <div className="relative">
//                                 <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-[#020c1b] border-2 border-indigo-300 shadow-lg shadow-[#64ffda]/10 flex items-center justify-center text-3xl font-mono text-indigo-400">
//                                     &lt;/&gt;
//                                 </div>
//                                 <div className="absolute bottom-2 right-2 w-4 h-4 bg-indigo-500 border-2 border-indigo-500 rounded-full"></div>
//                             </div>

//                             <div className="space-y-1 mb-2">
//                                 {isEditing ? (
//                                     <input 
//                                         type="text"
//                                         name="name"
//                                         value={profileData.name}
//                                         onChange={handleInputChange}
//                                         className="bg-[#020c1b] border border-indigo-500/40 rounded-lg px-3 py-1 text-lg font-bold text-white focus:outline-none focus:border-indigo-500"
//                                     />
//                                 ) : (
//                                     <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
//                                         {profileData.name}
//                                     </h1>
//                                 )}
//                                 <p className="text-xs sm:text-sm font-mono text-indigo-500">{profileData.role || "Software Developer"}</p>
//                                 <p className="text-xs text-slate-400">{profileData.email}</p>
//                             </div>
//                         </div>

//                         {isEditing && (
//                             <button 
//                                 type="submit"
//                                 disabled={saving}
//                                 className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-500/80 text-[#020c1b] font-bold text-xs font-mono rounded-xl transition-all shadow-lg shadow-[#64ffda]/20 self-center md:self-end"
//                             >
//                                 {saving ? "Saving..." : "Save Changes"}
//                             </button>
//                         )}
//                     </div>
//                 </div>

//                 {/* Main Content Grid Layout */}
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
//                     {/* Left Column: Personal Credentials */}
//                     <div className="space-y-6">
                        
//                         {/* Contact Info Card */}
//                         <div className="bg-[#0a192f] border border-[#64ffda]/20 rounded-2xl p-5 space-y-4">
//                             <h3 className="text-xs font-mono font-bold text-indigo-500 uppercase tracking-wider">
//                                 System Metadata
//                             </h3>
//                             <div className="space-y-3 text-xs">
//                                 <div>
//                                     <span className="text-slate-500 block text-[10px] font-mono uppercase">Phone</span>
//                                     {isEditing ? (
//                                         <input 
//                                             type="text"
//                                             name="mobile"
//                                             value={profileData.mobile}
//                                             onChange={handleInputChange}
//                                             className="w-full bg-[#020c1b] border border-indigo-500/30 rounded px-2 py-1 text-white text-xs mt-1"
//                                             placeholder="+91 XXXXX XXXXX"
//                                         />
//                                     ) : (
//                                         <span className="text-slate-300 font-medium">{profileData.mobile || "Not specified"}</span>
//                                     )}
//                                 </div>

//                                 <div>
//                                     <span className="text-slate-500 block text-[10px] font-mono uppercase">Location</span>
//                                     {isEditing ? (
//                                         <input 
//                                             type="text"
//                                             name="location"
//                                             value={profileData.location}
//                                             onChange={handleInputChange}
//                                             className="w-full bg-[#020c1b] border border-indigo-500/30 rounded px-2 py-1 text-white text-xs mt-1"
//                                             placeholder="City, Country"
//                                         />
//                                     ) : (
//                                         <span className="text-slate-300 font-medium">{profileData.location || "India"}</span>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="bg-[#0a192f] border border-[#64ffda]/20 rounded-2xl p-5 space-y-4">
//                             <h3 className="text-xs font-mono font-bold text-indigo-500 uppercase tracking-wider">
//                                 Coding score 
//                             </h3>
//                             <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
//           <p className="text-xs text-slate-400 uppercase tracking-wider">Total Score</p>
//           <p className="text-3xl font-extrabold text-green-400 mt-1">
//             {profileData.score ?? 0} <span className="text-sm text-slate-400 font-normal">PTS</span>
//           </p>
//         </div>
//                         </div>

//                         {/* Social Links Badge */}
//                         {/* <div className="bg-[#0a192f] border border-indigo-500/20 rounded-2xl p-5 space-y-3">
//                             <h3 className="text-xs font-mono font-bold text-indigo-500 uppercase tracking-wider">
//                                 Platform Credentials
//                             </h3>
//                             <div className="flex flex-col gap-2 font-mono text-xs">
//                                 <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2.5 bg-[#020c1b] rounded-lg border border-slate-800 hover:border-[#64ffda]/40 flex items-center justify-between text-slate-300 hover:text-[#64ffda] transition-all">
//                                     <span>GitHub Profile</span>
//                                     <span>↗</span>
//                                 </a>
//                                 <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2.5 bg-[#020c1b] rounded-lg border border-slate-800 hover:border-[#64ffda]/40 flex items-center justify-between text-slate-300 hover:text-[#64ffda] transition-all">
//                                     <span>LinkedIn Matrix</span>
//                                     <span>↗</span>
//                                 </a>
//                             </div>
//                         </div> */}
//                     </div>

//                     {/* Right Column: Platform Statistics & Extended Data */}
//                     <div className="lg:col-span-2 space-y-6">
                        
//                         {/* LeetCode / GFG Style Problem Metrics */}
//                         <div className="bg-[#0a192f] border border-[#64ffda]/20 rounded-2xl p-6">
//                             <h3 className="text-xs font-mono font-bold text-indigo-500 uppercase tracking-wider mb-4">
//                                 Problem Solving Progress
//                             </h3>

//                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                                 <div className="p-4 bg-[#020c1b] border border-slate-800 rounded-xl flex flex-col justify-between">
//                                     <span className="text-[10px] font-mono text-slate-500 uppercase">Solved Problems</span>
//                                     <span className="text-3xl font-black text-white mt-2">{solvedCount}</span>
//                                     <span className="text-[10px] font-mono text-emerald-400 mt-1">Verified Submissions</span>
//                                 </div>

    
//                             </div>
//                         </div>

//                         {/* About Me Section */}
//                         <div className="bg-[#0a192f] border border-[#64ffda]/20 rounded-2xl p-6 space-y-3">
//                             <h3 className="text-xs font-mono font-bold text-indigo-500 uppercase tracking-wider border-b border-[#64ffda]/10 pb-2">
//                                 Developer Bio & Objectives
//                             </h3>
//                             {isEditing ? (
//                                 <textarea 
//                                     name="systemObjective"
//                                     value={profileData.systemObjective}
//                                     onChange={handleInputChange}
//                                     rows="3"
//                                     className="w-full bg-[#020c1b] border border-[#64ffda]/30 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#64ffda]"
//                                     placeholder="Write a concise overview about your skills, engineering background, and interests..."
//                                 />
//                             ) : (
//                                 <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
//                                     {profileData.systemObjective || "No bio configured yet. Click 'Edit Profile' to add your summary."}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Skills Inventory */}
//                         <div className="bg-[#0a192f] border border-[#64ffda]/20 rounded-2xl p-6 space-y-3">
//                             <h3 className="text-xs font-mono font-bold text-indigo-500 uppercase tracking-wider border-b border-[#64ffda]/10 pb-2">
//                                 Technical Skills
//                             </h3>
//                             {isEditing ? (
//                                 <input 
//                                     type="text"
//                                     name="skills"
//                                     value={profileData.skills}
//                                     onChange={handleInputChange}
//                                     className="w-full bg-[#020c1b] border border-[#64ffda]/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#64ffda]"
//                                     placeholder="C++, React, Node.js, MongoDB, Data Structures"
//                                 />
//                             ) : (
//                                 <div className="flex flex-wrap gap-2 pt-1">
//                                     {profileData.skills.split(",").map(s => s.trim()).filter(Boolean).length > 0 ? (
//                                         profileData.skills.split(",").map((skill, idx) => (
//                                             <span 
//                                                 key={idx} 
//                                                 className="px-3 py-1 bg-[#020c1b] border border-[#64ffda]/30 text-[#64ffda] text-xs font-mono rounded-lg"
//                                             >
//                                                 {skill}
//                                             </span>
//                                         ))
//                                     ) : (
//                                         <span className="text-xs text-slate-500 italic">No skills added yet.</span>
//                                     )}
//                                 </div>
//                             )}
//                         </div>

//                         {/* Education Details */}
//                         <div className="bg-[#0a192f] border border-[#64ffda]/20 rounded-2xl p-6 space-y-4">
//                             <div className="flex justify-between items-center border-b border-[#64ffda]/10 pb-2">
//                                 <h3 className="text-xs font-mono font-bold text-indigo-500 uppercase tracking-wider">
//                                     Academic Qualifications
//                                 </h3>
//                                 {isEditing && (
//                                     <button
//                                         type="button"
//                                         onClick={addEducationField}
//                                         className="text-[10px] font-mono font-bold text-indigo-500 bg-emerald-950/40 border border-emerald-500/30 px-2 py-1 rounded hover:bg-emerald-950/70"
//                                     >
//                                         + Add Education
//                                     </button>
//                                 )}
//                             </div>

//                             {isEditing ? (
//                                 <div className="space-y-3">
//                                     {profileData.education.map((edu, idx) => (
//                                         <div key={idx} className="flex gap-2">
//                                             <input 
//                                                 type="text"
//                                                 value={edu}
//                                                 onChange={(e) => handleEducationChange(idx, e.target.value)}
//                                                 className="w-full bg-[#020c1b] border border-[#64ffda]/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#64ffda]"
//                                                 placeholder="B.Tech in Computer Science - University Name"
//                                             />
//                                             {profileData.education.length > 1 && (
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => removeEducationField(idx)}
//                                                     className="px-3 py-1 bg-red-950/30 border border-red-500/30 text-red-400 text-xs rounded-lg hover:bg-red-950/60"
//                                                 >
//                                                     ✕
//                                                 </button>
//                                             )}
//                                         </div>
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <div className="space-y-2">
//                                     {profileData.education.filter(Boolean).length > 0 ? (
//                                         profileData.education.filter(Boolean).map((edu, idx) => (
//                                             <div key={idx} className="p-3 bg-[#020c1b] border border-slate-800 rounded-xl text-xs text-slate-300 font-medium">
//                                                 🎓 {edu}
//                                             </div>
//                                         ))
//                                     ) : (
//                                         <p className="text-xs text-slate-500 italic">No education records found.</p>
//                                     )}
//                                 </div>
//                             )}
//                         </div>

//                         {/* Achievements Section */}
//                         <div className="bg-[#0a192f] border border-[#64ffda]/20 rounded-2xl p-6 space-y-4">
//                             <div className="flex justify-between items-center border-b border-[#64ffda]/10 pb-2">
//                                 <h3 className="text-xs font-mono font-bold text-indigo-500 uppercase tracking-wider">
//                                     Achievements & Badges
//                                 </h3>
//                                 {isEditing && (
//                                     <button
//                                         type="button"
//                                         onClick={addAchievementField}
//                                         className="text-[10px] font-mono font-bold text-indigo-500 bg-emerald-950/40 border border-emerald-500/30 px-2 py-1 rounded hover:bg-emerald-950/70"
//                                     >
//                                         + Add Achievement
//                                     </button>
//                                 )}
//                             </div>

//                             {isEditing ? (
//                                 <div className="space-y-3">
//                                     {profileData.achievements.map((ach, idx) => (
//                                         <div key={idx} className="flex gap-2">
//                                             <input 
//                                                 type="text"
//                                                 value={ach}
//                                                 onChange={(e) => handleAchievementChange(idx, e.target.value)}
//                                                 className="w-full bg-[#020c1b] border border-[#64ffda]/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#64ffda]"
//                                                 placeholder="LeetCode 50 Days Badge, GSSoC Contributor, etc."
//                                             />
//                                             {profileData.achievements.length > 1 && (
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => removeAchievementField(idx)}
//                                                     className="px-3 py-1 bg-red-950/30 border border-red-500/30 text-red-400 text-xs rounded-lg hover:bg-red-950/60"
//                                                 >
//                                                     ✕
//                                                 </button>
//                                             )}
//                                         </div>
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <div className="space-y-2">
//                                     {profileData.achievements.filter(Boolean).length > 0 ? (
//                                         profileData.achievements.filter(Boolean).map((ach, idx) => (
//                                             <div key={idx} className="p-3 bg-[#020c1b] border border-slate-800 rounded-xl text-xs text-slate-300 font-medium flex items-center gap-2">
//                                                 <span>🏆</span>
//                                                 <span>{ach}</span>
//                                             </div>
//                                         ))
//                                     ) : (
//                                         <p className="text-xs text-slate-500 italic">No achievements added yet.</p>
//                                     )}
//                                 </div>
//                             )}
//                         </div>

//                     </div>
//                 </div>
//             </form>
//         </div>
//     );
// }

// export default ProfilePage;

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router';
import axiosclient from '../utils/axiosclient';

function ProfilePage() {
    const [profileData, setProfileData] = useState({
        name: "",
        role: "",
        email: "",
        mobile: "", 
        location: "",
        systemObjective: "",
        education: [""], 
        skills: "",       
        achievements: [""],
        score: 0
    });

    const [solvedCount, setSolvedCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [systemMsg, setSystemMsg] = useState({ type: "", text: "" });

    useEffect(() => {
        const fetchEngineIdentity = async () => {
            try {
                setLoading(true);
                const res = await axiosclient.get("/user/getprofile"); 
                if (res.data) {
                    let parsedEd = [""];
                    if (res.data.education) {
                        parsedEd = Array.isArray(res.data.education) 
                            ? res.data.education 
                            : res.data.education.split(",").map(e => e.trim()).filter(Boolean);
                    }
                    
                    let parsedAch = [""];
                    if (res.data.achievements) {
                        parsedAch = Array.isArray(res.data.achievements)
                            ? res.data.achievements
                            : res.data.achievements.split(",").map(a => a.trim()).filter(Boolean);
                    }

                    setProfileData({
                        name: res.data.name || "Developer",
                        role: res.data.role || "Software Engineer",
                        email: res.data.email || "",
                        mobile: res.data.mobile || "", 
                        location: res.data.location || "",
                        systemObjective: res.data.systemObjective || "",
                        education: parsedEd.length ? parsedEd : [""],
                        skills: Array.isArray(res.data.skills) ? res.data.skills.join(", ") : res.data.skills || "",
                        achievements: parsedAch.length ? parsedAch : [""],
                        score: res.data.score || 0
                    });
                    setSolvedCount(Array.isArray(res.data.problemsolved) ? res.data.problemsolved.length : 0);
                }
            } catch (err) {
                console.error("DB Execution Error:", err);
                setSystemMsg({ type: "error", text: "Failed to connect to SankalpCode user services." });
            } finally {
                setLoading(false);
            }
        };

        fetchEngineIdentity();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleEducationChange = (index, value) => {
        const updatedEd = [...profileData.education];
        updatedEd[index] = value;
        setProfileData(prev => ({ ...prev, education: updatedEd }));
    };

    const addEducationField = () => {
        setProfileData(prev => ({ ...prev, education: [...prev.education, ""] }));
    };

    const removeEducationField = (index) => {
        if (profileData.education.length > 1) {
            const updatedEd = profileData.education.filter((_, i) => i !== index);
            setProfileData(prev => ({ ...prev, education: updatedEd }));
        }
    };

    const handleAchievementChange = (index, value) => {
        const updatedAch = [...profileData.achievements];
        updatedAch[index] = value;
        setProfileData(prev => ({ ...prev, achievements: updatedAch }));
    };

    const addAchievementField = () => {
        setProfileData(prev => ({ ...prev, achievements: [...prev.achievements, ""] }));
    };

    const removeAchievementField = (index) => {
        if (profileData.achievements.length > 1) {
            const updatedAch = profileData.achievements.filter((_, i) => i !== index);
            setProfileData(prev => ({ ...prev, achievements: updatedAch }));
        }
    };

    const handleCommitChanges = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setSystemMsg({ type: "", text: "" });

            const arraySkills = profileData.skills.split(",").map(s => s.trim()).filter(Boolean);
            const cleanEducationArray = profileData.education.map(e => e.trim()).filter(Boolean);
            const cleanAchievementsArray = profileData.achievements.map(a => a.trim()).filter(Boolean);

            const payload = {
                name: profileData.name,
                mobile: profileData.mobile,
                location: profileData.location,
                systemObjective: profileData.systemObjective,
                education: cleanEducationArray.join(", "),
                skills: arraySkills,
                achievements: cleanAchievementsArray.join(", ")
            };

            await axiosclient.put("/user/getprofile/update", payload);
            
            setProfileData(prev => ({
                ...prev,
                ...payload,
                education: cleanEducationArray.length ? cleanEducationArray : [""],
                skills: profileData.skills,
                achievements: cleanAchievementsArray.length ? cleanAchievementsArray : [""]
            }));

            setSystemMsg({ type: "success", text: "Profile updated successfully!" });
            setIsEditing(false);
        } catch (err) {
            console.error("Update Exception:", err);
            setSystemMsg({ type: "error", text: "Failed to save profile modifications." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center text-indigo-400 gap-4">
                <div className="relative flex items-center justify-center">
                    <div className="w-14 h-14 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    <span className="absolute font-mono text-xs font-bold text-indigo-400">&lt;/&gt;</span>
                </div>
                <span className="text-xs tracking-widest font-mono uppercase text-slate-400 animate-pulse">
                    Loading SankalpCode Profile...
                </span>
            </div>
        );
    }

    const skillsList = profileData.skills.split(",").map(s => s.trim()).filter(Boolean);

    return (
        <div className="min-h-screen bg-[#090d16] text-slate-200 font-sans antialiased pb-20 selection:bg-indigo-500/30 selection:text-indigo-300">
            
            {/* Header Navigation */}
            <header className="px-6 py-4 bg-[#0d1322]/80 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-30 shadow-2xl">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-pulse"></div>
                        <span className="font-mono text-xs sm:text-sm font-semibold tracking-wider text-slate-200 uppercase">
                            SankalpCode <span className="text-indigo-400 font-normal">/ DevSpace</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-xs">
                        {!isEditing ? (
                            <button 
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 rounded-xl font-medium transition-all shadow-sm active:scale-95"
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <button 
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl font-medium transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                        )}
                        <NavLink 
                            to="/" 
                            className="px-4 py-2 bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 rounded-xl transition-all"
                        >
                            Dashboard
                        </NavLink>
                    </div>
                </div>
            </header>

            {/* System Status Message */}
            {systemMsg.text && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
                    <div className={`p-3.5 text-xs text-center rounded-xl border font-mono backdrop-blur-md shadow-lg ${
                        systemMsg.type === "error" 
                            ? "bg-red-950/40 border-red-500/30 text-red-300" 
                            : "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                    }`}>
                        {systemMsg.text}
                    </div>
                </div>
            )}

            <form onSubmit={handleCommitChanges} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
                
                {/* Hero Header Card */}
                <div className="bg-[#0f172a]/90 border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl relative">
                    <div className="h-36 sm:h-48 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 relative border-b border-slate-800/60">
                        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:20px_20px]"></div>
                    </div>

                    <div className="px-6 sm:px-8 pb-6 relative flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 sm:-mt-20">
                        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
                            <div className="relative group">
                                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-[#0d1322] border-2 border-indigo-500/40 shadow-xl shadow-indigo-500/10 flex items-center justify-center text-3xl font-mono text-indigo-400 backdrop-blur-md">
                                    &lt;/&gt;
                                </div>
                                <div className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 border-2 border-[#0d1322] rounded-full shadow-md"></div>
                            </div>

                            <div className="space-y-1.5 mb-1">
                                {isEditing ? (
                                    <input 
                                        type="text"
                                        name="name"
                                        value={profileData.name}
                                        onChange={handleInputChange}
                                        className="bg-[#090d16] border border-indigo-500/50 rounded-xl px-3 py-1.5 text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                                        placeholder="Your Name"
                                    />
                                ) : (
                                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                                        {profileData.name}
                                    </h1>
                                )}
                                <p className="text-xs sm:text-sm font-mono text-indigo-400 font-medium">
                                    {profileData.role || "Software Developer"}
                                </p>
                                <p className="text-xs text-slate-400 font-mono">{profileData.email}</p>
                            </div>
                        </div>

                        {isEditing && (
                            <button 
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-xs font-mono rounded-xl transition-all shadow-lg shadow-indigo-500/25 self-center md:self-end active:scale-95 disabled:opacity-50"
                            >
                                {saving ? "Saving Changes..." : "Save Profile"}
                            </button>
                        )}
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Column: Metadata & Side Stats */}
                    <div className="space-y-6">
                        
                        {/* System Metadata Card */}
                        <div className="bg-[#0f172a]/90 border border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
                            <h3 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                Personal Details
                            </h3>
                            <div className="space-y-3.5 text-xs">
                                <div>
                                    <span className="text-slate-500 block text-[10px] font-mono uppercase tracking-wider">Mobile Number</span>
                                    {isEditing ? (
                                        <input 
                                            type="text"
                                            name="mobile"
                                            value={profileData.mobile}
                                            onChange={handleInputChange}
                                            className="w-full bg-[#090d16] border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs mt-1 focus:outline-none focus:border-indigo-500"
                                            placeholder="+91 XXXXX XXXXX"
                                        />
                                    ) : (
                                        <span className="text-slate-300 font-medium">{profileData.mobile || "Not specified"}</span>
                                    )}
                                </div>

                                <div>
                                    <span className="text-slate-500 block text-[10px] font-mono uppercase tracking-wider">Location</span>
                                    {isEditing ? (
                                        <input 
                                            type="text"
                                            name="location"
                                            value={profileData.location}
                                            onChange={handleInputChange}
                                            className="w-full bg-[#090d16] border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs mt-1 focus:outline-none focus:border-indigo-500"
                                            placeholder="City, Country"
                                        />
                                    ) : (
                                        <span className="text-slate-300 font-medium">{profileData.location || "India"}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Coding Score Metric Card */}
                        <div className="bg-[#0f172a]/90 border border-slate-800/80 rounded-2xl p-5 space-y-3 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
                            <h3 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                Coding Score
                            </h3>
                            <div className="bg-[#090d16] border border-slate-800/80 p-4 rounded-xl flex items-baseline justify-between">
                                <div>
                                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Platform Score</p>
                                    <p className="text-3xl font-black text-emerald-400 mt-1 font-mono tracking-tight">
                                        {profileData.score ?? 0}
                                    </p>
                                </div>
                                <span className="text-xs font-mono font-bold text-emerald-500/80 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                                    PTS
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Dynamic Content & Metrics */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Progress Cards */}
                        <div className="bg-[#0f172a]/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
                            <h3 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                Problem Solving Progress
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 bg-[#090d16] border border-slate-800/80 rounded-xl flex flex-col justify-between">
                                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Solved Problems</span>
                                    <span className="text-3xl font-black text-white mt-2 font-mono">{solvedCount}</span>
                                    <span className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
                                        ✓ Verified Submissions
                                    </span>
                                </div>
                                <div className="p-4 bg-[#090d16] border border-slate-800/80 rounded-xl flex flex-col justify-between">
                                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Overall Rating Status</span>
                                    <span className="text-xl font-bold text-indigo-300 mt-2 font-mono">Active Developer</span>
                                    <span className="text-[10px] font-mono text-slate-400 mt-1">SankalpCode Platform</span>
                                </div>
                            </div>
                        </div>

                        {/* Developer Bio & System Objectives */}
                        <div className="bg-[#0f172a]/90 border border-slate-800/80 rounded-2xl p-6 space-y-3 shadow-xl">
                            <h3 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                                Developer Bio & System Objective
                            </h3>
                            {isEditing ? (
                                <textarea 
                                    name="systemObjective"
                                    value={profileData.systemObjective}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full bg-[#090d16] border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                                    placeholder="Write a concise overview about your engineering background, goals, and core stack..."
                                />
                            ) : (
                                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                                    {profileData.systemObjective || "No system objective provided yet. Switch to edit mode to configure your profile summary."}
                                </p>
                            )}
                        </div>

                        {/* Technical Skills Inventory */}
                        <div className="bg-[#0f172a]/90 border border-slate-800/80 rounded-2xl p-6 space-y-3 shadow-xl">
                            <h3 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                                Technical Skills
                            </h3>
                            {isEditing ? (
                                <input 
                                    type="text"
                                    name="skills"
                                    value={profileData.skills}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#090d16] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                                    placeholder="Comma separated skills (e.g. C++, React, Node.js, MongoDB)"
                                />
                            ) : (
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {skillsList.length > 0 ? (
                                        skillsList.map((skill, idx) => (
                                            <span 
                                                key={idx} 
                                                className="px-3 py-1 bg-[#090d16] border border-indigo-500/30 text-indigo-300 text-xs font-mono rounded-lg shadow-sm"
                                            >
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-slate-500 italic">No skills listed yet.</span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Education Details */}
                        <div className="bg-[#0f172a]/90 border border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-xl">
                            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                                <h3 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                                    Academic Qualifications
                                </h3>
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={addEducationField}
                                        className="text-[10px] font-mono font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-1 rounded-lg hover:bg-indigo-500/20 transition-all"
                                    >
                                        + Add Qualification
                                    </button>
                                )}
                            </div>

                            {isEditing ? (
                                <div className="space-y-3">
                                    {profileData.education.map((edu, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <input 
                                                type="text"
                                                value={edu}
                                                onChange={(e) => handleEducationChange(idx, e.target.value)}
                                                className="w-full bg-[#090d16] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                                                placeholder="B.Tech in Computer Science - Institution"
                                            />
                                            {profileData.education.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeEducationField(idx)}
                                                    className="px-3 py-1 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-xl hover:bg-red-950/70 transition-all"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {profileData.education.filter(Boolean).length > 0 ? (
                                        profileData.education.filter(Boolean).map((edu, idx) => (
                                            <div key={idx} className="p-3 bg-[#090d16] border border-slate-800/80 rounded-xl text-xs text-slate-300 font-medium flex items-center gap-2.5">
                                                <span className="text-indigo-400">🎓</span>
                                                <span>{edu}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-500 italic">No academic qualifications listed.</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Achievements Section */}
                        <div className="bg-[#0f172a]/90 border border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-xl">
                            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                                <h3 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                                    Achievements & Badges
                                </h3>
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={addAchievementField}
                                        className="text-[10px] font-mono font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-1 rounded-lg hover:bg-indigo-500/20 transition-all"
                                    >
                                        + Add Achievement
                                    </button>
                                )}
                            </div>

                            {isEditing ? (
                                <div className="space-y-3">
                                    {profileData.achievements.map((ach, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <input 
                                                type="text"
                                                value={ach}
                                                onChange={(e) => handleAchievementChange(idx, e.target.value)}
                                                className="w-full bg-[#090d16] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                                                placeholder="e.g. LeetCode 50 Days Badge, Hackathon Winner"
                                            />
                                            {profileData.achievements.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeAchievementField(idx)}
                                                    className="px-3 py-1 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-xl hover:bg-red-950/70 transition-all"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {profileData.achievements.filter(Boolean).length > 0 ? (
                                        profileData.achievements.filter(Boolean).map((ach, idx) => (
                                            <div key={idx} className="p-3 bg-[#090d16] border border-slate-800/80 rounded-xl text-xs text-slate-300 font-medium flex items-center gap-2.5">
                                                <span>🏆</span>
                                                <span>{ach}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-500 italic">No achievements added yet.</p>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </form>
        </div>
    );
}

export default ProfilePage;