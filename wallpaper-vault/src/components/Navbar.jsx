import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div>{/* Empty intentionally to keep navigation items on the right */}</div>
                <div className="flex items-center gap-8 text-sm font-medium tracking-wide">
                    <Link to="/gallery" className="text-gray-400 hover:text-white transition-colors">
                        Collection
                    </Link>
                    <Link to="/upload" className="text-gray-400 hover:text-white transition-colors">
                        Upload
                    </Link>
                </div>
            </div>
        </nav>
    );
}
