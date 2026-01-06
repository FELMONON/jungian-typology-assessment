import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions } from '../data/questions';
import { calculateResults } from '../utils/scoring';
import { Button } from '../components/ui/Button';

export const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  
  // Group questions by 4 for better UX
  const QUESTIONS_PER_PAGE = 4;
  
  // Randomize questions on mount ideally, but for now simple slice
  // In a real app we'd shuffle 'questions' array once and store order
  
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const currentQuestions = questions.slice(currentIdx * QUESTIONS_PER_PAGE, (currentIdx + 1) * QUESTIONS_PER_PAGE);

  // Load progress from local storage
  useEffect(() => {
    const saved = localStorage.getItem('jungian_assessment_progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswers(parsed.answers || {});
        setCurrentIdx(parsed.currentStep || 0);
      } catch (e) {
        console.error("Failed to load progress", e);
      }
    }
  }, []);

  const handleAnswer = (qid: string, value: number) => {
    const newAnswers = { ...answers, [qid]: value };
    setAnswers(newAnswers);
    localStorage.setItem('jungian_assessment_progress', JSON.stringify({
      answers: newAnswers,
      currentStep: currentIdx
    }));
  };

  const handleNext = () => {
    if (currentIdx < totalPages - 1) {
      setCurrentIdx(p => p + 1);
      window.scrollTo(0, 0);
    } else {
      finishAssessment();
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx(p => p - 1);
      window.scrollTo(0, 0);
    }
  };

  const finishAssessment = () => {
    const results = calculateResults(answers);
    localStorage.setItem('jungian_assessment_results', JSON.stringify(results));
    // Clear progress but keep results
    localStorage.removeItem('jungian_assessment_progress');
    navigate('/results');
  };

  const isPageComplete = currentQuestions.every(q => answers[q.id] !== undefined);
  const progress = ((currentIdx) / totalPages) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-bold text-jung-dark mb-2">Assessment</h2>
        <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-jung-primary h-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-stone-500 mt-2">Part {currentIdx + 1} of {totalPages}</p>
      </div>

      <div className="space-y-12">
        {currentQuestions.map((q) => (
          <div key={q.id} className="bg-white p-6 rounded-lg shadow-sm border border-stone-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-medium text-stone-800 mb-6 leading-relaxed">
              {q.text}
            </h3>
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest hidden sm:block">Disagree</span>
              <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-center">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleAnswer(q.id, val)}
                    className={`
                      w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-200
                      ${answers[q.id] === val 
                        ? 'bg-jung-primary text-white scale-110 shadow-md ring-2 ring-offset-2 ring-jung-primary' 
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}
                    `}
                    aria-label={`Rate ${val} out of 5`}
                  >
                    {val}
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest hidden sm:block">Agree</span>
            </div>
            <div className="flex justify-between sm:hidden mt-2 px-1">
               <span className="text-xs font-bold text-stone-400 uppercase">Disagree</span>
               <span className="text-xs font-bold text-stone-400 uppercase">Agree</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-between">
        <Button 
          variant="secondary" 
          onClick={handleBack} 
          disabled={currentIdx === 0}
        >
          Back
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={!isPageComplete}
        >
          {currentIdx === totalPages - 1 ? 'Finish & View Results' : 'Next Section'}
        </Button>
      </div>
    </div>
  );
};