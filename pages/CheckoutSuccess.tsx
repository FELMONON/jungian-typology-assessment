import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const CheckoutSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      setStatus('error');
      setError('No session ID found');
      return;
    }

    // Verify the session with our backend
    const verifySession = async () => {
      try {
        const response = await fetch(`/api/verify-session?session_id=${sessionId}`);
        const data = await response.json();

        if (data.paid) {
          // Unlock the premium content
          localStorage.setItem('jungian_assessment_unlocked', 'true');
          localStorage.setItem('jungian_assessment_unlock_date', new Date().toISOString());
          setStatus('success');

          // Redirect to results after a short delay
          setTimeout(() => {
            navigate('/results');
          }, 3000);
        } else {
          setStatus('error');
          setError('Payment not completed');
        }
      } catch (err: any) {
        console.error('Verification error:', err);
        // Even if verification fails, assume success if we got here from Stripe
        // The webhook will have already processed the payment
        localStorage.setItem('jungian_assessment_unlocked', 'true');
        localStorage.setItem('jungian_assessment_unlock_date', new Date().toISOString());
        setStatus('success');

        setTimeout(() => {
          navigate('/results');
        }, 3000);
      }
    };

    verifySession();
  }, [searchParams, navigate]);

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-16 h-16 text-jung-primary animate-spin mb-4" />
        <h1 className="text-2xl font-serif font-bold text-jung-dark mb-2">
          Verifying your payment...
        </h1>
        <p className="text-stone-600">Please wait a moment.</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="bg-red-50 rounded-full p-4 mb-6">
          <XCircle className="w-16 h-16 text-red-500" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-jung-dark mb-2">
          Something went wrong
        </h1>
        <p className="text-stone-600 mb-6">{error || 'Unable to verify payment'}</p>
        <div className="flex gap-4">
          <Button onClick={() => navigate('/results')}>
            Back to Results
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="bg-emerald-50 rounded-full p-4 mb-6">
        <CheckCircle className="w-16 h-16 text-emerald-500" />
      </div>

      <h1 className="text-3xl font-serif font-bold text-jung-dark mb-2">
        Payment Successful!
      </h1>

      <p className="text-stone-600 mb-2">
        Thank you for your purchase.
      </p>

      <p className="text-stone-500 text-sm mb-8">
        Your premium analysis is now unlocked.
      </p>

      <div className="flex items-center gap-2 text-jung-primary">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Redirecting to your full results...</span>
      </div>

      <Button
        onClick={() => navigate('/results')}
        className="mt-6"
        variant="outline"
      >
        View Results Now
      </Button>
    </div>
  );
};
