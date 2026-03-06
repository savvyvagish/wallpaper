import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, Image as ImageIcon, CheckCircle } from 'lucide-react';
import FadeContent from '../components/reactbits/FadeContent';
import Magnet from '../components/reactbits/Magnet';
import { useWallpapers } from '../context/WallpaperContext';

export default function Upload() {
    const navigate = useNavigate();
    const { addWallpaper } = useWallpapers();

    const [previewImage, setPreviewImage] = useState(null);
    const [fullImage, setFullImage] = useState(null);

    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const processFile = (file) => {
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target.result;
            setPreviewImage(result);
            setFullImage(result); // Using same format for this minimal demo
            setError('');
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) processFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!previewImage) {
            setError('Please select an image first.');
            return;
        }

        setIsUploading(true);
        setError('');

        try {
            await addWallpaper({
                title: 'Untitled',
                category: 'Uncategorized',
                resolution: 'Original',
                img: fullImage
            });

            setSuccess(true);
            setTimeout(() => {
                navigate('/gallery');
            }, 1500);

        } catch (err) {
            setError('Failed to save wallpaper.');
            console.error(err);
            setIsUploading(false);
        }
    };

    return (
        <FadeContent blur={true} duration={1000} easing="power2.out" initialOpacity={0}>
            <div className="pt-32 pb-24 max-w-4xl mx-auto px-6">
                <div className="bg-[#121212] rounded-3xl p-8 md:p-12 shadow-2xl border border-white/5">

                    {error && (
                        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {success ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-medium text-white mb-2">Upload Complete</h2>
                            <p className="text-gray-400">Redirecting to gallery...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Drag and Drop Zone */}
                            <div
                                className={`w-full h-80 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden relative group
                                    ${isDragging ? 'border-white bg-white/5' : 'border-white/10 bg-[#0a0a0a] hover:border-white/30'}
                                    ${previewImage ? 'border-none' : ''}
                                `}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {previewImage ? (
                                    <>
                                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white font-medium bg-black/50 px-6 py-3 rounded-full backdrop-blur-md border border-white/10">Change Image</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center text-gray-400 pointer-events-none">
                                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-white hover:scale-110 transition-transform">
                                            <UploadIcon className="w-6 h-6" />
                                        </div>
                                        <span className="font-medium text-white mb-1">Click or drag image here</span>
                                        <span className="text-sm">High resolution JPG/PNG</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>

                            {/* Form fields removed for minimalism. The handle submit uses default generated values */}

                            <div className="pt-4">
                                <Magnet padding={30} magnetStrength={4} wrapperClassName="w-full">
                                    <button
                                        type="submit"
                                        disabled={isUploading}
                                        className="w-full py-4 bg-white text-black font-medium text-lg rounded-xl hover:bg-gray-200 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50 disabled:active:scale-100"
                                    >
                                        {isUploading ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                                Processing...
                                            </span>
                                        ) : (
                                            <>
                                                Upload to Vault
                                                <UploadIcon className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </Magnet>
                            </div>

                        </form>
                    )}
                </div>
            </div>
        </FadeContent>
    );
}
