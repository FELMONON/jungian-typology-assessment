import { useState, useCallback } from 'react';
import { readCompletePremiumReport, type PremiumAnalysis } from '../lib/premium-report';
export type { PremiumAnalysis } from '../lib/premium-report';

export interface FunctionScore {
  function: string;
  score: number;
  rawPreference: number;
  rawInferior: number;
  normalized: number;
}

export interface Stack {
  dominant: FunctionScore;
  auxiliary: FunctionScore;
  tertiary: FunctionScore;
  inferior: FunctionScore;
}

export interface AnalysisInput {
  scores: FunctionScore[];
  stack: Stack;
  attitudeScore: number;
  isUndifferentiated: boolean;
  resultVersion?: string;
  depthResult?: unknown;
  checkoutSessionId?: string;
}

export function useAiAnalysis() {
  const [freeAnalysis, setFreeAnalysis] = useState<string | null>(null);
  const [premiumAnalysis, setPremiumAnalysis] = useState<PremiumAnalysis | null>(null);
  const [isLoadingFree, setIsLoadingFree] = useState(false);
  const [isLoadingPremium, setIsLoadingPremium] = useState(false);
  const [freeError, setFreeError] = useState<string | null>(null);
  const [premiumError, setPremiumError] = useState<string | null>(null);

  const fetchFreeAnalysis = useCallback(async (input: AnalysisInput) => {
    setIsLoadingFree(true);
    setFreeError(null);
    
    try {
      const response = await fetch('/api/ai/free-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate analysis');
      }

      const data = await response.json();
      setFreeAnalysis(data.analysis);
      return data.analysis;
    } catch (error: any) {
      setFreeError(error.message);
      return null;
    } finally {
      setIsLoadingFree(false);
    }
  }, []);

  const fetchPremiumAnalysis = useCallback(async (input: AnalysisInput) => {
    setIsLoadingPremium(true);
    setPremiumError(null);
    
    try {
      const response = await fetch('/api/ai/premium-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate premium analysis');
      }

      const data = await response.json();
      const report = readCompletePremiumReport(data.analysis);
      if (!report) throw new Error('Your personalized report is incomplete. Please try again later or contact support.');
      setPremiumAnalysis(report);
      return report;
    } catch (error: any) {
      setPremiumError(error.message);
      return null;
    } finally {
      setIsLoadingPremium(false);
    }
  }, []);

  return {
    freeAnalysis,
    premiumAnalysis,
    isLoadingFree,
    isLoadingPremium,
    freeError,
    premiumError,
    fetchFreeAnalysis,
    fetchPremiumAnalysis,
  };
}
