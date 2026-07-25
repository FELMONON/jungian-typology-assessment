import { Compass, Brain, Sparkles, FileText, Target } from 'lucide-react';
import { discountedPriceLabel, EMAIL_CAPTURE_OFFER } from '../../data/discount';
import { PRICING } from '../../data/pricing';
import { AnalyticsEvents } from '../../lib/analytics';

export const AI_DEMO_CONVERSATION = [
  {
    role: 'user',
    message: "How could my inferior function show up in relationships?"
  },
  {
    role: 'assistant',
    message: `Your inferior Extraverted Sensing (Se) can show up when a relationship asks for direct presence, spontaneity, or contact with what is happening right now.

**In practice, that may create a pattern:**

When stress builds, you may judge a partner's spontaneity as irresponsible, then swing into impulsive action yourself. The issue is not that Se is bad; it is that it arrives late, pressured, and hard to regulate.

**A useful next step:** before reacting, ask what concrete reality needs attention: the room, the body, the timing, the facts, or the immediate need. Integration does not mean becoming Se-dominant. It means giving that present-moment energy a small, conscious role before it takes over.`
  }
];

export const FAQ_ITEMS = [
  {
    question: "How is this different from 16Personalities or other MBTI tests?",
    answer: "Most tests collapse your answers into a four-letter label. TypeJung maps function patterns, inferior-function pressure, body signals, and attitude direction so you can inspect the pattern behind the label."
  },
  {
    question: "Is this a clinical assessment?",
    answer: "No. TypeJung is an educational self-reflection tool, not a diagnosis or therapy substitute. It is research-informed, but the result should be tested against your lived patterns."
  },
  {
    question: "Why should I pay when other tests are free?",
    answer: `You do not have to pay first. The free assessment gives you the function-stack map. Insight is ${discountedPriceLabel(PRICING.insight.amount)} with ${EMAIL_CAPTURE_OFFER.code} applied on Stripe, and Mastery is ${discountedPriceLabel(PRICING.mastery.amount)} with the same code.`
  },
  {
    question: "What if I don't like my results?",
    answer: "This isn't about \"good\" or \"bad\" types. Every function pattern has strengths and growth areas. The goal is self-understanding, not judgment. That said, if you're unsatisfied with the premium purchase, contact us."
  },
  {
    question: "How long does the assessment take?",
    answer: "Set aside about 20-25 minutes. Progress saves on this device, so you can pause and return."
  },
  {
    question: "Do I need to create an account?",
    answer: "Not for the free assessment. You'll only need an account if you purchase premium and want to save your results history."
  }
];

export const PRODUCT_PROOF_ITEMS = [
  {
    title: "Built for mixed scores",
    description: "When two functions sit close together, TypeJung keeps that tension visible instead of forcing a single neat label.",
    detail: "Shows adjacent function strength"
  },
  {
    title: "Maps pressure points",
    description: "Results include the dominant-inferior axis so stress patterns and growth edges are part of the map from the start.",
    detail: "Dominant-inferior axis included"
  },
  {
    title: "Designed for reflection",
    description: "The report language is educational and testable against lived patterns, not a clinical diagnosis or fixed identity claim.",
    detail: "Self-reflection, not diagnosis"
  }
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Answer 42 questions honestly',
    description: 'Each prompt asks about concrete attention, decision, stress, body, and relationship patterns instead of forcing you into a simple either-or.'
  },
  {
    step: '02',
    title: 'See your function pattern',
    description: 'Your result shows how the functions appear in your answers, with the dominant-inferior axis and answer consistency signal made visible.'
  },
  {
    step: '03',
    title: 'Understand what it means',
    description: 'Turn the map into plain-language insight about your stress edge, relationship patterns, and practical next steps.'
  }
];

export const DIFFERENTIATORS = [
  {
    icon: Brain,
    title: 'Function patterns, not only labels',
    description: 'TypeJung looks at all 8 cognitive functions instead of treating personality as a single fixed label.'
  },
  {
    icon: FileText,
    title: "Closer to Jung's original problem",
    description: "The assessment focuses on psychological functions, attitude direction, one-sidedness, and inferior-function pressure."
  },
  {
    icon: Sparkles,
    title: 'Interpretation tied to your map',
    description: 'Paid reports explain your actual score pattern instead of handing you a generic type description.'
  },
  {
    icon: Target,
    title: 'Growth-oriented, not just labeling',
    description: "The result connects your pattern to stress, relationships, body signals, and practices you can test in daily life."
  }
];

export const COMPARISON_ROWS = [
  { label: 'Approach', values: ['4 binary dichotomies', 'Motivation-based', '5 trait spectrums', '8 functions independently'] },
  { label: 'Depth', values: ['Type label', 'Motivation label', 'Trait scores', 'Function and stress map'] },
  { label: 'Personalization', values: ['Generic descriptions', 'Generic descriptions', 'Statistical placement', 'Interpretation tied to your map'] },
  { label: 'Growth path', values: ['Read about type', 'Work on "wing"', 'None', 'Individuation roadmap'] },
  { label: 'Price', values: ['Paid report', 'Paid report', 'Free and paid reports', `Free / ${discountedPriceLabel(PRICING.insight.amount)} / ${discountedPriceLabel(PRICING.mastery.amount)} with ${EMAIL_CAPTURE_OFFER.code}`] }
];

export const PRICING_TIERS = [
  {
    name: 'FREE',
    price: PRICING.free.price,
    amount: PRICING.free.amount,
    icon: Compass,
    description: 'See Your Core Map',
    features: ['42-question assessment', 'Energy map', 'Dominant-inferior axis', 'No signup required'],
    cta: 'Take Free Assessment',
    popular: false,
    variant: 'outline' as const,
  },
  {
    name: 'INSIGHT',
    price: PRICING.insight.price,
    discountedPrice: discountedPriceLabel(PRICING.insight.amount),
    priceNote: `${EMAIL_CAPTURE_OFFER.code} auto-applies on Stripe`,
    amount: PRICING.insight.amount,
    icon: Brain,
    description: 'Understand What It Means',
    features: ['Deeper report', 'Stress-pattern map', 'Relationship-pattern reflection', 'Practice prompts'],
    cta: 'Review Insight',
    popular: true,
    variant: 'accent' as const,
  },
  {
    name: 'MASTERY',
    price: PRICING.mastery.price,
    discountedPrice: discountedPriceLabel(PRICING.mastery.amount),
    priceNote: `${EMAIL_CAPTURE_OFFER.code} auto-applies on Stripe`,
    amount: PRICING.mastery.amount,
    icon: Sparkles,
    description: 'Practice With Guidance',
    features: ['AI Type Guide', 'Growth exercises', 'Individuation roadmap', 'Everything in Insight'],
    cta: 'Review Mastery',
    popular: false,
    variant: 'primary' as const,
  }
];

export { AnalyticsEvents };
