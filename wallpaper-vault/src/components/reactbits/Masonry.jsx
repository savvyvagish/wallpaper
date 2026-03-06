import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';

const useMedia = (queries, values, defaultValue) => {
    const get = React.useCallback(() => values[queries.findIndex(q => matchMedia(q).matches)] ?? defaultValue, [queries, values, defaultValue]);

    const [value, setValue] = useState(get);

    useEffect(() => {
        const handler = () => setValue(get);
        queries.forEach(q => matchMedia(q).addEventListener('change', handler));
        return () => queries.forEach(q => matchMedia(q).removeEventListener('change', handler));
    }, [queries, get]);

    return value;
};

const useMeasure = () => {
    const ref = useRef(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
        if (!ref.current) return;
        const ro = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            setSize({ width, height });
        });
        ro.observe(ref.current);
        return () => ro.disconnect();
    }, []);

    return [ref, size];
};

const preloadImages = async (urls) => {
    await Promise.all(
        urls.map(
            src =>
                new Promise(resolve => {
                    const img = new Image();
                    img.src = src;
                    img.onload = img.onerror = () => resolve();
                })
        )
    );
};

const Masonry = ({
    items,
    ease = 'power3.out',
    duration = 0.6,
    stagger = 0.05,
    animateFrom = 'bottom',
    scaleOnHover = true,
    hoverScale = 0.95,
    blurToFocus = true,
    colorShiftOnHover = false,
    onItemClick
}) => {
    const columns = useMedia(
        ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)'],
        [5, 4, 3, 2],
        1
    );

    const [containerRef, { width }] = useMeasure();
    const [imagesReady, setImagesReady] = useState(false);

    const getInitialPosition = (item) => {
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!containerRect) return { x: item.x, y: item.y };

        let direction = animateFrom;
        if (animateFrom === 'random') {
            const dirs = ['top', 'bottom', 'left', 'right'];
            direction = dirs[Math.floor(Math.random() * dirs.length)];
        }

        switch (direction) {
            case 'top':
                return { x: item.x, y: -200 };
            case 'bottom':
                return { x: item.x, y: window.innerHeight + 200 };
            case 'left':
                return { x: -200, y: item.y };
            case 'right':
                return { x: window.innerWidth + 200, y: item.y };
            case 'center':
                return {
                    x: containerRect.width / 2 - item.w / 2,
                    y: containerRect.height / 2 - item.h / 2
                };
            default:
                return { x: item.x, y: item.y + 100 };
        }
    };

    useEffect(() => {
        preloadImages(items.map(i => i.img)).then(() => setImagesReady(true));
    }, [items]);

    const grid = useMemo(() => {
        if (!width) return [];
        const colHeights = new Array(columns).fill(0);
        const gap = 24;
        const totalGaps = (columns - 1) * gap;
        const columnWidth = (width - totalGaps) / columns;

        return items.map(child => {
            const col = colHeights.indexOf(Math.min(...colHeights));
            const x = col * (columnWidth + gap);
            const height = child.height / 2;
            const y = colHeights[col];

            colHeights[col] += height + gap;
            return { ...child, x, y, w: columnWidth, h: height };
        });
    }, [columns, items, width]);

    const hasMounted = useRef(false);

    useLayoutEffect(() => {
        if (!imagesReady) return;

        grid.forEach((item, index) => {
            const selector = `[data-key="${item.id}"]`;
            const animProps = { x: item.x, y: item.y, width: item.w, height: item.h };

            if (!hasMounted.current) {
                const start = getInitialPosition(item);
                gsap.fromTo(
                    selector,
                    {
                        opacity: 0,
                        x: start.x,
                        y: start.y,
                        width: item.w,
                        height: item.h,
                        ...(blurToFocus && { filter: 'blur(10px)' })
                    },
                    {
                        opacity: 1,
                        ...animProps,
                        ...(blurToFocus && { filter: 'blur(0px)' }),
                        duration: 0.8,
                        ease: 'power3.out',
                        delay: index * stagger
                    }
                );
            } else {
                gsap.to(selector, {
                    ...animProps,
                    duration,
                    ease,
                    overwrite: 'auto'
                });
            }
        });

        hasMounted.current = true;
    }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease]);

    const handleMouseEnter = (id, element) => {
        if (scaleOnHover) {
            gsap.to(`[data-key="${id}"]`, {
                scale: hoverScale,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
        if (colorShiftOnHover) {
            const overlay = element.querySelector('.color-overlay');
            if (overlay) gsap.to(overlay, { opacity: 0.3, duration: 0.3 });
        }
    };

    const handleMouseLeave = (id, element) => {
        if (scaleOnHover) {
            gsap.to(`[data-key="${id}"]`, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
        if (colorShiftOnHover) {
            const overlay = element.querySelector('.color-overlay');
            if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 });
        }
    };

    return (
        <div ref={containerRef} className="relative w-full h-full">
            {grid.map(item => (
                <div
                    key={item.id}
                    data-key={item.id}
                    className="absolute box-content cursor-pointer"
                    style={{ willChange: 'transform, width, height, opacity' }}
                    onClick={() => onItemClick ? onItemClick(item) : window.open(item.url, '_blank', 'noopener')}
                    onMouseEnter={e => handleMouseEnter(item.id, e.currentTarget)}
                    onMouseLeave={e => handleMouseLeave(item.id, e.currentTarget)}
                >
                    <div className="relative w-full h-full rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden group bg-[#111]">
                        {/* Loading Image Target */}
                        <img
                            src={item.img}
                            alt={item.title || 'Wallpaper'}
                            loading="lazy"
                            onLoad={(e) => {
                                e.currentTarget.classList.remove('opacity-0', 'scale-110', 'blur-sm');
                            }}
                            className="absolute inset-0 w-full h-full object-cover opacity-0 scale-110 blur-sm transition-all duration-[1.5s] ease-out group-hover:scale-[1.03]"
                        />

                        {/* Dark gradient overlay for hover legibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Title revelation on hover */}
                        <div className="absolute bottom-0 left-0 w-full p-6 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out flex justify-between items-end">
                            <span className="text-white font-medium text-base tracking-normal capitalize">{item.title || 'Untitled'}</span>
                            <span className="text-white/60 font-mono text-xs tracking-wider">{item.resolution || '4K'}</span>
                        </div>

                        {colorShiftOnHover && (
                            <div className="color-overlay absolute inset-0 bg-gradient-to-tr from-[#6c5ce7]/50 to-[#2a2a3e]/50 opacity-0 pointer-events-none transition-opacity duration-300" />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Masonry;
