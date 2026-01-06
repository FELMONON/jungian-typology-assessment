import { Question, FunctionDescription } from '../types';

// A subset of questions to demonstrate the functionality. 
// In a full production app, this would contain 80-100 items.
export const questions: Question[] = [
  // --- Te (Extraverted Thinking) ---
  { id: 'te_1', category: 'A', target: 'Te', text: 'When evaluating options, I prioritize objective criteria and measurable outcomes over personal feelings.' },
  { id: 'te_2', category: 'A', target: 'Te', text: 'I naturally organize information into systems, frameworks, or processes that others can follow.' },
  { id: 'te_3', category: 'A', target: 'Te', text: 'I find satisfaction in optimizing systems for maximum efficiency.' },
  { id: 'te_inf_1', category: 'B', target: 'Te', text: 'I become paralyzed by demands for efficiency and feel my careful process is dismissed.' }, 

  // --- Ti (Introverted Thinking) ---
  { id: 'ti_1', category: 'A', target: 'Ti', text: 'I often spend time mentally deconstructing how systems work, even with no practical purpose.' },
  { id: 'ti_2', category: 'A', target: 'Ti', text: 'Internal consistency of thought is more important to me than external efficiency.' },
  { id: 'ti_3', category: 'A', target: 'Ti', text: 'I seek precise definitions and distinctions when analyzing a problem.' },
  { id: 'ti_inf_1', category: 'B', target: 'Ti', text: 'I grasp for logical explanations that don\'t quite hold together, becoming rigid under stress.' },

  // --- Fe (Extraverted Feeling) ---
  { id: 'fe_1', category: 'A', target: 'Fe', text: 'I naturally attune to the emotional atmosphere of a room and adjust my behavior accordingly.' },
  { id: 'fe_2', category: 'A', target: 'Fe', text: 'I make decisions by considering the impact on social harmony and shared values.' },
  { id: 'fe_3', category: 'A', target: 'Fe', text: 'I feel responsible for ensuring everyone in a group feels included.' },
  { id: 'fe_inf_1', category: 'B', target: 'Fe', text: 'I feel disconnected from others\' emotional states and may say things that inadvertently hurt.' },

  // --- Fi (Introverted Feeling) ---
  { id: 'fi_1', category: 'A', target: 'Fi', text: 'I have strong inner convictions that I may struggle to articulate but won\'t compromise.' },
  { id: 'fi_2', category: 'A', target: 'Fi', text: 'Being authentic to my inner self is more important than fitting in.' },
  { id: 'fi_3', category: 'A', target: 'Fi', text: 'I evaluate worth based on a private, internal system of values.' },
  { id: 'fi_inf_1', category: 'B', target: 'Fi', text: 'I lose touch with what I actually value and feel inauthentic or hollow under pressure.' },

  // --- Se (Extraverted Sensation) ---
  { id: 'se_1', category: 'A', target: 'Se', text: 'I feel most alive when fully immersed in intense, immediate sensory experiences.' },
  { id: 'se_2', category: 'A', target: 'Se', text: 'I prefer to take immediate action rather than spending a long time planning.' },
  { id: 'se_3', category: 'A', target: 'Se', text: 'I notice aesthetic details and physical changes in my environment instantly.' },
  { id: 'se_inf_1', category: 'B', target: 'Se', text: 'I become clumsy, lose track of physical surroundings, or overindulge in sensory escape when stressed.' },

  // --- Si (Introverted Sensation) ---
  { id: 'si_1', category: 'A', target: 'Si', text: 'Certain sensory experiences (smells, textures) transport me vividly to past memories.' },
  { id: 'si_2', category: 'A', target: 'Si', text: 'I value established methods and traditions that have proven reliable over time.' },
  { id: 'si_3', category: 'A', target: 'Si', text: 'I compare the present situation detailedly against my rich internal database of past experiences.' },
  { id: 'si_inf_1', category: 'B', target: 'Si', text: 'I obsess over minor bodily symptoms or become trapped in negative past memories.' },

  // --- Ne (Extraverted Intuition) ---
  { id: 'ne_1', category: 'A', target: 'Ne', text: 'I frequently see connections between seemingly unrelated ideas or domains.' },
  { id: 'ne_2', category: 'A', target: 'Ne', text: 'I become energized by novel possibilities and "what could be".' },
  { id: 'ne_3', category: 'A', target: 'Ne', text: 'I prefer keeping options open rather than committing to a single definitive path.' },
  { id: 'ne_inf_1', category: 'B', target: 'Ne', text: 'I become convinced of a single negative possibility and can\'t see alternatives.' },

  // --- Ni (Introverted Intuition) ---
  { id: 'ni_1', category: 'A', target: 'Ni', text: 'Solutions or insights often come to me fully formed, without conscious step-by-step reasoning.' },
  { id: 'ni_2', category: 'A', target: 'Ni', text: 'I am drawn to symbolic meaning and the underlying archetypal patterns of events.' },
  { id: 'ni_3', category: 'A', target: 'Ni', text: 'I often have a singular vision of the future that I feel compelled to realize.' },
  { id: 'ni_inf_1', category: 'B', target: 'Ni', text: 'I feel ominous about the future but can\'t articulate why, leading to vague dread.' },

  // --- Attitude (E/I) ---
  { id: 'att_1', category: 'C', target: 'E', text: 'I process my thoughts best by discussing them with others or taking action.' },
  { id: 'att_2', category: 'C', target: 'I', text: 'After intense social interaction, I need solitude to restore my energy.' },
];

export const FUNCTION_DESCRIPTIONS: Record<string, FunctionDescription> = {
  Te: {
    title: "Extraverted Thinking",
    desc: "Organizes the external world through logical systems, objective criteria, and empirical facts. The extraverted thinker elevates objective reality and the 'intellectual formula' to the ruling principle of existence. Their life is governed by a dominating positive formula derived from objective facts or collective ideals.",
    quote: "The man who refuses to obey the formula is wrong... he is unreasonable, immoral.",
    positive: "Efficient, clear-headed, just, productive. Excellent at organizing resources, leading execution, and bringing environments into alignment with logical principles. The reformers, prosecutors, and organizers of society.",
    negative: "Dogmatic, tyrannical, dismissive of personal values. Because feeling is repressed, it becomes archaic and highly personal—manifesting as hidden sentimentality, explosive anger, or sudden mystical attachments that contradict their logical exterior."
  },
  Ti: {
    title: "Introverted Thinking",
    desc: "Oriented by the subjective factor, seeking the depth of the idea rather than the breadth of facts. They collect facts only as evidence for their internal premises. Kant is the prototype, contrasting with the 'Darwinian' extraverted thinker.",
    quote: "Formulates questions and creates theories; opens up prospects and yields insight, but with respect to facts its attitude is one of reserve.",
    positive: "Precise, analytical, independent thinker. Master of troubleshooting and deep theoretical understanding. They seek intellectual intensity and trust the power of the idea itself, not pressing their views on others.",
    negative: "Reserved, often impractical, indifferent to the object. Their repressed feeling is objective, primitive, and anxious—they may have a naive sensitivity to public opinion or be easily manipulated by emotional appeals they do not understand."
  },
  Fe: {
    title: "Extraverted Feeling",
    desc: "Oriented by objective emotional values and traditional standards. Their feeling aligns with the object: 'I love you because you are lovable' (objective reason), not merely 'because I like you.' They call a thing beautiful because it is collectively valued as such.",
    quote: "Feeling is determined chiefly by the objective factor... it adapts itself entirely to the objective situation.",
    positive: "Harmonious, empathetic, socially graceful. They are the social glue—accommodating, warm, and vital for community. Excellent at building consensus, smoothing over conflicts, and maintaining rapport.",
    negative: "Their thinking is repressed, infantile, and often negative. When feeling adaptation fails, inferior thinking emerges as cynical 'nothing but' judgments, reducing the object to its basest components. Prone to paranoia and projection."
  },
  Fi: {
    title: "Introverted Feeling",
    desc: "Governed by subjective feeling tones. Their motto is 'Still waters run deep.' They do not seek to influence the object but to secure the inner harmony of the subject. Their values are often archetypal (God, Freedom) but rarely articulated.",
    quote: "It is determined by the subjective factor... they neither shine nor reveal themselves.",
    positive: "Authentic, principled, deeply compassionate. Silent inner intensity. Loyal to inner truth regardless of pressure, capable of profound empathy that is expressed through action rather than words.",
    negative: "Silent, inaccessible, often appearing cold or melancholic because feeling does not flow outward. Their repressed thinking is concrete, factual, and tyrannical—manifesting as ruthless drives to execute facts or monomania over single objective details."
  },
  Se: {
    title: "Extraverted Sensation",
    desc: "The type of the 'extreme realist.' No other type equals their capacity for perceiving the concrete world. They are oriented toward the strongest objective stimulus—sensation is the 'fullness of life.' They accumulate actual experiences.",
    quote: "No other human type can equal the extraverted sensation type in realism.",
    positive: "Realistic, observant, adaptable, aesthetically attuned. The aesthetes, the lovers of good food, fashion, and physical experiences. Fully present in the moment, pragmatic and grounded in reality.",
    negative: "Repressed intuition takes on a 'dark' and archaic quality. They project evil possibilities onto the environment, developing phobias, jealous fantasies, or superstitious fears about the future or others' intentions."
  },
  Si: {
    title: "Introverted Sensation",
    desc: "Guided by the subjective intensity of the sense impression. Not the object itself, but the impression the object makes on the subject. A 'rainy day' is not just weather; it is a subjective atmosphere loaded with personal meaning—a mirror world of impressions.",
    quote: "It is an unrelatedness to the object... the subject's perception of the object is the decisive factor.",
    positive: "Reliable, thorough, detail-oriented, grounded. May appear passive but internally processes a rich world. Often has an artistic or impressionistic relation to reality. Excellent at preserving traditions and learning from the past.",
    negative: "Repressed intuition is projected outward as fear of the unknown. They perceive the world as chaotic and threatening, seeing 'danger' in every new possibility. They cling to the familiar to ward off 'demonic' novelty."
  },
  Ne: {
    title: "Extraverted Intuition",
    desc: "Seeks possibilities in the objective world. They are the 'initiators' with a 'keen nose' for what is in the making. They seize a situation with enthusiasm but abandon it as soon as the potential is exhausted—'the harvest is nothing.'",
    quote: "The intuitive is never to be found among the generally recognized reality values, but always where possibilities exist.",
    positive: "Innovative, inspiring, adaptable, quick-witted. Entrepreneurs, speculators, and inspirers who see potential where others see dead ends. Energized by the new, the future, and 'what could be.'",
    negative: "Their sensation is suppressed, leading to neglect of the body and physical reality. This results in physical exhaustion, hypochondria, or sudden compulsive indulgences in sensory pleasure as the starved body demands attention."
  },
  Ni: {
    title: "Introverted Intuition",
    desc: "Directs intuition toward the inner objects (archetypes). The 'mystical dreamers' who perceive the background processes of consciousness—the 'slow processes' of the collective unconscious. Often have difficulty communicating their vision.",
    quote: "It directs itself to the inner object... the contents of the unconscious.",
    positive: "Visionary, insightful, synthesizing, determined. 'The voice of one crying in the wilderness.' Artists, prophets, capable of profound foresight and realizing complex goals through singular vision.",
    negative: "Their link to reality is weak. Inferior sensation manifests as impulsive, raw sensuality or compulsive ties to specific persons or objects (fetishism). May be completely helpless in the physical world."
  }
};

export const ATTITUDE_DESCRIPTIONS = {
  E: {
    title: "Extraversion",
    positive: "Action-oriented, confident, sociable, adaptable to the environment.",
    negative: "Dependent on external stimulation, flighty, shallow, fear of solitude.",
    desc: "In the extraverted attitude, libido flows outward from the subject to the object. The object (external reality, people, norms, things) acts as a magnet, drawing interest outward. The extravert expends energy, is prolific, propagating their nature into the world, forming attachments easily, and venturing with confidence into the unknown.",
    biologicalAnalogy: "High fertility, high energy expenditure, low individual defense (r-selection). The species survives by propagating widely."
  },
  I: {
    title: "Introversion",
    positive: "Reflective, self-contained, deep concentration, independent of public opinion.",
    negative: "Withdrawn, secretive, socially anxious, prone to inertia.",
    desc: "In the introverted attitude, libido flows inward, withdrawing from the object back to the subject. The introvert interposes a subjective view between themselves and the world. The object is viewed with caution; the goal is to prevent the object from gaining power over the subject. They conserve energy and secure the 'inner fortress.'",
    biologicalAnalogy: "Low fertility, energy conservation, high individual defense (K-selection). The species survives by protecting the individual unit."
  }
};

// Stack Position Archetypes - The hierarchy of psychic functions
export const STACK_POSITIONS = {
  dominant: {
    name: "Dominant",
    archetype: "The Hero",
    description: "The Superior Function—the most differentiated and most frequently used tool of the conscious personality. This is the primary instrument of adaptation, the function you identify your character with. Development of this function is the 'Faustian bargain' of civilization: proficiency at the cost of wholeness.",
    development: "Fully conscious and under direction of the will. Developed in childhood and adolescence through natural aptitude and environmental reinforcement.",
    shadow: "One-sidedness. Over-reliance leads to neglect of other functions and eventual enantiodromia (reversal into the opposite)."
  },
  auxiliary: {
    name: "Auxiliary",
    archetype: "The Good Parent",
    description: "The second differentiated function that assists the Superior. Because absolute sovereignty of a single function would leave one unable to cope with reality, a secondary mode of adaptation is required. This function must be of opposite rationality to the Dominant.",
    development: "Develops in young adulthood as a bridge between the superior function and the rest of the psyche. Provides balance and a secondary mode of adaptation.",
    shadow: "May be mistaken for the dominant in some individuals. When underdeveloped, the personality remains rigid and one-dimensional."
  },
  tertiary: {
    name: "Tertiary",
    archetype: "The Eternal Child (Puer/Puella)",
    description: "Less differentiated than the auxiliary and lies closer to the unconscious. Possesses 'infantile' or childlike qualities—playful but also defensive. It often serves as a 'trap' or a 'gift,' luring the ego toward the inferior function.",
    development: "Emerges in mid-life as part of the individuation process. Carries the attitude opposite to the dominant. The first step into the 'underworld' of the unconscious stack.",
    shadow: "Can manifest defensively when the ego is threatened. May become a source of regression rather than growth if not properly integrated."
  },
  inferior: {
    name: "Inferior",
    archetype: "The Anima/Animus (Soul Image)",
    description: "The doorway to the unconscious. This function remains archaic, undifferentiated, and largely unconscious. It is the carrier of the 'dark side' of personality—slow, heavy, and charged with primitive affect. Where the ego is most vulnerable and where the wounds of personality reside.",
    development: "The 'treasure hard to attain' and the catalyst for individuation. Despite its troublesome nature, it is the bridge to the Self. Integration begins in the second half of life through confrontation with the Shadow.",
    shadow: "Operates autonomously—it 'happens' to the subject rather than being willed. Under stress, it erupts primitively (The Grip). The function you are 'seized' by, not the one you use."
  }
};

// The Grip - Inferior Function Pathology Under Stress
export const THE_GRIP = {
  Te: {
    inferiorFunction: "Introverted Feeling (Fi)",
    normalState: "Efficient, logical, objective, focused on external systems and results.",
    gripDescription: "When an Te-dominant is in The Grip, the repressed Fi erupts. They become hypersensitive, taking everything personally. They may withdraw into wounded silence, become uncharacteristically emotional, or develop intense but irrational attachments to people. They feel misunderstood and undervalued.",
    triggers: "Feeling dismissed, unappreciated, or when their competence is questioned. Lack of control over environment.",
    recovery: "Solitude to process emotions. Acknowledgment of personal values. Physical activity or familiar routines."
  },
  Ti: {
    inferiorFunction: "Extraverted Feeling (Fe)",
    normalState: "Analytical, precise, internally consistent, seeking theoretical depth.",
    gripDescription: "When a Ti-dominant is in The Grip, the repressed Fe erupts. They become desperate for social connection but express it clumsily—either overreacting emotionally to perceived slights or becoming obsessed with how others view them. They may make public emotional scenes or become blindly devoted to another person.",
    triggers: "Exclusion from groups. Feeling intellectually inadequate. Overwhelming social demands.",
    recovery: "Low-pressure social interaction. Logical analysis of the situation. Time alone to regain perspective."
  },
  Fe: {
    inferiorFunction: "Introverted Thinking (Ti)",
    normalState: "Harmonious, empathetic, attuned to social dynamics, values-oriented.",
    gripDescription: "When an Fe-dominant is in The Grip, the repressed Ti emerges as cold, obsessive logic. They become hyper-critical, finding fault with everything and everyone. They may develop paranoid thoughts, cynically reduce relationships to 'nothing but' transactions, and obsess over 'the truth' that others are hiding.",
    triggers: "Betrayal of trust. Conflict that cannot be smoothed over. Feeling that others are ungrateful.",
    recovery: "Logical problem-solving with trusted friend. Physical exercise. Acknowledging own needs vs. others' needs."
  },
  Fi: {
    inferiorFunction: "Extraverted Thinking (Te)",
    normalState: "Authentic, principled, governed by deep personal values, inner-directed.",
    gripDescription: "When an Fi-dominant is in The Grip, the repressed Te erupts as tyrannical external action. They become obsessed with organizing, controlling, and 'fixing' the external world. They may make harsh judgments, issue ultimatums, become ruthlessly efficient, or fixate obsessively on objective facts and details.",
    triggers: "Violation of core values. Feeling inauthentic. Being pressured to conform.",
    recovery: "Creative expression. Time in nature. Reconnection with personal values through meaningful activity."
  },
  Se: {
    inferiorFunction: "Introverted Intuition (Ni)",
    normalState: "Present, realistic, action-oriented, attuned to immediate sensory experience.",
    gripDescription: "When an Se-dominant is in The Grip, the repressed Ni erupts as dark inner visions. They become convinced of dire future possibilities, develop paranoid interpretations, see 'signs' everywhere, and may become obsessed with a single negative symbolic meaning. They withdraw from the outer world into gloomy internal prophecies.",
    triggers: "Inability to take action. Being physically confined. Loss of stimulation.",
    recovery: "Physical activity. Returning to present-moment awareness. Talking through fears with a trusted person."
  },
  Si: {
    inferiorFunction: "Extraverted Intuition (Ne)",
    normalState: "Thorough, detail-oriented, grounded in experience, respecting tradition.",
    gripDescription: "When an Si-dominant is in The Grip, the repressed Ne erupts as catastrophic possibilities. They see danger everywhere, imagine worst-case scenarios, and become paralyzed by all the things that could go wrong. They may become uncharacteristically impulsive or make wild, unfounded accusations.",
    triggers: "Too much novelty. Disruption of routines. Pressure to adapt quickly to change.",
    recovery: "Return to familiar routines. Focusing on concrete present details. Step-by-step problem solving."
  },
  Ne: {
    inferiorFunction: "Introverted Sensation (Si)",
    normalState: "Innovative, possibility-oriented, adaptable, seeking patterns and potential.",
    gripDescription: "When an Ne-dominant is in The Grip, the repressed Si erupts as obsessive focus on the body and past. They become hypochondriacal, fixating on physical symptoms. They may become depressed about the past, obsessively recall negative experiences, or compulsively overindulge in sensory pleasures (food, drink, etc.).",
    triggers: "Too many possibilities with no closure. Feeling scattered. Physical exhaustion ignored too long.",
    recovery: "Rest and physical self-care. Completing one concrete task. Returning to trusted routines."
  },
  Ni: {
    inferiorFunction: "Extraverted Sensation (Se)",
    normalState: "Visionary, synthesizing, focused on inner patterns and singular insights.",
    gripDescription: "When an Ni-dominant is in The Grip, the repressed Se erupts as raw sensory indulgence. They may become obsessed with physical details, overeat, over-exercise, or engage in impulsive sensory experiences. They can develop fetishistic attachments to specific objects or become completely overwhelmed by sensory stimuli.",
    triggers: "Vision not being realized. Feeling misunderstood. Overwhelming external demands.",
    recovery: "Controlled sensory experiences (massage, nature). Returning to the vision. Creative expression of inner insights."
  }
};

// Eight Type Phenomenology - Detailed Type Portraits
export const TYPE_PHENOMENOLOGY: Record<string, {
  typeName: string;
  focus: string;
  behavior: string;
  neurosis: string;
  historicalExample: string;
}> = {
  Te: {
    typeName: "The Extraverted Thinking Type",
    focus: "Universal Formula—their life is governed by a 'dominating positive formula' derived from objective facts or collective ideals (Justice, Efficiency, Progress).",
    behavior: "The reformers, prosecutors, and organizers. They strive to bring the environment into alignment with the formula. Confident, decisive, results-oriented.",
    neurosis: "Dogmatism, emotional outbursts. The 'tyranny' of the formula suppresses personal emotional life, causing the unconscious feeling to exact revenge through neurosis.",
    historicalExample: "Darwin (collecting facts for objective theory), industrial organizers, efficiency consultants."
  },
  Ti: {
    typeName: "The Introverted Thinking Type",
    focus: "Inner Idea—seeks the depth of the idea rather than the breadth of facts. Creates theories and systems.",
    behavior: "Reserved, often impractical, the 'absent-minded professor.' Does not press views on others, trusting the power of the idea itself.",
    neurosis: "Isolation, participation mystique. Hidden naive sensitivity to public opinion. Can be manipulated by emotional appeals they don't understand.",
    historicalExample: "Kant (contrasting with Darwin), theoretical physicists, philosophers of pure reason."
  },
  Fe: {
    typeName: "The Extraverted Feeling Type",
    focus: "Social Harmony—feeling aligns with objective values. 'Beautiful' because collectively valued, not because personally preferred.",
    behavior: "The social glue—accommodating, warm, vital for community. Smooths over conflicts to maintain rapport. Fashion-conscious, tradition-respecting.",
    neurosis: "'Hollow' personality, paranoia. When adaptation fails, inferior thinking emerges as cynical 'nothing but' judgments.",
    historicalExample: "Social leaders, diplomats, those who embody collective emotional values."
  },
  Fi: {
    typeName: "The Introverted Feeling Type",
    focus: "Inner Value—'Still waters run deep.' Values often archetypal (God, Freedom) but rarely articulated.",
    behavior: "Silent, inaccessible, often melancholic. May appear cold because feeling doesn't flow outward. 'They neither shine nor reveal themselves.'",
    neurosis: "Melancholy, tyrannical logic. Repressed Te manifests as ruthless drives to execute facts or monomania.",
    historicalExample: "Mystics, contemplatives, those with 'silent inner fires.'"
  },
  Se: {
    typeName: "The Extraverted Sensation Type",
    focus: "Concrete Experience—no other type equals their capacity for perceiving the concrete world. Sensation is 'fullness of life.'",
    behavior: "The aesthetes, lovers of good food, fashion, physical experiences. Grounded, pragmatic, oriented to strongest stimulus.",
    neurosis: "Phobias, obsessive jealousy. Repressed Ni projects 'evil' possibilities—superstitious fears about future or others' intentions.",
    historicalExample: "Connoisseurs, athletes, those fully alive in sensory experience."
  },
  Si: {
    typeName: "The Introverted Sensation Type",
    focus: "Subjective Impression—not the object itself, but the impression it makes. 'Rainy day' is subjective atmosphere, not weather.",
    behavior: "May appear passive but processes rich 'mirror world' internally. Artistic or impressionistic relation to reality.",
    neurosis: "Fear of novelty, exhaustion. Repressed Ne sees chaos and danger in every new possibility; clings to familiar.",
    historicalExample: "Impressionist artists, archivists, keepers of subjective tradition."
  },
  Ne: {
    typeName: "The Extraverted Intuitive Type",
    focus: "Possibility/Change—'keen nose' for what is in the making. 'The harvest is nothing'—abandons when potential exhausted.",
    behavior: "The 'initiators'—entrepreneurs, speculators, inspirers. Seize situations with enthusiasm for the new.",
    neurosis: "Physical neglect, instability. Suppressed Si leads to exhaustion, hypochondria, or compulsive sensory indulgence.",
    historicalExample: "Entrepreneurs, venture capitalists, those who see potential everywhere."
  },
  Ni: {
    typeName: "The Introverted Intuitive Type",
    focus: "Archetypal Vision—perceives the 'slow processes' of collective unconscious. 'Voice crying in the wilderness.'",
    behavior: "Mystical dreamers, difficulty communicating vision. Artists, prophets, or socially awkward eccentrics.",
    neurosis: "Reality detachment, sensual compulsion. Inferior Se manifests as impulsive raw sensuality or fetishism; helpless in physical world.",
    historicalExample: "Prophets, visionary artists, those who perceive what others cannot."
  }
};

// Individuation Process - The Path to Wholeness
export const INDIVIDUATION_GUIDANCE = {
  intro: "Individuation is the process of differentiating the individual personality from the collective psychology, integrating conscious and unconscious aspects into a new center: The Self. It is not about becoming 'balanced' in all functions, but about acknowledging and integrating the neglected aspects of the psyche.",
  stages: [
    {
      name: "1. Differentiation of the Ego",
      description: "The first half of life establishes the Superior Function and Persona (social mask) for worldly adaptation.",
      task: "Develop competence with your dominant function. Build a functional ego capable of meeting life's demands."
    },
    {
      name: "2. The Midlife Transition",
      description: "The one-sidedness of the superior function becomes a liability. The unconscious (Shadow/Inferior) presses for recognition.",
      task: "Recognize the limitations of your dominant approach. Notice recurring failures and frustrations as signals from the unconscious."
    },
    {
      name: "3. Confrontation with the Shadow",
      description: "The ego must acknowledge the dark, inferior parts of personality—the 'Other' within.",
      task: "Engage with your inferior function, not to master it, but to honor it. Allow yourself to be clumsy, slow, and primitive in this realm."
    },
    {
      name: "4. The Transcendent Function",
      description: "When tension between opposites is held (not repressed), the psyche produces a living symbol that transcends both.",
      task: "Practice active imagination. Dialogue with unconscious figures. Allow symbols to emerge that unite conscious and unconscious."
    },
    {
      name: "5. Realization of the Self",
      description: "The center of identity shifts from the Ego to the Self—the archetype of wholeness, the 'God-image' within.",
      task: "This is not an achievement but an ongoing process. The Self is approached asymptotically, never fully attained."
    }
  ],
  inferiorFunctionWork: "The inferior function is not meant to become a second superior function. It remains the doorway to the unconscious—archaic, slow, and charged with numinous energy. The goal is relationship, not mastery. Through the inferior, we touch the collective unconscious and the possibility of transformation.",
  transcendentFunction: "The Transcendent Function acts like a mathematical function of real and imaginary numbers. It facilitates the transition from one psychological attitude to another, producing the 'third thing' that contains both thesis and antithesis but transcends them.",
  warning: "Beware of Inflation—identifying with the god-image—or the Mana-Personality—identifying with the wise magician. The goal is dialogue with these figures, not possession by them."
};