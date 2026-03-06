import { Download } from 'lucide-react';
import { useWallpapers } from '../context/WallpaperContext';

export default function Gallery() {
    const { wallpapers, isLoading } = useWallpapers();

    return (
        <div className="pt-32 pb-24 max-w-[1600px] mx-auto px-6">

            {isLoading ? (
                <div className="w-full h-64 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
            ) : (
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                    {wallpapers.map((wallpaper, index) => (
                        <div
                            key={wallpaper.id}
                            className="relative group break-inside-avoid overflow-hidden rounded-2xl bg-[#111] animate-fade-in-up"
                            style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                        >
                            {/* Uncropped Image */}
                            <img
                                src={wallpaper.img}
                                alt={wallpaper.title}
                                loading="lazy"
                                className="w-full h-auto block transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                            />

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                            {/* Hover Details & Download Button */}
                            <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
                                <div className="flex justify-end relative z-10">
                                    <a
                                        href={wallpaper.img}
                                        download={`${wallpaper.title || 'wallpaper'}.${wallpaper.img.split('.').pop()}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl"
                                        title="Download Wallpaper"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Download className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
