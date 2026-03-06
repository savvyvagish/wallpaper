import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Download } from 'lucide-react';
import { useWallpapers } from '../context/WallpaperContext';

export default function Home() {
  const { wallpapers, isLoading } = useWallpapers();
  const [activeIndex, setActiveIndex] = useState(0);

  const imageRefs = useRef([]);
  const sectionRefs = useRef([]);
  const containerRef = useRef(null);

  // Enable html scroll snapping
  useEffect(() => {
    document.documentElement.classList.add('snap-y', 'snap-mandatory');
    return () => {
      document.documentElement.classList.remove('snap-y', 'snap-mandatory');
    };
  }, []);

  // Intersection Observer for tracking active section
  useEffect(() => {
    if (isLoading || wallpapers.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveIndex(Number(entry.target.dataset.index));
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [isLoading, wallpapers]);

  // RequestAnimationFrame scroll loop for subtle parallax & zoom
  useEffect(() => {
    if (isLoading || wallpapers.length === 0) return;

    let rafId;
    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        imageRefs.current.forEach((imgEl, index) => {
          if (!imgEl) return;
          
          // Assuming each section is 100vh tall
          const sectionTop = index * windowHeight;
          const sectionBottom = sectionTop + windowHeight;

          // Check if section is within the viewport
          if (scrollY + windowHeight >= sectionTop && scrollY <= sectionBottom) {
            const distanceFromCenter = (scrollY + windowHeight / 2) - (sectionTop + windowHeight / 2);
            const progress = Math.abs(distanceFromCenter) / windowHeight;

            // Parallax offset: moves opposite to scroll direction slightly
            const yOffset = distanceFromCenter * 0.15;
            
            // Subtle zoom effect: max zoom (1.08) at center, slightly zoomed out (1.02) at edges
            const scale = 1.08 - (progress * 0.06);

            // Subtle opacity fade out at the very edges to smooth the snap transition
            let opacity = 1;
            if (progress > 0.4) {
              opacity = 1 - ((progress - 0.4) * 2); 
            }

            imgEl.style.transform = `translate3d(0, ${yOffset}px, 0) scale(${scale})`;
            imgEl.style.opacity = Math.max(0, opacity).toFixed(2);
          }
        });
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Trigger initial render

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [isLoading, wallpapers]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  const isEndSection = activeIndex >= wallpapers.length;
  const currentWallpaper = !isEndSection ? wallpapers[activeIndex] : null;

  return (
    <div ref={containerRef} className="w-full bg-[#0a0a0a]">
      {/* Scrollable Wallpaper Sections */}
      {wallpapers.map((wallpaper, index) => (
        <section
          key={wallpaper.id}
          data-index={index}
          ref={(el) => (sectionRefs.current[index] = el)}
          className="relative h-screen w-full snap-start overflow-hidden flex-shrink-0"
        >
          <div
            ref={(el) => (imageRefs.current[index] = el)}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform transform-gpu"
            style={{ 
              backgroundImage: `url(${wallpaper.img})`,
              transform: 'scale(1.08)' // initial default
            }}
          />
        </section>
      ))}

      {/* End of Collection Section */}
      <section
        data-index={wallpapers.length}
        ref={(el) => (sectionRefs.current[wallpapers.length] = el)}
        className="relative h-screen w-full snap-start flex items-center justify-center bg-[#0a0a0a]"
      >
        <div className="text-center px-6 transition-all duration-1000 ease-out">
          <h2 className="text-5xl md:text-8xl lg:text-9xl font-extralight text-white/90 tracking-tighter mb-6">
            End of collection.
          </h2>
          <p className="text-sm md:text-base text-white/20 tracking-[0.3em] uppercase font-medium mb-12">
            Curated with intention
          </p>
          <Link
            to="/gallery"
            className="inline-flex items-center gap-3 px-8 py-4 border border-white/10 text-white/60 rounded-full text-sm tracking-wide hover:bg-white/5 hover:text-white/80 transition-all duration-500"
          >
            Browse full collection
          </Link>
        </div>
      </section>

      {/* Fixed UI Overlays */}
      <div className="fixed inset-0 pointer-events-none z-50 flex flex-col justify-end">
        {/* Top Right — Browse Link */}
        <div className="absolute top-8 right-8 md:top-12 md:right-16 pointer-events-auto transition-opacity duration-500">
          <Link
            to="/gallery"
            className="text-white/40 hover:text-white uppercase tracking-[0.2em] text-xs font-medium transition-colors"
          >
            Browse
          </Link>
        </div>

        {/* Download Button — bottom left */}
        <div 
          className="absolute bottom-16 left-8 md:left-16 pointer-events-auto transition-all duration-500 ease-out"
          style={{
            opacity: isEndSection ? 0 : 1,
            pointerEvents: isEndSection ? 'none' : 'auto',
            transform: isEndSection ? 'translateY(12px)' : 'translateY(0)'
          }}
        >
          {currentWallpaper && (
            <a
              href={currentWallpaper.img}
              download={`${currentWallpaper.title || 'wallpaper'}.${currentWallpaper.img.split('.').pop()}`}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 text-white/60 hover:text-white transition-all duration-300"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full border border-white/20 group-hover:border-white/60 group-hover:scale-105 transition-all duration-300">
                <Download className="w-5 h-5" />
              </div>
              <span className="text-sm tracking-[0.2em] uppercase font-medium">Download</span>
            </a>
          )}
        </div>

        {/* Counter — bottom right */}
        <div 
          className="absolute bottom-16 right-8 md:right-16 transition-all duration-500 ease-out"
          style={{
            opacity: isEndSection ? 0 : 1,
            transform: isEndSection ? 'translateY(10px)' : 'translateY(0)'
          }}
        >
          <span className="text-6xl md:text-8xl font-extralight text-white/20 tabular-nums">
            {!isEndSection && String(activeIndex + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Scroll indicator — first slide only */}
        <div 
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-500"
          style={{
            opacity: activeIndex === 0 && !isEndSection ? 1 : 0,
            pointerEvents: 'none'
          }}
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-medium">
            Scroll
          </span>
          <ChevronDown className="w-4 h-4 text-white/30 animate-bounce" />
        </div>
      </div>
    </div>
  );
}
