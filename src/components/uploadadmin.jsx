import { useParams } from "react-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import axiosClient from "../utils/axiosclient";
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
    // console.log(problemid);

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
            // console.log("Cloudinary Upload Success Result:", cloudinaryResult);
            const metadataResponse = await axiosClient.post('/video/save', {
                problemid: problemid,
                cloudnaryid: cloudinaryResult.public_id, // ✅ Backend 'cloudnaryid' expect kar raha hai
                secureurl: cloudinaryResult.secure_url,   // ✅ Backend 'secureurl' expect kar raha hai
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
        <div className="max-w-md mx-auto p-6">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Upload Video</h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* File Input */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Choose video file</span>
                            </label>
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
                                className={`file-input file-input-bordered w-full ${errors.videoFile ? 'file-input-error' : ''}`}
                                disabled={uploading}
                            />
                            {errors.videoFile && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.videoFile.message}</span>
                                </label>
                            )}
                        </div>

                        {/* Selected File Info */}
                        {selectfile && (
                            <div className="alert alert-info">
                                <div>
                                    <h3 className="font-bold">Selected File:</h3>
                                    <p className="text-sm">{selectfile.name}</p>
                                    <p className="text-sm">Size: {formatFileSize(selectfile.size)}</p>
                                </div>
                            </div>
                        )}

                        {/* Upload Progress */}
                        {uploading && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Uploading...</span>
                                    <span>{uploadprogress}%</span>
                                </div>
                                <progress
                                    className="progress progress-primary w-full"
                                    value={uploadprogress}
                                    max="100"
                                ></progress>
                            </div>
                        )}

                        {/* Error Message */}
                        {errors.root && (
                            <div className="alert alert-error">
                                <span>{errors.root.message}</span>
                            </div>
                        )}

                        {/* Success Message */}
                        {uploadedvideo && (
                            <div className="alert alert-success">
                                <div>
                                    <h3 className="font-bold">Upload Successful!</h3>
                                    <p className="text-sm">Duration: {formatDuration(uploadedvideo.duration)}</p>
                                    <p className="text-sm">Uploaded: {new Date(uploadedvideo.uploadedAt).toLocaleString()}</p>
                                </div>
                            </div>
                        )}

                        {/* Upload Button */}
                        <div className="card-actions justify-end">
                            <button
                                type="submit"
                                disabled={uploading}
                                className={`btn btn-primary ${uploading ? 'loading' : ''}`}
                            >
                                {uploading ? 'Uploading...' : 'Upload Video'}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default Adminuplaod;