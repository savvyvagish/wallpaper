import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Upload from './pages/Upload';
import { WallpaperProvider } from './context/WallpaperContext';
import TextPressure from './components/reactbits/TextPressure';

function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Lenis smooth scrolling — enabled globally
  useEffect(() => {

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [isHomePage]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white font-sans selection:bg-white selection:text-black overflow-x-hidden">
      {/* Navbar is completely hidden on homepage for an immersive experience */}
      {!isHomePage && <Navbar />}

      <main className="relative flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </main>

      {/* Footer — hidden on homepage for immersive experience */}
      {!isHomePage && (
        <footer className="w-full h-[300px] border-t border-white/5 relative overflow-hidden bg-black flex flex-col items-center justify-center pt-8">
          <div className="z-10 mb-4">
            <span className="text-white/40 text-[10px] md:text-xs font-medium tracking-[0.4em] uppercase">
              Made By
            </span>
          </div>
          <div className="w-full relative flex-grow flex items-center">
            <TextPressure
              text="Vagish Shandilya"
              flex={true}
              alpha={false}
              stroke={false}
              width={true}
              weight={true}
              italic={true}
              textColor="#ffffff"
              className="w-full text-center px-8"
              minFontSize={36}
            />
          </div>
        </footer>
      )}
    </div>
  );
}

function App() {
  return (
    <WallpaperProvider>
      <Router>
        <AppContent />
      </Router>
    </WallpaperProvider>
  );
}

export default App;
