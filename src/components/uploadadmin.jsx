// import { useParams } from "react-router";
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import axiosClient from "../utils/axiosclient";
// function Adminuplaod() {
//     const { problemid } = useParams();
//     const [uploading, setuploading] = useState(false);
//     const [uploadprogress, setuploadprogress] = useState(0);
//     const [uploadedvideo, setuploadedvideo] = useState(null);

//     const {
//         register,
//         handleSubmit,
//         watch,
//         formState: { errors },
//         reset,
//         setError,
//         clearErrors
//     } = useForm();
//     // console.log(problemid);

//     const selectfile = watch('videoFile')?.[0];

//     const onSubmit = async (data) => {
//         const file = data.videoFile[0];
//         setuploading(true);
//         setuploadprogress(0);
//         clearErrors();

//         try {
//             const setsignature = await axiosClient.get(`/video/create/${problemid}`);
//             const { signature, timestamp, public_id, api_key, cloud_name, uploadurl } = setsignature.data;
//             const targetUploadUrl = uploadurl || `https://api.cloudinary.com/v1_1/${cloud_name}/video/upload`;
//             const formData = new FormData();
//             formData.append('file', file);
//             formData.append('signature', signature);
//             formData.append('timestamp', timestamp);
//             formData.append('public_id', public_id);
//             formData.append('api_key', api_key);

//             const uploadResponse = await axios.post(targetUploadUrl, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//                 onUploadProgress: (progressEvent) => {
//                     const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//                     setuploadprogress(progress);
//                 },
//             });

//             const cloudinaryResult = uploadResponse.data;
//             // console.log("Cloudinary Upload Success Result:", cloudinaryResult);
//             const metadataResponse = await axiosClient.post('/video/save', {
//                 problemid: problemid,
//                 cloudnaryid: cloudinaryResult.public_id, // ✅ Backend 'cloudnaryid' expect kar raha hai
//                 secureurl: cloudinaryResult.secure_url,   // ✅ Backend 'secureurl' expect kar raha hai
//                 duration: cloudinaryResult.duration,
//             });

//             setuploadedvideo(metadataResponse.data.videoSolution);
//             reset();
//         }
//         catch (err) {
//             console.error('Upload error:', err);
//             setError('root', {
//                 type: 'manual',
//                 message: err.response?.data?.message || 'Upload failed. Please try again.'
//             });
//         } finally {
//             setuploading(false);
//             setuploadprogress(0);
//         }
//     };

//     const formatFileSize = (bytes) => {
//         if (bytes === 0) return '0 Bytes';
//         const k = 1024;
//         const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//         const i = Math.floor(Math.log(bytes) / Math.log(k));
//         return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//     };

//     const formatDuration = (seconds) => {
//         const mins = Math.floor(seconds / 60);
//         const secs = Math.floor(seconds % 60);
//         return `${mins}:${secs.toString().padStart(2, '0')}`;
//     };
//     return (
//         <div className="max-w-md mx-auto p-6">
//             <div className="card bg-base-100 shadow-xl">
//                 <div className="card-body">
//                     <h2 className="card-title">Upload Video</h2>

//                     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                         {/* File Input */}
//                         <div className="form-control w-full">
//                             <label className="label">
//                                 <span className="label-text">Choose video file</span>
//                             </label>
//                             <input
//                                 type="file"
//                                 accept="video/*"
//                                 {...register('videoFile', {
//                                     required: 'Please select a video file',
//                                     validate: {
//                                         isVideo: (files) => {
//                                             if (!files || !files[0]) return 'Please select a video file';
//                                             const file = files[0];
//                                             return file.type.startsWith('video/') || 'Please select a valid video file';
//                                         },
//                                         fileSize: (files) => {
//                                             if (!files || !files[0]) return true;
//                                             const file = files[0];
//                                             const maxSize = 100 * 1024 * 1024; // 100MB
//                                             return file.size <= maxSize || 'File size must be less than 100MB';
//                                         }
//                                     }
//                                 })}
//                                 className={`file-input file-input-bordered w-full ${errors.videoFile ? 'file-input-error' : ''}`}
//                                 disabled={uploading}
//                             />
//                             {errors.videoFile && (
//                                 <label className="label">
//                                     <span className="label-text-alt text-error">{errors.videoFile.message}</span>
//                                 </label>
//                             )}
//                         </div>

//                         {/* Selected File Info */}
//                         {selectfile && (
//                             <div className="alert alert-info">
//                                 <div>
//                                     <h3 className="font-bold">Selected File:</h3>
//                                     <p className="text-sm">{selectfile.name}</p>
//                                     <p className="text-sm">Size: {formatFileSize(selectfile.size)}</p>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Upload Progress */}
//                         {uploading && (
//                             <div className="space-y-2">
//                                 <div className="flex justify-between text-sm">
//                                     <span>Uploading...</span>
//                                     <span>{uploadprogress}%</span>
//                                 </div>
//                                 <progress
//                                     className="progress progress-primary w-full"
//                                     value={uploadprogress}
//                                     max="100"
//                                 ></progress>
//                             </div>
//                         )}

//                         {/* Error Message */}
//                         {errors.root && (
//                             <div className="alert alert-error">
//                                 <span>{errors.root.message}</span>
//                             </div>
//                         )}

//                         {/* Success Message */}
//                         {uploadedvideo && (
//                             <div className="alert alert-success">
//                                 <div>
//                                     <h3 className="font-bold">Upload Successful!</h3>
//                                     <p className="text-sm">Duration: {formatDuration(uploadedvideo.duration)}</p>
//                                     <p className="text-sm">Uploaded: {new Date(uploadedvideo.uploadedAt).toLocaleString()}</p>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Upload Button */}
//                         <div className="card-actions justify-end">
//                             <button
//                                 type="submit"
//                                 disabled={uploading}
//                                 className={`btn btn-primary ${uploading ? 'loading' : ''}`}
//                             >
//                                 {uploading ? 'Uploading...' : 'Upload Video'}
//                             </button>
//                         </div>
//                     </form>

//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Adminuplaod;

import { useParams } from "react-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import axiosClient from "../utils/axiosclient";
import { 
  UploadCloud, 
  Film, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  FileVideo, 
  Clock, 
  Calendar 
} from "lucide-react";

function Adminuplaod() {
    const { problemid } = useParams();
    const [uploading, setuploading] = useState(false);
    const [uploadprogress, setuploadprogress] = useState(0);
    const [uploadedvideo, setuploadedvideo] = useState(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
        setError,
        clearErrors
    } = useForm();

    const selectfile = watch('videoFile')?.[0];

    const onSubmit = async (data) => {
        const file = data.videoFile[0];
        setuploading(true);
        setuploadprogress(0);
        clearErrors();

        try {
            const setsignature = await axiosClient.get(`/video/create/${problemid}`);
            const { signature, timestamp, public_id, api_key, cloud_name, uploadurl } = setsignature.data;
            const targetUploadUrl = uploadurl || `https://api.cloudinary.com/v1_1/${cloud_name}/video/upload`;
            const formData = new FormData();
            formData.append('file', file);
            formData.append('signature', signature);
            formData.append('timestamp', timestamp);
            formData.append('public_id', public_id);
            formData.append('api_key', api_key);

            const uploadResponse = await axios.post(targetUploadUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setuploadprogress(progress);
                },
            });

            const cloudinaryResult = uploadResponse.data;
            const metadataResponse = await axiosClient.post('/video/save', {
                problemid: problemid,
                cloudnaryid: cloudinaryResult.public_id,
                secureurl: cloudinaryResult.secure_url,
                duration: cloudinaryResult.duration,
            });

            setuploadedvideo(metadataResponse.data.videoSolution);
            reset();
        }
        catch (err) {
            console.error('Upload error:', err);
            setError('root', {
                type: 'manual',
                message: err.response?.data?.message || 'Upload failed. Please try again.'
            });
        } finally {
            setuploading(false);
            setuploadprogress(0);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4 sm:p-6">
            <div className="bg-[#0e1626]/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
                
                {/* Header Section */}
                <div className="flex items-center justify-between pb-5 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                            <Film size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white tracking-tight">Upload Video Solution</h2>
                            <p className="text-xs text-slate-400">Problem ID: <span className="text-slate-300 font-mono">{problemid}</span></p>
                        </div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-900/60 border border-slate-800">
                        Max 100MB
                    </span>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    
                    {/* Drag/Drop Style Upload Input Box */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                            Select Video File
                        </label>
                        
                        <div className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer group ${
                            errors.videoFile 
                                ? 'border-red-500/50 bg-red-500/5' 
                                : 'border-slate-800 bg-[#0a0f1d]/50 hover:border-indigo-500/50 hover:bg-[#0e1626]'
                        }`}>
                            <input
                                type="file"
                                accept="video/*"
                                {...register('videoFile', {
                                    required: 'Please select a video file',
                                    validate: {
                                        isVideo: (files) => {
                                            if (!files || !files[0]) return 'Please select a video file';
                                            const file = files[0];
                                            return file.type.startsWith('video/') || 'Please select a valid video file';
                                        },
                                        fileSize: (files) => {
                                            if (!files || !files[0]) return true;
                                            const file = files[0];
                                            const maxSize = 100 * 1024 * 1024; // 100MB
                                            return file.size <= maxSize || 'File size must be less than 100MB';
                                        }
                                    }
                                })}
                                disabled={uploading}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                            />
                            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-200">
                                <UploadCloud size={24} />
                            </div>
                            <p className="text-sm font-medium text-slate-200">
                                Click or drag video file here
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                MP4, WebM, or MKV (Up to 100MB)
                            </p>
                        </div>

                        {errors.videoFile && (
                            <p className="text-xs text-red-400 flex items-center gap-1.5 mt-1">
                                <AlertCircle size={14} />
                                {errors.videoFile.message}
                            </p>
                        )}
                    </div>

                    {/* Selected File Details */}
                    {selectfile && (
                        <div className="bg-[#0a0f1d] border border-slate-800/80 rounded-xl p-3.5 flex items-center justify-between">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="p-2 bg-slate-800 text-indigo-400 rounded-lg">
                                    <FileVideo size={18} />
                                </div>
                                <div className="truncate">
                                    <p className="text-sm font-medium text-slate-200 truncate">{selectfile.name}</p>
                                    <p className="text-xs text-slate-500">{formatFileSize(selectfile.size)}</p>
                                </div>
                            </div>
                            <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded ml-2 whitespace-nowrap">
                                Ready
                            </span>
                        </div>
                    )}

                    {/* Upload Progress Bar */}
                    {uploading && (
                        <div className="space-y-2 p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                            <div className="flex justify-between text-xs font-medium">
                                <span className="text-slate-300 flex items-center gap-2">
                                    <Loader2 size={13} className="animate-spin text-indigo-400" />
                                    Uploading asset...
                                </span>
                                <span className="text-indigo-400 font-mono font-bold">{uploadprogress}%</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                <div 
                                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300 ease-out"
                                    style={{ width: `${uploadprogress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Error Box */}
                    {errors.root && (
                        <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                            <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                            <div className="text-sm text-red-300">
                                {errors.root.message}
                            </div>
                        </div>
                    )}

                    {/* Success Box */}
                    {uploadedvideo && (
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-2">
                            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                                <CheckCircle2 size={18} />
                                Video Uploaded Successfully!
                            </div>
                            <div className="flex flex-wrap gap-4 text-xs text-slate-300 pl-6">
                                <span className="flex items-center gap-1.5">
                                    <Clock size={13} className="text-slate-400" />
                                    Duration: <strong className="text-white">{formatDuration(uploadedvideo.duration)}</strong>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={13} className="text-slate-400" />
                                    Uploaded: <strong className="text-white">{new Date(uploadedvideo.uploadedAt).toLocaleString()}</strong>
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Action Button */}
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={uploading}
                            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                                uploading 
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 active:scale-[0.98]'
                            }`}
                        >
                            {uploading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <UploadCloud size={16} />
                                    Upload Video
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default Adminuplaod;