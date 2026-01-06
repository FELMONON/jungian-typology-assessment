import { questions } from '../data/questions';
import { AssessmentState, FunctionScore, ResultsAnalysis, FunctionAttitude, Stack } from '../types';

// Helper to find the theoretical opposite
const getOppositeFunction = (func: FunctionAttitude): FunctionAttitude => {
  const map: Record<FunctionAttitude, FunctionAttitude> = {
    'Te': 'Fi', 'Fi': 'Te',
    'Ti': 'Fe', 'Fe': 'Ti',
    'Se': 'Ni', 'Ni': 'Se',
    'Si': 'Ne', 'Ne': 'Si'
  };
  return map[func];
};

const isRational = (f: FunctionAttitude) => ['Te', 'Ti', 'Fe', 'Fi'].includes(f);

export const calculateResults = (answers: Record<string, number>): ResultsAnalysis => {
  const scores: Record<FunctionAttitude, { prefSum: number; prefCount: number; infSum: number; infCount: number }> = {
    Te: { prefSum: 0, prefCount: 0, infSum: 0, infCount: 0 },
    Ti: { prefSum: 0, prefCount: 0, infSum: 0, infCount: 0 },
    Fe: { prefSum: 0, prefCount: 0, infSum: 0, infCount: 0 },
    Fi: { prefSum: 0, prefCount: 0, infSum: 0, infCount: 0 },
    Se: { prefSum: 0, prefCount: 0, infSum: 0, infCount: 0 },
    Si: { prefSum: 0, prefCount: 0, infSum: 0, infCount: 0 },
    Ne: { prefSum: 0, prefCount: 0, infSum: 0, infCount: 0 },
    Ni: { prefSum: 0, prefCount: 0, infSum: 0, infCount: 0 },
  };

  let attitudeBalance = 0; // + for E, - for I

  questions.forEach((q) => {
    const val = answers[q.id];
    if (val === undefined) return;

    if (q.category === 'C') {
      if (q.target === 'E') attitudeBalance += (val - 3);
      if (q.target === 'I') attitudeBalance -= (val - 3);
      return;
    }

    if (q.category === 'A' && q.target in scores) {
      const t = q.target as FunctionAttitude;
      scores[t].prefSum += val;
      scores[t].prefCount += 1;
    } else if (q.category === 'B' && q.target in scores) {
      const t = q.target as FunctionAttitude;
      scores[t].infSum += (6 - val); // Inverse scoring
      scores[t].infCount += 1;
    }
  });

  const finalScores: FunctionScore[] = Object.keys(scores).map((k) => {
    const key = k as FunctionAttitude;
    const data = scores[key];
    
    const prefAvg = data.prefCount > 0 ? data.prefSum / data.prefCount : 3;
    const infAvg = data.infCount > 0 ? data.infSum / data.infCount : 3;

    // Weighting: 70% Preference, 30% Inferior(Inverse)
    const weightedAvg = (prefAvg * 0.7) + (infAvg * 0.3);
    const normalized = Math.round(((weightedAvg - 1) / 4) * 100);

    return {
      function: key,
      score: normalized,
      rawPreference: prefAvg,
      rawInferior: infAvg,
      normalized
    };
  });

  // Sort by score descending to find empirical dominance
  finalScores.sort((a, b) => b.score - a.score);

  const dominant = finalScores[0];
  
  // Theoretical Stack Calculation
  // 1. Dominant: The highest scorer.
  // 2. Inferior: The theoretical opposite of the Dominant (regardless of its actual score).
  const theoreticalInferiorName = getOppositeFunction(dominant.function);
  const theoreticalInferior = finalScores.find(f => f.function === theoreticalInferiorName)!;

  // 3. Auxiliary: The highest scoring function that is of the OPPOSITE rationality to Dominant.
  // (e.g., If Dom is Judging, Aux must be Perceiving).
  const domIsRational = isRational(dominant.function);
  const auxiliary = finalScores.find(f => 
    isRational(f.function) !== domIsRational && 
    f.function !== theoreticalInferiorName // Should implicitly be true but safe to check
  )!;

  // 4. Tertiary: The theoretical opposite of the Auxiliary.
  const theoreticalTertiaryName = getOppositeFunction(auxiliary.function);
  const tertiary = finalScores.find(f => f.function === theoreticalTertiaryName)!;

  const stack: Stack = {
    dominant,
    auxiliary,
    tertiary,
    inferior: theoreticalInferior
  };

  // Empirical stats
  const differentiation = Math.sqrt(
    finalScores.map(f => f.score).reduce((a, b) => a + Math.pow(b - (finalScores.reduce((x, y) => x + y.score, 0) / 8), 2), 0) / 8
  );

  return {
    scores: finalScores,
    dominant,
    inferior: theoreticalInferior, // Use theoretical inferior for the main analysis
    stack,
    auxiliary,
    differentiation,
    isUndifferentiated: differentiation < 10,
    attitudeScore: attitudeBalance
  };
};