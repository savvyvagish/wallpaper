import { createContext, useState, useEffect, useContext } from 'react';
import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';

// Initialize localforage store for wallpapers
localforage.config({
    name: 'WallpaperVault',
    storeName: 'wallpapers_v2'
});

const WallpaperContext = createContext();

const DEFAULT_WALLPAPERS = [
    { id: '1', title: 'The Odyssey', resolution: '4K', img: '/wallpapers/the-odyssey-movie-ly.jpg', category: 'Cinema' },
    { id: '2', title: 'Italian GP 2024', resolution: '4K', img: '/wallpapers/Italian%20GP%202024%20Desktop%20Wallpaper%203.jpg', category: 'Motorsport' },
    { id: '3', title: 'Mexico City GP 2024', resolution: '4K', img: '/wallpapers/Mexico%20City%20GP%202024%20Desktop%20Wallpaper%201.jpg', category: 'Motorsport' },
    { id: '4', title: 'Neon Numbers', resolution: '5K', img: '/wallpapers/Neon%20Numbers%20Desktop%20Wallpaper%201.png', category: 'Abstract' },
    { id: '5', title: 'Up Close', resolution: '4K', img: '/wallpapers/getting-up-close-and-personal.avif', category: 'Photography' },
    { id: '6', title: 'W1', resolution: '4K', img: '/wallpapers/W1.jpg', category: 'Photography' },
    { id: '7', title: 'Lunar Night', resolution: '4K', img: '/wallpapers/desktop-wallpaper_ln_2025.jpg', category: 'Space' },
    { id: '8', title: 'Home', resolution: '4K', img: '/wallpapers/Home_page_in_between.jpg', category: 'Design' },
    { id: '9', title: 'Ethereal', resolution: '4K', img: '/wallpapers/wallhaven-6l5yzw.png', category: 'Abstract' },
    { id: '10', title: 'Serenity', resolution: '4K', img: '/wallpapers/wallhaven-6lqr1x.jpg', category: 'Photography' },
    { id: '11', title: 'Dusk', resolution: '4K', img: '/wallpapers/wallhaven-8ge5zo.jpg', category: 'Nature' },
    { id: '12', title: 'Void', resolution: '4K', img: '/wallpapers/wallhaven-e83oj8.png', category: 'Abstract' },
    { id: '13', title: 'Horizon', resolution: '4K', img: '/wallpapers/wallhaven-jewk7y.jpg', category: 'Landscape' },
    { id: '14', title: 'Drift', resolution: '4K', img: '/wallpapers/wallhaven-w5126q.jpg', category: 'Photography' },
    { id: '15', title: 'Prism', resolution: '5K', img: '/wallpapers/wallhaven-yq579k.png', category: 'Abstract' },
    { id: '16', title: 'Eclipse', resolution: '5K', img: '/wallpapers/wallhaven-zpzkyw.png', category: 'Space' },
    { id: '17', title: 'M35', resolution: '4K', img: '/wallpapers/M351664.jpg', category: 'Motorsport' },
    { id: '18', title: 'Fragment', resolution: '4K', img: '/wallpapers/8827d13a-09ac-4568-8be2-eda9de5ec702.jpg', category: 'Abstract' },
];

export const WallpaperProvider = ({ children }) => {
    const [wallpapers, setWallpapers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadWallpapers = async () => {
            try {
                // Always use the local defaults — reset stored data to match
                await localforage.setItem('wallpapers_list', DEFAULT_WALLPAPERS);
                setWallpapers(DEFAULT_WALLPAPERS);
            } catch (error) {
                console.error("Error loading wallpapers:", error);
                setWallpapers(DEFAULT_WALLPAPERS);
            } finally {
                setIsLoading(false);
            }
        };

        loadWallpapers();
    }, []);

    const addWallpaper = async (newWallpaper) => {
        const wallpaperToAdd = {
            ...newWallpaper,
            id: uuidv4(),
            createdAt: Date.now()
        };

        try {
            const updatedWallpapers = [wallpaperToAdd, ...wallpapers];
            await localforage.setItem('wallpapers_list', updatedWallpapers);
            setWallpapers(updatedWallpapers);
            return wallpaperToAdd;
        } catch (error) {
            console.error("Error saving new wallpaper to IndexedDB:", error);
            throw error;
        }
    };

    const getWallpaperById = (id) => {
        return wallpapers.find(w => w.id === id);
    };

    return (
        <WallpaperContext.Provider value={{ wallpapers, addWallpaper, getWallpaperById, isLoading }}>
            {children}
        </WallpaperContext.Provider>
    );
};

export const useWallpapers = () => {
    return useContext(WallpaperContext);
};
