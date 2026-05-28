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
        achievements: [""] 
    });

    const [solvedCount, setSolvedCount] = useState(0); // Kept isolated state to protect payload synchronization
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [systemMsg, setSystemMsg] = useState({ type: "", text: "" });

    // API Pipeline: Fetch structural configurations
    useEffect(() => {
        const fetchEngineIdentity = async () => {
            try {
                setLoading(true);
                const res = await axiosclient.get("/user/getprofile"); 
                if (res.data) {
                    // Safe conversion check for legacy comma strings or new multi-arrays
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
                        name: res.data.name || "Anonymous_Node",
                        role: res.data.role || "User_Shell",
                        email: res.data.email || "",
                        mobile: res.data.mobile || "", 
                        location: res.data.location || "",
                        systemObjective: res.data.systemObjective || "",
                        education: parsedEd.length ? parsedEd : [""],
                        skills: Array.isArray(res.data.skills) ? res.data.skills.join(", ") : res.data.skills || "",
                        achievements: parsedAch.length ? parsedAch : [""]
                    });
                    setSolvedCount(Array.isArray(res.data.problemsolved) ? res.data.problemsolved.length : 0);
                }
            } catch (err) {
                console.error("DB Execution Trace Error:", err);
                setSystemMsg({ type: "error", text: "❌ Code 404/500: Database pipe handshake failed." });
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

    // Handler arrays for Academic Dynamic Qualifications
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

    // Handler arrays for Achievements Matrix
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

    // Committing changed memory frames to remote database server
   // Committing changed memory frames to remote database server
   const handleCommitChanges = async (e) => {
    e.preventDefault();
    try {
        setSaving(true);
        setSystemMsg({ type: "", text: "" });

        const arraySkills = profileData.skills.split(",").map(s => s.trim()).filter(s => s !== "");
        
        // 1. Clean empty strings out of arrays
        const cleanEducationArray = profileData.education.map(e => e.trim()).filter(Boolean);
        const cleanAchievementsArray = profileData.achievements.map(a => a.trim()).filter(Boolean);

        // 2. Convert them BACK to comma-separated strings to match your exact backend structure
        const stringEducation = cleanEducationArray.join(", ");
        const stringAchievements = cleanAchievementsArray.join(", ");

        const payload = {
            name: profileData.name,
            mobile: profileData.mobile,
            location: profileData.location,
            systemObjective: profileData.systemObjective,
            education: stringEducation,     // Transmits as clean legacy string
            skills: arraySkills,
            achievements: stringAchievements // Transmits as clean legacy string
        };

        await axiosclient.put("/user/getprofile/update", payload);
        setSystemMsg({ type: "success", text: "✓ Configuration matrix successfully saved to server memory." });
        setIsEditing(false);
    } catch (err) {
        console.error("Write execution exception:", err);
        setSystemMsg({ type: "error", text: "❌ Commit Rejected: API routing parameters failed." });
    } finally {
        setSaving(false);
    }
};

    if (loading) {
        return (
            <div className="h-screen bg-[#020c1b] flex flex-col items-center justify-center font-mono text-primary gap-3">
                <span className="loading loading-spinner loading-md text-primary"></span>
                <span className="text-xs uppercase tracking-[0.25em]">Accessing database frames...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020c1b] text-slate-300 font-mono antialiased selection:bg-primary/20 selection:text-white">
            
            {/* Top Control Terminal Console Header */}
            <header className="p-4 bg-[#0a192f]/70 border-b border-primary/30 backdrop-blur-md flex justify-between items-center px-4 sm:px-8 shadow-[0_4px_25px_rgba(0,0,0,0.5)] sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <h1 className="text-[10px] sm:text-xs font-bold tracking-[0.15em] sm:tracking-[0.25em] text-primary uppercase whitespace-nowrap">
                        My_Profile_space
                    </h1>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    {!isEditing ? (
                        <button 
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="px-2.5 sm:px-4 py-1.5 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase bg-primary/10 text-primary border border-primary/30 hover:border-primary hover:bg-primary/20 transition-all duration-200 rounded-lg whitespace-nowrap"
                        >
                            Edit_Profile
                        </button>
                    ) : (
                        <button 
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-2.5 sm:px-4 py-1.5 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase bg-transparent text-slate-500 border border-slate-800 hover:text-slate-300 hover:border-slate-600 transition-all duration-200 rounded-lg whitespace-nowrap"
                        >
                            Cancel_Write
                        </button>
                    )}
                    <NavLink 
                        to="/" 
                        className="px-2.5 sm:px-4 py-1.5 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase bg-transparent text-primary hover:bg-primary/10 border border-primary/40 hover:border-primary transition-all duration-200 rounded-lg whitespace-nowrap"
                    >
                        Exit_Terminal
                    </NavLink>
                </div>
            </header>

            {/* Notification Bar Stack */}
            {systemMsg.text && (
                <div className={`max-w-6xl mx-auto mt-4 mx-4 md:mx-6 p-3 border text-xs text-center rounded-lg ${
                    systemMsg.type === "error" 
                        ? "bg-red-950/20 border-red-500/20 text-red-400" 
                        : "bg-emerald-950/20 border-emerald-500/20 text-emerald-400"
                }`}>
                    {systemMsg.text}
                </div>
            )}

            {/* Profile Architecture Layout Container */}
            <form onSubmit={handleCommitChanges} className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Left Panel Vector Layout - Static Credentials */}
                <section className="bg-[#0a192f]/40 border border-primary/20 rounded-xl p-4 sm:p-6 flex flex-col items-center text-center shadow-[0_4px_25px_rgba(0,0,0,0.2)] backdrop-blur-sm h-fit">
                    <div className="relative w-24 h-24 rounded-full border-2 border-primary/20 flex items-center justify-center bg-[#020c1b] mb-4">
                        <div className="text-2xl text-primary/40 select-none">&lt;/&gt;</div>
                        <div className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-500 border-2 border-[#020c1b] rounded-full"></div>
                    </div>

                    {/* Left Div Profile Identity Node Info Group */}
                    {isEditing ? (
                        <div className="w-full space-y-2 mb-2">
                            <input 
                                type="text"
                                name="name"
                                value={profileData.name}
                                onChange={handleInputChange}
                                className="w-full bg-[#020c1b] border border-primary/30 rounded px-2 py-1 text-center text-sm font-bold text-white focus:outline-none focus:border-primary/60 uppercase"
                                placeholder="Core Identity Name"
                            />
                        </div>
                    ) : (
                        <h2 className="text-base font-bold text-white tracking-wide uppercase">
                            {profileData.name}
                        </h2>
                    )}
                    
                    <p className="text-[10px] text-primary/80 font-bold uppercase tracking-wider mt-1">
                        System_{profileData.role}
                    </p>

                    <hr className="w-full border-primary/10 my-5" />

                    {/* Operational Core Parameters Info Array */}
                    <div className="w-full space-y-3.5 text-left text-xs">
                        <div className="p-3 bg-[#020c1b]/60 border border-slate-800/60 rounded-lg">
                            <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider mb-1">Email Id:</span>
                            <span className="text-slate-300 break-all select-all font-sans">{profileData.email || "unconfigured@server.com"}</span>
                        </div>

                        {/* Mobile Number Vector Element */}
                        <div className="p-3 bg-[#020c1b]/60 border border-slate-800/60 rounded-lg">
                            <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider mb-1">Contact number</span>
                            {isEditing ? (
                                <input 
                                    type="text"
                                    name="mobile"
                                    value={profileData.mobile}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#020c1b] border border-primary/30 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-primary/60"
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            ) : (
                                <span className="text-slate-300 font-sans">{profileData.mobile || "Unregistered_Terminal"}</span>
                            )}
                        </div>

                        <div className="p-3 bg-[#020c1b]/60 border border-slate-800/60 rounded-lg">
                            <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider mb-1">Location Coordinates</span>
                            {isEditing ? (
                                <input 
                                    type="text"
                                    name="location"
                                    value={profileData.location}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#020c1b] border border-primary/30 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-primary/60"
                                    placeholder="City, Country"
                                />
                            ) : (
                                <span className="text-slate-300">{profileData.location || "Earth_Node_Standard"}</span>
                            )}
                        </div>
                    </div>
                </section>

                {/* Right Panel Array - Problem counters and Dynamic Fields */}
                <section className="md:col-span-2 space-y-6">
                    
                    {/* Metrics Counter Top Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-[#0a192f]/40 border border-primary/20 rounded-xl p-5 backdrop-blur-sm shadow-[0_4px_15px_rgba(0,0,0,0.15)] flex justify-between items-center">
                            <div>
                                <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-widest mb-0.5">SOLVED_PROBLEMS</span>
                                <span className="text-2xl font-black text-white tracking-tight">{solvedCount}</span>
                            </div>
                            <div className="text-2xl p-2 bg-primary/5 border border-primary/10 rounded-lg text-primary">✓</div>
                        </div>
                        <div className="bg-[#0a192f]/40 border border-slate-800/60 rounded-xl p-5 backdrop-blur-sm shadow-[0_4px_15px_rgba(0,0,0,0.15)] flex justify-between items-center">
                            <div>
                                <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-widest mb-0.5">ENGINE_STATUS</span>
                                <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase block mt-1.5">ONLINE_SYNCED</span>
                            </div>
                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        </div>
                    </div>

                    {/* [01] Objective / About Me Block */}
                    <div className="bg-[#0a192f]/40 border border-primary/10 rounded-xl p-6 backdrop-blur-sm space-y-3">
                        <h3 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-primary/10 pb-2">
                             About_Myself
                        </h3>
                        {isEditing ? (
                            <textarea 
                                name="systemObjective"
                                value={profileData.systemObjective}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="Write complex developer objective summary specifications..."
                                className="w-full bg-[#020c1b]/90 border border-primary/30 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-primary/60 font-mono resize-none shadow-inner"
                            />
                        ) : (
                            <p className="text-xs text-slate-400 leading-relaxed font-sans font-medium">
                                {profileData.systemObjective || "Configure your developer statement matrix to showcase skill definitions."}
                            </p>
                        )}
                    </div>

                    {/* [02] Technology Stack Inventory */}
                    <div className="bg-[#0a192f]/40 border border-primary/10 rounded-xl p-6 backdrop-blur-sm space-y-4">
                        <h3 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-primary/10 pb-2">
                            Skills
                        </h3>
                        {isEditing ? (
                            <div className="space-y-1.5">
                                <span className="text-[9px] text-slate-500 block font-bold uppercase tracking-wider">Separate values via commas:</span>
                                <input 
                                    type="text"
                                    name="skills"
                                    value={profileData.skills}
                                    onChange={handleInputChange}
                                    placeholder="C++, React, Node.js, MongoDB, Data Structures"
                                    className="w-full bg-[#020c1b]/90 border border-primary/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/60"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {profileData.skills.split(",").map(s => s.trim()).filter(s => s !== "").length > 0 ? (
                                    profileData.skills.split(",").map((skill, idx) => (
                                        <span 
                                            key={idx} 
                                            className="px-2.5 py-1 text-[11px] bg-[#020c1b] border border-slate-800 text-slate-300 rounded-md shadow-sm"
                                        >
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-slate-600 italic">No technology vectors mapped inside buffer matrix.</span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* [03] Education Detail Block - Upgraded with Add More functionality */}
                    <div className="bg-[#0a192f]/40 border border-primary/10 rounded-xl p-6 backdrop-blur-sm space-y-4">
                        <div className="flex justify-between items-center border-b border-primary/10 pb-2">
                            <h3 className="text-xs font-bold text-primary uppercase tracking-widest">
                                ACADEMIC_QUALIFICATIONS
                            </h3>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={addEducationField}
                                    className="px-2 py-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 rounded hover:bg-emerald-950/60 transition-all"
                                >
                                    + Add_More
                                </button>
                            )}
                        </div>
                        {isEditing ? (
                            <div className="space-y-3">
                                {profileData.education.map((edu, idx) => (
                                    <div key={idx} className="flex gap-2 items-center">
                                        <input 
                                            type="text"
                                            value={edu}
                                            onChange={(e) => handleEducationChange(idx, e.target.value)}
                                            placeholder="B.Tech in Computer Science - University Name"
                                            className="w-full bg-[#020c1b]/90 border border-primary/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/60"
                                        />
                                        {profileData.education.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeEducationField(idx)}
                                                className="px-2 py-2 text-xs font-bold text-red-400 bg-red-950/20 border border-red-500/20 rounded-lg hover:bg-red-950/40 transition-all"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                {profileData.education.filter(Boolean).length > 0 ? (
                                    profileData.education.filter(Boolean).map((edu, idx) => (
                                        <p key={idx} className="text-xs text-slate-300 font-medium flex items-start gap-2">
                                            <span className="text-primary/70">»</span>
                                            <span>{edu}</span>
                                        </p>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-600 italic">Academic credentials unconfigured.</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* [04] Achievements Dynamic Block - Upgraded with Add More functionality */}
                    <div className="bg-[#0a192f]/40 border border-primary/10 rounded-xl p-6 backdrop-blur-sm space-y-4">
                        <div className="flex justify-between items-center border-b border-primary/10 pb-2">
                            <h3 className="text-xs font-bold text-primary uppercase tracking-widest">
                                ACHIEVEMENTS
                            </h3>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={addAchievementField}
                                    className="px-2 py-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 rounded hover:bg-emerald-950/60 transition-all"
                                >
                                    + Add_More
                                </button>
                            )}
                        </div>
                        {isEditing ? (
                            <div className="space-y-3">
                                {profileData.achievements.map((ach, idx) => (
                                    <div key={idx} className="flex gap-2 items-center">
                                        <input 
                                            type="text"
                                            value={ach}
                                            onChange={(e) => handleAchievementChange(idx, e.target.value)}
                                            placeholder="LeetCode 50 Days Badge, GSSoC Contributor, Platform Top Rank"
                                            className="w-full bg-[#020c1b]/90 border border-primary/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/60"
                                        />
                                        {profileData.achievements.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeAchievementField(idx)}
                                                className="px-2 py-2 text-xs font-bold text-red-400 bg-red-950/20 border border-red-500/20 rounded-lg hover:bg-red-950/40 transition-all"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <ul className="space-y-2.5 text-xs text-slate-400">
                                {profileData.achievements.filter(Boolean).length > 0 ? (
                                    profileData.achievements.filter(Boolean).map((ach, idx) => (
                                        <li key={idx} className="flex items-start gap-2.5">
                                            <span className="text-primary font-bold">»</span>
                                            <span className="font-sans font-medium text-slate-300">{ach}</span>
                                        </li>
                                    ))
                                ) : (
                                    <span className="text-xs text-slate-600 italic block">No milestone registers found in profile tracking metrics.</span>
                                )}
                            </ul>
                        )}
                    </div>

                    {/* Commit Save Button Trigger Row */}
                    {isEditing && (
                        <div className="flex justify-end pt-2">
                            <button 
                                type="submit"
                                disabled={saving}
                                className="bg-primary/10 hover:bg-primary/20 disabled:bg-transparent text-primary disabled:text-slate-600 border border-primary/30 disabled:border-slate-800 px-6 py-2.5 uppercase text-[10px] tracking-[0.2em] font-bold rounded-xl transition-all duration-200 min-w-[150px] shadow-md shadow-primary/5 dynamic-fade-in"
                            >
                                {saving ? "Committing..." : "Commit_Changes"}
                            </button>
                        </div>
                    )}

                </section>
            </form>
        </div>
    );
}

export default ProfilePage;