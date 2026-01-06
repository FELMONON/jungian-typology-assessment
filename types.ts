export type FunctionAttitude = 'Te' | 'Ti' | 'Fe' | 'Fi' | 'Se' | 'Si' | 'Ne' | 'Ni';
export type Attitude = 'E' | 'I';

export interface Question {
  id: string;
  text: string;
  category: 'A' | 'B' | 'C' | 'D' | 'E';
  target: FunctionAttitude | Attitude; // What this measures
}

export interface AssessmentState {
  answers: Record<string, number>; // questionId -> value (1-5)
  currentStep: number;
  isComplete: boolean;
  completedAt?: string;
}

export interface FunctionScore {
  function: FunctionAttitude;
  score: number; // 0-100
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

export interface ResultsAnalysis {
  scores: FunctionScore[];
  dominant: FunctionScore;
  inferior: FunctionScore; // This is the empirically lowest score
  stack: Stack; // This is the theoretical structural stack
  auxiliary?: FunctionScore;
  differentiation: number; // Standard deviation or similar metric
  isUndifferentiated: boolean;
  attitudeScore: number; // > 0 Extraverted, < 0 Introverted (roughly)
}

export interface FunctionDescription {
  title: string;
  desc: string;
  quote: string;
  positive: string; // The "Light" side
  negative: string; // The "Shadow" side
}