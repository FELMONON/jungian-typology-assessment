import React, { useState } from 'react';
import { Lock, Check, Loader2, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';

interface PaywallGateProps {
  onUnlock?: () => void;
}

const PREMIUM_FEATURES = [
  'Complete Archetypal Stack Analysis (Hero, Parent, Child, Anima/Animus)',
  'The Grip: Your Stress Response Patterns',
  'Individuation Guidance: Your Path to Wholeness',
  'Type Phenomenology: Deep Behavioral Insights',
  'Downloadable PDF Report',
];

export const PaywallGate: React.FC<PaywallGateProps> = ({ onUnlock }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUnlock = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: import.meta.env.VITE_STRIPE_PRICE_ID,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative my-12">
      {/* Gradient fade overlay for content above */}
      <div className="absolute -top-20 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-stone-100 pointer-events-none" />

      <div className="bg-gradient-to-br from-stone-100 to-stone-200 rounded-2xl p-8 md:p-12 border border-stone-300 shadow-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-jung-primary/10 rounded-full mb-4">
            <Lock className="w-8 h-8 text-jung-primary" />
          </div>

          <h2 className="text-3xl font-serif font-bold text-jung-dark mb-3">
            Unlock Your Complete Analysis
          </h2>

          <p className="text-stone-600 max-w-xl mx-auto">
            You've seen the basics. Dive deeper into your psychological type with a comprehensive analysis that reveals your archetypal patterns, stress responses, and path to individuation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Features List */}
          <div className="space-y-3">
            <h3 className="font-bold text-jung-dark mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-jung-primary" />
              Premium Includes:
            </h3>
            {PREMIUM_FEATURES.map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 text-emerald-600" />
                </div>
                <span className="text-stone-700 text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {/* Pricing Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
            <div className="text-center">
              <p className="text-sm text-stone-500 uppercase tracking-wide mb-2">One-Time Payment</p>
              <div className="flex items-baseline justify-center gap-1 mb-4">
                <span className="text-5xl font-bold text-jung-dark">$19</span>
                <span className="text-stone-500">USD</span>
              </div>

              <p className="text-sm text-stone-500 mb-6">
                Lifetime access to this assessment
              </p>

              <Button
                onClick={handleUnlock}
                disabled={isLoading}
                className="w-full py-4 text-lg font-bold bg-jung-primary hover:bg-jung-primary/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-5 w-5" />
                    Unlock Premium Analysis
                  </>
                )}
              </Button>

              {error && (
                <p className="mt-4 text-sm text-red-600">{error}</p>
              )}

              <p className="mt-4 text-xs text-stone-400">
                Secure payment powered by Stripe
              </p>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-6 text-xs text-stone-500 border-t border-stone-300 pt-6">
          <span className="flex items-center gap-1">
            <Check className="w-4 h-4 text-emerald-500" /> Instant Access
          </span>
          <span className="flex items-center gap-1">
            <Check className="w-4 h-4 text-emerald-500" /> No Subscription
          </span>
          <span className="flex items-center gap-1">
            <Check className="w-4 h-4 text-emerald-500" /> Secure Checkout
          </span>
        </div>
      </div>
    </div>
  );
};
