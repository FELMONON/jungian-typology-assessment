import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { ResultsAnalysis } from '../types';
import { FUNCTION_DESCRIPTIONS, ATTITUDE_DESCRIPTIONS, STACK_POSITIONS, THE_GRIP, TYPE_PHENOMENOLOGY, INDIVIDUATION_GUIDANCE } from '../data/questions';
import { Button } from '../components/ui/Button';
import { AlertCircle, Download, RefreshCcw, Layers, ArrowDown, Loader2, BookOpen, AlertTriangle, Compass } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const Results: React.FC = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<ResultsAnalysis | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('jungian_assessment_results');
    if (saved) {
      setResults(JSON.parse(saved));
    } else {
      navigate('/assessment');
    }
  }, [navigate]);

  const generatePDF = async () => {
    if (!contentRef.current || !results) return;

    setIsGeneratingPdf(true);

    try {
      const content = contentRef.current;

      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#fafaf9',
        windowWidth: 1200,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const ratio = pdfWidth / imgWidth;
      const scaledHeight = imgHeight * ratio;

      let heightLeft = scaledHeight;
      let position = 0;
      let page = 0;

      while (heightLeft > 0) {
        if (page > 0) {
          pdf.addPage();
        }

        pdf.addImage(
          imgData,
          'PNG',
          0,
          position,
          pdfWidth,
          scaledHeight
        );

        heightLeft -= pdfHeight;
        position -= pdfHeight;
        page++;
      }

      const dominantFunction = results.stack.dominant.function;
      pdf.save(`jungian-profile-${dominantFunction}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (!results) return null;

  const chartData = results.scores.map(s => ({
    subject: s.function,
    A: s.score,
    fullMark: 100,
  }));

  const barData = [...results.scores].sort((a,b) => b.score - a.score);
  const attitude = results.attitudeScore > 0 ? ATTITUDE_DESCRIPTIONS.E : ATTITUDE_DESCRIPTIONS.I;
  const attitudeType = results.attitudeScore > 0 ? 'Extraversion' : 'Introversion';

  const dominantFunc = results.stack.dominant.function;
  const grip = THE_GRIP[dominantFunc as keyof typeof THE_GRIP];
  const typePhenomenology = TYPE_PHENOMENOLOGY[dominantFunc];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div ref={contentRef} className="bg-stone-50 p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-jung-dark mb-4">Your Jungian Profile</h1>
          <p className="text-stone-600 max-w-2xl mx-auto">
            An in-depth analysis of your conscious preferences and unconscious tendencies, based on Carl Jung's theory of psychological types.
          </p>
          <p className="text-xs text-stone-400 mt-2 italic">
            "Every individual is an exception to the rule." — C.G. Jung
          </p>
        </div>

        {/* Type Summary Banner */}
        <div className="bg-gradient-to-r from-jung-primary to-jung-accent text-white p-6 rounded-lg mb-12 shadow-lg">
          <div className="text-center">
            <p className="text-sm uppercase tracking-widest opacity-80 mb-2">Your Dominant Function</p>
            <h2 className="text-3xl font-serif font-bold mb-2">
              {FUNCTION_DESCRIPTIONS[dominantFunc].title} ({dominantFunc})
            </h2>
            <p className="text-lg opacity-90 italic">"{FUNCTION_DESCRIPTIONS[dominantFunc].quote}"</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Profile Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-100 flex flex-col items-center">
            <h3 className="text-lg font-bold text-jung-secondary mb-4 tracking-wider uppercase">Function-Attitude Energy</h3>
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                  <PolarGrid stroke="#e7e5e4" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#451a03', fontSize: 14, fontWeight: 'bold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Score"
                    dataKey="A"
                    stroke="#b45309"
                    strokeWidth={3}
                    fill="#b45309"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Type Phenomenology */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="bg-white p-6 rounded-lg border border-stone-200">
              <h3 className="text-lg font-serif font-bold text-jung-dark mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-jung-primary" />
                {typePhenomenology.typeName}
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="font-bold text-stone-700">Focus: </span>
                  <span className="text-stone-600">{typePhenomenology.focus}</span>
                </div>
                <div>
                  <span className="font-bold text-stone-700">Behavior: </span>
                  <span className="text-stone-600">{typePhenomenology.behavior}</span>
                </div>
                <div>
                  <span className="font-bold text-stone-700">Historical Parallel: </span>
                  <span className="text-stone-600 italic">{typePhenomenology.historicalExample}</span>
                </div>
              </div>
            </div>

            {/* Attitude Analysis */}
            <div className="bg-stone-50 p-6 rounded-lg border-l-4 border-stone-400">
              <h3 className="text-xl font-serif font-bold text-stone-800 mb-2">
                General Attitude: {attitudeType}
              </h3>
              <p className="text-stone-600 text-sm mb-4">
                {attitude.desc}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white p-3 rounded border border-stone-100">
                  <span className="font-bold text-emerald-700 block mb-1">Strengths</span>
                  {attitude.positive}
                </div>
                <div className="bg-white p-3 rounded border border-stone-100">
                  <span className="font-bold text-red-700 block mb-1">Shadow</span>
                  {attitude.negative}
                </div>
              </div>
            </div>

            {results.isUndifferentiated && (
              <div className="flex items-start gap-3 p-4 bg-amber-50 text-amber-900 rounded-md">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Differentiation Note:</strong> Your profile is relatively balanced (undifferentiated). The stack below is a theoretical projection based on your highest score, but you may not feel strongly bound to this specific hierarchy.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* THE ARCHETYPAL STACK */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8 border-b border-stone-200 pb-4">
            <Layers className="w-8 h-8 text-jung-primary" />
            <div>
              <h2 className="text-3xl font-serif font-bold text-jung-dark">The Archetypal Stack</h2>
              <p className="text-sm text-stone-500">The hierarchy of psychic functions from conscious to unconscious</p>
            </div>
          </div>

          <p className="text-stone-600 max-w-3xl mb-8">
            {STACK_POSITIONS.dominant.description.split('.')[0]}. This stack represents the journey from your most conscious, developed self (the Hero) to the primitive, unconscious doorway to the Self (the Anima/Animus).
          </p>

          <div className="space-y-6">
            {/* Dominant */}
            <div className="bg-white rounded-lg border-l-8 border-jung-primary shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <span className="text-xs font-bold tracking-widest uppercase text-jung-primary mb-1 block">
                      {STACK_POSITIONS.dominant.archetype} • {STACK_POSITIONS.dominant.name}
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-jung-dark">
                      {FUNCTION_DESCRIPTIONS[results.stack.dominant.function].title} ({results.stack.dominant.function})
                    </h3>
                  </div>
                  <div className="mt-2 md:mt-0 px-3 py-1 bg-jung-primary/10 rounded text-jung-primary font-mono text-sm font-bold">
                    Score: {results.stack.dominant.score}
                  </div>
                </div>
                <p className="text-stone-600 mb-4">{FUNCTION_DESCRIPTIONS[results.stack.dominant.function].desc}</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50/50 p-4 rounded border border-emerald-100">
                    <h4 className="font-bold text-emerald-800 mb-2 text-sm">Positive Manifestation</h4>
                    <p className="text-sm text-stone-700">{FUNCTION_DESCRIPTIONS[results.stack.dominant.function].positive}</p>
                  </div>
                  <div className="bg-red-50/50 p-4 rounded border border-red-100">
                    <h4 className="font-bold text-red-800 mb-2 text-sm">Shadow Manifestation</h4>
                    <p className="text-sm text-stone-700">{FUNCTION_DESCRIPTIONS[results.stack.dominant.function].negative}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center py-2 text-stone-300"><ArrowDown className="w-6 h-6" /></div>

            {/* Auxiliary */}
            <div className="bg-white rounded-lg border-l-8 border-jung-accent shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <span className="text-xs font-bold tracking-widest uppercase text-jung-accent mb-1 block">
                      {STACK_POSITIONS.auxiliary.archetype} • {STACK_POSITIONS.auxiliary.name}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-jung-dark">
                      {FUNCTION_DESCRIPTIONS[results.stack.auxiliary.function].title} ({results.stack.auxiliary.function})
                    </h3>
                  </div>
                  <div className="mt-2 md:mt-0 px-3 py-1 bg-stone-100 rounded text-stone-600 font-mono text-sm font-bold">
                    Score: {results.stack.auxiliary.score}
                  </div>
                </div>
                <p className="text-stone-600 text-sm mb-3">{STACK_POSITIONS.auxiliary.description}</p>
                <p className="text-stone-500 text-sm italic">{FUNCTION_DESCRIPTIONS[results.stack.auxiliary.function].desc}</p>
              </div>
            </div>

            <div className="flex justify-center py-2 text-stone-300"><ArrowDown className="w-6 h-6" /></div>

            {/* Tertiary */}
            <div className="bg-white rounded-lg border-l-8 border-stone-400 shadow-sm overflow-hidden opacity-90">
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <span className="text-xs font-bold tracking-widest uppercase text-stone-500 mb-1 block">
                      {STACK_POSITIONS.tertiary.archetype} • {STACK_POSITIONS.tertiary.name}
                    </span>
                    <h3 className="text-lg font-serif font-bold text-stone-700">
                      {FUNCTION_DESCRIPTIONS[results.stack.tertiary.function].title} ({results.stack.tertiary.function})
                    </h3>
                  </div>
                  <div className="mt-2 md:mt-0 px-3 py-1 bg-stone-100 rounded text-stone-600 font-mono text-sm font-bold">
                    Score: {results.stack.tertiary.score}
                  </div>
                </div>
                <p className="text-stone-600 text-sm">{STACK_POSITIONS.tertiary.description}</p>
              </div>
            </div>

            <div className="flex justify-center py-2 text-stone-300"><ArrowDown className="w-6 h-6" /></div>

            {/* Inferior */}
            <div className="bg-stone-900 rounded-lg shadow-md overflow-hidden text-stone-100">
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <span className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-1 block">
                      {STACK_POSITIONS.inferior.archetype} • {STACK_POSITIONS.inferior.name}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-white">
                      {FUNCTION_DESCRIPTIONS[results.stack.inferior.function].title} ({results.stack.inferior.function})
                    </h3>
                  </div>
                  <div className="mt-2 md:mt-0 px-3 py-1 bg-stone-800 rounded text-stone-300 font-mono text-sm font-bold">
                    Score: {results.stack.inferior.score}
                  </div>
                </div>
                <p className="text-stone-300 mb-4 leading-relaxed">
                  {STACK_POSITIONS.inferior.description}
                </p>
                <p className="text-stone-400 text-sm italic">
                  "{FUNCTION_DESCRIPTIONS[results.stack.inferior.function].quote}"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* THE GRIP - Inferior Function Under Stress */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8 border-b border-stone-200 pb-4">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
            <div>
              <h2 className="text-3xl font-serif font-bold text-jung-dark">The Grip</h2>
              <p className="text-sm text-stone-500">When the Inferior Function Takes Over Under Stress</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
            <p className="text-stone-700 mb-4">
              Under extreme stress, fatigue, or when your dominant function fails repeatedly, you may fall into "The Grip" — a state where your inferior function ({grip.inferiorFunction}) erupts in its most primitive, undifferentiated form.
            </p>
            <div className="bg-white rounded-lg p-4 border border-amber-100">
              <h4 className="font-bold text-amber-800 mb-2">What The Grip Looks Like For You:</h4>
              <p className="text-stone-700 text-sm">{grip.gripDescription}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-stone-200">
              <h4 className="font-bold text-stone-700 mb-2 text-sm uppercase tracking-wide">Normal State</h4>
              <p className="text-sm text-stone-600">{grip.normalState}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-stone-200">
              <h4 className="font-bold text-stone-700 mb-2 text-sm uppercase tracking-wide">Common Triggers</h4>
              <p className="text-sm text-stone-600">{grip.triggers}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-stone-200">
              <h4 className="font-bold text-stone-700 mb-2 text-sm uppercase tracking-wide">Path to Recovery</h4>
              <p className="text-sm text-stone-600">{grip.recovery}</p>
            </div>
          </div>
        </section>

        {/* INDIVIDUATION */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8 border-b border-stone-200 pb-4">
            <Compass className="w-8 h-8 text-jung-secondary" />
            <div>
              <h2 className="text-3xl font-serif font-bold text-jung-dark">The Path of Individuation</h2>
              <p className="text-sm text-stone-500">The Journey Toward Wholeness</p>
            </div>
          </div>

          <p className="text-stone-600 mb-8 max-w-3xl">
            {INDIVIDUATION_GUIDANCE.intro}
          </p>

          <div className="bg-stone-100 rounded-lg p-6 mb-6">
            <h4 className="font-bold text-jung-dark mb-4">Working With Your Inferior Function ({results.stack.inferior.function})</h4>
            <p className="text-stone-600 text-sm">
              {INDIVIDUATION_GUIDANCE.inferiorFunctionWork}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {INDIVIDUATION_GUIDANCE.stages.slice(0, 3).map((stage, i) => (
              <div key={i} className="bg-white p-4 rounded-lg border border-stone-200">
                <h4 className="font-bold text-jung-primary mb-2 text-sm">{stage.name}</h4>
                <p className="text-xs text-stone-500 mb-2">{stage.description}</p>
                <p className="text-sm text-stone-700 font-medium">{stage.task}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-stone-800 text-stone-100 rounded-lg">
            <p className="text-sm italic">
              <strong>Caution:</strong> {INDIVIDUATION_GUIDANCE.warning}
            </p>
          </div>
        </section>

        {/* Full Score Breakdown */}
        <section className="mb-8">
          <h2 className="text-xl font-serif font-bold text-jung-dark mb-6 border-b border-stone-200 pb-2">Complete 8-Function Score Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {barData.map((item) => (
              <div key={item.function} className="bg-white p-4 rounded border border-stone-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-bold text-stone-700">{FUNCTION_DESCRIPTIONS[item.function].title}</span>
                  <span className="text-xs text-stone-400">{item.function}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 bg-stone-100 h-2 rounded-full">
                    <div
                      className="bg-jung-primary h-full rounded-full transition-all"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <span className="font-mono font-bold text-stone-500 w-8 text-right">{item.score}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-xs text-stone-400 pt-6 border-t border-stone-200">
          <p>Based on the typological work of Carl Gustav Jung (Psychological Types, CW Vol. 6)</p>
          <p className="mt-1 italic">"The meeting of two personalities is like the contact of two chemical substances: if there is any reaction, both are transformed."</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4 border-t border-stone-200 pt-8 mt-8">
        <Button onClick={generatePDF} disabled={isGeneratingPdf}>
          {isGeneratingPdf ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating PDF...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </>
          )}
        </Button>
        <Button variant="outline" onClick={() => {
          localStorage.removeItem('jungian_assessment_progress');
          localStorage.removeItem('jungian_assessment_results');
          navigate('/assessment');
        }}>
          <RefreshCcw className="mr-2 h-4 w-4" /> Retake Assessment
        </Button>
      </div>
    </div>
  );
};
