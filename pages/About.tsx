import React from 'react';
import { Activity, AlertTriangle, FileText, Users } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 font-serif text-lg leading-relaxed text-stone-800">
      
      {/* Header */}
      <div className="mb-12 border-b border-stone-200 pb-8">
        <div className="flex items-center gap-3 text-jung-primary mb-4">
          <Activity className="w-6 h-6" />
          <span className="font-sans font-bold uppercase tracking-widest text-sm">Methodology</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-jung-dark mb-6">
          About This Assessment
        </h1>
        <p className="text-xl text-stone-600 leading-relaxed font-sans font-light">
          Why this is not another MBTI clone, and how we attempt to honor Jung's original clinical insights.
        </p>
      </div>

      <div className="prose prose-stone prose-lg max-w-none">
        
        {/* Why this exists */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-jung-dark mb-4">Clinical Insight vs. Classification</h2>
          <p>
            Carl Jung explicitly warned against turning his typology into a classification system. In the foreword to the Argentine Edition (1934), he wrote that using his work to "stick labels on people at first sight" was "nothing but a childish parlor game."
          </p>
          <p>
            Modern instruments like the MBTI have largely done exactly that—creating rigid categories (like "INTJ") that Jung never defined. 
            This project aims to return to the source: <strong>typology as a tool for understanding psychological one-sidedness.</strong>
          </p>
        </section>

        {/* Methodology */}
        <section className="mb-16 bg-stone-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-jung-dark mb-6 flex items-center gap-3">
            <FileText className="w-6 h-6" />
            Our Assessment Methodology
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-jung-primary font-sans uppercase tracking-wide">1. Independent Measurement (Singer-Loomis)</h3>
              <p className="text-base">
                Most tests force you to choose between opposites (e.g., "Are you Thinking OR Feeling?"). This assumes these traits are mutually exclusive. 
                Following the research of <strong>Singer and Loomis (1984)</strong>, we measure all 8 function-attitudes independently using Likert scales. 
                It is empirically possible to have high usage of both Te and Ti, and our results reflect that reality.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-jung-primary font-sans uppercase tracking-wide">2. The Inferior Function as Diagnostic</h3>
              <p className="text-base">
                Conscious self-reporting is flawed; we often describe who we <i>want</i> to be (Persona). 
                Following <strong>Marie-Louise von Franz</strong>, this assessment includes "dysfunction questions" that look for emotional reactivity, 
                stress responses, and rigidity. These "negative" traits are often more reliable indicators of your underlying type structure than your strengths.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-jung-primary font-sans uppercase tracking-wide">3. Theoretical vs. Empirical Stack</h3>
              <p className="text-base">
                Your results show two things: your <strong>Empirical Score</strong> (what you actually reported) and your <strong>Archetypal Stack</strong> (the theoretical structure Jung proposed). 
                Discrepancies between these two are not errors—they are areas for self-reflection.
              </p>
            </div>
          </div>
        </section>

        {/* Limitations */}
        <section className="mb-16">
          <div className="flex items-start gap-4 p-6 bg-amber-50 rounded-lg text-amber-900 border border-amber-100">
            <AlertTriangle className="w-8 h-8 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-xl mb-2">Honest Limitations</h3>
              <p className="text-base mb-2">
                <strong>1. The Persona Problem:</strong> Any self-report questionnaire can only measure your conscious self-image. It cannot directly access the unconscious.
              </p>
              <p className="text-base mb-2">
                <strong>2. Type Changes:</strong> Jung stated, "The type is nothing static. It changes in the course of life." Your results represent your current configuration, not a permanent destiny.
              </p>
              <p className="text-base">
                <strong>3. No Professional Diagnosis:</strong> This tool is for educational and reflective purposes only. Deep typological work usually requires analysis with a trained professional and dream work.
              </p>
            </div>
          </div>
        </section>

        {/* Sources */}
        <section className="mb-12 border-t border-stone-200 pt-8">
          <h3 className="text-xl font-bold text-stone-500 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Primary Sources & Credits
          </h3>
          <ul className="text-sm text-stone-600 space-y-2 font-sans">
            <li><strong>C.G. Jung:</strong> <i>Psychological Types</i> (CW 6), 1921.</li>
            <li><strong>Marie-Louise von Franz & James Hillman:</strong> <i>Lectures on Jung's Typology</i>, 1971.</li>
            <li><strong>June Singer & Mary Loomis:</strong> <i>The Singer-Loomis Type Deployment Inventory</i>, 1984.</li>
            <li><strong>John Beebe:</strong> <i>Energies and Patterns in Psychological Type</i>, 2016.</li>
          </ul>
        </section>

      </div>
    </div>
  );
};