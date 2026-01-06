import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Activity, Home, Info } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans text-stone-800 bg-jung-base selection:bg-jung-accent selection:text-white">
      <header className="sticky top-0 z-50 bg-jung-base/95 backdrop-blur-sm border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
               <Activity className="h-6 w-6 text-jung-primary" />
               <span className="font-serif text-xl font-bold tracking-tight text-jung-primary">JungianTypology</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <NavLink to="/" className={({isActive}) => `text-sm font-medium hover:text-jung-accent transition-colors ${isActive ? 'text-jung-primary font-bold' : 'text-stone-600'}`}>Assessment</NavLink>
              <NavLink to="/learn" className={({isActive}) => `text-sm font-medium hover:text-jung-accent transition-colors ${isActive ? 'text-jung-primary font-bold' : 'text-stone-600'}`}>Learn</NavLink>
              <NavLink to="/about" className={({isActive}) => `text-sm font-medium hover:text-jung-accent transition-colors ${isActive ? 'text-jung-primary font-bold' : 'text-stone-600'}`}>About</NavLink>
            </nav>
            {/* Mobile menu placeholder */}
            <div className="md:hidden">
              <span className="text-jung-primary font-bold">Menu</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-jung-dark text-stone-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-stone-100 font-serif text-lg mb-4">Jungian Typology</h3>
            <p className="text-sm leading-relaxed">
              A tool for self-exploration based on Carl Jung's <i>Psychological Types</i> (1921). 
              Not a diagnostic instrument, but a mirror for reflection.
            </p>
          </div>
          <div>
            <h3 className="text-stone-100 font-serif text-lg mb-4">Key Concepts</h3>
            <ul className="space-y-2 text-sm">
              <li>Individuation</li>
              <li>Differentiation</li>
              <li>Dominant-Inferior Axis</li>
              <li>The 8 Function-Attitudes</li>
            </ul>
          </div>
          <div>
            <h3 className="text-stone-100 font-serif text-lg mb-4">Disclaimer</h3>
            <p className="text-xs leading-relaxed">
              This assessment relies on self-reporting and cannot access the unconscious directly. 
              Results should be viewed as a "current configuration" rather than a fixed identity.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-stone-800 text-center text-xs">
          &copy; {new Date().getFullYear()} Jungian Typology Assessment.
        </div>
      </footer>
    </div>
  );
};