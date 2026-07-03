import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Brain, Compass, Layers, AlertTriangle, ChevronDown, ArrowRight, Sparkles, Zap, HelpCircle, Quote, ExternalLink } from 'lucide-react';
import { FUNCTION_DESCRIPTIONS, STACK_POSITIONS, THE_GRIP } from '../data/questions';
import { Button } from '../components/ui/Button';
import { useSEO, PAGE_SEO } from '../hooks/useSEO';
import { AnalyticsEvents } from '../lib/analytics';

interface AccordionItemProps {
  title: string;
  code?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, code, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-jung-border rounded-lg overflow-hidden bg-jung-surface transition-all duration-300 hover:shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-jung-surface-alt transition-colors"
      >
        <div className="flex items-center gap-4">
          {code && (
            <span className="font-mono font-bold text-lg text-jung-accent bg-jung-accent/10 px-3 py-1.5 rounded-lg">
              {code}
            </span>
          )}
          <span className="font-serif text-lg md:text-xl font-semibold text-jung-dark">{title}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-jung-muted transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px]' : 'max-h-0'}`}>
        <div className="px-5 md:px-6 pb-6 pt-2 border-t border-jung-border">
          {children}
        </div>
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; subtitle?: string }> = ({ icon, title, subtitle }) => (
  <div className="flex items-start gap-4 mb-8">
    <div className="flex-shrink-0 w-14 h-14 rounded-full bg-jung-accent/10 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h2 className="text-display text-2xl md:text-3xl text-jung-dark font-serif">{title}</h2>
      {subtitle && <p className="text-body text-jung-muted mt-1 font-serif">{subtitle}</p>}
    </div>
  </div>
);

const BlockQuote: React.FC<{ children: React.ReactNode; author: string }> = ({ children, author }) => (
  <blockquote className="relative pl-6 py-4 my-8 border-l-4 border-jung-accent bg-jung-surface-alt rounded-r-lg">
    <Quote className="absolute -left-3 -top-3 w-6 h-6 text-jung-accent bg-jung-surface rounded-full p-1" />
    <p className="text-lg text-jung-secondary italic font-serif leading-relaxed">
      {children}
    </p>
    <footer className="text-sm font-bold mt-3 text-jung-accent">— {author}</footer>
  </blockquote>
);

export const LearnTheory: React.FC = () => {
  const functionOrder = ['Te', 'Ti', 'Fe', 'Fi', 'Se', 'Si', 'Ne', 'Ni'];

  // SEO and analytics
  useSEO(PAGE_SEO.learn);
  React.useEffect(() => {
    AnalyticsEvents.theoryPageViewed();
  }, []);

  return (
    <div className="min-h-screen bg-jung-base">
      {/* Hero Header */}
      <header className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-jung-base" />
        <div className="editorial-container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 text-jung-accent mb-6">
              <span className="text-5xl font-serif">ψ</span>
              <BookOpen className="w-8 h-8" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-jung-dark mb-6 leading-tight">
              Learn the Theory
            </h1>
            <p className="text-xl text-jung-secondary max-w-2xl mx-auto leading-relaxed font-serif">
              A comprehensive guide to Carl Jung's psychological typology—the authentic foundation behind modern personality frameworks.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="editorial-container pb-20">
        <div className="max-w-4xl mx-auto">

          {/* Section 1: Origins */}
          <section className="mb-20">
            <SectionHeader
              icon={<BookOpen className="w-7 h-7 text-jung-accent" />}
              title="Why Jung Created Typology"
              subtitle="The origins and philosophy"
            />

            <div className="prose-editorial font-serif">
              <p>
                In 1921, Swiss psychiatrist <strong>Carl Gustav Jung</strong> published <em>Psychological Types</em>,
                a groundbreaking work that would reshape our understanding of human cognition. It wasn't about
                putting people in boxes or assigning labels. Jung wanted to understand
                <strong> why we all perceive and judge the world differently</strong>—and how this natural "one-sidedness"
                shapes our strengths, blind spots, and paths toward psychological growth.
              </p>

              <BlockQuote author="Carl Jung">
                The classification of individuals means nothing, nothing at all. It is only the instrument...
                To understand them, you have to be on the spot.
              </BlockQuote>

              <p>
                Jung noticed that everyone gravitates toward certain ways of thinking, feeling, perceiving, and deciding.
                This creates natural biases—like wearing tinted glasses that color everything we see.
                Typology helps us recognize our particular "tint" so we can transcend it through
                <strong> individuation</strong>—the lifelong journey of becoming a more whole, integrated self.
              </p>

              <div className="card-elevated p-6 my-8">
                <h4 className="font-serif font-bold text-jung-dark mb-3 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-jung-accent" />
                  Simple Analogy
                </h4>
                <p className="text-jung-secondary font-serif">
                  Imagine driving a car. Some people love the accelerator (outward action), others prefer the brakes
                  (inner reflection). Some focus on the map (logic/values), others on the scenery (details/possibilities).
                  Your "driving style" is your type—but the goal is learning to drive skillfully in all conditions.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: How This Differs */}
          <section className="mb-20">
            <SectionHeader
              icon={<Brain className="w-7 h-7 text-jung-accent" />}
              title="How This Assessment Differs"
              subtitle="A more nuanced approach than MBTI"
            />

            <div className="prose-editorial mb-8 font-serif">
              <p>
                The popular Myers-Briggs Type Indicator (MBTI) uses forced-choice questions
                (e.g., "Logic OR feelings?") and outputs 16 fixed "types" (like INFP).
              </p>
              <p><strong>This assessment takes a fundamentally different approach:</strong></p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {[
                {
                  icon: <Layers className="w-5 h-5 text-jung-accent" />,
                  title: 'Function-first method',
                  desc: 'Scores cognitive processes separately instead of forcing either-or choices'
                },
                {
                  icon: <Sparkles className="w-5 h-5 text-jung-accent" />,
                  title: '8 Independent Scales',
                  desc: 'Maps each cognitive process independently—no forcing opposites'
                },
                {
                  icon: <Compass className="w-5 h-5 text-jung-accent" />,
                  title: 'Nuanced Profile',
                  desc: 'You can score high in both logical organization AND group harmony'
                },
                {
                  icon: <ArrowRight className="w-5 h-5 text-jung-accent" />,
                  title: 'Growth-Focused',
                  desc: 'Emphasizes self-reflection and development, not static labels'
                }
              ].map((item, idx) => (
                <div key={idx} className="card-elevated p-6">
                  <div className="w-10 h-10 rounded-full bg-jung-accent/10 flex items-center justify-center mb-3">
                    {item.icon}
                  </div>
                  <h4 className="font-serif font-semibold text-jung-dark mb-2">{item.title}</h4>
                  <p className="text-sm text-jung-muted font-serif">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-jung-surface-alt rounded-xl p-6 text-center">
              <p className="text-jung-dark font-serif text-lg">
                No 4-letter codes. No rigid boxes. Just a mirror for your current psychic configuration.
              </p>
            </div>
          </section>

          {/* Section 3: Psychic Energy */}
          <section className="mb-20">
            <SectionHeader
              icon={<Zap className="w-7 h-7 text-jung-accent" />}
              title="The Foundation: Psychic Energy"
              subtitle="Libido and how it flows"
            />

            <div className="prose-editorial font-serif">
              <p>
                Jung conceived of the mind as a dynamic system powered by energy called <strong>libido</strong>
                (not strictly sexual—rather, a general life force akin to motivation, attention, or psychic vitality).
                This energy flows in characteristic patterns, creating habitual ways of engaging with reality.
              </p>

              <div className="bg-jung-accent-light rounded-xl p-6 my-8 border-l-4 border-jung-accent">
                <h4 className="font-serif font-bold text-jung-dark mb-2">Analogy</h4>
                <p className="text-jung-secondary font-serif">
                  Libido flows like water in a river. It naturally takes one main course—but dams or blocks
                  cause floods (unconscious eruptions). Understanding your flow pattern is the first step
                  toward psychological balance.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: The Two Attitudes */}
          <section className="mb-20">
            <SectionHeader
              icon={<Compass className="w-7 h-7 text-jung-accent" />}
              title="The Two Attitudes"
              subtitle="Where your energy flows"
            />

            <div className="prose-editorial mb-8 font-serif">
              <p>
                Libido flows in one primary direction—this creates <strong>Extraversion</strong> or <strong>Introversion</strong>.
                This is not about being shy or outgoing—it's a deeper orientation of psychic energy.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="card-elevated p-6 border-l-4 border-jung-accent">
                <h3 className="font-serif text-xl font-bold text-jung-dark mb-3 flex items-center gap-2">
                  <span className="text-2xl text-jung-accent">→</span>
                  Extraversion — Outward Flow
                </h3>
                <p className="text-jung-secondary mb-4 font-serif">
                  Energy moves <strong>from you toward the world</strong>. The external object (people, facts, situations)
                  "pulls" your attention. You adapt by engaging, influencing, exploring.
                </p>
                <div className="space-y-2 text-sm font-serif">
                  <p><span className="font-semibold text-emerald-700">Strengths:</span> Action-oriented, adaptable, confident in new situations</p>
                  <p><span className="font-semibold text-rose-700">Blind Spots:</span> Can overlook inner needs; may fear boredom or solitude</p>
                </div>
                <p className="text-jung-muted text-sm mt-4 italic font-serif">
                  Example: At a gathering, you naturally dive in—initiate conversations, organize activities, feed off the collective energy.
                </p>
              </div>

              <div className="card-elevated p-6 border-l-4 border-jung-secondary">
                <h3 className="font-serif text-xl font-bold text-jung-dark mb-3 flex items-center gap-2">
                  <span className="text-2xl text-jung-secondary">←</span>
                  Introversion — Inward Flow
                </h3>
                <p className="text-jung-secondary mb-4 font-serif">
                  Energy moves <strong>from the world back to you</strong>. The subject (inner impressions, values)
                  takes precedence. You filter reality through your inner lens before responding.
                </p>
                <div className="space-y-2 text-sm font-serif">
                  <p><span className="font-semibold text-emerald-700">Strengths:</span> Deep reflection, independence, sustained concentration</p>
                  <p><span className="font-semibold text-rose-700">Blind Spots:</span> Can withdraw excessively; risk of inertia or isolation</p>
                </div>
                <p className="text-jung-muted text-sm mt-4 italic font-serif">
                  Example: At a gathering, you observe first, process internally, then join selectively based on genuine interest.
                </p>
              </div>
            </div>

            <BlockQuote author="Carl Jung">
              The introvert... tries to withdraw libido from the object, as though to prevent the object from gaining power over him.
            </BlockQuote>

            <div className="bg-jung-surface-alt rounded-xl p-6">
              <p className="text-jung-secondary font-serif">
                <strong className="text-jung-dark">Key insight:</strong> Everyone possesses both attitudes—but one dominates
                conscious life. The opposite builds in the unconscious, creating a compensatory dynamic that shapes our growth.
              </p>
            </div>
          </section>

          {/* Section 5: The Four Functions */}
          <section className="mb-20">
            <SectionHeader
              icon={<Brain className="w-7 h-7 text-jung-accent" />}
              title="The Four Functions"
              subtitle="How you process reality"
            />

            <div className="prose-editorial mb-8 font-serif">
              <p>
                We take in and evaluate experience via four basic cognitive "tools"—two pairs of natural opposites.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="card-elevated p-6 border-t-4 border-jung-accent">
                <h3 className="font-serif text-xl font-bold text-jung-accent mb-2">
                  Perceiving Functions (Irrational)
                </h3>
                <p className="text-jung-muted text-sm mb-4 font-serif">
                  "Irrational" means "beyond reason"—they simply register data without judgment.
                </p>
                <div className="space-y-4 font-serif">
                  <div>
                    <span className="font-bold text-jung-dark">Sensation</span>
                    <p className="text-jung-secondary text-sm mt-1">
                      "What exists right now?" Concrete sensory data (sight, touch, body signals).
                      Includes raw emotions (affect) as internal sensations.
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-jung-dark">Intuition</span>
                    <p className="text-jung-secondary text-sm mt-1">
                      "Where is this going?" Unconscious pattern recognition. Sudden "aha!"
                      insights or perceiving hidden meanings and possibilities.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card-elevated p-6 border-t-4 border-jung-dark">
                <h3 className="font-serif text-xl font-bold text-jung-dark mb-2">
                  Judging Functions (Rational)
                </h3>
                <p className="text-jung-muted text-sm mb-4 font-serif">
                  Make ordered judgments and systematic evaluations.
                </p>
                <div className="space-y-4 font-serif">
                  <div>
                    <span className="font-bold text-jung-accent">Thinking</span>
                    <p className="text-jung-secondary text-sm mt-1">
                      "What is true/logical?" Analyzes connections and principles.
                      Focus: Objective facts, systems, "true vs. false."
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-jung-accent">Feeling</span>
                    <p className="text-jung-secondary text-sm mt-1">
                      "What is valuable?" Assigns worth (good/bad, like/dislike).
                      <span className="block text-jung-muted mt-1">
                        <strong>Important:</strong> This is rational valuation, not raw emotion.
                        Emotion = bodily affect. Feeling = systematic "yes/no" based on values.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-jung-surface-alt rounded-xl p-6">
              <h4 className="font-serif font-bold text-jung-dark mb-3">Law of Opposites</h4>
              <p className="text-jung-secondary font-serif">
                Functions compensate each other. Strong Thinking → weak/unconscious Feeling (and vice versa).
                Strong Sensation → weak Intuition. Like left and right hands—one dominant, the other
                underdeveloped but still present (and sometimes "possesses" you under stress).
              </p>
            </div>
          </section>

          {/* Section 6: The 8 Function-Attitudes */}
          <section className="mb-20">
            <SectionHeader
              icon={<span className="text-3xl text-jung-accent font-serif">ψ</span>}
              title="The 8 Function-Attitudes"
              subtitle="The building blocks of cognition"
            />

            <div className="prose-editorial mb-8 font-serif">
              <p>
                Combine attitudes with functions and you get 8 distinct cognitive processes, each with its unique flavor.
                Click each to explore its characteristics.
              </p>
            </div>

            <div className="space-y-4">
              {functionOrder.map(code => {
                const func = FUNCTION_DESCRIPTIONS[code];
                const shortDesc: Record<string, string> = {
                  'Te': 'Efficient external systems',
                  'Ti': 'Precise inner principles',
                  'Fe': 'Group harmony and shared values',
                  'Fi': 'Personal authenticity and deep values',
                  'Se': 'Immersive present-moment reality',
                  'Si': 'Detailed inner impressions and memory',
                  'Ne': 'Brainstorming possibilities',
                  'Ni': 'Deep foresight and symbolic vision'
                };
                return (
                  <AccordionItem key={code} code={code} title={`${func.title} — ${shortDesc[code]}`}>
                    <div className="space-y-4 font-serif">
                      <p className="text-jung-secondary leading-relaxed">{func.desc}</p>

                      <blockquote className="border-l-4 border-jung-accent pl-4 italic text-jung-secondary text-sm py-2">
                        "{func.quote}"
                      </blockquote>

                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-emerald-50 rounded-lg p-4">
                          <h5 className="font-semibold text-emerald-800 mb-2">Positive Expression</h5>
                          <p className="text-sm text-emerald-900">{func.positive}</p>
                        </div>
                        <div className="bg-rose-50 rounded-lg p-4">
                          <h5 className="font-semibold text-rose-800 mb-2">Shadow Side</h5>
                          <p className="text-sm text-rose-900">{func.negative}</p>
                        </div>
                      </div>
                    </div>
                  </AccordionItem>
                );
              })}
            </div>
          </section>

          {/* Section 7: Function Hierarchy */}
          <section className="mb-20">
            <SectionHeader
              icon={<Layers className="w-7 h-7 text-jung-accent" />}
              title="The Function Hierarchy"
              subtitle="Your psychic 'stack'"
            />

            <div className="prose-editorial mb-8 font-serif">
              <p>
                Functions aren't equal in influence—one dominates consciousness while others operate at different levels of awareness.
              </p>
            </div>

            <div className="space-y-4">
              {Object.entries(STACK_POSITIONS).map(([key, position]) => (
                <AccordionItem
                  key={key}
                  title={`${position.name}: ${position.archetype}`}
                  defaultOpen={key === 'dominant'}
                >
                  <div className="space-y-4 font-serif">
                    <p className="text-jung-secondary leading-relaxed">{position.description}</p>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-jung-accent-light rounded-lg p-4 border border-jung-accent/20">
                        <h5 className="font-semibold text-jung-accent mb-2">Development</h5>
                        <p className="text-sm text-jung-secondary">{position.development}</p>
                      </div>
                      <div className="bg-jung-surface-alt rounded-lg p-4">
                        <h5 className="font-semibold text-jung-dark mb-2">Shadow Aspect</h5>
                        <p className="text-sm text-jung-muted">{position.shadow}</p>
                      </div>
                    </div>
                  </div>
                </AccordionItem>
              ))}
            </div>

            <BlockQuote author="Marie-Louise von Franz">
              The inferior function is the ever-bleeding wound... but through it the unconscious can always come in.
            </BlockQuote>

            <div className="bg-jung-accent-light rounded-xl p-5 border border-jung-accent">
              <p className="text-sm text-jung-dark font-serif">
                <strong>Note:</strong> Archetypal labels like "Hero/Parent" are modern extensions (John Beebe)—helpful
                metaphors for understanding the stack, though not Jung's exact terminology.
              </p>
            </div>
          </section>

          {/* Section 8: The Grip */}
          <section className="mb-20">
            <SectionHeader
              icon={<AlertTriangle className="w-7 h-7 text-jung-accent" />}
              title="The Grip"
              subtitle="When stress takes over"
            />

            <div className="prose-editorial mb-8 font-serif">
              <p>
                Under extreme pressure, the inferior function "erupts" primitively—behaviors that feel "not like you."
              </p>
            </div>

            <div className="bg-jung-accent-light border border-jung-accent rounded-xl p-6 mb-6">
              <h4 className="font-serif font-bold text-jung-dark mb-4">Signs You May Be "In the Grip"</h4>
              <ul className="space-y-3 text-jung-secondary font-serif">
                {[
                  'Behaviors that feel foreign or "not like yourself"',
                  'Hypersensitivity in areas you\'re normally confident about',
                  'Rigid, black-and-white thinking where you\'re usually nuanced',
                  'Obsessive focus on things you normally ignore'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-jung-accent mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <details className="card-elevated overflow-hidden group">
              <summary className="p-5 cursor-pointer font-serif font-semibold text-jung-dark hover:bg-jung-surface-alt transition-colors flex items-center justify-between">
                <span>View Grip Patterns by Dominant Function</span>
                <ChevronDown className="w-5 h-5 text-jung-muted group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-5 pt-0 space-y-4 border-t border-jung-border font-serif">
                {Object.entries(THE_GRIP).map(([code, grip]) => (
                  <div key={code} className="border-b border-jung-border pb-4 last:border-0 last:pb-0">
                    <h5 className="font-semibold text-jung-dark mb-2">
                      {code}-Dominant → {grip.inferiorFunction}
                    </h5>
                    <p className="text-sm text-jung-secondary mb-2">{grip.gripDescription}</p>
                    <p className="text-xs text-jung-muted">
                      <strong>Triggers:</strong> {grip.triggers}
                    </p>
                  </div>
                ))}
              </div>
            </details>
          </section>

          {/* Section 9: Misconceptions */}
          <section className="mb-20">
            <SectionHeader
              icon={<HelpCircle className="w-7 h-7 text-jung-accent" />}
              title="Common Misconceptions"
              subtitle="Clearing up confusion"
            />

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { myth: '"Feeling = emotional"', truth: 'Feeling is rational value judgment. Raw emotion = sensation (affect).' },
                { myth: '"Introvert = shy"', truth: 'It\'s energy direction (inner focus), not social behavior or anxiety.' },
                { myth: '"Type is fixed"', truth: 'Your configuration changes with life experiences and conscious development.' },
                { myth: '"Better types exist"', truth: 'All types have unique strengths and blind spots. No hierarchy.' }
              ].map((item, idx) => (
                <div key={idx} className="card-elevated p-5">
                  <h4 className="font-semibold text-jung-dark mb-2 font-serif">{item.myth}</h4>
                  <p className="text-jung-muted text-sm font-serif">
                    <strong className="text-jung-accent">Actually:</strong> {item.truth}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 10: Individuation */}
          <section className="mb-20">
            <SectionHeader
              icon={<Sparkles className="w-7 h-7 text-jung-accent" />}
              title="Individuation"
              subtitle="The real goal of typology"
            />

            <div className="prose-editorial font-serif">
              <p>
                Jung didn't want you to "find your type" and stop there. Typology reveals <strong>one-sidedness</strong>—your
                natural strengths create corresponding blind spots.
              </p>

              <p>
                <strong>Individuation:</strong> The lifelong integration of opposites → becoming a more whole Self.
              </p>

              <ul className="space-y-2 my-6">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-jung-accent mt-2 flex-shrink-0" />
                  <span><strong>First half of life:</strong> Develop dominant/auxiliary functions (adapt to world)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-jung-accent mt-2 flex-shrink-0" />
                  <span><strong>Second half:</strong> Reclaim tertiary/inferior, confront Shadow → wholeness</span>
                </li>
              </ul>

              <BlockQuote author="Carl Jung">
                Individuation means becoming one's own self... our incomparable uniqueness.
              </BlockQuote>

              <div className="bg-jung-accent-light rounded-xl p-6 border-l-4 border-jung-accent">
                <h4 className="font-serif font-bold text-jung-dark mb-3">Key Insight</h4>
                <p className="text-jung-secondary font-serif">
                  Your lowest scores? That's your <strong>growth edge</strong>—the "treasure hard to attain" that holds
                  the key to psychological wholeness.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center py-16 border-t border-jung-border">
            <div className="inline-block text-5xl font-serif text-jung-accent mb-6">ψ</div>
            <h2 className="text-display text-jung-dark mb-4 font-serif">
              Ready to Reflect?
            </h2>
            <p className="text-body text-jung-secondary mb-8 max-w-xl mx-auto font-serif">
              Take the assessment to discover your current cognitive profile. Use it as a mirror—not a label.
            </p>
            <Link to="/assessment" className="inline-block">
              <Button variant="accent" size="lg">
                Begin Your Assessment
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </section>

          {/* Footer */}
          <footer className="pt-12 border-t border-jung-border text-center">
            <img src="/logo.svg" alt="TypeJung" className="w-12 h-12 mx-auto mb-3" />
            <p className="font-serif text-jung-dark mb-2">TypeJung</p>
            <p className="text-sm text-jung-muted mb-4 font-serif">
              A self-exploration tool based on Jung's <em>Psychological Types</em> (1921). Not diagnostic—just reflection.
            </p>
            <p className="text-xs text-jung-muted mb-2 font-serif">
              <strong>Key Concepts:</strong> Individuation • Differentiation • Dominant-Inferior • 8 Processes
            </p>
            <p className="text-xs text-jung-muted font-serif">
              <strong>Disclaimer:</strong> Self-report only—cannot access unconscious fully. Results = snapshot, not fixed identity.
            </p>
            <p className="mt-6 text-xs text-jung-muted font-serif">© 2026 TypeJung</p>
          </footer>
        </div>
      </div>
    </div>
  );
};
