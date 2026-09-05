import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, FileText, Users, BookOpen, ArrowRight, Target, Lightbulb, Scale } from 'lucide-react';
import { useSEO, PAGE_SEO } from '../hooks/useSEO';

export const About: React.FC = () => {
  useSEO(PAGE_SEO.about);

  return (
    <div className="editorial-container py-12 md:py-20">
      {/* Hero Header */}
      <header className="mb-16 md:mb-20 text-center">
        <div className="inline-flex items-center gap-3 mb-6">
          <img src="/logo.svg" alt="TypeJung" className="w-12 h-12" />
        </div>
        <h1 className="text-display text-4xl sm:text-5xl md:text-6xl mb-6 max-w-3xl mx-auto font-serif">
          About This Assessment
        </h1>
        <p className="text-body text-xl text-jung-muted max-w-2xl mx-auto leading-relaxed font-serif">
          Why this is not another MBTI clone, and how TypeJung turns Jung's ideas into a practical self-reflection map.
        </p>
      </header>

      {/* Jung's Warning Section */}
      <section className="mb-16 md:mb-20">
        <div className="flex items-start gap-4 md:gap-5 mb-8">
          <div className="flex-shrink-0 w-14 h-14 rounded-full bg-jung-accent/10 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-jung-accent" />
          </div>
          <div>
            <h2 className="text-heading text-2xl md:text-3xl font-serif">Jung's Warning</h2>
            <p className="text-body text-jung-muted mt-1 font-serif">Typology isn't a game</p>
          </div>
        </div>

        <div className="prose-editorial font-serif">
          <p>
            Carl Jung never wanted his ideas turned into quick labels or fixed categories. In 1934, he wrote:
          </p>

          <blockquote className="my-8 pl-6 border-l-4 border-jung-accent bg-jung-surface-alt py-6 pr-6 rounded-r-lg">
            <p className="text-lg md:text-xl italic text-jung-secondary leading-relaxed font-serif">
              "Using [typology] to stick labels on people at first sight is nothing but a childish parlor game."
            </p>
            <footer className="mt-4 text-sm font-semibold text-jung-accent not-italic">
              — Carl Jung, 1934
            </footer>
          </blockquote>

          <p>
            Jung used typology to help people understand natural "one-sidedness"
            (biases in how we think/perceive) and grow beyond it through <strong>individuation</strong> (becoming a
            more whole, unique self).
          </p>

          <div className="card-elevated p-6 my-8 bg-jung-accent-light border-jung-accent">
            <div className="flex items-start gap-4">
              <Lightbulb className="w-6 h-6 text-jung-accent flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-ui font-semibold text-jung-dark mb-2">Simple Analogy</h4>
                <p className="text-body text-jung-secondary font-serif">
                  Typology is like a mirror showing your current "driving style" (habits). The goal isn't
                  "I'm a sedan!"—it's learning to drive better in all conditions.
                </p>
              </div>
            </div>
          </div>

          <p>
            Popular tools (like MBTI) often focus on fun labels ("INTJ Judge"). This site returns to Jung:
            reflection on strengths, blind spots, and psychological balance.
          </p>
        </div>
      </section>

      {/* How This Assessment Differs */}
      <section className="mb-16 md:mb-20">
        <div className="flex items-start gap-4 md:gap-5 mb-8">
          <div className="flex-shrink-0 w-14 h-14 rounded-full bg-jung-accent/10 flex items-center justify-center">
            <Scale className="w-7 h-7 text-jung-accent" />
          </div>
          <div>
            <h2 className="text-heading text-2xl md:text-3xl font-serif">How This Assessment Differs</h2>
            <p className="text-body text-jung-muted mt-1 font-serif">A fundamentally different approach</p>
          </div>
        </div>

        <div className="prose-editorial mb-10 font-serif">
          <p>
            TypeJung combines scenario answers, stress-pattern prompts, body-signal prompts, and
            an introversion/extraversion measure to propose a function-stack pattern.
          </p>
          <p className="text-jung-accent font-semibold">What the current assessment does:</p>
        </div>

        <div className="space-y-4 mb-10">
          {[
            {
              icon: Target,
              title: 'Four Channels, Inferred Stack',
              description: 'Thinking, feeling, sensation, and intuition scores combine with attitude direction to derive the eight-function display.'
            },
            {
              icon: Scale,
              title: 'Nuanced Results',
              description: 'The map keeps relative channel scores visible. Its function-attitude values are derived, not eight independent measurements.'
            },
            {
              icon: ArrowRight,
              title: 'Focus on Growth',
              description: 'Highlights unconscious "blind spots" (inferior function) for self-awareness.'
            }
          ].map((item, index) => (
            <div
              key={index}
              className="card-elevated p-5 flex gap-4 hover:border-jung-accent/30 transition-colors"
            >
              <div className="w-11 h-11 rounded-full bg-jung-accent/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-jung-accent" />
              </div>
              <div>
                <h4 className="text-ui font-semibold text-jung-dark mb-1">{item.title}</h4>
                <p className="text-body text-sm text-jung-muted font-serif">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-jung-surface rounded-xl p-6 text-center border border-jung-border">
          <p className="text-body text-jung-secondary font-medium font-serif">
            No forced four-letter box. Just a clearer map of the pattern in your answers.
          </p>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="mb-16 md:mb-20 card-elevated p-6 md:p-10 rounded-2xl">
        <div className="flex items-start gap-4 md:gap-5 mb-8">
          <div className="flex-shrink-0 w-14 h-14 rounded-full bg-jung-accent/10 flex items-center justify-center">
            <FileText className="w-7 h-7 text-jung-accent" />
          </div>
          <div>
            <h2 className="text-heading text-2xl md:text-3xl font-serif">Our Methodology</h2>
            <p className="text-body text-jung-muted mt-1 font-serif">Theory-informed, not diagnostic</p>
          </div>
        </div>

        <p className="text-body text-jung-secondary mb-10 font-serif">
          We draw from Jung's writings and Marie-Louise von Franz's lectures on typology.
          The current scoring method is an educational self-reflection framework, not a clinical instrument.
        </p>

        <div className="space-y-10">
          {/* Method 1 */}
          <div>
            <h3 className="text-lg font-serif font-bold text-jung-accent mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-jung-accent text-white flex items-center justify-center text-sm">1</span>
              Four Channel Scores and a Derived Function Stack
            </h3>
            <div className="text-body text-jung-secondary space-y-4 pl-10 font-serif">
              <p>
                The 42-question assessment scores thinking, feeling, sensation, and intuition using
                behavioral, stress, and body-signal answers. Six attitude prompts separately estimate
                an introversion/extraversion direction.
              </p>
              <p>
                The scoring rules combine those signals into a proposed stack. The eight-function view
                assigns function-attitude labels and derived values to that pattern; it does not
                independently measure Te, Ti, Fe, Fi, Se, Si, Ne, and Ni.
              </p>
              <div className="bg-jung-surface rounded-lg p-4 border border-jung-border">
                <p className="text-sm text-jung-muted italic">
                  <strong className="not-italic">Read it as a hypothesis:</strong> The eight-function display is an interpretation of the channel scores, not eight separate test scales.
                </p>
              </div>
            </div>
          </div>

          {/* Method 2 */}
          <div>
            <h3 className="text-lg font-serif font-bold text-jung-accent mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-jung-accent text-white flex items-center justify-center text-sm">2</span>
              Probing the Unconscious (Dysfunction & Grip Questions)
            </h3>
            <div className="text-body text-jung-secondary space-y-4 pl-10 font-serif">
              <p>
                Self-report often shows "who we want to be" (Persona—social mask). Following
                <strong> Marie-Louise von Franz</strong>: We include questions on stress reactivity,
                emotional "touchiness," and rigid behaviors.
              </p>
              <p>
                These can point toward the <strong>inferior function</strong> (least conscious in this framework)—what
                von Franz called the "ever-bleeding wound," but also "treasure hard to attain."
              </p>
              <div className="bg-jung-surface rounded-lg p-4 border border-jung-border">
                <p className="text-sm text-jung-muted italic">
                  <strong className="not-italic">Example:</strong> Sudden irrational fears or obsessions under stress? That's often the inferior erupting ("grip").
                </p>
              </div>
              <p className="text-sm text-jung-muted">
                <strong>Why include this?</strong> Tension and stress-pattern questions can add a confidence signal
                beyond claimed strengths, while still remaining self-report.
              </p>
            </div>
          </div>

          {/* Method 3 */}
          <div>
            <h3 className="text-lg font-serif font-bold text-jung-accent mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-jung-accent text-white flex items-center justify-center text-sm">3</span>
              Empirical Scores + Theoretical Insights
            </h3>
            <div className="text-body text-jung-secondary space-y-4 pl-10 font-serif">
              <p>
                <strong>Empirical:</strong> What you actually report (current habits).
              </p>
              <p>
                <strong>Theoretical:</strong> Suggested "stack" based on Jung's opposites/compensation.
              </p>
              <p>
                A mismatch may reflect context, question wording, or limits in the scoring rules.
                Do not assume the test is right when your experience disagrees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="mb-16 md:mb-20">
        <div className="flex items-start gap-4 md:gap-5 mb-8">
          <div className="flex-shrink-0 w-14 h-14 rounded-full bg-jung-accent/10 flex items-center justify-center">
            <ArrowRight className="w-7 h-7 text-jung-accent" />
          </div>
          <div>
            <h2 className="text-heading text-2xl md:text-3xl font-serif">Why This Matters</h2>
            <p className="text-body text-jung-muted mt-1 font-serif">One-sidedness & growth</p>
          </div>
        </div>

        <div className="prose-editorial font-serif">
          <p>
            Jung saw type as <strong>problematic bias</strong>—strengths create blind spots. Over-rely on logic?
            Emotions become primitive/unconscious.
          </p>
          <p>
            The goal: <strong>Individuation</strong>—integrate opposites for wholeness.
          </p>
          <ul className="space-y-2 my-6">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-jung-accent mt-2.5 flex-shrink-0" />
              <span><strong>Low scores?</strong> Your growth edge (unconscious potential).</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-jung-accent mt-2.5 flex-shrink-0" />
              <span><strong>High scores?</strong> Your strengths—but watch for over-one-sidedness.</span>
            </li>
          </ul>

          <div className="card-elevated p-6 my-8 bg-jung-accent-light border-jung-accent">
            <p className="text-body text-jung-dark font-serif">
              <strong>Analogy:</strong> Like exercising weak muscles—the "inferior" is where real development happens.
            </p>
          </div>
        </div>
      </section>

      {/* Limitations */}
      <section className="mb-16 md:mb-20">
        <div className="card-elevated p-6 md:p-8 bg-jung-accent-light border-jung-accent rounded-2xl">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 flex-shrink-0 text-jung-accent mt-1" />
            <div>
              <h3 className="text-heading text-xl md:text-2xl text-jung-dark mb-4 font-serif">Honest Limitations</h3>
              <p className="text-body text-jung-secondary mb-6 font-serif">We're transparent—no tool is perfect.</p>

              <div className="space-y-6">
                <div>
                  <p className="font-semibold text-jung-dark mb-1">1. Persona Problem</p>
                  <p className="text-sm text-jung-secondary font-serif">
                    Self-report captures conscious image, not full unconscious (Jung: "Every mind contains unacknowledged contents").
                  </p>
                  <p className="text-sm text-jung-muted italic mt-2 font-serif">
                    Analogy: Like a mirror for reflection, not an X-ray or clinical assessment. Deeper personal work
                    belongs with appropriate professional support.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-jung-dark mb-1">2. Type Isn't Static</p>
                  <p className="text-sm text-jung-secondary font-serif">
                    Jung: "The type changes in the course of life." Results = snapshot.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-jung-dark mb-1">3. Consistency Is Not Accuracy</p>
                  <p className="text-sm text-jung-secondary font-serif">
                    The consistency percentage is a rule-based agreement signal across answer layers.
                    It is not the probability that your type is correct or a validated accuracy score.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-jung-dark mb-1">4. Not Diagnosis</p>
                  <p className="text-sm text-jung-secondary font-serif">
                    Educational/reflective only. It is not medical, mental-health, or diagnostic advice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sources */}
      <section className="mb-16 md:mb-20 border-t border-jung-border pt-10">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-jung-muted" />
          <h3 className="text-heading text-xl font-serif">Primary Sources & Credits</h3>
        </div>
        <p className="text-body text-jung-muted mb-6 font-serif">Influenced by:</p>
        <ul className="text-body text-sm text-jung-secondary space-y-3 font-serif">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-jung-accent mt-2 flex-shrink-0" />
            <span><strong>C.G. Jung:</strong> <em>Psychological Types</em> (CW 6, 1921).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-jung-accent mt-2 flex-shrink-0" />
            <span><strong>Marie-Louise von Franz & James Hillman:</strong> <em>Lectures on Jung's Typology</em> (1971).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-jung-accent mt-2 flex-shrink-0" />
            <span><strong>June Singer & Mary Loomis:</strong> Singer-Loomis Inventory research (1984).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-jung-accent mt-2 flex-shrink-0" />
            <span><strong>John Beebe:</strong> Archetypal extensions (2016).</span>
          </li>
        </ul>
        <p className="text-sm text-jung-muted mt-6 italic font-serif">
          Inspired by Jungian writers and analysts, with the goal of reflection rather than certainty or diagnosis.
        </p>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16 border-t border-jung-border">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-jung-accent/10 mb-6">
          <span className="text-jung-accent font-serif text-4xl">ψ</span>
        </div>
        <h2 className="text-display text-2xl md:text-3xl mb-4 font-serif">
          Ready for Reflection?
        </h2>
        <p className="text-body text-jung-muted mb-8 max-w-md mx-auto font-serif">
          Begin a self-reflection exercise informed by Jungian typology.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="
              inline-flex items-center justify-center gap-2
              px-8 py-4 min-h-[56px]
              bg-jung-accent text-white text-ui font-semibold
              rounded-lg shadow-lg shadow-jung-accent/20
              hover:bg-jung-accent-hover hover:-translate-y-px
              transition-all duration-200
            "
          >
            Take the Assessment
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/learn"
            className="
              inline-flex items-center justify-center gap-2
              px-8 py-4 min-h-[56px]
              bg-jung-surface text-jung-accent text-ui font-semibold
              rounded-lg border-2 border-jung-accent
              hover:bg-jung-accent/5 hover:-translate-y-px
              transition-all duration-200
            "
          >
            <BookOpen className="w-5 h-5" />
            Learn the Theory
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 pt-10 border-t border-jung-border text-center">
        <img src="/logo.svg" alt="TypeJung" className="w-12 h-12 mx-auto mb-4" />
        <p className="text-ui font-semibold text-jung-dark mb-2 font-serif">TypeJung</p>
        <p className="text-body text-sm text-jung-muted mb-4 max-w-md mx-auto font-serif">
          A self-exploration tool based on Jung's <em>Psychological Types</em> (1921). Mirror for reflection—not fixed label.
        </p>
        <p className="text-xs text-jung-muted mb-2 font-serif">
          <strong>Key Concepts:</strong> Individuation • One-Sidedness • Inferior Function • 8 Processes
        </p>
        <p className="text-xs text-jung-muted/70 font-serif">
          <strong>Disclaimer:</strong> Self-report only. Results = current configuration, not permanent identity.
        </p>
        <p className="mt-6 text-xs text-jung-muted/50 font-serif">© 2026 TypeJung</p>
      </footer>
    </div>
  );
};
