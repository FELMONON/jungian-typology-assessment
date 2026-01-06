import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Compass, Brain, ArrowRight, Activity } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-stone-100 py-20 px-4 text-center border-b border-stone-200">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-block p-3 rounded-full bg-jung-primary/5 mb-4">
             <Compass className="w-12 h-12 text-jung-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-serif text-jung-dark font-medium leading-tight">
            Who are you, <span className="italic text-jung-accent">really</span>?
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Move beyond superficial labels. Explore your psychological one-sidedness and discover the path to individuation with a faithful interpretation of Carl Jung's typology.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/assessment')}>
              Begin Assessment <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/learn')}>
              Learn the Theory
            </Button>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 px-4 bg-jung-base w-full">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="font-serif text-2xl md:text-3xl italic text-jung-secondary leading-relaxed">
            "The classification of individuals means nothing, nothing at all. To understand them, you have to be on the spot... Every individual is an exception to the rule."
          </blockquote>
          <cite className="block mt-6 text-sm font-bold tracking-wider uppercase text-jung-primary">— Carl Gustav Jung</cite>
        </div>
      </section>

      {/* Differentiators */}
      <section className="py-20 px-4 bg-white w-full border-t border-stone-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center text-jung-accent">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-jung-dark">Function Profile, Not a Label</h3>
            <p className="text-stone-600 leading-relaxed">
              We measure all 8 function-attitudes independently using the Singer-Loomis approach. No false dichotomies or forced 4-letter codes.
            </p>
          </div>
          <div className="space-y-4">
             <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center text-jung-accent">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-jung-dark">The Inferior Function</h3>
            <p className="text-stone-600 leading-relaxed">
              Following von Franz, we look for dysfunction and reactivity to identify the "inferior" function—the gateway to the unconscious.
            </p>
          </div>
          <div className="space-y-4">
             <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center text-jung-accent">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-jung-dark">Developmental Focus</h3>
            <p className="text-stone-600 leading-relaxed">
              Your results are a snapshot of your current ego-consciousness. The goal is not to stay comfortably in your type, but to grow.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};