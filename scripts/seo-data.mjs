// Comprehensive SEO data for all pages

export const functionData = {
  ni: {
    code: 'Ni',
    name: 'Introverted Intuition',
    nickname: 'The Pattern Seer',
    description: 'Synthesizes information into unified visions and insights. Operates unconsciously, delivering "aha" moments with deep conviction.',
    dominantTypes: ['INFJ', 'INTJ'],
    auxiliaryTypes: ['ENFJ', 'ENTJ'],
    keywords: ['pattern recognition', 'future vision', 'unconscious insight', 'convergent thinking', 'symbolic understanding'],
    characteristics: [
      'Sees patterns beneath the surface that others miss',
      'Experiences sudden insights and "knowing" without conscious reasoning',
      'Focused on a single, unified vision of how things will unfold',
      'Trusts gut feelings and hunches that prove accurate over time',
      'Thinks in symbols, metaphors, and abstract patterns',
      'Often described as "prophetic" or having strong intuition',
    ],
    strengths: ['Strategic foresight', 'Pattern synthesis', 'Long-term planning', 'Insight generation'],
    challenges: ['Difficulty explaining intuitions', 'May seem disconnected from present', 'Can be seen as mysterious'],
  },
  ne: {
    code: 'Ne',
    name: 'Extraverted Intuition',
    nickname: 'The Possibility Explorer',
    description: 'Explores possibilities and connections in the external world. Generates ideas rapidly, seeing multiple angles simultaneously.',
    dominantTypes: ['ENFP', 'ENTP'],
    auxiliaryTypes: ['INFP', 'INTP'],
    keywords: ['brainstorming', 'possibilities', 'connections', 'novelty', 'divergent thinking'],
    characteristics: [
      'Generates multiple ideas and possibilities rapidly',
      'Sees connections between seemingly unrelated concepts',
      'Energized by brainstorming and exploring "what if" scenarios',
      'Constantly scanning the environment for new opportunities',
      'Enjoys novelty and gets bored with routine',
      'Natural at seeing things from multiple perspectives simultaneously',
    ],
    strengths: ['Idea generation', 'Adaptability', 'Innovation', 'Seeing potential'],
    challenges: ['May struggle with follow-through', 'Can be scattered', 'Difficulty choosing one path'],
  },
  si: {
    code: 'Si',
    name: 'Introverted Sensing',
    nickname: 'The Detail Keeper',
    description: 'Stores and recalls detailed sensory impressions from past experiences. Creates a rich internal library of "how things are."',
    dominantTypes: ['ISFJ', 'ISTJ'],
    auxiliaryTypes: ['ESFJ', 'ESTJ'],
    keywords: ['memory', 'tradition', 'detail', 'consistency', 'past experience'],
    characteristics: [
      'Has detailed, vivid memories of past experiences',
      'Compares present situations to past experiences for guidance',
      'Values tradition, consistency, and proven methods',
      'Notices when things are different from how they "should" be',
      'Builds expertise through repeated experience and practice',
      'Creates and maintains reliable systems and routines',
    ],
    strengths: ['Attention to detail', 'Reliability', 'Institutional memory', 'Quality assurance'],
    challenges: ['May resist change', 'Can be overly focused on the past', 'May miss new possibilities'],
  },
  se: {
    code: 'Se',
    name: 'Extraverted Sensing',
    nickname: 'The Present Moment Master',
    description: 'Engages directly with the present moment through the five senses. Attuned to aesthetics, physical environment, and immediate opportunities.',
    dominantTypes: ['ESFP', 'ESTP'],
    auxiliaryTypes: ['ISFP', 'ISTP'],
    keywords: ['present moment', 'sensory experience', 'action', 'aesthetics', 'physical awareness'],
    characteristics: [
      'Fully present and engaged with the immediate environment',
      'Highly attuned to sensory details—sights, sounds, textures, tastes',
      'Quick to notice and respond to changes in the environment',
      'Energized by action and physical experiences',
      'Natural sense of aesthetics and style',
      'Thrives in high-stimulus, fast-paced situations',
    ],
    strengths: ['Quick reflexes', 'Aesthetic sense', 'Crisis response', 'Physical awareness'],
    challenges: ['May struggle with long-term planning', 'Can be impulsive', 'May overlook abstract implications'],
  },
  ti: {
    code: 'Ti',
    name: 'Introverted Thinking',
    nickname: 'The Logic Architect',
    description: 'Builds precise internal logical frameworks. Seeks to understand how things work at a fundamental level.',
    dominantTypes: ['INTP', 'ISTP'],
    auxiliaryTypes: ['ENTP', 'ESTP'],
    keywords: ['logic', 'analysis', 'frameworks', 'precision', 'understanding'],
    characteristics: [
      'Builds comprehensive internal models of how systems work',
      'Values logical consistency and precision above all',
      'Constantly refining understanding and categorizations',
      'Questions assumptions and seeks root causes',
      'Prefers understanding principles over following procedures',
      'Independent thinker who trusts internal analysis',
    ],
    strengths: ['Analytical depth', 'Problem-solving', 'System understanding', 'Logical precision'],
    challenges: ['May seem detached', 'Can over-analyze', 'May struggle communicating complex ideas'],
  },
  te: {
    code: 'Te',
    name: 'Extraverted Thinking',
    nickname: 'The Efficiency Expert',
    description: 'Organizes the external world for efficiency and results. Values measurable outcomes, clear processes, and getting things done.',
    dominantTypes: ['ENTJ', 'ESTJ'],
    auxiliaryTypes: ['INTJ', 'ISTJ'],
    keywords: ['efficiency', 'organization', 'results', 'systems', 'leadership'],
    characteristics: [
      'Naturally organizes people, processes, and resources for efficiency',
      'Focuses on measurable results and objective criteria',
      'Creates clear systems, procedures, and hierarchies',
      'Makes decisions based on logic and external evidence',
      'Drives toward goals with determination and directness',
      'Natural at delegation and project management',
    ],
    strengths: ['Organization', 'Leadership', 'Goal achievement', 'Systematic thinking'],
    challenges: ['May overlook feelings', 'Can be seen as controlling', 'May dismiss subjective factors'],
  },
  fi: {
    code: 'Fi',
    name: 'Introverted Feeling',
    nickname: 'The Values Guardian',
    description: 'Evaluates everything against a deep internal value system. Attuned to authenticity, personal meaning, and emotional integrity.',
    dominantTypes: ['INFP', 'ISFP'],
    auxiliaryTypes: ['ENFP', 'ESFP'],
    keywords: ['values', 'authenticity', 'meaning', 'integrity', 'personal ethics'],
    characteristics: [
      'Has a deeply personal, nuanced internal value system',
      'Immediately senses when something violates personal values',
      'Seeks authenticity in self and others',
      'Processes emotions internally and privately',
      'Strong sense of personal identity and integrity',
      'Advocates for causes aligned with deep values',
    ],
    strengths: ['Authenticity', 'Moral clarity', 'Empathy', 'Personal integrity'],
    challenges: ['May struggle expressing feelings', 'Can be seen as stubborn', 'May take criticism personally'],
  },
  fe: {
    code: 'Fe',
    name: 'Extraverted Feeling',
    nickname: 'The Harmony Weaver',
    description: 'Focused on social harmony and group dynamics. Reads and responds to the emotional atmosphere and meets others\' emotional needs.',
    dominantTypes: ['ENFJ', 'ESFJ'],
    auxiliaryTypes: ['INFJ', 'ISFJ'],
    keywords: ['harmony', 'connection', 'social dynamics', 'emotional atmosphere', 'group needs'],
    characteristics: [
      'Naturally reads and responds to the emotional atmosphere of groups',
      'Prioritizes maintaining harmony and positive relationships',
      'Skilled at meeting others\' emotional needs',
      'Values social norms and appropriate behavior',
      'Creates connection and brings people together',
      'Expresses emotions openly and encourages others to share',
    ],
    strengths: ['Social intelligence', 'Diplomacy', 'Team building', 'Emotional support'],
    challenges: ['May neglect own needs', 'Can be people-pleasing', 'May avoid necessary conflict'],
  },
};

export const typeData = {
  intj: {
    code: 'INTJ',
    name: 'The Architect',
    stack: 'Ni-Te-Fi-Se',
    description: 'Strategic visionaries who see the world as a chess board. They combine long-term vision with systematic execution to build complex systems and achieve ambitious goals.',
    cognitiveStack: [
      { position: 'Dominant', function: 'Ni', description: 'Introverted Intuition provides strategic vision and pattern recognition' },
      { position: 'Auxiliary', function: 'Te', description: 'Extraverted Thinking executes plans with efficiency and logic' },
      { position: 'Tertiary', function: 'Fi', description: 'Introverted Feeling guides personal values and authenticity' },
      { position: 'Inferior', function: 'Se', description: 'Extraverted Sensing connects to present-moment experience' },
    ],
    keywords: ['strategic', 'independent', 'analytical', 'determined', 'innovative'],
    strengths: ['Strategic planning', 'Systems thinking', 'Independence', 'High standards', 'Innovation'],
    challenges: ['Impatience with inefficiency', 'May seem cold or arrogant', 'Perfectionism', 'Difficulty with small talk'],
    famousExamples: ['Elon Musk', 'Isaac Newton', 'Nikola Tesla', 'Michelle Obama'],
    careers: ['Engineer', 'Scientist', 'Strategist', 'Architect', 'Executive', 'Professor'],
  },
  intp: {
    code: 'INTP',
    name: 'The Logician',
    stack: 'Ti-Ne-Si-Fe',
    description: 'Analytical problem-solvers who love exploring theoretical frameworks. They seek to understand how things work at the deepest level.',
    cognitiveStack: [
      { position: 'Dominant', function: 'Ti', description: 'Introverted Thinking builds precise logical frameworks' },
      { position: 'Auxiliary', function: 'Ne', description: 'Extraverted Intuition explores possibilities and connections' },
      { position: 'Tertiary', function: 'Si', description: 'Introverted Sensing provides memory and attention to detail' },
      { position: 'Inferior', function: 'Fe', description: 'Extraverted Feeling navigates social harmony' },
    ],
    keywords: ['analytical', 'curious', 'logical', 'inventive', 'independent'],
    strengths: ['Logical analysis', 'Innovation', 'Problem-solving', 'Abstract thinking', 'Objectivity'],
    challenges: ['Social situations', 'Emotional expression', 'Following through', 'Practical details'],
    famousExamples: ['Albert Einstein', 'Bill Gates', 'Marie Curie', 'Charles Darwin'],
    careers: ['Scientist', 'Philosopher', 'Software Developer', 'Engineer', 'Mathematician', 'Writer'],
  },
  entj: {
    code: 'ENTJ',
    name: 'The Commander',
    stack: 'Te-Ni-Se-Fi',
    description: 'Bold, strategic leaders who mobilize resources and people toward ambitious goals. Natural executives who create order from chaos.',
    cognitiveStack: [
      { position: 'Dominant', function: 'Te', description: 'Extraverted Thinking organizes and executes efficiently' },
      { position: 'Auxiliary', function: 'Ni', description: 'Introverted Intuition provides strategic vision' },
      { position: 'Tertiary', function: 'Se', description: 'Extraverted Sensing engages with immediate reality' },
      { position: 'Inferior', function: 'Fi', description: 'Introverted Feeling connects to personal values' },
    ],
    keywords: ['decisive', 'ambitious', 'strategic', 'efficient', 'commanding'],
    strengths: ['Leadership', 'Strategic planning', 'Efficiency', 'Confidence', 'Organization'],
    challenges: ['May seem domineering', 'Impatience', 'Difficulty with emotions', 'Work-life balance'],
    famousExamples: ['Steve Jobs', 'Margaret Thatcher', 'Napoleon Bonaparte', 'Gordon Ramsay'],
    careers: ['Executive', 'Entrepreneur', 'Lawyer', 'Consultant', 'Manager', 'Politician'],
  },
  entp: {
    code: 'ENTP',
    name: 'The Debater',
    stack: 'Ne-Ti-Fe-Si',
    description: 'Quick-witted innovators who love intellectual challenges. They see possibilities everywhere and enjoy exploring ideas through debate.',
    cognitiveStack: [
      { position: 'Dominant', function: 'Ne', description: 'Extraverted Intuition generates possibilities and connections' },
      { position: 'Auxiliary', function: 'Ti', description: 'Introverted Thinking analyzes and refines ideas' },
      { position: 'Tertiary', function: 'Fe', description: 'Extraverted Feeling engages with social dynamics' },
      { position: 'Inferior', function: 'Si', description: 'Introverted Sensing grounds in past experience' },
    ],
    keywords: ['innovative', 'clever', 'entrepreneurial', 'resourceful', 'outspoken'],
    strengths: ['Innovation', 'Debate', 'Problem-solving', 'Adaptability', 'Big-picture thinking'],
    challenges: ['Follow-through', 'Routine tasks', 'Sensitivity to others', 'Argumentativeness'],
    famousExamples: ['Thomas Edison', 'Mark Twain', 'Leonardo da Vinci', 'Socrates'],
    careers: ['Entrepreneur', 'Lawyer', 'Consultant', 'Inventor', 'Marketing', 'Journalist'],
  },
  infj: {
    code: 'INFJ',
    name: 'The Advocate',
    stack: 'Ni-Fe-Ti-Se',
    description: 'Insightful idealists driven to help others. They combine deep intuition with genuine care for people to create meaningful change.',
    cognitiveStack: [
      { position: 'Dominant', function: 'Ni', description: 'Introverted Intuition provides deep insight and vision' },
      { position: 'Auxiliary', function: 'Fe', description: 'Extraverted Feeling connects with others\' needs' },
      { position: 'Tertiary', function: 'Ti', description: 'Introverted Thinking provides analytical framework' },
      { position: 'Inferior', function: 'Se', description: 'Extraverted Sensing engages with the physical world' },
    ],
    keywords: ['insightful', 'principled', 'compassionate', 'private', 'visionary'],
    strengths: ['Deep insight', 'Empathy', 'Dedication', 'Writing/creativity', 'Counseling'],
    challenges: ['Burnout', 'Perfectionism', 'Over-sensitivity', 'Difficulty with conflict'],
    famousExamples: ['Martin Luther King Jr.', 'Nelson Mandela', 'Carl Jung', 'Mother Teresa'],
    careers: ['Counselor', 'Writer', 'Psychologist', 'Teacher', 'Healthcare', 'Non-profit work'],
  },
  infp: {
    code: 'INFP',
    name: 'The Mediator',
    stack: 'Fi-Ne-Si-Te',
    description: 'Imaginative idealists guided by their own values and beliefs. They seek meaning and authenticity in everything they do.',
    cognitiveStack: [
      { position: 'Dominant', function: 'Fi', description: 'Introverted Feeling guides deep personal values' },
      { position: 'Auxiliary', function: 'Ne', description: 'Extraverted Intuition explores possibilities' },
      { position: 'Tertiary', function: 'Si', description: 'Introverted Sensing connects to meaningful memories' },
      { position: 'Inferior', function: 'Te', description: 'Extraverted Thinking organizes and executes' },
    ],
    keywords: ['idealistic', 'creative', 'empathetic', 'authentic', 'reserved'],
    strengths: ['Creativity', 'Empathy', 'Writing', 'Deep thinking', 'Authenticity'],
    challenges: ['Practical matters', 'Criticism sensitivity', 'Self-isolation', 'Idealism vs reality'],
    famousExamples: ['William Shakespeare', 'J.R.R. Tolkien', 'Princess Diana', 'Edgar Allan Poe'],
    careers: ['Writer', 'Artist', 'Counselor', 'Psychologist', 'Teacher', 'Musician'],
  },
  enfj: {
    code: 'ENFJ',
    name: 'The Protagonist',
    stack: 'Fe-Ni-Se-Ti',
    description: 'Charismatic leaders who inspire others toward growth. They combine genuine care for people with a vision for what they can become.',
    cognitiveStack: [
      { position: 'Dominant', function: 'Fe', description: 'Extraverted Feeling creates harmony and connection' },
      { position: 'Auxiliary', function: 'Ni', description: 'Introverted Intuition provides vision and insight' },
      { position: 'Tertiary', function: 'Se', description: 'Extraverted Sensing engages with the moment' },
      { position: 'Inferior', function: 'Ti', description: 'Introverted Thinking provides logical analysis' },
    ],
    keywords: ['charismatic', 'empathetic', 'inspiring', 'organized', 'diplomatic'],
    strengths: ['Leadership', 'Empathy', 'Communication', 'Inspiration', 'Organization'],
    challenges: ['Over-involvement', 'Approval-seeking', 'Neglecting own needs', 'Conflict avoidance'],
    famousExamples: ['Barack Obama', 'Oprah Winfrey', 'Martin Luther King Jr.', 'Abraham Lincoln'],
    careers: ['Teacher', 'Coach', 'Counselor', 'HR Manager', 'Public Relations', 'Politics'],
  },
  enfp: {
    code: 'ENFP',
    name: 'The Campaigner',
    stack: 'Ne-Fi-Te-Si',
    description: 'Enthusiastic, creative spirits who see life as full of possibilities. They inspire others with their energy and authenticity.',
    cognitiveStack: [
      { position: 'Dominant', function: 'Ne', description: 'Extraverted Intuition explores endless possibilities' },
      { position: 'Auxiliary', function: 'Fi', description: 'Introverted Feeling guides authentic values' },
      { position: 'Tertiary', function: 'Te', description: 'Extraverted Thinking helps execute ideas' },
      { position: 'Inferior', function: 'Si', description: 'Introverted Sensing grounds in experience' },
    ],
    keywords: ['enthusiastic', 'creative', 'sociable', 'optimistic', 'free-spirited'],
    strengths: ['Creativity', 'Enthusiasm', 'Communication', 'Empathy', 'Adaptability'],
    challenges: ['Focus', 'Follow-through', 'Overthinking', 'Practical details'],
    famousExamples: ['Robin Williams', 'Walt Disney', 'Mark Twain', 'Oscar Wilde'],
    careers: ['Writer', 'Actor', 'Counselor', 'Journalist', 'Marketing', 'Entrepreneur'],
  },
  istj: {
    code: 'ISTJ',
    name: 'The Logistician',
    stack: 'Si-Te-Fi-Ne',
    description: 'Responsible and thorough individuals who value tradition and reliability. They are the backbone of institutions.',
    cognitiveStack: [
      { position: 'Dominant', function: 'Si', description: 'Introverted Sensing stores detailed experience' },
      { position: 'Auxiliary', function: 'Te', description: 'Extraverted Thinking organizes and executes' },
      { position: 'Tertiary', function: 'Fi', description: 'Introverted Feeling guides personal values' },
      { position: 'Inferior', function: 'Ne', description: 'Extraverted Intuition considers possibilities' },
    ],
    keywords: ['responsible', 'thorough', 'dependable', 'traditional', 'practical'],
    strengths: ['Reliability', 'Organization', 'Attention to detail', 'Commitment', 'Practical skills'],
    challenges: ['Rigidity', 'Change resistance', 'Emotional expression', 'Seeing alternatives'],
    famousExamples: ['George Washington', 'Queen Elizabeth II', 'Warren Buffett', 'Angela Merkel'],
    careers: ['Accountant', 'Lawyer', 'Military', 'Administrator', 'Engineer', 'Manager'],
  },
  isfj: {
    code: 'ISFJ',
    name: 'The Defender',
    stack: 'Si-Fe-Ti-Ne',
    description: 'Caring protectors who remember details about the people they care for. They quietly ensure others are looked after.',
    cognitiveStack: [
      { position: 'Dominant', function: 'Si', description: 'Introverted Sensing recalls personal details' },
      { position: 'Auxiliary', function: 'Fe', description: 'Extraverted Feeling cares for others\' needs' },
      { position: 'Tertiary', function: 'Ti', description: 'Introverted Thinking provides logical analysis' },
      { position: 'Inferior', function: 'Ne', description: 'Extraverted Intuition explores possibilities' },
    ],
    keywords: ['supportive', 'reliable', 'patient', 'observant', 'loyal'],
    strengths: ['Reliability', 'Patience', 'Care for others', 'Memory', 'Practical support'],
    challenges: ['Overworking', 'Difficulty saying no', 'Change resistance', 'Neglecting self'],
    famousExamples: ['Mother Teresa', 'Queen Elizabeth II', 'Rosa Parks', 'Kate Middleton'],
    careers: ['Nurse', 'Teacher', 'Administrator', 'Social Worker', 'Librarian', 'Healthcare'],
  },
  estj: {
    code: 'ESTJ',
    name: 'The Executive',
    stack: 'Te-Si-Ne-Fi',
    description: 'Organized leaders who value order, tradition, and getting things done. They excel at managing people and processes.',
    cognitiveStack: [
      { position: 'Dominant', function: 'Te', description: 'Extraverted Thinking organizes and directs' },
      { position: 'Auxiliary', function: 'Si', description: 'Introverted Sensing values proven methods' },
      { position: 'Tertiary', function: 'Ne', description: 'Extraverted Intuition considers alternatives' },
      { position: 'Inferior', function: 'Fi', description: 'Introverted Feeling connects to values' },
    ],
    keywords: ['organized', 'logical', 'assertive', 'practical', 'direct'],
    strengths: ['Organization', 'Leadership', 'Dedication', 'Reliability', 'Directness'],
    challenges: ['Inflexibility', 'Impatience', 'Emotional sensitivity', 'Work-life balance'],
    famousExamples: ['Henry Ford', 'Judge Judy', 'John D. Rockefeller', 'Lyndon B. Johnson'],
    careers: ['Manager', 'Administrator', 'Military', 'Lawyer', 'Business Owner', 'Judge'],
  },
  esfj: {
    code: 'ESFJ',
    name: 'The Consul',
    stack: 'Fe-Si-Ne-Ti',
    description: 'Warm, social connectors who create harmony in their communities. They remember personal details and care deeply about others.',
    cognitiveStack: [
      { position: 'Dominant', function: 'Fe', description: 'Extraverted Feeling creates social harmony' },
      { position: 'Auxiliary', function: 'Si', description: 'Introverted Sensing remembers personal details' },
      { position: 'Tertiary', function: 'Ne', description: 'Extraverted Intuition considers possibilities' },
      { position: 'Inferior', function: 'Ti', description: 'Introverted Thinking provides logical analysis' },
    ],
    keywords: ['caring', 'sociable', 'traditional', 'loyal', 'organized'],
    strengths: ['Social skills', 'Loyalty', 'Practical care', 'Organization', 'Reliability'],
    challenges: ['Approval-seeking', 'Conflict sensitivity', 'Change resistance', 'Self-neglect'],
    famousExamples: ['Taylor Swift', 'Bill Clinton', 'Jennifer Garner', 'Sally Field'],
    careers: ['Teacher', 'Nurse', 'Administrator', 'Social Worker', 'Event Planner', 'Healthcare'],
  },
  istp: {
    code: 'ISTP',
    name: 'The Virtuoso',
    stack: 'Ti-Se-Ni-Fe',
    description: 'Cool-headed problem-solvers who excel with hands-on challenges. They understand how systems work and troubleshoot effectively.',
    cognitiveStack: [
      { position: 'Dominant', function: 'Ti', description: 'Introverted Thinking analyzes how things work' },
      { position: 'Auxiliary', function: 'Se', description: 'Extraverted Sensing engages with physical reality' },
      { position: 'Tertiary', function: 'Ni', description: 'Introverted Intuition provides insight' },
      { position: 'Inferior', function: 'Fe', description: 'Extraverted Feeling navigates social situations' },
    ],
    keywords: ['practical', 'observant', 'analytical', 'reserved', 'adaptable'],
    strengths: ['Problem-solving', 'Crisis response', 'Technical skills', 'Adaptability', 'Calm under pressure'],
    challenges: ['Emotional expression', 'Long-term planning', 'Commitment', 'Social conventions'],
    famousExamples: ['Steve Jobs', 'Bruce Lee', 'Clint Eastwood', 'Michael Jordan'],
    careers: ['Engineer', 'Mechanic', 'Pilot', 'Surgeon', 'Forensics', 'Craftsperson'],
  },
  isfp: {
    code: 'ISFP',
    name: 'The Adventurer',
    stack: 'Fi-Se-Ni-Te',
    description: 'Gentle artists who live in the present and express themselves through action. They have strong values and aesthetic sense.',
    cognitiveStack: [
      { position: 'Dominant', function: 'Fi', description: 'Introverted Feeling guides personal values' },
      { position: 'Auxiliary', function: 'Se', description: 'Extraverted Sensing engages with beauty and experience' },
      { position: 'Tertiary', function: 'Ni', description: 'Introverted Intuition provides insight' },
      { position: 'Inferior', function: 'Te', description: 'Extraverted Thinking organizes and executes' },
    ],
    keywords: ['artistic', 'sensitive', 'helpful', 'flexible', 'quiet'],
    strengths: ['Artistic expression', 'Sensitivity', 'Present-moment awareness', 'Loyalty', 'Aesthetic sense'],
    challenges: ['Long-term planning', 'Self-assertion', 'Dealing with conflict', 'Structure'],
    famousExamples: ['Bob Dylan', 'Rihanna', 'David Bowie', 'Frida Kahlo'],
    careers: ['Artist', 'Musician', 'Photographer', 'Chef', 'Veterinarian', 'Physical Therapist'],
  },
  estp: {
    code: 'ESTP',
    name: 'The Entrepreneur',
    stack: 'Se-Ti-Fe-Ni',
    description: 'Energetic risk-takers who thrive on action and live in the moment. They read situations quickly and act decisively.',
    cognitiveStack: [
      { position: 'Dominant', function: 'Se', description: 'Extraverted Sensing engages with immediate reality' },
      { position: 'Auxiliary', function: 'Ti', description: 'Introverted Thinking analyzes and problem-solves' },
      { position: 'Tertiary', function: 'Fe', description: 'Extraverted Feeling reads social situations' },
      { position: 'Inferior', function: 'Ni', description: 'Introverted Intuition considers long-term implications' },
    ],
    keywords: ['energetic', 'perceptive', 'direct', 'rational', 'bold'],
    strengths: ['Quick thinking', 'Negotiation', 'Crisis response', 'Persuasion', 'Adaptability'],
    challenges: ['Long-term planning', 'Patience', 'Sensitivity to others', 'Following rules'],
    famousExamples: ['Donald Trump', 'Ernest Hemingway', 'Madonna', 'Bruce Willis'],
    careers: ['Entrepreneur', 'Sales', 'Paramedic', 'Sports', 'Marketing', 'Police'],
  },
  esfp: {
    code: 'ESFP',
    name: 'The Entertainer',
    stack: 'Se-Fi-Te-Ni',
    description: 'Spontaneous entertainers who bring joy and energy to every situation. They love people and new experiences.',
    cognitiveStack: [
      { position: 'Dominant', function: 'Se', description: 'Extraverted Sensing engages with the world' },
      { position: 'Auxiliary', function: 'Fi', description: 'Introverted Feeling guides personal values' },
      { position: 'Tertiary', function: 'Te', description: 'Extraverted Thinking helps with practical matters' },
      { position: 'Inferior', function: 'Ni', description: 'Introverted Intuition considers deeper meaning' },
    ],
    keywords: ['spontaneous', 'energetic', 'friendly', 'playful', 'practical'],
    strengths: ['Social skills', 'Optimism', 'Practical problem-solving', 'Adaptability', 'Present-focus'],
    challenges: ['Long-term planning', 'Focus', 'Serious topics', 'Delayed gratification'],
    famousExamples: ['Marilyn Monroe', 'Elvis Presley', 'Jamie Oliver', 'Adele'],
    careers: ['Entertainer', 'Sales', 'Teacher', 'Event Planner', 'Healthcare', 'Hospitality'],
  },
};

export const pageData = {
  '/': {
    title: 'Free Cognitive Function Test - MBTI Test Alternative | TypeJung',
    description: 'Take a free 42-question Jungian cognitive functions test for people comparing MBTI tests, Sakinorva, and 16Personalities. See the function-stack map first.',
  },
  '/assessment': {
    title: 'Take the Free Jungian Cognitive Function Assessment | TypeJung',
    description: 'Start your free 42-question Jungian cognitive function assessment. Map self-reported patterns across all 8 functions, inferior-function pressure, somatic signals, and attitude direction.',
  },
  '/results': {
    title: 'Your Function-Stack Map | TypeJung',
    description: 'View your Jungian function-stack map with function scores, dominant-inferior axis, stress-edge context, and reflection prompts.',
  },
  '/learn': {
    title: 'Learn Jungian Typology | TypeJung',
    description: 'Understand Carl Jung\'s theory of psychological types, the 8 cognitive functions, and how they shape personality.',
  },
  '/pricing': {
    title: 'Pricing Plans | TypeJung',
    description: 'Choose your TypeJung plan: Free, Insight (CA$7 with TYPEJUNG30), or Mastery (CA$20.30 with TYPEJUNG30). One-time CAD upgrades add deeper interpretation, practice prompts, and guided follow-up support.',
  },
  '/privacy': {
    title: 'Privacy Policy | TypeJung',
    description: 'TypeJung\'s privacy policy explains how we collect, use, and protect your personal information.',
  },
  '/terms': {
    title: 'Terms of Service | TypeJung',
    description: 'Terms and conditions for using the TypeJung cognitive function assessment platform.',
  },
  '/jungian-test': {
    title: 'Jungian Test - Map Your Cognitive Functions | TypeJung',
    description: 'Take a Jungian test that maps all 8 cognitive functions, shows your likely type pattern, and supports educational self-reflection.',
  },
  '/mbti-alternative': {
    title: 'MBTI Alternative - Function-Based Typology Map | TypeJung',
    description: 'Compare TypeJung as an MBTI alternative for people who want Jungian function evidence, a free function-stack map, and optional paid interpretation after the result.',
  },
  '/inferior-function-test': {
    title: 'Inferior Function Test - Find Your Stress Pattern | TypeJung',
    description: 'Find your likely inferior function and understand how it can show up under stress with TypeJung\'s cognitive function assessment.',
  },
  '/cognitive-function-test': {
    title: 'Cognitive Function Test - Map All 8 Functions | TypeJung',
    description: 'Take a cognitive function test that maps Ni, Ne, Si, Se, Ti, Te, Fi, and Fe in one Jungian function-stack profile.',
  },
  '/cognitive-functions-test': {
    title: 'Cognitive Functions Test - Free Jungian 8-Function Map | TypeJung',
    description: 'Take a free Jungian cognitive functions test for Ni, Ne, Si, Se, Ti, Te, Fi, and Fe. This is a personality-functions map, not a memory screening test.',
  },
  '/jungian-cognitive-functions-test': {
    title: 'Jungian Cognitive Functions Test - Free Ni Ne Si Se Ti Te Fi Fe Map | TypeJung',
    description: 'Take a free Jungian cognitive functions test that maps Ni, Ne, Si, Se, Ti, Te, Fi, and Fe, then explains your dominant-inferior pattern.',
  },
};

const typeComparisonLandingPages = [
  {
    left: 'INFJ',
    right: 'INTJ',
    slug: 'infj-vs-intj-test',
    leftPattern: 'Ni-Fe',
    rightPattern: 'Ni-Te',
    shared: 'Both patterns can lead with introverted intuition, so both may look private, future-focused, and pattern-driven.',
    difference: 'The useful question is usually what supports the insight: relational calibration and shared values for INFJ-like patterns, or external structure and execution for INTJ-like patterns.',
    leftStress: 'inferior Se can show up as sensory overwhelm, urgency, or difficulty staying grounded',
    rightStress: 'inferior Se can show up as pressure around concrete limits, appetite, timing, or immediate action',
    leftType: 'infj',
    rightType: 'intj',
    leftFunction: 'fe',
    rightFunction: 'te',
  },
  {
    left: 'ENFP',
    right: 'INFP',
    slug: 'enfp-vs-infp-test',
    leftPattern: 'Ne-Fi',
    rightPattern: 'Fi-Ne',
    shared: 'Both patterns can feel imaginative, values-aware, and possibility-oriented, which is why quick quizzes often blur them.',
    difference: 'The useful question is what starts the process: outward possibility scanning for ENFP-like patterns, or inner value alignment for INFP-like patterns.',
    leftStress: 'inferior Si can show up as anxiety around memory, details, routine, or past precedent',
    rightStress: 'inferior Te can show up as pressure around execution, measurement, systems, or external demands',
    leftType: 'enfp',
    rightType: 'infp',
    leftFunction: 'ne',
    rightFunction: 'fi',
  },
  {
    left: 'ENTP',
    right: 'INTP',
    slug: 'entp-vs-intp-test',
    leftPattern: 'Ne-Ti',
    rightPattern: 'Ti-Ne',
    shared: 'Both patterns can be analytical, skeptical, idea-rich, and drawn to debate or model-building.',
    difference: 'The useful question is whether possibility generation comes first and logic refines it, or whether internal logic comes first and possibilities test the model.',
    leftStress: 'inferior Si can show up as resistance to routine, details, and repeated obligations',
    rightStress: 'inferior Fe can show up as tension around social feedback, harmony, or being emotionally legible',
    leftType: 'entp',
    rightType: 'intp',
    leftFunction: 'ne',
    rightFunction: 'ti',
  },
  {
    left: 'INTJ',
    right: 'ENTJ',
    slug: 'intj-vs-entj-test',
    leftPattern: 'Ni-Te',
    rightPattern: 'Te-Ni',
    shared: 'Both patterns can look strategic, decisive, systems-oriented, and impatient with vague execution.',
    difference: 'The useful question is what leads: an internal strategic image that later gets organized, or external organizing pressure that uses insight to choose direction.',
    leftStress: 'inferior Se can show up as sensory pressure, impatience with the present, or impulsive overcorrection',
    rightStress: 'inferior Fi can show up as difficulty naming personal values, emotional cost, or inner consent',
    leftType: 'intj',
    rightType: 'entj',
    leftFunction: 'ni',
    rightFunction: 'te',
  },
  {
    left: 'INFJ',
    right: 'ENFJ',
    slug: 'infj-vs-enfj-test',
    leftPattern: 'Ni-Fe',
    rightPattern: 'Fe-Ni',
    shared: 'Both patterns can be people-aware, meaning-focused, and tuned to relational atmosphere.',
    difference: 'The useful question is whether private pattern synthesis leads and then becomes relational, or whether relational needs lead and intuition organizes the longer arc.',
    leftStress: 'inferior Se can show up as sensory overwhelm, avoidance of direct action, or sudden urgency',
    rightStress: 'inferior Ti can show up as tension around detached analysis, precision, or being challenged on logic',
    leftType: 'infj',
    rightType: 'enfj',
    leftFunction: 'ni',
    rightFunction: 'fe',
  },
  {
    left: 'INFP',
    right: 'ISFP',
    slug: 'infp-vs-isfp-test',
    leftPattern: 'Fi-Ne',
    rightPattern: 'Fi-Se',
    shared: 'Both patterns can lead with introverted feeling, so both may look private, values-driven, sensitive to authenticity, and resistant to being pushed into false agreement.',
    difference: 'The useful question is what supports the value signal: possibility, language, and alternate meanings for INFP-like patterns, or direct sensory contact, aesthetics, and present action for ISFP-like patterns.',
    leftStress: 'inferior Te can show up as pressure around execution, metrics, systems, or being forced to prove value externally',
    rightStress: 'inferior Te can show up as sudden rigidity, harsh efficiency, or pressure to organize what had been handled through direct feel',
    leftType: 'infp',
    rightType: 'isfp',
    leftFunction: 'ne',
    rightFunction: 'se',
  },
  {
    left: 'INTP',
    right: 'ISTP',
    slug: 'intp-vs-istp-test',
    leftPattern: 'Ti-Ne',
    rightPattern: 'Ti-Se',
    shared: 'Both patterns can lead with introverted thinking, so both may look detached, precise, skeptical, and more interested in how something works than how it is socially received.',
    difference: 'The useful question is how the thinking gets tested: alternate models and theoretical possibility for INTP-like patterns, or hands-on contact with what works now for ISTP-like patterns.',
    leftStress: 'inferior Fe can show up as tension around social feedback, group expectation, or being emotionally readable',
    rightStress: 'inferior Fe can show up as pressure around relational atmosphere, being misunderstood, or needing to explain feelings cleanly',
    leftType: 'intp',
    rightType: 'istp',
    leftFunction: 'ne',
    rightFunction: 'se',
  },
  {
    left: 'ENFP',
    right: 'ENTP',
    slug: 'enfp-vs-entp-test',
    leftPattern: 'Ne-Fi',
    rightPattern: 'Ne-Ti',
    shared: 'Both patterns can lead with extraverted intuition, so both may look idea-rich, quick, curious, playful, and hard to pin down with routine personality questions.',
    difference: 'The useful question is what evaluates the possibilities: inner value and personal meaning for ENFP-like patterns, or internal logic and precision for ENTP-like patterns.',
    leftStress: 'inferior Si can show up as anxiety around routine, memory, bodily maintenance, or repeating details',
    rightStress: 'inferior Si can show up as resistance to precedent, maintenance, repeated obligations, or the limits of what has already happened',
    leftType: 'enfp',
    rightType: 'entp',
    leftFunction: 'fi',
    rightFunction: 'ti',
  },
  {
    left: 'ENTJ',
    right: 'ESTJ',
    slug: 'entj-vs-estj-test',
    leftPattern: 'Te-Ni',
    rightPattern: 'Te-Si',
    shared: 'Both patterns can lead with extraverted thinking, so both may look decisive, structured, outcome-focused, and impatient with vague follow-through.',
    difference: 'The useful question is what informs the external structure: long-range pattern and strategic implication for ENTJ-like patterns, or tested precedent, reliability, and procedural memory for ESTJ-like patterns.',
    leftStress: 'inferior Fi can show up as difficulty naming personal cost, inner consent, or the value beneath the goal',
    rightStress: 'inferior Fi can show up as pressure around personal preference, emotional ownership, or whether the efficient path still feels right',
    leftType: 'entj',
    rightType: 'estj',
    leftFunction: 'ni',
    rightFunction: 'si',
  },
  {
    left: 'ISFJ',
    right: 'INFJ',
    slug: 'isfj-vs-infj-test',
    leftPattern: 'Si-Fe',
    rightPattern: 'Ni-Fe',
    shared: 'Both patterns can support themselves with extraverted feeling, so both may look considerate, relationally aware, careful with tone, and responsible toward people.',
    difference: 'The useful question is what comes before the relational calibration: memory, continuity, and concrete precedent for ISFJ-like patterns, or symbolic pattern and future implication for INFJ-like patterns.',
    leftStress: 'inferior Ne can show up as anxious possibility, scattered what-ifs, or fear that one change will unravel stability',
    rightStress: 'inferior Se can show up as sensory overwhelm, urgency, or difficulty staying grounded in direct reality',
    leftType: 'isfj',
    rightType: 'infj',
    leftFunction: 'si',
    rightFunction: 'ni',
  },
  {
    left: 'ISTJ',
    right: 'INTJ',
    slug: 'istj-vs-intj-test',
    leftPattern: 'Si-Te',
    rightPattern: 'Ni-Te',
    shared: 'Both patterns can use extraverted thinking as a strong support, so both may look organized, private, competent, and serious about reliable execution.',
    difference: 'The useful question is what leads the execution: experience-based comparison and procedural memory for ISTJ-like patterns, or long-range pattern synthesis for INTJ-like patterns.',
    leftStress: 'inferior Ne can show up as spiraling possibilities, worry about what could go wrong, or discomfort with open-ended novelty',
    rightStress: 'inferior Se can show up as pressure around immediate limits, appetite, timing, sensory overwhelm, or sudden impulsive correction',
    leftType: 'istj',
    rightType: 'intj',
    leftFunction: 'si',
    rightFunction: 'ni',
  },
  {
    left: 'ESFP',
    right: 'ENFP',
    slug: 'esfp-vs-enfp-test',
    leftPattern: 'Se-Fi',
    rightPattern: 'Ne-Fi',
    shared: 'Both patterns can support themselves with introverted feeling, so both may look expressive, values-aware, people-responsive, and allergic to lifeless rules.',
    difference: 'The useful question is how attention opens first: direct sensory contact and present opportunity for ESFP-like patterns, or possibility, association, and imaginative branching for ENFP-like patterns.',
    leftStress: 'inferior Ni can show up as ominous meanings, future dread, or sudden fixation on one hidden implication',
    rightStress: 'inferior Si can show up as pressure around routine, health maintenance, details, memory, or past precedent',
    leftType: 'esfp',
    rightType: 'enfp',
    leftFunction: 'se',
    rightFunction: 'ne',
  },
  {
    left: 'ESTP',
    right: 'ENTP',
    slug: 'estp-vs-entp-test',
    leftPattern: 'Se-Ti',
    rightPattern: 'Ne-Ti',
    shared: 'Both patterns can support themselves with introverted thinking, so both may look quick, skeptical, adaptive, and energized by testing limits.',
    difference: 'The useful question is where the testing starts: direct contact with the situation, body, and immediate leverage for ESTP-like patterns, or idea generation and alternate possibilities for ENTP-like patterns.',
    leftStress: 'inferior Ni can show up as dark future projections, hidden-meaning fixation, or pressure to find one inevitable outcome',
    rightStress: 'inferior Si can show up as resistance to maintenance, repetition, past precedent, or the limits imposed by accumulated details',
    leftType: 'estp',
    rightType: 'entp',
    leftFunction: 'se',
    rightFunction: 'ne',
  },
].map((page) => {
  const leftName = typeData[page.leftType].name;
  const rightName = typeData[page.rightType].name;

  return {
    slug: page.slug,
    query: `${page.left} vs ${page.right} test`,
    title: `${page.left} vs ${page.right} Test - Compare ${page.leftPattern} and ${page.rightPattern} | TypeJung`,
    description: `Use TypeJung as an ${page.left} vs ${page.right} test by comparing ${page.leftPattern} and ${page.rightPattern} function evidence before choosing a label.`,
    keywords: [
      `${page.left} vs ${page.right} test`,
      `${page.left} or ${page.right}`,
      `${page.leftPattern} vs ${page.rightPattern}`,
      `${page.left} ${page.right} cognitive functions`,
    ],
    eyebrow: `${page.left} vs ${page.right} test`,
    h1: `${page.left} vs ${page.right}: compare the function pattern`,
    intro: [
      `${page.left} and ${page.right} can overlap enough that behavior-based personality quizzes may not settle the question.`,
      `TypeJung helps you compare the process behind the labels: ${page.leftPattern} for ${page.left}-like patterns and ${page.rightPattern} for ${page.right}-like patterns.`,
    ],
    intent: {
      bestFor: `People deciding between ${page.left} and ${page.right} who want function evidence instead of another stereotype list.`,
      measures: 'All 8 cognitive functions, likely type pattern, dominant-inferior axis, attitude direction, and stress-edge signals.',
      privacy: 'Start with the free 42-question map. Paid reports are optional after you see whether the result feels accurate.',
    },
    sections: [
      {
        heading: `Why ${page.left} and ${page.right} get confused`,
        body: [
          page.shared,
          page.difference,
        ],
        table: {
          headers: ['Question', `${page.left}-like ${page.leftPattern}`, `${page.right}-like ${page.rightPattern}`],
          rows: [
            ['First filter', `The pattern usually starts through ${page.leftPattern.split('-')[0]}`, `The pattern usually starts through ${page.rightPattern.split('-')[0]}`],
            ['Support function', `The next stabilizer is ${page.leftPattern.split('-')[1]}`, `The next stabilizer is ${page.rightPattern.split('-')[1]}`],
            ['Stress edge', page.leftStress, page.rightStress],
          ],
        },
      },
      {
        heading: 'Why a normal type description may not be enough',
        body: [
          `A description of ${leftName} or ${rightName} can feel partly true even when the function order is not right. Type descriptions compress many signals into one story.`,
          'A stronger test checks what your attention does first, which support function appears next, and what becomes awkward or reactive under pressure.',
        ],
        bullets: [
          'Look for the order of cognition, not just familiar traits',
          'Compare dominant and auxiliary evidence together',
          'Check the inferior-function signal instead of ignoring stress data',
          'Treat the result as a map to inspect, not a permanent identity stamp',
        ],
      },
      {
        heading: 'Use TypeJung as the next check',
        body: [
          `Take the free assessment, then compare your ${page.leftPattern} and ${page.rightPattern} evidence in the full map. If the result is useful, the optional Insight report explains the stress edge, relationship-pattern reflection, and practical next steps behind your pattern.`,
        ],
        links: [
          { href: '/assessment', label: `Take the free ${page.left} vs ${page.right} assessment` },
          { href: '/sample-report', label: 'Preview the optional Insight report' },
          { href: '/pricing', label: 'Compare Free, Insight, and Mastery' },
        ],
      },
    ],
    faqs: [
      {
        question: `Can TypeJung tell me if I am ${page.left} or ${page.right}?`,
        answer: `TypeJung gives a likely type pattern and the function evidence behind it. Use it to compare ${page.leftPattern} and ${page.rightPattern} rather than treating any test as a final verdict.`,
      },
      {
        question: `Why do ${page.left} and ${page.right} get mistyped?`,
        answer: 'Nearby types can share visible behaviors. The difference usually sits in the function order and the stress edge, not in a single stereotype.',
      },
      {
        question: `Is this ${page.left} vs ${page.right} test free?`,
        answer: 'The core 42-question TypeJung assessment is free. Optional paid reports add deeper interpretation after you see the map.',
      },
    ],
    relatedLinks: [
      { href: '/assessment', label: 'Take the free assessment' },
      { href: `/types/${page.leftType}`, label: `${page.left} type guide` },
      { href: `/types/${page.rightType}`, label: `${page.right} type guide` },
      { href: `/functions/${page.leftFunction}`, label: `${page.leftPattern.split('-')[0]} function guide` },
      { href: `/functions/${page.rightFunction}`, label: `${page.rightPattern.split('-')[0]} function guide` },
      { href: '/cognitive-function-test', label: 'Cognitive function test' },
    ],
  };
});

const competitorLandingPages = [
  {
    slug: 'mbti-test-alternative',
    query: 'MBTI test alternative',
    title: 'MBTI Test Alternative - Free Cognitive Function Map | TypeJung',
    description: 'Looking for an MBTI test alternative? TypeJung maps all 8 Jungian cognitive functions before any paid report, so you can inspect the pattern behind the label.',
    keywords: ['MBTI test alternative', 'free MBTI alternative', 'cognitive functions test', 'Jungian function test'],
    eyebrow: 'MBTI test alternative',
    h1: 'An MBTI test alternative for people whose type keeps changing',
    intro: [
      'If an MBTI test or 16Personalities-style quiz gives you a quick four-letter result, it can still leave the function pattern hidden.',
      'TypeJung is not an official MBTI instrument. It is a free Jungian cognitive-functions test that shows all 8 scores and the dominant-inferior axis before any optional paid report.',
    ],
    intent: {
      bestFor: 'People who want a serious second opinion after changing MBTI results or broad personality labels.',
      measures: 'Ni, Ne, Si, Se, Ti, Te, Fi, Fe, likely function stack, inferior-function pressure, attitude direction, and reliability signal.',
      privacy: 'Start with the free 42-question map. Signup and paid reports are optional after you see the result.',
    },
    sections: [
      {
        heading: 'Why an MBTI test alternative can be more useful',
        body: [
          'Four-letter type results can be helpful shorthand, but they often hide the evidence behind the label.',
          'TypeJung starts with the function pattern: which function leads, which function supports it, and which opposite function tends to tighten under stress.',
        ],
        bullets: [
          'Use function evidence before deciding on a label',
          'Compare nearby type patterns instead of forcing one answer too early',
          'See the stress edge and body signal that many quick quizzes miss',
          'Read the free map before deciding whether paid interpretation is worth it',
        ],
        links: [
          { href: '/assessment', label: 'Take the free TypeJung assessment' },
          { href: '/sample-report', label: 'Preview the optional Insight report' },
        ],
      },
      {
        heading: 'How TypeJung differs from label-first tests',
        body: [
          'TypeJung is independent and educational. It does not claim to be an official MBTI instrument.',
          'The practical difference is the order of value: you get the function-stack map first, then optional depth only after the result feels useful.',
        ],
        table: {
          headers: ['Need', 'Label-first test', 'TypeJung'],
          rows: [
            ['First output', 'A four-letter result', 'Function-stack map plus likely pattern'],
            ['Stress evidence', 'Often generic', 'Dominant-inferior axis and pressure signals'],
            ['Payment timing', 'Varies by tool', 'Free map before paid interpretation'],
            ['Best use', 'Quick type hypothesis', 'Inspectable second opinion'],
          ],
        },
      },
      {
        heading: 'Start with the map',
        body: [
          'If your result keeps changing, treat the next test as evidence gathering, not a verdict. Take TypeJung, read the free map, and compare the axis against real stress patterns.',
        ],
        links: [
          { href: '/assessment', label: 'Start the free assessment' },
          { href: '/mbti-keeps-changing', label: 'Why MBTI results keep changing' },
          { href: '/cognitive-function-test', label: 'Cognitive function test' },
        ],
      },
    ],
    faqs: [
      {
        question: 'Is TypeJung an official MBTI test?',
        answer: 'No. TypeJung is an independent Jungian cognitive-functions assessment for educational self-reflection, not an official MBTI instrument.',
      },
      {
        question: 'Is the TypeJung assessment free?',
        answer: 'Yes. The core 42-question assessment and function-stack map are free. Insight and Mastery are optional one-time upgrades after you see the map.',
      },
      {
        question: 'Why use cognitive functions instead of only four letters?',
        answer: 'Cognitive functions make the result easier to inspect. They show which processes lead, support, and create pressure under stress.',
      },
    ],
    relatedLinks: [
      { href: '/assessment', label: 'Take the free assessment' },
      { href: '/16personalities-alternative', label: '16Personalities alternative' },
      { href: '/sakinorva-alternative', label: 'Sakinorva alternative' },
      { href: '/best-cognitive-functions-test', label: 'Best cognitive functions test' },
      { href: '/sample-report', label: 'View sample report' },
    ],
  },
  {
    slug: '16personalities-alternative',
    query: '16Personalities alternative',
    title: '16Personalities Alternative - Free Function Map First | TypeJung',
    description: 'Looking for a 16Personalities alternative? TypeJung maps all 8 Jungian cognitive functions, shows a free result first, and avoids forcing a final label too early.',
    keywords: ['16Personalities alternative', '16 personalities alternative', 'MBTI test alternative', 'cognitive functions test'],
    eyebrow: '16Personalities alternative',
    h1: 'A 16Personalities alternative when four letters are not enough',
    intro: [
      'If a 16Personalities-style result felt too broad, the next useful step is not always another label. It is seeing the function evidence behind the label.',
      'TypeJung is not affiliated with 16Personalities. It gives a free function-stack map first, then optional paid interpretation only after you can judge the result.',
    ],
    intent: {
      bestFor: 'People who liked the accessibility of a quick type result but want a deeper function-based map.',
      measures: 'All 8 Jungian functions, dominant-inferior axis, stress-edge signal, attitude direction, and answer consistency.',
      privacy: 'No card required for the core map. Paid reports are optional one-time upgrades.',
    },
    sections: [
      {
        heading: 'Why people outgrow broad type summaries',
        body: [
          'A polished type description can feel validating while still leaving you unsure why the type fits.',
          'TypeJung focuses on the underlying function pattern so you can compare the evidence instead of relying only on a broad personality summary.',
        ],
        bullets: [
          'See all 8 function signals',
          'Compare close type possibilities',
          'Use stress patterns as evidence',
          'Preview the paid report before checkout',
        ],
        links: [
          { href: '/assessment', label: 'Start the free TypeJung assessment' },
          { href: 'https://www.16personalities.com/', label: 'Visit 16Personalities directly' },
        ],
      },
      {
        heading: 'What TypeJung gives you first',
        body: [
          'The free result gives a function-stack map, dominant-inferior axis, reliability signal, and plain-language interpretation. Paid reports add deeper stress-pattern reflection, relationship-pattern reflection, and practice prompts.',
        ],
        table: {
          headers: ['Question', '16Personalities-style path', 'TypeJung path'],
          rows: [
            ['Main output', 'Accessible type profile', 'Inspectable function-stack map'],
            ['Depth layer', 'Broad trait summary', 'Function order, stress edge, and body signal'],
            ['Upgrade decision', 'Depends on product path', 'Decide after seeing the free map'],
          ],
        },
      },
      {
        heading: 'Use it as a second opinion',
        body: [
          'If you already have a four-letter result, use TypeJung to test the cognitive pattern behind it. A useful second opinion should make the type easier to inspect, not just hand you another label.',
        ],
        links: [
          { href: '/assessment', label: 'Take the free assessment' },
          { href: '/mbti-test-alternative', label: 'MBTI test alternative' },
          { href: '/cognitive-function-test', label: 'Cognitive function test' },
        ],
      },
      {
        heading: 'Which one to choose',
        body: [
          'These two tools answer different questions. Pick the one that matches what you are trying to learn.',
        ],
        table: {
          headers: ['Choose 16Personalities if…', 'Choose TypeJung if…'],
          rows: [
            ['You want a fast, friendly trait portrait and percentages', 'You want the underlying Jungian function stack, not a trait percentage'],
            ['You like a polished summary you can share immediately', 'You want the dominant-inferior axis and stress edge you can verify'],
            ['You are exploring personality for the first time', 'Your result keeps changing and you want evidence layers behind it'],
            ['A descriptive overview is enough', 'You want optional, result-tied depth only after a free map you trust'],
          ],
        },
      },
    ],
    faqs: [
      {
        question: 'Is TypeJung affiliated with 16Personalities?',
        answer: 'No. TypeJung is independent and not affiliated with 16Personalities.',
      },
      {
        question: 'Will TypeJung give me a four-letter type?',
        answer: 'TypeJung can suggest a likely type pattern, but the main result is the function-stack map and dominant-inferior axis.',
      },
      {
        question: 'Do I need to pay before seeing the result?',
        answer: 'No. The core TypeJung map is free. Paid reports are optional after you see whether the map is useful.',
      },
    ],
    relatedLinks: [
      { href: '/assessment', label: 'Take the free assessment' },
      { href: '/mbti-test-alternative', label: 'MBTI test alternative' },
      { href: '/sakinorva-alternative', label: 'Sakinorva alternative' },
      { href: '/sample-report', label: 'View sample report' },
      { href: '/pricing', label: 'Pricing' },
    ],
  },
  {
    slug: 'sakinorva-alternative',
    query: 'Sakinorva alternative',
    title: 'Sakinorva Alternative - Free Cognitive Function Map First | TypeJung',
    description: 'Looking for a Sakinorva alternative? TypeJung maps all 8 Jungian functions, shows a free result first, and offers optional deeper reports only after you see the map.',
    keywords: ['Sakinorva alternative', 'Sakinorva cognitive functions test alternative', 'cognitive functions test', 'MBTI function test alternative'],
    eyebrow: 'Sakinorva alternative',
    h1: 'A Sakinorva alternative when you want the map before the label',
    intro: [
      'Sakinorva is a familiar name for people exploring cognitive functions. Many searchers arrive there because they want something deeper than a four-letter MBTI-style result.',
      'TypeJung is built for the same search moment, but with a different path: finish a 42-question free map first, inspect all 8 function signals, then decide whether a paid interpretation is useful.',
    ],
    intent: {
      bestFor: 'People comparing cognitive-function tests who want an inspectable free map and optional paid depth after the result.',
      measures: 'All 8 function-attitudes, likely dominant-inferior axis, attitude direction, answer consistency, stress-edge signals, and type-pattern evidence.',
      privacy: 'Start free before checkout. Signup is optional for saved history and restored paid access.',
    },
    sections: [
      {
        heading: 'Why people search for a Sakinorva alternative',
        body: [
          'A search for a Sakinorva alternative usually means the person already knows the phrase cognitive functions and wants a better way to interpret the result.',
          'The problem is rarely just taking another test. The real need is a result that is readable enough to compare against lived patterns: attention, decisions, conflict, stress, and recovery.',
        ],
        bullets: [
          'You want all 8 functions visible, not only a final type code',
          'You want a shorter assessment path than very long-form function batteries',
          'You want the stress edge and inferior-function pattern explained',
          'You want to see value before paying for deeper interpretation',
        ],
        links: [
          { href: '/assessment', label: 'Start the free TypeJung assessment' },
          { href: 'https://sakinorva.net/functions?lang=en', label: 'Visit Sakinorva directly' },
        ],
      },
      {
        heading: 'TypeJung and Sakinorva solve different parts of the problem',
        body: [
          'Sakinorva is widely known among typology communities and offers cognitive-function testing routes, including long-form formats. TypeJung focuses on a free-first product path that is easier to judge before paying.',
          'Use TypeJung when you want a clear map, a sample paid report before checkout, and upgrade copy tied to the result you already saw.',
        ],
        table: {
          headers: ['Need', 'Sakinorva-style search', 'TypeJung path'],
          rows: [
            ['Core intent', 'Explore cognitive-function scores', 'Map functions, stress edge, and development path'],
            ['Result decision', 'Compare scores and formulas', 'Read the free map, then decide whether depth is worth it'],
            ['Upgrade pressure', 'Varies by tool path', 'No payment before the core TypeJung map'],
            ['Best next action', 'Use if you want another function-test reference point', 'Use if you want the result interpreted after the map feels accurate'],
          ],
        },
      },
      {
        heading: 'Which one to choose',
        body: [
          'Neither tool is the single right answer. Pick based on what you actually want to walk away with.',
        ],
        table: {
          headers: ['Choose Sakinorva if…', 'Choose TypeJung if…'],
          rows: [
            ['You enjoy comparing multiple scoring formulas and long-form function batteries', 'You want one readable map you can check against real behaviour'],
            ['You are happy to interpret raw function scores yourself', 'You want the dominant-inferior axis and stress edge explained in plain language'],
            ['You already know your type and want another data point', 'Your type keeps shifting and you want four evidence layers, not a single label'],
            ['You do not need a guided next step', 'You want optional, result-tied depth only after the free map earns trust'],
          ],
        },
      },
      {
        heading: 'What TypeJung adds after the free result',
        body: [
          'The free TypeJung result shows the function-stack map and dominant-inferior axis. Insight adds a deeper read of the developmental edge, stress-pattern reflection, relationship patterns, and practice prompts. Mastery adds the AI Type Guide and follow-up tools.',
          'That makes TypeJung strongest for searchers who are tired of collecting screenshots of test scores and want a next-step interpretation tied to their exact pattern.',
        ],
        links: [
          { href: '/sample-report', label: 'View the sample Insight report' },
          { href: '/pricing', label: 'Compare Free, Insight, and Mastery' },
        ],
      },
    ],
    faqs: [
      {
        question: 'Is TypeJung the same as Sakinorva?',
        answer: 'No. Both live in the cognitive-functions search category, but TypeJung emphasizes a free 42-question map, result-first upgrade path, and optional paid interpretation after the result.',
      },
      {
        question: 'Should I retake a test if Sakinorva confused me?',
        answer: 'A second test can help, but compare the result against real patterns. TypeJung is designed to make the map easier to inspect before you commit to a label.',
      },
      {
        question: 'Is TypeJung free?',
        answer: 'The core TypeJung assessment and map are free. Insight and Mastery are optional one-time CAD upgrades.',
      },
    ],
    relatedLinks: [
      { href: '/assessment', label: 'Take the free assessment' },
      { href: '/cognitive-function-test', label: 'Cognitive function test' },
      { href: '/free-cognitive-function-test', label: 'Free cognitive function test' },
      { href: '/sample-report', label: 'View sample report' },
      { href: '/pricing', label: 'Pricing' },
    ],
  },
  {
    slug: 'keys2cognition-alternative',
    query: 'Keys2Cognition alternative',
    title: 'Keys2Cognition Alternative - Free Jungian Function Map | TypeJung',
    description: 'Compare TypeJung as a Keys2Cognition alternative for mapping all 8 Jungian functions, stress edges, and optional deeper reports after a free result.',
    keywords: ['Keys2Cognition alternative', 'Keys2Cognition cognitive processes alternative', 'cognitive processes test', 'Jungian functions test'],
    eyebrow: 'Keys2Cognition alternative',
    h1: 'A Keys2Cognition alternative with a free-first result path',
    intro: [
      'Keys2Cognition is one of the older cognitive-process resources in the Jungian type space. People who search for alternatives usually want another way to understand all 8 function-attitudes.',
      'TypeJung keeps the function-level focus, but makes the commercial path explicit: take the free assessment, inspect the result, then upgrade only if the map is useful.',
    ],
    intent: {
      bestFor: 'Searchers who know cognitive-process language and want a modern result page with an optional deeper report.',
      measures: 'Ni, Ne, Si, Se, Ti, Te, Fi, Fe, likely hierarchy, dominant-inferior tension, answer consistency, and stress cues.',
      privacy: 'No payment is required to see the function-stack map. Account use is optional unless you want saved history or restored paid access.',
    },
    sections: [
      {
        heading: 'What to compare',
        body: [
          'Keys2Cognition describes cognition through eight mental processes. TypeJung also centers the eight function-attitudes, but turns the result into a guided map with a clearer upgrade decision.',
          'The useful question is not which tool can give a label fastest. It is which result helps you understand what leads, what supports, and what becomes pressured or less conscious.',
        ],
        table: {
          headers: ['Question', 'Keys2Cognition-style need', 'TypeJung path'],
          rows: [
            ['Do I see all 8 processes?', 'Yes, this is the core reason people search for it', 'Yes, TypeJung maps all 8 function-attitudes'],
            ['Do I get a free first result?', 'Users look for cognitive-process scoring', 'The free TypeJung map appears before paid reports'],
            ['Do I get deeper interpretation?', 'Depends on what the user studies afterward', 'Insight and Mastery add paid interpretation after the map'],
            ['Do I get stress-edge context?', 'Not always the main product promise', 'Dominant-inferior and stress pattern are central to TypeJung'],
          ],
        },
        links: [
          { href: 'https://www.keys2cognition.com/index.htm', label: 'Visit Keys2Cognition directly' },
          { href: '/assessment', label: 'Start TypeJung free' },
        ],
      },
      {
        heading: 'When TypeJung is the better next test',
        body: [
          'Choose TypeJung if you already know function terms but want a cleaner path from scores to practical interpretation.',
          'The result is written around attention, judgment, stress, relationships, and practice rather than treating the type code as the only outcome.',
        ],
        bullets: [
          'You want the dominant-inferior axis made explicit',
          'You want sample paid-report content before checkout',
          'You want source-tracked links back to the exact assessment path',
          'You want one-time pricing rather than a subscription model',
        ],
      },
      {
        heading: 'Which one to choose',
        body: [
          'Both stay at the function level. The difference is what you do with the scores once you have them.',
        ],
        table: {
          headers: ['Choose Keys2Cognition if…', 'Choose TypeJung if…'],
          rows: [
            ['You want a quick cognitive-process score as a reference point', 'You want a readable map with the dominant-inferior axis made explicit'],
            ['You are comfortable interpreting the numbers on your own', 'You want stress-edge and reliability context in plain language'],
            ['You only need the raw process ranking', 'You want optional, result-tied interpretation after a free map'],
            ['You are gathering multiple data points to compare', 'Your type keeps shifting and you want four agreeing evidence layers'],
          ],
        },
      },
      {
        heading: 'Start with the free map',
        body: [
          'Take the free assessment first. If your map feels accurate, the optional Insight report explains the developmental edge and stress pattern behind it.',
        ],
        links: [
          { href: '/sample-report', label: 'Preview the optional report' },
          { href: '/pricing', label: 'Compare the report options' },
        ],
      },
    ],
    faqs: [
      {
        question: 'Does TypeJung replace Keys2Cognition?',
        answer: 'No single test should be treated as final. TypeJung is a useful alternative when you want a modern free-first map and optional interpretation after seeing the result.',
      },
      {
        question: 'Does TypeJung measure cognitive processes?',
        answer: 'TypeJung maps self-reported patterns across the eight Jungian function-attitudes and presents them as a function-stack map with likely hierarchy and stress-edge context.',
      },
      {
        question: 'Do I need to know theory first?',
        answer: 'No. The result and Learn pages explain the relevant functions after you finish the assessment.',
      },
    ],
    relatedLinks: [
      { href: '/assessment', label: 'Take the free assessment' },
      { href: '/jungian-cognitive-functions-test', label: 'Jungian cognitive functions test' },
      { href: '/function-stack-test', label: 'Function stack test' },
      { href: '/cognitive-functions', label: 'Cognitive functions guide' },
      { href: '/pricing', label: 'Pricing' },
    ],
  },
  {
    slug: 'mistype-investigator-alternative',
    query: 'Mistype Investigator alternative',
    title: 'Mistype Investigator Alternative - Function Evidence Before Type | TypeJung',
    description: 'Use TypeJung as a Mistype Investigator alternative when you want a free cognitive-function map, stress-edge context, and optional deeper interpretation.',
    keywords: ['Mistype Investigator alternative', 'mistype investigator cognitive functions test', 'mistype test alternative', 'MBTI mistype test'],
    eyebrow: 'Mistype Investigator alternative',
    h1: 'A Mistype Investigator alternative for checking the pattern behind a mistype',
    intro: [
      'Mistype Investigator attracts people who suspect their type result is wrong or incomplete. That is the right instinct: mistypes usually need function evidence, not another personality stereotype.',
      'TypeJung approaches that question through a free 42-question map of all 8 functions, then shows the dominant-inferior axis and stress edge before any paid report.',
    ],
    intent: {
      bestFor: 'People trying to resolve a suspected MBTI mistype through function evidence instead of more type descriptions.',
      measures: 'All 8 functions, likely type pattern, dominant-inferior axis, stress signals, and answer consistency.',
      privacy: 'The map is free first. Paid interpretation is optional and one-time.',
    },
    sections: [
      {
        heading: 'What a mistype check needs',
        body: [
          'A mistype check should explain why two or three labels are competing. The answer often sits in function order, support function evidence, and the less conscious stress edge.',
          'TypeJung helps by showing the profile first, then linking the result to type and function pages so you can compare competing hypotheses.',
        ],
        bullets: [
          'Compare functions, not only type stereotypes',
          'Check whether stress behavior points toward an inferior function',
          'Treat close results as hypotheses instead of forcing certainty',
          'Use the result as a self-observation map over time',
        ],
        links: [
          { href: 'https://mistypeinvestigator.com/', label: 'Visit Mistype Investigator directly' },
          { href: '/assessment', label: 'Start the TypeJung map' },
        ],
      },
      {
        heading: 'TypeJung versus a mistype-only workflow',
        body: [
          'If your main question is "what type am I really?", a mistype-focused test can be useful. If your next question is "what does this pattern mean in stress, relationships, and practice?", TypeJung is designed to carry the result further.',
        ],
        table: {
          headers: ['Need', 'Mistype search intent', 'TypeJung path'],
          rows: [
            ['Resolve confusion', 'Compare possible type outcomes', 'Show function evidence and axis tension'],
            ['Understand stress', 'Often discussed after the result', 'Built into the map and optional report'],
            ['Keep learning', 'User studies theory and examples', 'Result links into function, type, and sample-report paths'],
            ['Pay only after value', 'Depends on the tool path', 'Core TypeJung map is free before checkout'],
          ],
        },
      },
      {
        heading: 'Use TypeJung after conflicting test results',
        body: [
          'If Sakinorva, Keys2Cognition, Mistype Investigator, or IDRlabs gave you conflicting results, do not just average the labels. Look for repeated function signals and repeated stress patterns.',
          'TypeJung is useful as another structured check because it gives you a result you can read as a map, not a verdict.',
        ],
        links: [
          { href: '/infj-vs-infp-test', label: 'Example: INFJ vs INFP' },
          { href: '/intj-vs-intp-test', label: 'Example: INTJ vs INTP' },
          { href: '/entp-vs-intp-test', label: 'Example: ENTP vs INTP' },
        ],
      },
    ],
    faqs: [
      {
        question: 'Can TypeJung tell me if I was mistyped?',
        answer: 'TypeJung can give another function-evidence map and likely type pattern. Use it to inspect competing hypotheses rather than treating any test as final.',
      },
      {
        question: 'What if TypeJung gives a different result?',
        answer: 'Compare the function evidence and stress edge. A different result is useful if it explains repeated real-life patterns better.',
      },
      {
        question: 'Is TypeJung free to try?',
        answer: 'Yes. The core assessment and map are free; paid reports are optional after you see the result.',
      },
    ],
    relatedLinks: [
      { href: '/assessment', label: 'Take the free assessment' },
      { href: '/mbti-keeps-changing', label: 'Why MBTI results change' },
      { href: '/infj-vs-infp-test', label: 'INFJ vs INFP test' },
      { href: '/intj-vs-intp-test', label: 'INTJ vs INTP test' },
      { href: '/sample-report', label: 'View sample report' },
    ],
  },
  {
    slug: 'michael-caloz-alternative',
    query: 'Michael Caloz alternative',
    title: 'Michael Caloz Alternative - Free Jungian Function Map First | TypeJung',
    description: 'Looking for a Michael Caloz alternative? TypeJung maps all 8 functions, shows a free result first, and offers optional paid depth after the map.',
    keywords: ['Michael Caloz alternative', 'Michael Caloz cognitive functions test alternative', 'cognitive functions test alternative', 'MBTI function test'],
    eyebrow: 'Michael Caloz alternative',
    h1: 'A Michael Caloz alternative when you want the map before the coaching path',
    intro: [
      'The Michael Caloz Cognitive Functions Test is a familiar option for people who already know that type is more than four letters.',
      'TypeJung is useful as the next comparison point when you want a free 42-question function map first, a visible dominant-inferior axis, and optional paid interpretation only after you can inspect the result.',
    ],
    intent: {
      bestFor: 'People who like function-pair comparison tests but want a result-first upgrade path and a clear sample report before checkout.',
      measures: 'All 8 function-attitudes, likely hierarchy, dominant-inferior tension, stress-edge signals, answer consistency, and type-pattern evidence.',
      privacy: 'Start free before checkout. Paid access is optional and one-time, with account sign-in used only for saved history or restored access.',
    },
    sections: [
      {
        heading: 'Why people search for a Michael Caloz alternative',
        body: [
          'People usually search for a Michael Caloz alternative because they want another structured read on cognitive functions, not a shallow type quiz.',
          'A second test is most useful when it gives you a different lens on the same question: which function leads, which support function stabilizes it, and what gets pressured under stress.',
        ],
        bullets: [
          'You want to compare another function-map result against your current type hypothesis',
          'You want all 8 functions visible before making a paid decision',
          'You want the stress edge and inferior-function pattern surfaced in the result',
          'You want an optional report preview before Stripe checkout',
        ],
        links: [
          { href: 'https://www.michaelcaloz.com/personality/', label: 'Visit the Michael Caloz test directly' },
          { href: '/assessment', label: 'Start the TypeJung map' },
        ],
      },
      {
        heading: 'TypeJung and Michael Caloz answer different next questions',
        body: [
          'Michael Caloz uses educational function comparisons and type-fit interpretation. TypeJung focuses on turning a free map into a clear upgrade decision after the result is already visible.',
          'Use TypeJung when the question has shifted from "which type fits?" to "what does this dominant-inferior pattern mean in stress, relationships, and practice?"',
        ],
        table: {
          headers: ['Need', 'Michael Caloz-style search', 'TypeJung path'],
          rows: [
            ['Function evidence', 'Compare cognitive-function preferences and type fit', 'Read all 8 function signals in a free function-stack map'],
            ['Result interpretation', 'Study the result and type explanations', 'Use the map, then optionally unlock deeper stress and practice interpretation'],
            ['Payment timing', 'External coaching and resources may be available after the test', 'No payment before the core TypeJung result'],
            ['Best next action', 'Use if you want another established function test reference', 'Use if you want a result-first path with one-time report pricing'],
          ],
        },
      },
      {
        heading: 'How to compare your results',
        body: [
          'Do not average type labels from different tests. Compare repeated signals: which functions appear near the top, which functions feel effortful, and whether the stress edge explains real pressure patterns.',
          'If the TypeJung map feels accurate, the optional Insight report adds the developmental edge, relationship-pattern reflection, and practice prompts tied to your exact axis.',
        ],
        links: [
          { href: '/sample-report', label: 'View the sample Insight report' },
          { href: '/pricing', label: 'Compare Free, Insight, and Mastery' },
        ],
      },
    ],
    faqs: [
      {
        question: 'Is TypeJung better than the Michael Caloz test?',
        answer: 'TypeJung is different rather than universally better. It is built for a free-first function map and optional paid interpretation after you inspect the result.',
      },
      {
        question: 'Should I take both tests?',
        answer: 'You can, as long as you compare the function evidence instead of treating either result as a final verdict.',
      },
      {
        question: 'Does TypeJung require payment?',
        answer: 'No. The core TypeJung assessment and map are free. Insight and Mastery are optional one-time CAD upgrades.',
      },
    ],
    relatedLinks: [
      { href: '/assessment', label: 'Take the free assessment' },
      { href: '/best-cognitive-functions-test', label: 'Best cognitive functions test' },
      { href: '/function-stack-test', label: 'Function stack test' },
      { href: '/dominant-function-test', label: 'Dominant function test' },
      { href: '/sample-report', label: 'View sample report' },
    ],
  },
  {
    slug: 'idrlabs-cognitive-function-test-alternative',
    query: 'IDRlabs cognitive function test alternative',
    title: 'IDRlabs Cognitive Function Test Alternative - Free Function Map | TypeJung',
    description: 'Compare TypeJung as an IDRlabs cognitive function test alternative with a free all-8-function map, stress edge, and optional paid interpretation.',
    keywords: ['IDRlabs cognitive function test alternative', 'IDR Labs alternative', 'IDRlabs Jungian functions test', 'free cognitive function test'],
    eyebrow: 'IDRlabs alternative',
    h1: 'An IDRlabs cognitive function test alternative with result-first depth',
    intro: [
      'IDRlabs is a common stop for people searching broad personality and Jungian function tests. Its cognitive-function test is free and built around 48 questions.',
      'TypeJung gives the same high-intent searcher a different path: take a 42-question map, see all 8 function signals and the dominant-inferior axis, then decide whether paid interpretation is worth it.',
    ],
    intent: {
      bestFor: 'People who found IDRlabs useful but want a quieter Jungian map with paid depth only after seeing the free result.',
      measures: 'Ni, Ne, Si, Se, Ti, Te, Fi, Fe, likely hierarchy, dominant-inferior axis, stress cues, and answer consistency.',
      privacy: 'The TypeJung map appears before any payment. Signup is optional for saved history or restored paid access.',
    },
    sections: [
      {
        heading: 'What to compare after IDRlabs',
        body: [
          'IDRlabs positions its cognitive function test as a free way to obtain scores on the eight Jungian functions. That makes it useful for broad exploration.',
          'TypeJung is most useful when you want the result to become a practical map: what leads, what supports, what gets pressured, and what a paid report would actually add.',
        ],
        table: {
          headers: ['Question', 'IDRlabs-style need', 'TypeJung path'],
          rows: [
            ['Do I see all 8 functions?', 'Yes, eight-function scoring is the core category promise', 'Yes, TypeJung maps all 8 function-attitudes'],
            ['How long is it?', 'The IDRlabs page shows 48 questions', 'TypeJung uses 42 questions before the free map'],
            ['What does the result emphasize?', 'Function scores and type indicators', 'Energy map, hierarchy hypothesis, dominant-inferior axis, and stress edge'],
            ['When do I pay?', 'The IDRlabs cognitive function test is free', 'The TypeJung map is free; paid reports are optional after the result'],
          ],
        },
        links: [
          { href: 'https://www.idrlabs.com/cognitive-function/test.php', label: 'Visit the IDRlabs cognitive function test directly' },
          { href: '/assessment', label: 'Start TypeJung free' },
        ],
      },
      {
        heading: 'When TypeJung is the better next step',
        body: [
          'Use TypeJung after IDRlabs if you want a second function-level read that is easier to connect to stress, relationships, and practice.',
          'The free map is designed to earn the upgrade ask. If it does not feel accurate, you do not need to buy anything.',
        ],
        bullets: [
          'You want a dominant-inferior axis, not just a set of scores',
          'You want a sample paid report before checkout',
          'You want one-time CAD pricing rather than subscription framing',
          'You want educational self-reflection, not a diagnostic claim',
        ],
      },
      {
        heading: 'Use both results carefully',
        body: [
          'If IDRlabs and TypeJung disagree, treat the difference as a prompt for observation. Look for repeated function evidence and repeated stress signals, not just the most flattering label.',
        ],
        links: [
          { href: '/inferior-function-test', label: 'Inferior function test' },
          { href: '/sample-report', label: 'Preview the optional report' },
          { href: '/pricing', label: 'Compare the report options' },
        ],
      },
    ],
    faqs: [
      {
        question: 'Is TypeJung an IDRlabs replacement?',
        answer: 'It is an alternative path, not a universal replacement. TypeJung is best when you want a free-first Jungian map and optional deeper report after seeing your result.',
      },
      {
        question: 'Does TypeJung measure the same eight functions?',
        answer: 'TypeJung maps Ni, Ne, Si, Se, Ti, Te, Fi, and Fe as function-attitudes, then frames the likely hierarchy and stress edge.',
      },
      {
        question: 'Is TypeJung a clinical test?',
        answer: 'No. TypeJung is for educational self-reflection and should not be used as a clinical or diagnostic assessment.',
      },
    ],
    relatedLinks: [
      { href: '/assessment', label: 'Take the free assessment' },
      { href: '/cognitive-function-test', label: 'Cognitive function test' },
      { href: '/jungian-cognitive-functions-test', label: 'Jungian cognitive functions test' },
      { href: '/inferior-function-test', label: 'Inferior function test' },
      { href: '/pricing', label: 'Pricing' },
    ],
  },
  {
    slug: '16selves-alternative',
    query: '16Selves alternative',
    title: '16Selves Alternative - Free Jungian Function Map First | TypeJung',
    description: 'Looking for a 16Selves alternative? TypeJung maps all 8 Jungian function-attitudes before optional one-time paid reports.',
    keywords: ['16Selves alternative', '16Selves Jungian cognitive functions alternative', 'Jungian cognitive functions test', 'personality test alternative'],
    eyebrow: '16Selves alternative',
    h1: 'A 16Selves alternative when you want paid depth after the free map',
    intro: [
      '16Selves is a newer Jungian cognitive-functions test that emphasizes direct measurement of the eight function-attitudes and local-first results.',
      'TypeJung is a useful alternative when you want a similarly function-focused result, but with a clear free-first commercial path: inspect the map, view the sample report, then upgrade only if the result earns it.',
    ],
    intent: {
      bestFor: 'People comparing modern Jungian function tests who want all 8 functions plus an optional paid interpretation path.',
      measures: 'All 8 function-attitudes, likely type pattern, dominant-inferior axis, attitude direction, stress-edge cues, and answer consistency.',
      privacy: 'The core result is free before checkout. Paid upgrades are one-time CAD purchases handled by Stripe.',
    },
    sections: [
      {
        heading: 'Why people compare 16Selves and TypeJung',
        body: [
          'Both tools speak to users who have outgrown four-letter-only personality quizzes and want the cognitive functions underneath the label.',
          'The difference is the product path. 16Selves emphasizes a quick local-first assessment experience, while TypeJung emphasizes a free map that can be extended into a paid depth report if the result feels useful.',
        ],
        table: {
          headers: ['Need', '16Selves-style search', 'TypeJung path'],
          rows: [
            ['Function focus', 'Direct measurement of eight function-attitudes', 'All 8 functions plus a dominant-inferior axis'],
            ['Assessment length', 'The site describes a 5-minute path with core and adaptive questions', '42 questions before the free TypeJung map'],
            ['Result philosophy', 'Best-fit hypotheses and local result exploration', 'Free map first, optional report after value is visible'],
            ['Paid decision', 'Useful for free self-exploration', 'Sample report and one-time Stripe pricing are visible before purchase'],
          ],
        },
        links: [
          { href: 'https://16selves.com/', label: 'Visit 16Selves directly' },
          { href: '/assessment', label: 'Start the TypeJung map' },
        ],
      },
      {
        heading: 'When TypeJung is the better next test',
        body: [
          'Choose TypeJung when the important question is not only "which type fits?" but "what does this map mean when I am under pressure?"',
          'Insight and Mastery are designed to extend the free result into stress-pattern reflection, relationship-pattern reflection, and practice prompts without creating a subscription.',
        ],
        bullets: [
          'You want the inferior-function edge named explicitly',
          'You want paid report content previewed before checkout',
          'You want one-time CAD pricing and a 30-day refund window',
          'You want a shareable result page that can bring friends into the free assessment',
        ],
      },
      {
        heading: 'How to use TypeJung after 16Selves',
        body: [
          'Take the TypeJung map as a second structured lens. If the leading functions and stress edge repeat across tools, that pattern is more useful than a single label.',
        ],
        links: [
          { href: '/dominant-function-test', label: 'Dominant function test' },
          { href: '/sample-report', label: 'View the sample Insight report' },
          { href: '/pricing', label: 'Compare Free, Insight, and Mastery' },
        ],
      },
    ],
    faqs: [
      {
        question: 'Is TypeJung the same as 16Selves?',
        answer: 'No. Both focus on Jungian function-attitudes, but TypeJung is built around a free map followed by optional one-time paid reports.',
      },
      {
        question: 'Which test should I take first?',
        answer: 'If you are comparing tools, take whichever path feels clearer, then compare repeated function evidence rather than treating one result as final.',
      },
      {
        question: 'Does TypeJung keep the core result free?',
        answer: 'Yes. The 42-question map is free. Insight and Mastery only add deeper interpretation after you see the result.',
      },
    ],
    relatedLinks: [
      { href: '/assessment', label: 'Take the free assessment' },
      { href: '/free-cognitive-function-test', label: 'Free cognitive function test' },
      { href: '/dominant-function-test', label: 'Dominant function test' },
      { href: '/sample-report', label: 'View sample report' },
      { href: '/pricing', label: 'Pricing' },
    ],
  },
  {
    slug: 'best-cognitive-functions-test',
    query: 'best cognitive functions test',
    title: 'Best Cognitive Functions Test? How to Choose a Useful Function Map | TypeJung',
    description: 'Compare what makes a cognitive functions test useful: all 8 functions, inspectable scores, stress-edge context, free-first results, and practical interpretation.',
    keywords: ['best cognitive functions test', 'best Jungian cognitive functions test', 'Sakinorva vs Keys2Cognition', 'MBTI cognitive functions test'],
    eyebrow: 'Best cognitive functions test',
    h1: 'The best cognitive functions test is the one you can inspect',
    intro: [
      'People searching for the best cognitive functions test are usually not beginners. They often know names like Sakinorva, Keys2Cognition, Mistype Investigator, Michael Caloz, IDRlabs, 16Selves, or Typology Central and want a result they can trust more.',
      'The better question is what makes a function test useful: visible evidence, all 8 functions, stress-edge context, and a result you can compare against real life before paying for interpretation.',
    ],
    intent: {
      bestFor: 'Searchers comparing cognitive-function tests and deciding which one to take next.',
      measures: 'All 8 function-attitudes, hierarchy hypotheses, dominant-inferior axis, stress patterns, and confidence signals.',
      privacy: 'Use the free TypeJung map first. Upgrade only if the result earns deeper interpretation.',
    },
    sections: [
      {
        heading: 'What useful cognitive-function tests have in common',
        body: [
          'A useful function test does not hide everything behind one label. It shows enough of the underlying evidence that you can ask whether the result matches your actual patterns.',
          'Look for tests that separate function scores, explain uncertainty, and help you interpret the dominant and inferior poles rather than pretending a type code is the whole answer.',
        ],
        bullets: [
          'All 8 functions are visible',
          'The result explains function order, not just strength',
          'Stress and inferior-function data are included',
          'The free result is useful before any paid report',
          'Claims stay educational rather than diagnostic',
        ],
      },
      {
        heading: 'Common cognitive-functions test options',
        body: [
          'Sakinorva, Keys2Cognition, Mistype Investigator, IDRlabs, and other typology tools all attract people who want more than a broad MBTI-style quiz. They differ in length, scoring style, interpretation depth, and how much explanation appears after the result.',
          'TypeJung positions itself as a free-first map plus optional interpretation path. It is not trying to be the only test you ever take. It is trying to make the next result more usable.',
        ],
        table: {
          headers: ['Tool people search for', 'Typical reason people use it', 'When TypeJung is useful next'],
          rows: [
            ['Sakinorva', 'Function-score exploration and long-form testing routes', 'When you want a shorter free map with optional report interpretation'],
            ['Keys2Cognition', 'Eight cognitive-process language and older theory resources', 'When you want a modern result page and stress-edge context'],
            ['Mistype Investigator', 'Resolving suspected mistypes', 'When you want function evidence plus paid-depth preview after the free map'],
            ['Michael Caloz', 'Function-pair explanations and type-fit comparison', 'When you want another free-first map with dominant-inferior interpretation'],
            ['IDRlabs', 'Fast free personality-test browsing', 'When you want a Jungian-focused map with all 8 functions'],
            ['16Selves', 'Modern function-attitude testing with best-fit hypotheses', 'When you want one-time paid depth after a free map'],
          ],
        },
      },
      {
        heading: 'Why TypeJung may be the right next test',
        body: [
          'TypeJung is strongest when you want to see the whole function map before paying. The free result lets you judge whether the pattern feels accurate. The sample report shows what paid interpretation looks like before checkout.',
          'That matters commercially too: a good paid report should not be a surprise. It should deepen a result you already found useful.',
        ],
        links: [
          { href: '/assessment', label: 'Take the free TypeJung assessment' },
          { href: '/sample-report', label: 'View the sample report' },
          { href: '/pricing', label: 'Compare pricing' },
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the best cognitive functions test?',
        answer: 'There is no single final test. The best option is one that shows all 8 functions clearly and helps you inspect the result against real patterns.',
      },
      {
        question: 'Is TypeJung better than Sakinorva or Keys2Cognition?',
        answer: 'TypeJung is different rather than universally better. Use it when you want a free-first map, stress-edge context, sample report preview, and optional paid interpretation after seeing the result.',
      },
      {
        question: 'Should I take multiple cognitive-function tests?',
        answer: 'Multiple tests can help if you compare repeated patterns instead of collecting labels. Look for recurring function evidence and stress signals.',
      },
    ],
    relatedLinks: [
      { href: '/assessment', label: 'Take the free assessment' },
      { href: '/sakinorva-alternative', label: 'Sakinorva alternative' },
      { href: '/keys2cognition-alternative', label: 'Keys2Cognition alternative' },
      { href: '/mistype-investigator-alternative', label: 'Mistype Investigator alternative' },
      { href: '/michael-caloz-alternative', label: 'Michael Caloz alternative' },
      { href: '/idrlabs-cognitive-function-test-alternative', label: 'IDRlabs alternative' },
      { href: '/16selves-alternative', label: '16Selves alternative' },
      { href: '/cognitive-function-test', label: 'Cognitive function test' },
    ],
  },
];

const inferiorFunctionByDominant = {
  ni: 'se',
  ne: 'si',
  si: 'ne',
  se: 'ni',
  ti: 'fe',
  te: 'fi',
  fi: 'te',
  fe: 'ti',
};

const dominantFunctionFocus = {
  ni: {
    searchNeed: 'convergent pattern insight, future implication, and the pull toward one underlying meaning',
    falsePositive: 'a strong imagination, anxiety about the future, or learned strategy without the slower pattern-convergence process',
    stressEdge: 'present-moment pressure, sensory overload, or impulsive overcorrection can make inferior Se visible',
    nextObservation: 'whether your attention naturally narrows toward one symbolic pattern before you can explain it',
  },
  ne: {
    searchNeed: 'rapid possibility scanning, associative thinking, and comfort keeping several interpretations open',
    falsePositive: 'novelty-seeking, distractibility, or high creativity without the deeper pattern of external possibility generation',
    stressEdge: 'routine, precedent, and concrete follow-through pressure can make inferior Si visible',
    nextObservation: 'whether new external cues immediately open alternate meanings, options, and routes',
  },
  si: {
    searchNeed: 'experience-based comparison, detailed recall, continuity, and trust in what has proven itself',
    falsePositive: 'being cautious, nostalgic, or organized without the inner library of sensory precedent doing the real work',
    stressEdge: 'open-ended possibility pressure can make inferior Ne visible as worry, scattered ideation, or unlikely scenarios',
    nextObservation: 'whether present situations are automatically checked against remembered texture and precedent',
  },
  se: {
    searchNeed: 'direct contact with the present, sensory accuracy, aesthetic response, and fast action in real conditions',
    falsePositive: 'being social, impulsive, or athletic without the broader present-moment attunement of Se',
    stressEdge: 'abstract future pressure can make inferior Ni visible as tunnel vision, ominous certainty, or over-interpretation',
    nextObservation: 'whether you trust what is happening now before turning it into a theory',
  },
  ti: {
    searchNeed: 'internal logic, precision, model-building, and the need for definitions that hold together',
    falsePositive: 'being smart, detached, skeptical, or technical without the private framework-refinement process',
    stressEdge: 'social feedback and relational expectations can make inferior Fe visible as awkward repair attempts or rejection sensitivity',
    nextObservation: 'whether you first ask if the model is internally consistent, even before asking whether others accept it',
  },
  te: {
    searchNeed: 'external structure, measurable results, prioritization, and pressure to turn decisions into workable systems',
    falsePositive: 'being ambitious, blunt, productive, or managerial without the objective organizing process leading cognition',
    stressEdge: 'personal value pressure can make inferior Fi visible as sudden defensiveness, emptiness, or difficulty naming inner consent',
    nextObservation: 'whether you naturally organize facts, people, and steps toward a measurable outcome',
  },
  fi: {
    searchNeed: 'inner value clarity, authenticity, emotional nuance, and a private sense of what is personally right',
    falsePositive: 'being emotional, artistic, sensitive, or kind without the inner evaluative compass leading the pattern',
    stressEdge: 'efficiency pressure can make inferior Te visible as harsh self-management, avoidance, or sudden controlling behavior',
    nextObservation: 'whether your first signal is private alignment or dissonance before you can make it socially legible',
  },
  fe: {
    searchNeed: 'relational attunement, shared values, emotional atmosphere, and coordination around what helps the group',
    falsePositive: 'being nice, agreeable, extroverted, or conflict-avoidant without the real-time social calibration process',
    stressEdge: 'detached precision pressure can make inferior Ti visible as over-explaining, self-doubt, or brittle logic',
    nextObservation: 'whether you read the emotional field first and adjust communication around shared impact',
  },
};

const dominantFunctionLandingPages = Object.entries(functionData).map(([functionKey, fn]) => {
  const inferiorKey = inferiorFunctionByDominant[functionKey];
  const inferior = functionData[inferiorKey];
  const focus = dominantFunctionFocus[functionKey];
  const typeLinks = fn.dominantTypes.map((type) => ({
    href: `/types/${type.toLowerCase()}`,
    label: `${type} type guide`,
  }));
  const dominantTypeNames = fn.dominantTypes
    .map((type) => `${type} (${typeData[type.toLowerCase()].name})`)
    .join(' and ');

  return {
    slug: `${functionKey}-dominant-test`,
    query: `${fn.code} dominant test`,
    title: `${fn.code} Dominant Test - Check ${fn.name} Evidence | TypeJung`,
    description: `Use TypeJung as a ${fn.code} dominant test to compare ${fn.name} evidence, likely type pattern, and ${inferior.code} stress-edge signals.`,
    keywords: [
      `${fn.code} dominant test`,
      `${fn.name} dominant`,
      `${fn.code} dominant cognitive function`,
      `${fn.dominantTypes.join(' ')} cognitive functions`,
      `${fn.code} ${inferior.code} axis`,
    ],
    eyebrow: `${fn.code} dominant test`,
    h1: `Check whether ${fn.code} is your dominant function`,
    intro: [
      `A ${fn.code} dominant test should do more than ask whether you relate to a stereotype. It should compare ${fn.name} evidence against all 8 function-attitudes, then inspect the likely inferior ${inferior.code} edge.`,
      `TypeJung starts with a free 42-question assessment. You see the function-stack map first, then decide whether the optional report is worth using for deeper interpretation.`,
    ],
    intent: {
      bestFor: `People who suspect ${fn.code} leads their type pattern, especially ${fn.dominantTypes.join(' or ')} searchers comparing function evidence.`,
      measures: `All 8 functions, likely ${fn.code}-${inferior.code} dominant-inferior tension, attitude direction, stress signals, and nearby type hypotheses.`,
      privacy: 'Start with the free map before checkout. Paid Insight and Mastery reports are optional one-time upgrades after the result is visible.',
    },
    sections: [
      {
        heading: `What ${fn.code} dominant usually means`,
        body: [
          `${fn.name} is often described as ${fn.description.charAt(0).toLowerCase()}${fn.description.slice(1)}`,
          `When it is dominant, it tends to act like the most trusted starting point for attention or judgment. For TypeJung, the question is not whether ${fn.code} sounds flattering. The question is whether the whole answer pattern repeatedly points toward ${focus.searchNeed}.`,
        ],
        bullets: fn.characteristics.slice(0, 4),
        links: [
          { href: `/functions/${functionKey}`, label: `Read the ${fn.code} function guide` },
          ...typeLinks,
        ],
      },
      {
        heading: `How a ${fn.code} dominant test should avoid false positives`,
        body: [
          `Many people identify with a function because one trait feels familiar. That can create false positives. ${fn.code} dominance is not the same as ${focus.falsePositive}.`,
          'A better test compares function relationships: what comes first, what supports it, what becomes reactive under pressure, and whether the likely type pattern makes sense as a whole.',
        ],
        table: {
          headers: ['Signal to inspect', `${fn.code} dominant evidence`, 'Could mean something else'],
          rows: [
            ['First response', focus.nextObservation, 'A role, skill, mood, or current life demand may be shaping the answer'],
            ['Support pattern', `A supporting function should help ${fn.code} operate in real situations`, 'A single high score without support may need cautious interpretation'],
            ['Stress edge', focus.stressEdge, `A different inferior-function signal may point away from ${fn.code} dominance`],
          ],
        },
      },
      {
        heading: `The ${fn.code}-${inferior.code} axis matters`,
        body: [
          `${dominantTypeNames} are usually interpreted through ${fn.code} dominance, but the opposite edge is just as important. A likely ${fn.code} dominant pattern should have some recognizable tension with ${inferior.code}, especially under stress or development pressure.`,
          `TypeJung uses the full function map to make that axis visible. The paid report is optional, but if the free map fits, it can explain the developmental edge, relationship-pattern reflection, and practice path behind the ${fn.code}-${inferior.code} pattern.`,
        ],
        links: [
          { href: `/functions/${inferiorKey}`, label: `Read the ${inferior.code} function guide` },
          { href: '/inferior-function-test', label: 'Understand inferior-function pressure' },
          { href: '/sample-report', label: 'Preview the optional Insight report' },
        ],
      },
      {
        heading: 'Best next step',
        body: [
          `Take the free assessment, then compare your ${fn.code} score with the whole map instead of reading it alone. If ${fn.code}, its support function, and inferior ${inferior.code} all make sense together, the result is more useful than a one-function label.`,
        ],
        links: [
          { href: '/assessment', label: `Start the free ${fn.code} dominant test` },
          { href: '/function-stack-test', label: 'Compare the full function stack' },
          { href: '/pricing', label: 'Compare Free, Insight, and Mastery' },
        ],
      },
    ],
    faqs: [
      {
        question: `Can TypeJung tell me if I am ${fn.code} dominant?`,
        answer: `TypeJung gives a likely function pattern and type hypothesis. Use it to inspect ${fn.code} dominance as evidence, not as a final identity verdict.`,
      },
      {
        question: `Which types are usually ${fn.code} dominant?`,
        answer: `${fn.code} is usually associated with ${fn.dominantTypes.join(' and ')} in common function-stack interpretation, but the full pattern matters more than the label alone.`,
      },
      {
        question: `Is this ${fn.code} dominant test free?`,
        answer: 'The core 42-question TypeJung assessment is free. Paid reports are optional after you have seen the map.',
      },
    ],
    relatedLinks: [
      { href: '/assessment', label: 'Take the free assessment' },
      { href: `/functions/${functionKey}`, label: `${fn.code} function guide` },
      { href: `/functions/${inferiorKey}`, label: `${inferior.code} inferior edge` },
      ...typeLinks,
      { href: '/function-stack-test', label: 'Function stack test' },
      { href: '/sample-report', label: 'View sample report' },
    ],
  };
});

const dominantFunctionHubPage = {
  slug: 'dominant-function-test',
  query: 'dominant function test',
  title: 'Dominant Function Test - Find Your Leading Jungian Function | TypeJung',
  description: 'Take a dominant function test that compares all 8 Jungian cognitive functions, support signals, and inferior-function pressure before naming a likely lead function.',
  keywords: ['dominant function test', 'find my dominant function', 'Jungian dominant function', 'cognitive function test', 'function stack test'],
  eyebrow: 'Dominant function test',
  h1: 'Find your likely dominant function without forcing a label first',
  intro: [
    'A dominant function test should not ask you to choose the function that sounds most flattering. It should compare the whole pattern: what leads, what supports it, and what becomes pressured under stress.',
    'TypeJung starts with a free 42-question map of Ni, Ne, Si, Se, Ti, Te, Fi, and Fe. You see the core result first, then decide whether optional paid interpretation is useful.',
  ],
  intent: {
    bestFor: 'People who suspect a dominant function but want evidence across all 8 functions and the matching inferior-function edge.',
    measures: 'All 8 function-attitudes, likely dominant and support signals, dominant-inferior tension, attitude direction, and stress-pattern evidence.',
    privacy: 'Start free before checkout. Paid Insight and Mastery reports are optional one-time upgrades after the free map is visible.',
  },
  sections: [
    {
      heading: 'What is a dominant function?',
      body: [
        'In Jungian typology, the dominant function is the most trusted mode of attention or judgment in a type pattern. It is not simply the function you admire most or the highest trait stereotype you recognize.',
        'A useful test looks at relationships between functions. Dominant Ni usually implies a different stress edge than dominant Fi, Te, or Se. That is why TypeJung maps the whole stack before asking you to trust a conclusion.',
      ],
      table: {
        headers: ['Dominant function', 'Common type patterns', 'Inferior edge to inspect'],
        rows: Object.entries(functionData).map(([key, fn]) => {
          const inferior = functionData[inferiorFunctionByDominant[key]];
          return [fn.code, fn.dominantTypes.join(' or '), `${inferior.code} (${inferior.name})`];
        }),
      },
    },
    {
      heading: 'Why a single-function quiz can mislead you',
      body: [
        'Many people identify with a function because one description sounds accurate. That is risky because roles, stress, current work, relationships, and admired traits can all distort self-reporting.',
        'TypeJung is built around a stronger question: does the full map show a coherent lead function, support function, and inferior-function pressure pattern?',
      ],
      bullets: [
        'A high score does not always mean a dominant function',
        'Stress can make an inferior function feel louder than usual',
        'Nearby types can share visible traits while using different function order',
        'The best result is a hypothesis you can inspect, not a permanent identity stamp',
      ],
    },
    {
      heading: 'Compare each dominant function path',
      body: [
        'Use these guides after the free assessment if one function looks especially likely. Each page explains the evidence to inspect, the false positives to avoid, and the likely inferior-function edge.',
      ],
      links: Object.entries(functionData).map(([key, fn]) => ({
        href: `/${key}-dominant-test`,
        label: `${fn.code} dominant test`,
      })),
    },
    {
      heading: 'Best next step',
      body: [
        'Take the free assessment first. Read the result as a working map, then compare your likely dominant function against its support function and inferior edge. If the map feels accurate, the optional Insight report explains the pattern in more depth.',
      ],
      links: [
        { href: '/assessment', label: 'Start the free dominant function test' },
        { href: '/function-stack-test', label: 'Compare the function stack test' },
        { href: '/inferior-function-test', label: 'Understand inferior-function pressure' },
        { href: '/sample-report', label: 'Preview the optional Insight report' },
      ],
    },
  ],
  faqs: [
    {
      question: 'Can TypeJung find my dominant function?',
      answer: 'TypeJung gives a likely dominant-function hypothesis from the full cognitive-function map. Treat it as structured evidence for self-observation, not a final identity verdict.',
    },
    {
      question: 'Is my highest score always my dominant function?',
      answer: 'Not always. Dominance is interpreted in relationship to the support functions, inferior edge, attitude direction, and overall pattern.',
    },
    {
      question: 'Is the dominant function test free?',
      answer: 'Yes. The 42-question assessment and function-stack map are free. Paid reports are optional after you see the result.',
    },
  ],
  relatedLinks: [
    { href: '/assessment', label: 'Take the free assessment' },
    { href: '/function-stack-test', label: 'Function stack test' },
    { href: '/inferior-function-test', label: 'Inferior function test' },
    { href: '/cognitive-function-test', label: 'Cognitive function test' },
    { href: '/jungian-cognitive-functions-test', label: 'Jungian cognitive functions test' },
    { href: '/sample-report', label: 'View sample report' },
  ],
};

const guidesHubPage = {
  slug: 'guides',
  query: 'TypeJung guides',
  title: 'TypeJung Guides - Jungian Tests, Cognitive Functions, and MBTI Alternatives',
  description: 'Browse TypeJung guides for Jungian tests, cognitive functions, function stacks, inferior-function stress, MBTI alternatives, and common mistype comparisons.',
  keywords: ['TypeJung guides', 'Jungian test guides', 'cognitive function guides', 'MBTI alternative guides', 'function stack guide'],
  eyebrow: 'TypeJung guides',
  h1: 'Guides for reading your Jungian function map',
  intro: [
    'Use this hub when you want the right next page after a TypeJung result or before taking the free assessment.',
    'The guides are organized around practical search paths: Jungian test pages, cognitive-function theory, MBTI alternatives, and common type-comparison questions.',
  ],
  intent: {
    bestFor: 'People comparing Jungian assessments, learning cognitive functions, or checking a likely mistype before choosing a label.',
    measures: 'All 8 cognitive functions, function-stack interpretation, dominant-inferior tension, stress-pattern context, and close type comparisons.',
    privacy: 'Most guides are public. The free assessment shows the map before any optional paid Insight or Mastery report.',
  },
  sections: [
    {
      heading: 'Start with the assessment path',
      body: [
        'If you are new to TypeJung, start with the free assessment and use the guides to interpret the result afterward.',
        'These pages explain what the test maps, why the function stack matters, and how to compare a result without treating any label as final proof.',
      ],
      links: [
        { href: '/assessment', label: 'Take the free assessment' },
        { href: '/free-cognitive-function-test', label: 'Free cognitive function test' },
        { href: '/cognitive-function-test', label: 'Cognitive function test' },
        { href: '/cognitive-functions-quiz', label: 'Cognitive functions quiz' },
        { href: '/jungian-personality-test', label: 'Jungian personality test' },
        { href: '/function-stack-test', label: 'Function stack test' },
        { href: '/dominant-function-test', label: 'Dominant function test' },
        { href: '/inferior-function-test', label: 'Inferior function test' },
        { href: '/shadow-work-test', label: 'Shadow work test' },
      ],
    },
    {
      heading: 'Check each dominant function',
      body: [
        'Use these when one function already looks likely and you want the evidence to inspect, the false positives to avoid, and the matching inferior edge.',
      ],
      links: [
        { href: '/ni-dominant-test', label: 'Ni dominant test' },
        { href: '/ne-dominant-test', label: 'Ne dominant test' },
        { href: '/si-dominant-test', label: 'Si dominant test' },
        { href: '/se-dominant-test', label: 'Se dominant test' },
        { href: '/ti-dominant-test', label: 'Ti dominant test' },
        { href: '/te-dominant-test', label: 'Te dominant test' },
        { href: '/fi-dominant-test', label: 'Fi dominant test' },
        { href: '/fe-dominant-test', label: 'Fe dominant test' },
      ],
    },
    {
      heading: 'Learn the Jungian function model',
      body: [
        'Use the theory guides when you want language for Ni, Ne, Si, Se, Ti, Te, Fi, and Fe before interpreting a score shape.',
        'The most useful reading order is usually the broad Jungian page, the cognitive-functions guide, then the specific function or type page that matches your result.',
      ],
      table: {
        headers: ['Need', 'Best guide', 'Use it for'],
        rows: [
          ['Broad overview', 'Jungian test', 'Understanding how TypeJung differs from a quick label quiz'],
          ['Theory foundation', 'Jungian typology', 'Learning attitudes, functions, type, and self-reflection language'],
          ['Function language', 'Cognitive functions guide', 'Comparing the eight function-attitudes before reading a result'],
          ['Full function test', 'Jungian cognitive functions test', 'Seeing how Ni, Ne, Si, Se, Ti, Te, Fi, and Fe are mapped together'],
        ],
      },
      links: [
        { href: '/jungian-test', label: 'Jungian test' },
        { href: '/jungian-typology', label: 'Jungian typology guide' },
        { href: '/cognitive-functions', label: 'Cognitive functions guide' },
        { href: '/jungian-cognitive-functions-test', label: 'Jungian cognitive functions test' },
      ],
    },
    {
      heading: 'Compare TypeJung with other test paths',
      body: [
        'Alternative pages are useful when you already know another test name and want to understand what TypeJung does differently.',
        'The repeated pattern is simple: TypeJung gives the free function-stack map first, then asks whether optional paid interpretation is worth adding.',
      ],
      links: [
        { href: '/mbti-test-alternative', label: 'MBTI test alternative' },
        { href: '/mbti-alternative', label: 'MBTI alternative' },
        { href: '/16personalities-alternative', label: '16Personalities alternative' },
        { href: '/sakinorva-alternative', label: 'Sakinorva alternative' },
        { href: '/keys2cognition-alternative', label: 'Keys2Cognition alternative' },
        { href: '/mistype-investigator-alternative', label: 'Mistype Investigator alternative' },
        { href: '/michael-caloz-alternative', label: 'Michael Caloz alternative' },
        { href: '/idrlabs-cognitive-function-test-alternative', label: 'IDRlabs alternative' },
        { href: '/16selves-alternative', label: '16Selves alternative' },
        { href: '/best-cognitive-functions-test', label: 'Best cognitive functions test' },
      ],
    },
    {
      heading: 'Resolve common mistype questions',
      body: [
        'Comparison guides help when two nearby labels both sound plausible. They focus on function order, support function evidence, and the inferior-function edge.',
        'Use them after the free map if your top result is close to another pattern or if previous tests keep switching between two types.',
      ],
      links: [
        { href: '/mbti-mistype-test', label: 'MBTI mistype test' },
        { href: '/mbti-keeps-changing', label: 'Why your MBTI keeps changing' },
        { href: '/infj-vs-infp-test', label: 'INFJ vs INFP test' },
        { href: '/intj-vs-intp-test', label: 'INTJ vs INTP test' },
        { href: '/infj-vs-intj-test', label: 'INFJ vs INTJ test' },
        { href: '/infj-vs-enfj-test', label: 'INFJ vs ENFJ test' },
        { href: '/intj-vs-entj-test', label: 'INTJ vs ENTJ test' },
        { href: '/istj-vs-intj-test', label: 'ISTJ vs INTJ test' },
        { href: '/infp-vs-isfp-test', label: 'INFP vs ISFP test' },
        { href: '/enfp-vs-infp-test', label: 'ENFP vs INFP test' },
        { href: '/enfp-vs-entp-test', label: 'ENFP vs ENTP test' },
        { href: '/entp-vs-intp-test', label: 'ENTP vs INTP test' },
        { href: '/intp-vs-istp-test', label: 'INTP vs ISTP test' },
        { href: '/entj-vs-estj-test', label: 'ENTJ vs ESTJ test' },
        { href: '/isfj-vs-infj-test', label: 'ISFJ vs INFJ test' },
        { href: '/esfp-vs-enfp-test', label: 'ESFP vs ENFP test' },
        { href: '/estp-vs-entp-test', label: 'ESTP vs ENTP test' },
      ],
    },
    {
      heading: 'Preview paid depth before deciding',
      body: [
        'The free guides and assessment are enough to start working with the map. Paid reports are optional and should deepen a result you already find useful.',
        'Preview the sample report and pricing page before buying, especially if you want stress-pattern reflection, relationship-pattern reflection, and practice prompts tied to your exact map.',
      ],
      links: [
        { href: '/sample-report', label: 'View the sample report' },
        { href: '/pricing', label: 'Compare Free, Insight, and Mastery' },
      ],
    },
  ],
  faqs: [
    {
      question: 'Which TypeJung guide should I read first?',
      answer: 'If you have not taken the assessment, start with the free cognitive function test page. If you already have a result, read the function stack test and the guides for your strongest and weakest functions.',
    },
    {
      question: 'Are the guides free?',
      answer: 'Yes. The public guides and the core assessment map are free. Insight and Mastery are optional one-time paid reports after you see the free map.',
    },
    {
      question: 'Can these guides prove my type?',
      answer: 'No. TypeJung guides are educational self-reflection resources. Use them to inspect function evidence, stress patterns, and close alternatives rather than treating any page as final proof.',
    },
  ],
  relatedLinks: [
    { href: '/assessment', label: 'Take the free assessment' },
    { href: '/free-cognitive-function-test', label: 'Free cognitive function test' },
    { href: '/cognitive-functions', label: 'Cognitive functions guide' },
    { href: '/function-stack-test', label: 'Function stack test' },
    { href: '/sakinorva-alternative', label: 'Sakinorva alternative' },
    { href: '/sample-report', label: 'View sample report' },
  ],
};

export const seoLandingPages = [
  ...competitorLandingPages,
  guidesHubPage,
  dominantFunctionHubPage,
  ...dominantFunctionLandingPages,
  {
    slug: 'creator-preview',
    query: 'TypeJung creator preview',
    title: 'TypeJung Creator Preview - Free Function-Stack Map for Typology Audiences',
    description: 'A review path for typology creators, newsletters, and communities evaluating TypeJung as a free-first Jungian function-stack map.',
    keywords: ['TypeJung creator preview', 'typology creator resource', 'cognitive functions tool review', 'MBTI creator resource'],
    eyebrow: 'Creator review page',
    h1: 'A review path for typology creators',
    intro: [
      'If you teach MBTI, Jungian typology, cognitive functions, or mistype questions, TypeJung is easiest to evaluate from the same path your audience would use: the free map first.',
      'This page gives you the product promise, safe wording, and review links in one place so you can decide privately whether TypeJung belongs in your resource list, newsletter, video, podcast, or community thread.',
    ],
    saveLink: {
      title: 'Send yourself the review path',
      body: 'Email yourself the free assessment path and TYPEJUNG30 code. Start with the free map, then review the optional report only if the result earns interest.',
      button: 'Email the review path',
      tier: 'mastery',
    },
    creatorKit: {
      title: 'Safe mention kit after review',
      body: 'Use these only if TypeJung feels useful for your audience. The snippets keep the free-first promise, avoid diagnosis or final-type claims, and preserve creator attribution in the public link.',
      publicPath: '/mbti-mistype-test',
      defaultCampaign: 'creator_outreach_2026_05',
      snippets: [
        {
          label: 'Short social post',
          copy: `I tried TypeJung for people whose MBTI result keeps changing. It maps all 8 cognitive functions and shows the free function-stack map before any paid report. It is self-reflection, not diagnosis or final type proof.\n\n{public_link}`,
        },
        {
          label: 'Newsletter blurb',
          copy: `Resource note: TypeJung is a free Jungian function-stack map for readers who want to inspect the pattern underneath changing MBTI results. The core 42-question map is free, and paid reports are optional after the result is visible. Treat it as educational self-reflection, not a typing authority.\n\n{public_link}`,
        },
        {
          label: 'Video description',
          copy: `Tool mentioned: TypeJung maps all 8 cognitive functions and the dominant-inferior tension behind a likely type pattern. Start with the free map first; use paid reports only if the result feels useful. Not clinical or guaranteed type proof.\n\n{public_link}`,
        },
        {
          label: 'Community feedback note',
          copy: `If links are allowed here, I found a free Jungian function-stack map called TypeJung. It is built for people whose MBTI result keeps changing and shows the all-8-function map before checkout. I would treat the result as a reflection hypothesis, not a final answer.\n\n{public_link}`,
        },
      ],
    },
    intent: {
      bestFor: 'Typology creators, newsletters, coaches, and community moderators evaluating a free-first cognitive-functions tool before mentioning it publicly.',
      measures: '42 scenario prompts, all 8 Jungian function-attitudes, likely function-stack pattern, dominant-inferior axis, stress-edge signals, and optional paid interpretation.',
      privacy: 'No payment is required to see the free function-stack map. Paid reports are optional one-time CAD upgrades after the result is visible.',
    },
    sections: [
      {
        heading: 'What your audience gets before checkout',
        body: [
          'The first experience is not a paywall. Visitors answer 42 questions and see a free function-stack map before TypeJung asks them to consider Insight or Mastery.',
          'That makes the tool easiest to share when your audience is already comparing type hypotheses, asking why results keep changing, or trying to learn the functions without starting from a paid report.',
        ],
        bullets: [
          'A free all-8-function map before payment',
          'Dominant-inferior tension written as educational self-reflection',
          'Likely type-pattern context without claiming final proof',
          'Shareable results for comparing maps with friends or communities',
          'Optional Insight and Mastery reports after the free result is visible',
        ],
        links: [
          { href: '/assessment', label: 'Start the free assessment path' },
          { href: '/sample-report', label: 'Preview the optional report structure' },
        ],
      },
      {
        heading: 'Why TypeJung may be worth reviewing',
        body: [
          'A creator mention only works if the product has a clear reason to exist. TypeJung is positioned against label-first testing, not against thoughtful typology education.',
          'The useful review question is simple: does the free map help people inspect the function pattern underneath a changing or confusing type result?',
        ],
        table: {
          headers: ['Audience problem', 'Common test experience', 'TypeJung review angle'],
          rows: [
            ['Results keep changing', 'Another four-letter answer without enough context', 'Look at the function pattern underneath the label'],
            ['Cognitive functions feel abstract', 'Theory pages without a personal map', 'Connect Ni, Ne, Si, Se, Ti, Te, Fi, and Fe to the user result'],
            ['Paid reports create anxiety', 'Pay before knowing whether the result helps', 'Free map first, optional one-time paid depth later'],
            ['Typology claims get too strong', 'Final-answer language or diagnostic framing', 'Educational self-reflection with clear guardrails'],
          ],
        },
      },
      {
        heading: 'Safe language for a mention',
        body: [
          'The cleanest public framing is: TypeJung is a free Jungian function-stack map for people whose MBTI result keeps changing.',
          'Please avoid describing it as a diagnosis, a clinical assessment, or proof of someone\'s final type. The product is designed as an inspectable self-reflection map, not an authority that settles every typology debate.',
        ],
        bullets: [
          'Use: free map, cognitive functions, all 8 functions, function stack, stress edge, optional one-time report',
          'Use: try the free result first and upgrade only if it feels useful',
          'Avoid: guaranteed type, clinically proven, diagnosis, therapy replacement, permanent identity answer',
        ],
        links: [
          { href: '/mbti-mistype-test', label: 'Mistype-focused public entry page' },
          { href: '/cognitive-functions-quiz', label: 'Lighter quiz-style public entry page' },
          { href: '/jungian-cognitive-functions-test', label: 'Function-first public entry page' },
        ],
      },
      {
        heading: 'How to test the flow privately',
        body: [
          'Start with the assessment link and judge the free result before looking at pricing. If the map feels too vague, too strong, or not useful for your audience, that feedback is more valuable than a public mention.',
          'If you want to review the paid side, ask for a private Mastery access link from Felmon. The public page still keeps the normal free-first path intact for regular visitors.',
        ],
        bullets: [
          'Take the free assessment from this page so creator attribution stays intact',
          'Read the sample report to see the paid-report tone before checkout',
          'Check whether the result avoids stereotypes and overclaiming',
          'Send private critique before deciding whether to mention the tool publicly',
        ],
        links: [
          { href: '/pricing', label: 'Check the one-time pricing page' },
          { href: '/cognitive-function-test', label: 'Read the cognitive function test guide' },
        ],
      },
    ],
    faqs: [
      {
        question: 'Is TypeJung free for my audience to try?',
        answer: 'Yes. The 42-question assessment and core function-stack map are free. Insight and Mastery are optional one-time CAD upgrades after the result is visible.',
      },
      {
        question: 'Can I describe TypeJung as a typing authority?',
        answer: 'No. TypeJung gives a likely function-stack map for educational self-reflection. It should not be framed as clinical, diagnostic, or guaranteed final proof of type.',
      },
      {
        question: 'What should I review first?',
        answer: 'Review the free result first, then the sample report and pricing page. That mirrors the decision path regular visitors take before any paid report.',
      },
      {
        question: 'Does TypeJung have an affiliate program?',
        answer: 'No affiliate program is documented for this review path. The current ask is private feedback or resource-fit review before any public mention.',
      },
    ],
    relatedLinks: [
      { href: '/assessment', label: 'Start the free assessment' },
      { href: '/sample-report', label: 'View sample report' },
      { href: '/pricing', label: 'See one-time pricing' },
      { href: '/mbti-mistype-test', label: 'MBTI mistype test' },
      { href: '/cognitive-functions-quiz', label: 'Cognitive functions quiz' },
      { href: '/jungian-cognitive-functions-test', label: 'Jungian cognitive functions test' },
    ],
  },
  {
    slug: 'jungian-test',
    query: 'Jungian test',
    title: 'Jungian Test - Measure Your Cognitive Functions | TypeJung',
    description: 'Take a Jungian test that maps all 8 cognitive functions, shows your likely type pattern, and supports educational self-reflection.',
    keywords: ['Jungian test', 'Carl Jung personality test', 'Jungian personality test', 'Jung cognitive functions'],
    eyebrow: 'Jungian test',
    h1: 'A Jungian test that goes beyond a four-letter label',
    intro: [
      'TypeJung is a Jungian self-assessment for people who want more than a quick type label. It maps self-reported patterns associated with all 8 cognitive functions, then turns that profile into an educational map of attention, decision-making, and stress patterns.',
      'The free assessment takes about 20 to 25 minutes. Paid reports are optional one-time CAD upgrades; TYPEJUNG30 currently brings Insight to CA$7 and Mastery to CA$20.30 on Stripe.',
    ],
    intent: {
      bestFor: 'Searchers who want a Jungian test with visible cognitive-function evidence, not only a fast type label.',
      measures: 'All 8 function-attitudes, dominant-inferior tension, behavioral scenarios, stress signals, somatic cues, and attitude direction.',
      privacy: 'The free assessment can be started before paying. Account features are for saved history and paid report access.',
    },
    sections: [
      {
        heading: 'What a Jungian test should show',
        body: [
          'Carl Jung described psychological type through patterns of perception and judgment. A useful Jungian test should therefore look at the function pattern behind the result, not only the final type code.',
          'TypeJung scores the intuitive, sensing, thinking, and feeling functions in both introverted and extraverted attitudes. That creates a richer profile than a simple either-or quiz and helps explain why nearby type labels can both feel partly true.',
        ],
        bullets: [
          'Perceiving functions: Ni, Ne, Si, and Se',
          'Judging functions: Ti, Te, Fi, and Fe',
          'Likely dominant, auxiliary, tertiary, and inferior patterns',
          'Stress signals connected to the inferior function',
          'A result you can inspect as a hypothesis rather than memorize as an identity',
        ],
        links: [
          { href: '/cognitive-functions', label: 'Read the guide to all 8 cognitive functions' },
          { href: '/jungian-cognitive-functions-test', label: 'Compare the full Jungian cognitive functions test' },
        ],
      },
      {
        heading: 'How TypeJung is different from a quick personality quiz',
        body: [
          'Many personality quizzes ask direct identity questions such as whether you are organized, emotional, intuitive, or social. Those answers can change with role, mood, age, stress, and what you want to believe about yourself.',
          'TypeJung uses scenario evidence instead. It asks how your attention behaves, how decisions get made, what happens when pressure rises, and where your body registers engagement or threat. That gives the result more texture than a label-only quiz.',
        ],
        table: {
          headers: ['What searchers need', 'Quick label quiz', 'TypeJung approach'],
          rows: [
            ['Result format', 'A single type code', 'Function map plus likely type pattern'],
            ['Jungian depth', 'Usually light or implied', 'Function-attitude and dominant-inferior interpretation'],
            ['Stress insight', 'Generic advice', 'Inferior-function and grip pattern context'],
            ['Payment path', 'Often pay before depth is clear', 'Free function-stack map first, optional one-time upgrades later'],
          ],
        },
      },
      {
        heading: 'How to read your Jungian test result',
        body: [
          'Your result is best read as a working hypothesis. The strongest scores show the functions you may rely on most. The lower or less stable scores can point toward the parts of the psyche that need patience, context, and development.',
          'Use the free result to orient yourself, then use the Learn section to compare your pattern with the 8 functions and 16 type profiles.',
        ],
        bullets: [
          'Start with the top two functions, because they often explain what feels natural and trusted',
          'Then study the likely inferior function, because that is where stress and growth usually become visible',
          'Compare your likely type page with the function scores instead of forcing a result that does not fit',
        ],
        links: [
          { href: '/types/infj', label: 'Example type guide: INFJ' },
          { href: '/types/intp', label: 'Example type guide: INTP' },
          { href: '/learn', label: 'Learn how to interpret the result' },
        ],
      },
      {
        heading: 'When a paid report helps',
        body: [
          'The free assessment gives you the function-stack map. Insight adds developmental edge analysis, a stress-pattern reflection map, relationship-pattern reflection, and practical prompts for a one-time CA$10 base price, currently CA$7 with TYPEJUNG30 on Stripe. Mastery adds the AI Type Guide, an individuation roadmap, reflection exercises, and practice support for a one-time CA$29 base price, currently CA$20.30 with the same code.',
          'The best path is to take the free test first. Upgrade only if the function map feels accurate enough to make deeper interpretation useful.',
        ],
        links: [
          { href: '/pricing', label: 'Compare Free, Insight, and Mastery pricing' },
          { href: '/assessment', label: 'Start the free Jungian assessment' },
        ],
      },
    ],
    faqs: [
      {
        question: 'Is TypeJung a clinical Jungian test?',
        answer: 'No. TypeJung is for education and self-exploration. It is not a medical, psychological, or clinical diagnostic tool.',
      },
      {
        question: 'How long does the Jungian test take?',
        answer: 'Most people complete the free 42-question assessment in about 20 to 25 minutes.',
      },
      {
        question: 'Does TypeJung give me an MBTI type?',
        answer: 'TypeJung can suggest a likely type pattern, but the main value is the full cognitive function profile behind the type.',
      },
    ],
    relatedLinks: [
      { href: '/assessment', label: 'Take the free assessment' },
      { href: '/jungian-typology', label: 'Jungian typology guide' },
      { href: '/cognitive-functions', label: 'Cognitive functions guide' },
      { href: '/learn', label: 'Learn Jungian typology' },
      { href: '/pricing', label: 'Compare Free, Insight, and Mastery' },
    ],
  },
  {
    slug: 'mbti-alternative',
    query: 'MBTI alternative',
    title: 'MBTI Alternative - Function-Based Typology Map | TypeJung',
    description: 'Compare TypeJung as an MBTI alternative for people who want Jungian function evidence, a free function-stack map, and optional paid interpretation after the result.',
    keywords: ['MBTI alternative', 'alternative to MBTI', 'Jungian typology alternative', 'function based typology', 'cognitive functions MBTI'],
    eyebrow: 'MBTI alternative',
    h1: 'An MBTI alternative for people who want the function pattern, not only the label',
    intro: [
      'MBTI-style language is useful shorthand, but it can feel too final when the evidence behind the label is hidden.',
      'TypeJung is an independent MBTI alternative built around Jungian cognitive functions. It shows a free function-stack map first, then lets you decide whether deeper paid interpretation is worth it.',
    ],
    intent: {
      bestFor: 'People comparing MBTI as a framework with function-based Jungian typology and wanting a more inspectable map.',
      measures: 'Independent function scores, likely type pattern, inferior-function pressure, and context for why MBTI results change.',
      privacy: 'Start free without paying first. Upgrade only after the function profile feels useful.',
    },
    sections: [
      {
        heading: 'Why people look for an MBTI alternative',
        body: [
          'Four-letter type codes can help people talk about patterns, but they can also flatten the evidence. The useful question is not only which label fits, but which functions are leading, supporting, and getting pressured.',
          'That is why TypeJung treats the type code as a hypothesis drawn from a visible function map, not as the whole result.',
        ],
        bullets: [
          'All 8 functions stay visible instead of disappearing behind one code',
          'Nearby type possibilities can be compared through function evidence',
          'Dominant-inferior tension is part of the result, not an afterthought',
          'The free map comes before any paid report',
        ],
        links: [
          { href: '/mbti-keeps-changing', label: 'Why your MBTI result keeps changing' },
          { href: '/mbti-test-alternative', label: 'Take the MBTI test alternative route' },
          { href: '/infj-vs-infp-test', label: 'Compare INFJ vs INFP through function evidence' },
        ],
      },
      {
        heading: 'TypeJung versus a label-first typology path',
        body: [
          'TypeJung still speaks the language of Jungian type, but it treats type as an interpretation of a function profile. That makes the result easier to inspect if you already know the basics and want a clearer self-assessment.',
          'If your main goal is a quick social label, a simple quiz may be enough. If your goal is to understand why a label fits or keeps changing, function evidence is more useful.',
        ],
        table: {
          headers: ['Question', 'Label-first typology', 'TypeJung alternative'],
          rows: [
            ['Main model', 'Broad preferences summarized as a type code', 'A visible Jungian function-stack map'],
            ['How results are shown', 'A final label with limited score context', 'Function scores plus likely type pattern'],
            ['Development angle', 'General type advice', 'Dominant-inferior edge, pressure signals, and reflection prompts'],
            ['What is free?', 'Usually a basic type result', 'A free 42-question assessment and core profile'],
            ['Close results', 'Often hidden behind a final label', 'Shown as a pattern you can compare'],
          ],
        },
      },
      {
        heading: 'When TypeJung is the better MBTI alternative',
        body: [
          'TypeJung is strongest when the question is not simply "what type am I?" but "why do I keep getting this result, and what pattern does it point toward?"',
          'Use it when you want to compare function pairs, see stress-edge evidence, or understand whether a result is stable enough to build self-reflection around.',
        ],
        bullets: [
          'You keep testing between two nearby types',
          'You want the cognitive functions behind a four-letter code',
          'You care about growth, stress, and relationship patterns',
          'You want a free first result before deciding whether a deeper report is worth it',
        ],
      },
      {
        heading: 'What to do after the function map',
        body: [
          'Start with the free assessment, then compare your strongest and weakest functions in the Learn section. If you want a deeper written interpretation, the Insight and Mastery reports are optional one-time CAD purchases.',
        ],
        links: [
          { href: '/assessment', label: 'Take the free TypeJung assessment' },
          { href: '/cognitive-function-test', label: 'See the cognitive function test page' },
          { href: '/blog/best-mbti-alternative-tests', label: 'Read the MBTI alternatives guide' },
        ],
      },
    ],
    faqs: [
      {
        question: 'Is TypeJung an official MBTI test?',
        answer: 'No. TypeJung is an independent Jungian cognitive-functions assessment for educational self-reflection, not an official MBTI instrument.',
      },
      {
        question: 'How is this page different from the MBTI test alternative page?',
        answer: 'This page compares TypeJung as an alternative typology approach. The MBTI test alternative page is for people specifically looking to take another test after a changing or unclear result.',
      },
      {
        question: 'Is TypeJung the same as MBTI?',
        answer: 'No. TypeJung uses Jungian type language, but it focuses on independent cognitive-function scoring and a visible function-stack map rather than only a four-letter result.',
      },
      {
        question: 'Is this MBTI alternative free?',
        answer: 'The core TypeJung assessment is free. Deeper Insight and Mastery reports are optional one-time CAD upgrades.',
      },
    ],
    relatedLinks: [
      { href: '/assessment', label: 'Take the free assessment' },
      { href: '/mbti-test-alternative', label: 'MBTI test alternative' },
      { href: '/blog/singer-loomis-vs-mbti', label: 'Singer-Loomis vs MBTI' },
      { href: '/jungian-typology', label: 'Jungian typology guide' },
      { href: '/learn', label: 'Explore all 8 functions' },
      { href: '/pricing', label: 'View one-time pricing' },
    ],
  },
  {
    slug: 'inferior-function-test',
    query: 'inferior function test',
    title: 'Inferior Function Test - Find Your Stress Pattern | TypeJung',
    description: 'Find your likely inferior function and understand how it can show up under stress with TypeJung\'s cognitive function assessment.',
    keywords: ['inferior function test', 'inferior cognitive function', 'the grip Jungian', 'stress personality test'],
    eyebrow: 'Inferior function test',
    h1: 'Find your likely inferior function and stress pattern',
    intro: [
      'Your inferior function is often the least conscious part of your Jungian function stack. It can feel awkward, compelling, or strangely powerful under stress.',
      'TypeJung estimates inferior-function patterns by measuring the whole cognitive profile first. That matters because the inferior function is not just the lowest number. It sits in relationship to the dominant function and the rest of the stack.',
    ],
    intent: {
      bestFor: 'People who want to understand stress patterns, grip reactions, and the growth edge behind a Jungian type result.',
      measures: 'Dominant-inferior tension, pressure responses, function imbalance, attraction and avoidance signals, and recovery themes.',
      privacy: 'Educational self-reflection only. It is not a mental health diagnosis, and severe distress belongs with a qualified professional.',
    },
    sections: [
      {
        heading: 'Why the inferior function matters',
        body: [
          'In Jungian typology, the inferior function often marks a growth edge. It may show up as avoidance in everyday life and as overreaction during pressure. Learning the pattern gives you a way to notice stress before it takes over.',
          'A good inferior function test should not simply ask what you are bad at. It should compare the whole function profile and look at the tension between what feels controlled and what becomes reactive.',
        ],
        bullets: [
          'Ni-dominant patterns often struggle with inferior Se under stress',
          'Ne-dominant patterns often struggle with inferior Si under stress',
          'Ti-dominant patterns often struggle with inferior Fe under stress',
          'Fi-dominant patterns often struggle with inferior Te under stress',
          'Fe-dominant patterns often struggle with inferior Ti under stress',
          'Te-dominant patterns often struggle with inferior Fi under stress',
        ],
        links: [
          { href: '/blog/what-is-the-inferior-function', label: 'Read: what is the inferior function?' },
          { href: '/blog/what-does-it-mean-to-be-in-the-grip', label: 'Read: what it means to be in the grip' },
        ],
      },
      {
        heading: 'What the test looks for',
        body: [
          'A useful inferior-function test needs more than a single question about weakness. TypeJung looks at how you attend, decide, respond to pressure, and distribute energy across the 8 functions.',
          'The result helps you compare likely dominant and inferior poles, then gives you a language for recovery and development.',
        ],
        table: {
          headers: ['Signal', 'What it can reveal', 'Why it matters'],
          rows: [
            ['Stress reaction', 'What takes over when control weakens', 'Often points toward inferior-function material'],
            ['Avoidance pattern', 'What you postpone, dismiss, or overcompensate for', 'Shows where development may be needed'],
            ['Attraction or envy', 'What feels powerful in others but hard to own', 'Can mark a less conscious function'],
            ['Recovery need', 'What helps you regain balance', 'Turns insight into practical self-observation'],
          ],
        },
      },
      {
        heading: 'Inferior function examples',
        body: [
          'If the likely inferior function is Se, stress may involve sensory overwhelm, impulsive action, or difficulty staying grounded in the present. If the likely inferior function is Fe, stress may involve social over-reading, rejection sensitivity, or awkward attempts to repair harmony.',
          'These examples are not diagnoses. They are prompts for observation: what appears repeatedly, under what conditions, and what helps you return to choice?',
        ],
        links: [
          { href: '/functions/se', label: 'Learn Introverted Intuition vs Extraverted Sensing patterns' },
          { href: '/functions/fe', label: 'Learn Introverted Thinking vs Extraverted Feeling patterns' },
          { href: '/shadow-work-test', label: 'Explore the Jungian shadow work test' },
        ],
      },
      {
        heading: 'Use your result carefully',
        body: [
          'Inferior-function language can be clarifying, but it should not become a self-criticism tool. Treat the result as a map for observation. If stress feels severe or persistent, work with a qualified professional.',
          'The best next step is to take the free assessment, read the inferred dominant-inferior axis, then compare it against real situations for a few weeks before turning it into a fixed identity.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is the inferior function just my weakest function?',
        answer: 'Not always. The inferior function is understood in relation to the dominant function and the whole stack, so TypeJung interprets the broader pattern.',
      },
      {
        question: 'What is the grip?',
        answer: 'The grip is a Jungian term for a stress state where the inferior function can show up in a reactive or exaggerated way.',
      },
      {
        question: 'Will the test diagnose my stress?',
        answer: 'No. TypeJung offers educational personality insight. It does not diagnose stress, trauma, anxiety, or any mental health condition.',
      },
    ],
    relatedLinks: [
      { href: '/assessment', label: 'Take the free assessment' },
      { href: '/shadow-work-test', label: 'Jungian self-observation test' },
      { href: '/blog/understanding-the-grip', label: 'Read about the grip' },
      { href: '/learn', label: 'Learn the function stack' },
    ],
  },
  {
    slug: 'cognitive-functions-test',
    query: 'cognitive functions test',
    title: 'Cognitive Functions Test - Free Jungian 8-Function Map | TypeJung',
    description: 'Take a free Jungian cognitive functions test for Ni, Ne, Si, Se, Ti, Te, Fi, and Fe. This is a personality-functions map, not a memory screening test.',
    keywords: ['cognitive functions test', 'Jungian cognitive functions test', 'free cognitive functions test', '8 cognitive functions test', 'Ni Ne Si Se Ti Te Fi Fe test'],
    eyebrow: 'Cognitive functions test',
    h1: 'A cognitive functions test for Jungian personality type',
    intro: [
      'TypeJung is a Jungian personality cognitive functions test: it maps Ni, Ne, Si, Se, Ti, Te, Fi, and Fe into a function-stack profile you can inspect before paying for anything.',
      'If you are looking for a clinical memory, dementia, or medical cognition screen, this is not that. If you want to understand the personality functions behind MBTI-style type, start here.',
    ],
    intent: {
      bestFor: 'Searchers who typed "cognitive functions test" and want a Jungian personality result, not a medical cognitive screening test.',
      measures: 'All 8 Jungian function-attitudes, likely dominant and auxiliary pattern, inferior-function edge, type hypothesis, and result confidence.',
      privacy: 'No card before the free result. Paid Insight and Mastery reports are optional one-time CAD upgrades after you see the map.',
    },
    sections: [
      {
        heading: 'Quick answer: what this test is',
        body: [
          'This page is for the plural search intent: cognitive functions test as used in Jungian and MBTI-style typology communities. The assessment asks 42 scenario-based questions and returns a free function-stack map.',
          'The result is educational self-reflection. It does not diagnose memory problems, ADHD, dementia, trauma, anxiety, or any medical condition.',
        ],
        table: {
          headers: ['If you mean...', 'Use TypeJung for...', 'Do not use it for...'],
          rows: [
            ['Jungian cognitive functions', 'Ni, Ne, Si, Se, Ti, Te, Fi, and Fe pattern mapping', 'Clinical cognitive screening'],
            ['MBTI-style type depth', 'Function evidence behind a likely type result', 'Official MBTI certification'],
            ['Function stack testing', 'Dominant, auxiliary, tertiary, and inferior hypotheses', 'A permanent identity label'],
            ['Stress and growth edge', 'Inferior-function reflection prompts', 'Mental health diagnosis'],
          ],
        },
        links: [
          { href: '/assessment', label: 'Start the free cognitive functions test' },
          { href: '/jungian-cognitive-functions-test', label: 'Compare the Jungian cognitive functions test page' },
          { href: '/sample-report', label: 'Preview the paid report before checkout' },
        ],
      },
      {
        heading: 'What the free result shows',
        body: [
          'A useful cognitive functions test should show the actual function map, not hide the evidence behind a single type code. TypeJung keeps the result inspectable so you can compare the highest signals, nearby alternatives, and stress-linked edge.',
          'The paid report is only offered after the free result. That matters because the upgrade should deepen a pattern you already found useful, not force a blind purchase.',
        ],
        bullets: [
          'Scores across all 8 function-attitudes',
          'Likely function-stack pattern and type hypothesis',
          'Dominant-inferior axis for stress and development reflection',
          'Links to the specific function and type guides that match your result',
          'Optional Insight and Mastery reports after the free map',
        ],
      },
      {
        heading: 'Why plural "functions" matters',
        body: [
          'The plural wording usually means the searcher already knows one score is not enough. They want to see the relationship between functions: which mode leads, which supports it, and which one becomes awkward or reactive under pressure.',
          'TypeJung is built around those relationships. It gives the map first, then explains how the pattern can be read as a stack hypothesis.',
        ],
        table: {
          headers: ['Result area', 'Question it helps answer', 'Where to go deeper'],
          rows: [
            ['Dominant signal', 'What mode of attention or judgment feels most trusted?', 'Dominant function guide'],
            ['Auxiliary support', 'What balances or supports the leading function?', 'Type result page'],
            ['Inferior edge', 'What becomes loaded, avoided, or reactive under stress?', 'Inferior function guide'],
            ['Close alternatives', 'Why do two type results both seem plausible?', 'Type-vs-type comparison page'],
          ],
        },
        links: [
          { href: '/dominant-function-test', label: 'Dominant function test' },
          { href: '/inferior-function-test', label: 'Inferior function test' },
          { href: '/function-stack-test', label: 'Function stack test' },
        ],
      },
      {
        heading: 'How TypeJung compares to other function tests',
        body: [
          'People often compare TypeJung with Sakinorva, Keys2Cognition, Mistype Investigator, Michael Caloz, IDRlabs, and 16Selves. Those tools can be useful; the important question is whether the result is inspectable and whether the interpretation explains real situations.',
          'TypeJung is strongest when you want a shorter free-first path, a clear function-stack map, stress-edge context, and an optional sample-backed paid report after the result.',
        ],
        links: [
          { href: '/best-cognitive-functions-test', label: 'Best cognitive functions test comparison' },
          { href: '/sakinorva-alternative', label: 'Sakinorva alternative' },
          { href: '/keys2cognition-alternative', label: 'Keys2Cognition alternative' },
          { href: '/idrlabs-cognitive-function-test-alternative', label: 'IDRlabs alternative' },
        ],
      },
    ],
    faqs: [
      {
        question: 'Is this a cognitive functions test or a medical cognitive test?',
        answer: 'It is a Jungian personality cognitive functions test. It maps typology functions like Ni, Ne, Si, Se, Ti, Te, Fi, and Fe. It is not a medical, memory, dementia, ADHD, or clinical screening tool.',
      },
      {
        question: 'Does TypeJung test all 8 cognitive functions?',
        answer: 'Yes. The assessment maps all 8 Jungian function-attitudes and uses them to form a likely function-stack and type hypothesis.',
      },
      {
        question: 'Can I take the cognitive functions test for free?',
        answer: 'Yes. The 42-question assessment and core function-stack map are free. Paid reports are optional one-time CAD upgrades after the result is visible.',
      },
      {
        question: 'What is the difference between cognitive function test and cognitive functions test?',
        answer: 'In typology searches, both usually mean a Jungian function assessment. The plural phrase often signals that the searcher wants all 8 functions mapped rather than one broad result.',
      },
    ],
    relatedLinks: [
      { href: '/assessment', label: 'Take the free cognitive functions test' },
      { href: '/cognitive-function-test', label: 'Cognitive function test' },
      { href: '/jungian-cognitive-functions-test', label: 'Jungian cognitive functions test' },
      { href: '/free-cognitive-function-test', label: 'Free cognitive function test' },
      { href: '/function-stack-test', label: 'Function stack test' },
      { href: '/sample-report', label: 'View sample paid report' },
    ],
  },
  {
    slug: 'cognitive-function-test',
    query: 'cognitive function test',
    title: 'Cognitive Function Test - Map All 8 Functions | TypeJung',
    description: 'Take a cognitive function test that maps Ni, Ne, Si, Se, Ti, Te, Fi, and Fe in one Jungian function-stack profile.',
    keywords: ['cognitive function test', '8 cognitive functions test', 'Jungian cognitive functions', 'Ni Ne Si Se Ti Te Fi Fe test'],
    eyebrow: 'Cognitive function test',
    h1: 'A cognitive function test for all 8 Jungian functions',
    intro: [
      'TypeJung maps Ni, Ne, Si, Se, Ti, Te, Fi, and Fe so you can see the shape of your cognitive profile instead of guessing from a type description.',
      'The free assessment gives you a function map and likely type pattern. Optional paid reports add deeper analysis with one-time CAD pricing; TYPEJUNG30 currently brings Insight to CA$7 and Mastery to CA$20.30 on Stripe.',
    ],
    intent: {
      bestFor: 'Searchers who want a cognitive function test that shows all 8 scores and explains the pattern behind them.',
      measures: 'Ni, Ne, Si, Se, Ti, Te, Fi, Fe, likely type pattern, dominant-inferior axis, stress signals, and interpretation confidence.',
      privacy: 'The core 42-question result is free. Paid reports are optional one-time upgrades after the result is visible.',
    },
    sections: [
      {
        heading: 'The 8 function-attitudes TypeJung maps',
        body: [
          'The test separates perceiving functions, which describe how information comes into awareness, from judging functions, which describe how decisions and evaluations are made.',
          'This is useful because people rarely fit cleanly into one simple trait pair. You may have strong intuition and still rely on sensing in specific contexts, or score close between two judging functions when work and relationships ask different things from you.',
        ],
        bullets: [
          'Ni: convergent pattern insight and future orientation',
          'Ne: divergent possibility scanning and idea generation',
          'Si: memory, continuity, and experience-based comparison',
          'Se: present-moment awareness and direct engagement',
          'Ti: internal logic, precision, and model building',
          'Te: external organization, results, and execution',
          'Fi: personal values, authenticity, and inner alignment',
          'Fe: relational attunement, harmony, and shared values',
        ],
        links: [
          { href: '/functions/ni', label: 'Introverted Intuition guide' },
          { href: '/functions/ne', label: 'Extraverted Intuition guide' },
          { href: '/functions/ti', label: 'Introverted Thinking guide' },
          { href: '/functions/fe', label: 'Extraverted Feeling guide' },
        ],
      },
      {
        heading: 'What you receive after the assessment',
        body: [
          'Your result shows relative function strength and a likely type interpretation. That gives you a way to inspect the data instead of accepting a black-box label.',
          'The result is designed for self-reflection, not clinical diagnosis. It gives you language for attention, judgment, stress, and development so you can test the pattern against real life.',
        ],
        bullets: [
          'A free cognitive function profile',
          'A likely Jungian type pattern',
          'Educational links for each function',
          'Optional deeper reports for stress-pattern reflection, relationship-pattern reflection, and practice prompts',
        ],
      },
      {
        heading: 'Why all 8 scores matter',
        body: [
          'The most useful insight often comes from the relationships between scores. A high dominant score can show what feels natural. A close auxiliary score can show how that strength gets supported. A lower or reactive function can point toward stress and growth.',
          'That is why TypeJung avoids reducing the result to only one function or one type code. The function map lets you compare competing hypotheses instead of hiding uncertainty.',
        ],
        table: {
          headers: ['Pattern in the score', 'Possible meaning', 'What to inspect next'],
          rows: [
            ['Two high perceiving functions', 'You may switch between pattern insight, possibilities, memory, or direct experience by context', 'Compare Ni, Ne, Si, and Se descriptions'],
            ['High thinking and feeling', 'Decision-making may combine logic and values rather than one simple preference', 'Compare Ti, Te, Fi, and Fe examples'],
            ['One function feels reactive', 'It may be less conscious or stress-linked', 'Read the inferior function page'],
            ['Nearby type possibilities', 'Your likely type may need interpretation, not force', 'Read the matching type pages'],
          ],
        },
      },
      {
        heading: 'Best next step',
        body: [
          'Take the assessment first, then use the Learn section to understand your top two functions and your possible inferior function. The pattern between those positions is usually more useful than any single score.',
        ],
        links: [
          { href: '/assessment', label: 'Start the free cognitive function test' },
          { href: '/cognitive-functions-test', label: 'Use the plural cognitive functions test page' },
          { href: '/jungian-cognitive-functions-test', label: 'Compare the Jungian cognitive functions test' },
          { href: '/jungian-typology', label: 'Read the Jungian typology guide' },
          { href: '/inferior-function-test', label: 'Find your inferior-function pattern' },
        ],
      },
    ],
    faqs: [
      {
        question: 'Does the cognitive function test map all 8 functions?',
        answer: 'Yes. TypeJung scores Ni, Ne, Si, Se, Ti, Te, Fi, and Fe rather than only asking broad type-dichotomy questions.',
      },
      {
        question: 'Is the cognitive function test free?',
        answer: 'The core 42-question assessment is free. Insight and Mastery are optional one-time CAD paid reports.',
      },
      {
        question: 'Can I use the result to find my type?',
        answer: 'Yes. The function profile supports a likely type interpretation, but the profile itself is the main source of self-reflection.',
      },
    ],
    relatedLinks: [
      { href: '/assessment', label: 'Start the test' },
      { href: '/cognitive-functions-test', label: 'Cognitive functions test' },
      { href: '/jungian-cognitive-functions-test', label: 'Jungian cognitive functions test' },
      { href: '/cognitive-functions', label: 'Cognitive functions guide' },
      { href: '/functions/ni', label: 'Introverted Intuition' },
      { href: '/functions/ti', label: 'Introverted Thinking' },
    ],
  },
  {
    slug: 'cognitive-functions-quiz',
    query: 'cognitive functions quiz',
    title: 'Cognitive Functions Quiz - Map Ni Ne Si Se Ti Te Fi Fe | TypeJung',
    description: 'Take a cognitive functions quiz that maps all 8 Jungian functions, shows the dominant-inferior axis, and gives the free result before any paid report.',
    keywords: ['cognitive functions quiz', 'Jungian cognitive functions quiz', '8 cognitive functions quiz', 'Ni Ne Si Se Ti Te Fi Fe quiz'],
    eyebrow: 'Cognitive functions quiz',
    h1: 'A cognitive functions quiz that shows the map first',
    intro: [
      'Most people searching for a cognitive functions quiz do not only want another label. They want to see whether Ni, Ne, Si, Se, Ti, Te, Fi, or Fe actually explains the way they notice, decide, react, and recover.',
      'TypeJung turns the quiz into a free function-stack map before any checkout. Paid reports are optional one-time CAD upgrades only if the map gives you something worth interpreting further.',
    ],
    intent: {
      bestFor: 'People who want a quiz-style route into Jungian cognitive functions without paying before the result is visible.',
      measures: 'All 8 function-attitudes, likely stack pattern, dominant-inferior axis, stress edge, and answer-consistency signal.',
      privacy: 'Start free without a card. An account is only needed for saved history, share links, and restored paid access across devices.',
    },
    sections: [
      {
        heading: 'What makes this different from a normal personality quiz',
        body: [
          'A normal personality quiz often compresses the answer into one type code. That can be useful, but it hides the shape of the result when two functions or two possible types are close.',
          'TypeJung keeps the map visible. You can inspect the function evidence, compare the likely dominant and inferior poles, and decide whether the result explains real situations before buying anything.',
        ],
        bullets: [
          '42 scenario-based prompts',
          'Scores across all 8 Jungian function-attitudes',
          'A likely function-stack pattern instead of only a label',
          'Dominant-inferior axis copy for stress and growth reflection',
          'Optional Insight and Mastery reports after the free map',
        ],
        links: [
          { href: '/assessment', label: 'Start the free quiz' },
          { href: '/cognitive-function-test', label: 'Read the cognitive function test guide' },
          { href: '/cognitive-functions', label: 'Learn the 8 functions' },
        ],
      },
      {
        heading: 'How to read the quiz result',
        body: [
          'Start with the strongest function-attitude signal, then read the supporting pattern around it. A useful result should explain both what comes naturally and what becomes reactive under pressure.',
          'If two patterns are close, treat the result as a hypothesis to inspect. The goal is educational self-reflection, not a fixed identity claim or clinical assessment.',
        ],
        table: {
          headers: ['Result signal', 'What it can show', 'Where to go next'],
          rows: [
            ['Dominant signal', 'The mode of attention or judgment that feels most practiced', 'Read the matching function guide'],
            ['Auxiliary support', 'The function that often helps the dominant pattern operate in real life', 'Compare the likely type stack'],
            ['Inferior edge', 'The stress-linked opposite pole that may feel awkward or loaded', 'Read the inferior function guide'],
            ['Close alternatives', 'A result that may need comparison instead of forced certainty', 'Use a type-vs-type page'],
          ],
        },
      },
      {
        heading: 'Free first, upgrade only if the map earns it',
        body: [
          'The quiz is designed to reduce purchase anxiety. You get the function-stack map first, then choose whether a deeper paid interpretation is useful.',
          'Insight currently shows CA$7 with TYPEJUNG30 on Stripe and adds a deeper report, stress-pattern reflection map, relationship-pattern reflection, and practice prompts. Mastery currently shows CA$20.30 with the same code and adds the AI Type Guide plus a practice roadmap.',
        ],
        bullets: [
          'No card before the free result',
          'One-time CAD pricing, not a subscription',
          'Sample report available before checkout',
          'Discount code is shown before payment',
        ],
        links: [
          { href: '/sample-report', label: 'View the sample report' },
          { href: '/pricing', label: 'Compare Insight and Mastery' },
          { href: '/cognitive-functions-test', label: 'Cognitive functions test' },
          { href: '/free-cognitive-function-test', label: 'Free cognitive function test' },
        ],
      },
    ],
    faqs: [
      {
        question: 'Is this cognitive functions quiz free?',
        answer: 'Yes. The core 42-question TypeJung assessment and function-stack map are free. Paid reports are optional one-time upgrades after the result is visible.',
      },
      {
        question: 'Does it quiz all 8 cognitive functions?',
        answer: 'Yes. TypeJung maps Ni, Ne, Si, Se, Ti, Te, Fi, and Fe instead of stopping at one broad four-letter result.',
      },
      {
        question: 'Can the quiz tell me my exact type?',
        answer: 'It gives a likely Jungian type pattern and function-stack map for educational self-reflection. It should be inspected as a map, not treated as a guaranteed or clinical typing authority.',
      },
    ],
    relatedLinks: [
      { href: '/assessment', label: 'Take the free quiz' },
      { href: '/cognitive-functions-test', label: 'Cognitive functions test' },
      { href: '/cognitive-function-test', label: 'Cognitive function test' },
      { href: '/free-cognitive-function-test', label: 'Free cognitive function test' },
      { href: '/function-stack-test', label: 'Function stack test' },
      { href: '/sample-report', label: 'View sample report' },
    ],
  },
  {
    slug: 'free-cognitive-function-test',
    query: 'free cognitive function test',
    title: 'Free Cognitive Function Test - Map All 8 Functions | TypeJung',
    description: 'Take a free cognitive function test that maps Ni, Ne, Si, Se, Ti, Te, Fi, and Fe before any optional paid report.',
    keywords: ['free cognitive function test', 'free Jungian cognitive functions test', 'free function test', 'Ni Ne Si Se Ti Te Fi Fe test'],
    eyebrow: 'Free cognitive function test',
    h1: 'A free cognitive function test before any paid report',
    intro: [
      'TypeJung starts with the part most people need first: a free map of how your attention, judgment, stress, and energy distribute across the Jungian functions.',
      'You do not need to pay before seeing the core result. Paid Insight and Mastery reports are optional one-time CAD upgrades if the free map feels accurate enough to keep working with.',
    ],
    intent: {
      bestFor: 'Searchers who want a free cognitive function test and do not want to pay before seeing whether the result is useful.',
      measures: 'All 8 function-attitudes, likely dominant and inferior pattern, attitude direction, stress signals, and practical self-reflection prompts.',
      privacy: 'Start the assessment free. Signup is only needed for saved history, share links, and restored paid access across devices.',
    },
    sections: [
      {
        heading: 'What is free',
        body: [
          'The free assessment gives you the TypeJung function-stack map. It shows the relative pattern across thinking, feeling, sensation, and intuition, plus the introverted or extraverted direction that appears strongest.',
          'That free result is meant to be useful on its own. You can compare your dominant-inferior axis, read the function guides, and decide whether the map matches real situations before considering an upgrade.',
        ],
        bullets: [
          '42 scenario-based prompts',
          'A function-stack map',
          'Dominant, auxiliary, tertiary, and inferior hypotheses',
          'Attitude direction and answer consistency signal',
          'Free next links into the relevant function and type guides',
        ],
        links: [
          { href: '/assessment', label: 'Start the free assessment' },
          { href: '/sample-report', label: 'Preview the optional paid report' },
        ],
      },
      {
        heading: 'Why free first matters',
        body: [
          'Personality tests are only useful if the result feels inspectable. If a tool asks for payment before showing the map, you cannot tell whether the deeper interpretation is worth buying.',
          'TypeJung reverses that order. The free map lets you check the pattern first. The paid report is for people who want a deeper explanation of the exact result they already saw.',
        ],
        table: {
          headers: ['Step', 'What happens', 'Why it helps'],
          rows: [
            ['Free assessment', 'You answer the 42 questions and see the function-stack map', 'You can judge accuracy before paying'],
            ['Free result review', 'You inspect dominant, inferior, attitude, and stress signals', 'You can compare the result against real life'],
            ['Optional upgrade', 'Insight or Mastery adds deeper interpretation', 'You only pay if the result earned interest'],
          ],
        },
      },
      {
        heading: 'When to upgrade after the free test',
        body: [
          'Upgrade only if the map gives you a useful starting point and you want help interpreting the developmental edge behind it.',
          'Insight is currently CA$7 with TYPEJUNG30 applied on Stripe. It adds the deeper report, stress-pattern reflection map, relationship-pattern reflection, and practice prompts. Mastery adds AI Type Guide support and a practice roadmap.',
        ],
        bullets: [
          'Choose Insight when you want a deeper written report',
          'Choose Mastery when you want the report plus follow-up coaching tools',
          'Skip the upgrade if the free map does not feel useful',
        ],
        links: [
          { href: '/pricing', label: 'Compare one-time pricing' },
          { href: '/cognitive-functions-test', label: 'Cognitive functions test' },
          { href: '/cognitive-function-test', label: 'Read the broader cognitive function test guide' },
        ],
      },
    ],
    faqs: [
      {
        question: 'Is the cognitive function test really free?',
        answer: 'Yes. The 42-question assessment and function-stack map are free. Insight and Mastery are optional one-time upgrades after the result is visible.',
      },
      {
        question: 'Do I need an account to take the free test?',
        answer: 'No. You can start without signup. An account helps save history, share links, and restore paid access across devices.',
      },
      {
        question: 'What do paid reports add?',
        answer: 'Paid reports add deeper interpretation of your result, including developmental edge, stress-pattern reflection, relationship-pattern reflection, practices, and for Mastery, AI Type Guide support.',
      },
    ],
    relatedLinks: [
      { href: '/assessment', label: 'Take the free assessment' },
      { href: '/sample-report', label: 'View sample paid report' },
      { href: '/cognitive-functions-test', label: 'Cognitive functions test' },
      { href: '/function-stack-test', label: 'Function stack test' },
      { href: '/jungian-cognitive-functions-test', label: 'Jungian cognitive functions test' },
      { href: '/pricing', label: 'See one-time pricing' },
    ],
  },
  {
    slug: 'function-stack-test',
    query: 'function stack test',
    title: 'Function Stack Test - Find Your Jungian Stack | TypeJung',
    description: 'Use TypeJung as a function stack test to compare dominant, auxiliary, tertiary, and inferior Jungian function signals.',
    keywords: ['function stack test', 'cognitive function stack test', 'Jungian function stack', 'dominant auxiliary tertiary inferior test'],
    eyebrow: 'Function stack test',
    h1: 'A function stack test that shows the pattern behind the label',
    intro: [
      'A useful function stack test should not only name a four-letter type. It should show why a dominant function looks likely, what supports it, and where inferior-function pressure appears.',
      'TypeJung starts from the full function profile, then interprets likely dominant, auxiliary, tertiary, and inferior positions as a working hypothesis.',
    ],
    intent: {
      bestFor: 'People who know cognitive functions and want to test the stack pattern behind their type hypothesis.',
      measures: 'Dominant, auxiliary, tertiary, and inferior signals across the 8 functions, with attitude direction and stress-edge evidence.',
      privacy: 'The stack map starts free. Paid interpretation is optional after you have seen the result.',
    },
    sections: [
      {
        heading: 'What a function stack test should compare',
        body: [
          'A stack is a model of how functions organize together. The dominant function is usually the most trusted mode. The auxiliary often supports it from the opposite axis. The inferior marks a less conscious edge that can become visible under stress.',
          'Because stack interpretation depends on relationships between functions, a good test needs more than one score. It needs a map.',
        ],
        bullets: [
          'Dominant function: the most trusted mode of attention or judgment',
          'Auxiliary function: the supporting channel that balances the dominant',
          'Tertiary function: a less central but available support',
          'Inferior function: the developmental and stress-linked edge',
        ],
        links: [
          { href: '/assessment', label: 'Start the function stack assessment' },
          { href: '/inferior-function-test', label: 'Understand the inferior-function edge' },
        ],
      },
      {
        heading: 'Why your stack result may need interpretation',
        body: [
          'Function stack tests can feel confusing when two functions score close together or when stress makes the inferior signal loud. That does not always mean the test failed. It may mean the pattern needs careful reading.',
          'TypeJung treats the stack as a hypothesis. The free result gives you the map, and the optional paid report explains how that pattern may show up in development, conflict, and daily practice.',
        ],
        table: {
          headers: ['Result pattern', 'What it may mean', 'Next check'],
          rows: [
            ['High dominant and auxiliary scores', 'A stable leading pattern may be visible', 'Read both function guides'],
            ['Close scores across several functions', 'Context may be shaping the result', 'Compare real situations before forcing type'],
            ['Inferior signal feels strong', 'Stress may be amplifying the edge', 'Read stress and grip material carefully'],
            ['Type label feels close but incomplete', 'The stack may need interpretation beyond stereotypes', 'Use the sample report to inspect depth'],
          ],
        },
      },
      {
        heading: 'From stack to practical use',
        body: [
          'The point of a function stack test is not to memorize a label. The point is to recognize the pattern when it appears in decisions, relationships, stress, and recovery.',
          'After the free map, use the dominant-inferior axis as a practical self-observation tool: what do you over-trust, what do you avoid, and what brings you back into balance?',
        ],
        links: [
          { href: '/sample-report', label: 'View the paid report sample' },
          { href: '/pricing', label: 'Compare Free, Insight, and Mastery' },
          { href: '/cognitive-functions', label: 'Review all 8 functions' },
        ],
      },
    ],
    faqs: [
      {
        question: 'Can TypeJung find my exact function stack?',
        answer: 'TypeJung gives a likely stack pattern and function evidence. Treat it as a structured hypothesis rather than a final identity verdict.',
      },
      {
        question: 'Does the test show dominant and inferior functions?',
        answer: 'Yes. The free result includes a likely dominant-inferior axis and a broader hierarchy of function signals.',
      },
      {
        question: 'Is a function stack the same as a type label?',
        answer: 'No. A type label summarizes a pattern, while a stack describes the functions that may be organizing that pattern.',
      },
    ],
    relatedLinks: [
      { href: '/assessment', label: 'Take the function stack test' },
      { href: '/free-cognitive-function-test', label: 'Free cognitive function test' },
      { href: '/jungian-personality-test', label: 'Jungian personality test' },
      { href: '/inferior-function-test', label: 'Inferior function test' },
      { href: '/sample-report', label: 'View sample report' },
    ],
  },
  {
    slug: 'jungian-personality-test',
    query: 'Jungian personality test',
    title: 'Jungian Personality Test - Cognitive Function Map | TypeJung',
    description: 'Take a Jungian personality test that maps cognitive functions, likely type pattern, stress edge, and self-reflection themes.',
    keywords: ['Jungian personality test', 'Carl Jung personality test', 'Jung personality types test', 'Jungian type test'],
    eyebrow: 'Jungian personality test',
    h1: 'A Jungian personality test built around cognitive functions',
    intro: [
      'A Jungian personality test should help you understand how attention and judgment organize themselves, not only attach a short label to your identity.',
      'TypeJung maps the cognitive-function pattern behind a likely type result, then gives you a free map before any optional paid interpretation.',
    ],
    intent: {
      bestFor: 'Searchers who want a Jungian personality test with type language, cognitive functions, and practical self-reflection.',
      measures: 'Function energy, attitude direction, likely type pattern, dominant-inferior tension, stress signals, and developmental edge.',
      privacy: 'Educational self-reflection only. Start free, then upgrade only if the result feels worth deeper interpretation.',
    },
    sections: [
      {
        heading: 'How Jungian personality differs from trait quizzes',
        body: [
          'Many personality quizzes ask whether you are organized, emotional, social, or imaginative. Jungian typology asks a different question: which psychological functions carry your most habitual energy?',
          'That is why TypeJung maps function channels and attitude direction from your self-reported answers. The result is a map you can inspect rather than a black-box label.',
        ],
        bullets: [
          'Thinking and feeling as judging patterns',
          'Sensation and intuition as perceiving patterns',
          'Introverted and extraverted direction',
          'Dominant-inferior tension under stress',
        ],
        links: [
          { href: '/assessment', label: 'Start the Jungian personality test' },
          { href: '/jungian-typology', label: 'Read the Jungian typology guide' },
        ],
      },
      {
        heading: 'What your result can help you inspect',
        body: [
          'The free result helps you compare what feels most natural with what becomes difficult under pressure. That tension is often more useful than a quick type name.',
          'If the map fits, the optional paid report turns the result into a deeper explanation of stress-pattern reflection, relationship-pattern reflection, and practical next steps.',
        ],
        table: {
          headers: ['Question', 'Free map', 'Optional paid report'],
          rows: [
            ['What pattern is strongest?', 'Dominant and supporting function signals', 'A deeper written interpretation'],
            ['What happens under stress?', 'Inferior-function edge', 'Stress trigger map and repair cues'],
            ['How do I use this?', 'Next links and core self-reflection', 'Practices and coaching prompts'],
          ],
        },
      },
      {
        heading: 'Best path through TypeJung',
        body: [
          'Take the free assessment first. Read the result as a working hypothesis. If it gives you language for a pattern you recognize, then use the sample report or pricing page to decide whether deeper interpretation is worth it.',
        ],
        links: [
          { href: '/sample-report', label: 'View the sample paid report' },
          { href: '/free-cognitive-function-test', label: 'Free cognitive function test' },
          { href: '/function-stack-test', label: 'Function stack test' },
          { href: '/pricing', label: 'Compare one-time upgrades' },
        ],
      },
    ],
    faqs: [
      {
        question: 'Is TypeJung based on Carl Jung?',
        answer: 'TypeJung uses Jungian typology language and modern cognitive-function interpretation for educational self-reflection. It is not a clinical assessment.',
      },
      {
        question: 'Will I get a personality type?',
        answer: 'You get a likely type pattern, but the main output is the function map behind that interpretation.',
      },
      {
        question: 'Can I take the Jungian personality test free?',
        answer: 'Yes. The core assessment and free map are available before any optional paid report.',
      },
    ],
    relatedLinks: [
      { href: '/assessment', label: 'Take the Jungian personality test' },
      { href: '/jungian-test', label: 'Jungian test' },
      { href: '/free-cognitive-function-test', label: 'Free cognitive function test' },
      { href: '/function-stack-test', label: 'Function stack test' },
      { href: '/sample-report', label: 'View sample report' },
    ],
  },
  {
    slug: 'infj-vs-infp-test',
    query: 'INFJ vs INFP test',
    title: 'INFJ vs INFP Test - Compare Ni-Fe and Fi-Ne | TypeJung',
    description: 'Use TypeJung as an INFJ vs INFP test by comparing Ni-Fe and Fi-Ne evidence instead of relying on stereotypes.',
    keywords: ['INFJ vs INFP test', 'INFJ or INFP', 'Ni Fe vs Fi Ne', 'INFJ INFP cognitive functions'],
    eyebrow: 'INFJ vs INFP test',
    h1: 'INFJ vs INFP: test the function pattern, not the stereotype',
    intro: [
      'INFJ and INFP can both look private, sensitive, idealistic, and meaning-focused. That is why stereotype-based quizzes often confuse them.',
      'TypeJung helps you compare the function evidence behind the labels: Ni-Fe for INFJ-like patterns and Fi-Ne for INFP-like patterns.',
    ],
    sections: [
      {
        heading: 'The real comparison: Ni-Fe versus Fi-Ne',
        body: [
          'INFJ usually points toward introverted intuition supported by extraverted feeling. INFP usually points toward introverted feeling supported by extraverted intuition.',
          'Both patterns can care deeply, but they organize experience differently. Ni-Fe tends to converge on a pattern and translate it relationally. Fi-Ne tends to protect inner meaning and explore possibilities around it.',
        ],
        table: {
          headers: ['Question', 'INFJ-like Ni-Fe', 'INFP-like Fi-Ne'],
          rows: [
            ['What comes first?', 'A converging pattern or future implication', 'A felt sense of personal truth or value'],
            ['How does care show up?', 'Reading relational atmosphere and adjusting communication', 'Protecting authenticity and inner alignment'],
            ['What creates stress?', 'Concrete limits, sensory overwhelm, or loss of groundedness', 'External demands, efficiency pressure, or being forced to systematize'],
          ],
        },
      },
      {
        heading: 'Why a normal quiz may not settle it',
        body: [
          'Many quizzes ask whether you are organized, emotional, creative, or introverted. Those answers can shift with age, work, relationships, and stress.',
          'A better INFJ vs INFP test looks for the order of attention: whether insight narrows toward one symbolic pattern or value opens into many possible meanings.',
        ],
      },
      {
        heading: 'Use TypeJung as the next check',
        body: [
          'Take the free assessment, then compare your strongest intuition and feeling signals, attitude direction, and likely inferior-function pressure. The result will not force certainty too quickly, but it gives a clearer map than a label-only quiz.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can TypeJung tell me if I am INFJ or INFP?',
        answer: 'TypeJung gives a likely type pattern and function map. Use it to compare Ni-Fe and Fi-Ne evidence instead of treating any test as final identity.',
      },
      {
        question: 'Why do INFJ and INFP get confused?',
        answer: 'They can share interests, sensitivity, introversion, and idealism. The difference is usually the function process underneath the behavior.',
      },
      {
        question: 'Is this INFJ vs INFP test free?',
        answer: 'The core 42-question TypeJung assessment is free. Deeper reports are optional one-time CAD upgrades.',
      },
    ],
    relatedLinks: [
      { href: '/assessment', label: 'Take the free assessment' },
      { href: '/blog/infj-vs-infp-cognitive-functions', label: 'INFJ vs INFP guide' },
      { href: '/functions/ni', label: 'Introverted Intuition' },
      { href: '/functions/fi', label: 'Introverted Feeling' },
      { href: '/types/infj', label: 'INFJ type guide' },
      { href: '/types/infp', label: 'INFP type guide' },
    ],
  },
  {
    slug: 'intj-vs-intp-test',
    query: 'INTJ vs INTP test',
    title: 'INTJ vs INTP Test - Compare Ni-Te and Ti-Ne | TypeJung',
    description: 'Use TypeJung as an INTJ vs INTP test by comparing Ni-Te and Ti-Ne function evidence instead of stereotypes.',
    keywords: ['INTJ vs INTP test', 'INTJ or INTP', 'Ni Te vs Ti Ne', 'INTJ INTP cognitive functions'],
    eyebrow: 'INTJ vs INTP test',
    h1: 'INTJ vs INTP: compare your thinking pattern',
    intro: [
      'INTJ and INTP are often compared through shallow stereotypes: planner versus procrastinator, strategist versus philosopher, confident versus detached.',
      'TypeJung makes the comparison more useful by looking at the function pattern: Ni-Te for INTJ-like convergence and execution, Ti-Ne for INTP-like precision and possibility testing.',
    ],
    sections: [
      {
        heading: 'The real comparison: Ni-Te versus Ti-Ne',
        body: [
          'An INTJ-like pattern often starts with a strategic read of where things are going, then organizes action around that direction. An INTP-like pattern often starts by refining the internal model, then tests alternate explanations.',
          'Both can be analytical and private. The difference is whether insight tends to converge toward a plan or logic tends to stay open while the model becomes cleaner.',
        ],
        table: {
          headers: ['Question', 'INTJ-like Ni-Te', 'INTP-like Ti-Ne'],
          rows: [
            ['What is satisfying?', 'A clear strategic direction that can be executed', 'A precise model that explains the edge cases'],
            ['What is frustrating?', 'Endless debate without movement', 'Premature execution before the logic is clean'],
            ['What often gets neglected?', 'Present sensory limits and improvisation', 'Relational calibration and social feedback'],
          ],
        },
      },
      {
        heading: 'Why type descriptions are not enough',
        body: [
          'Many INTJ and INTP descriptions overlap around intelligence, independence, skepticism, and systems thinking. That overlap can make a type description feel accurate even when the function order is wrong.',
          'A useful INTJ vs INTP test should ask what your attention does first and what kind of uncertainty bothers you most.',
        ],
      },
      {
        heading: 'Use the TypeJung result as a map',
        body: [
          'Take the free assessment, then compare your thinking and intuition scores, attitude direction, and inferior-function signal. The point is not to win a label. The point is to understand the operating pattern behind the label.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can TypeJung decide INTJ vs INTP for me?',
        answer: 'TypeJung gives a likely type pattern and function evidence. Use it as a structured comparison between Ni-Te and Ti-Ne, not as an unquestionable verdict.',
      },
      {
        question: 'Why do INTJ and INTP get mistyped?',
        answer: 'Both can be analytical, private, and independent. Many tests overfocus on behavior and underfocus on the order of cognition.',
      },
      {
        question: 'Is this INTJ vs INTP test free?',
        answer: 'The core TypeJung assessment is free. Optional paid reports add deeper interpretation after you see the result.',
      },
    ],
    relatedLinks: [
      { href: '/assessment', label: 'Take the free assessment' },
      { href: '/blog/intj-vs-intp-ni-te-vs-ti-ne', label: 'INTJ vs INTP guide' },
      { href: '/functions/ni', label: 'Introverted Intuition' },
      { href: '/functions/ti', label: 'Introverted Thinking' },
      { href: '/types/intj', label: 'INTJ type guide' },
      { href: '/types/intp', label: 'INTP type guide' },
    ],
  },
  ...typeComparisonLandingPages,
  {
    slug: 'mbti-mistype-test',
    query: 'MBTI mistype test',
    title: 'MBTI Mistype Test - Check Function Evidence Before Your Type | TypeJung',
    description: 'Use TypeJung as an MBTI mistype test when your type result keeps changing or two labels both feel partly true.',
    keywords: ['MBTI mistype test', 'am I mistyped MBTI', 'mistyped MBTI test', 'personality type mistype test', 'cognitive functions mistype test'],
    eyebrow: 'MBTI mistype test',
    h1: 'Think you were mistyped? Test the function pattern underneath',
    intro: [
      'A mistype usually does not get solved by reading more type stereotypes. If two or three labels keep competing, the useful question is what function pattern is actually showing up.',
      'TypeJung maps all 8 cognitive functions first, then shows a likely type pattern, dominant-inferior axis, and stress edge before any paid report.',
    ],
    intent: {
      bestFor: 'People who suspect an MBTI mistype, keep getting different labels, or are comparing nearby types that both feel partly accurate.',
      measures: 'All 8 cognitive functions, likely type pattern, dominant and support signals, answer consistency, attitude direction, and inferior-function pressure.',
      privacy: 'The core mistype check is free. Paid Insight and Mastery reports are optional after you see whether the map feels useful.',
    },
    sections: [
      {
        heading: 'Why MBTI mistypes happen',
        body: [
          'Many MBTI-style tests reduce a complex pattern into four letter choices. That can work for broad sorting, but it becomes unstable when your scores are close, your role changes, or your answers come from stress.',
          'Mistypes also happen because nearby types can look similar from the outside. INFJ and INFP can both seem introspective and idealistic; INTJ and INTP can both seem analytical and private. The difference usually sits in function order.',
        ],
        bullets: [
          'A work role can make one behavior look stronger than it is',
          'Stress can make an inferior function feel louder than usual',
          'Close letter scores can flip the type label without changing the deeper pattern',
          'Type descriptions can feel true because they mix traits, values, and habits together',
        ],
      },
      {
        heading: 'What a useful mistype test should compare',
        body: [
          'A better mistype test compares the process behind the label. It should ask what leads your attention, what supports it, what becomes awkward under pressure, and whether the result holds together as a whole map.',
        ],
        table: {
          headers: ['Evidence to inspect', 'Why it matters', 'TypeJung path'],
          rows: [
            ['Dominant signal', 'The leading function should explain your most trusted mode of attention or judgment', 'The free map estimates the likely dominant function from scenario evidence'],
            ['Support function', 'Many mistypes happen when the auxiliary is guessed from stereotype instead of pattern', 'The result compares the function stack instead of treating one score as the whole answer'],
            ['Inferior edge', 'Stress often reveals the opposite pole of the pattern more clearly than normal behavior', 'TypeJung highlights the dominant-inferior axis and stress pressure'],
            ['Answer consistency', 'A shaky result should be read as a hypothesis, not a verdict', 'The result includes a consistency signal so you know how firmly to read the map'],
          ],
        },
      },
      {
        heading: 'Common mistype comparisons',
        body: [
          'If you already have two likely labels in mind, compare the specific pair after taking the free assessment. These pages explain the most common function differences behind nearby type results.',
        ],
        links: [
          { href: '/infj-vs-infp-test', label: 'INFJ vs INFP mistype check' },
          { href: '/intj-vs-intp-test', label: 'INTJ vs INTP mistype check' },
          { href: '/enfp-vs-entp-test', label: 'ENFP vs ENTP mistype check' },
          { href: '/isfj-vs-infj-test', label: 'ISFJ vs INFJ mistype check' },
          { href: '/mistype-investigator-alternative', label: 'Mistype Investigator alternative' },
        ],
      },
      {
        heading: 'Start with the free function map',
        body: [
          'Take the free TypeJung assessment first. Use the result to compare the function evidence behind your suspected type, then decide whether a deeper report is useful after the map earns your trust.',
        ],
        links: [
          { href: '/assessment', label: 'Start the free MBTI mistype test' },
          { href: '/mbti-keeps-changing', label: 'Why your MBTI keeps changing' },
          { href: '/sample-report', label: 'Preview the optional Insight report' },
          { href: '/pricing', label: 'Compare Free, Insight, and Mastery' },
        ],
      },
    ],
    faqs: [
      {
        question: 'Can TypeJung prove my true MBTI type?',
        answer: 'No test should be treated as final proof. TypeJung gives a likely function-stack map and type pattern so you can inspect the evidence behind a possible mistype.',
      },
      {
        question: 'How do I know if I was mistyped?',
        answer: 'Look for repeated mismatch between the type label and your function pattern: what leads, what supports it, what gets pressured under stress, and which nearby type explains the whole map better.',
      },
      {
        question: 'Is this MBTI mistype test free?',
        answer: 'Yes. The 42-question TypeJung assessment and core function-stack map are free. Paid reports are optional after you see the result.',
      },
    ],
    relatedLinks: [
      { href: '/assessment', label: 'Take the free assessment' },
      { href: '/mistype-investigator-alternative', label: 'Mistype Investigator alternative' },
      { href: '/mbti-keeps-changing', label: 'Why your MBTI keeps changing' },
      { href: '/infj-vs-infp-test', label: 'INFJ vs INFP test' },
      { href: '/intj-vs-intp-test', label: 'INTJ vs INTP test' },
      { href: '/cognitive-function-test', label: 'Cognitive function test' },
      { href: '/sample-report', label: 'View sample report' },
    ],
  },
  {
    slug: 'mbti-keeps-changing',
    query: 'why does my MBTI keep changing',
    title: 'Why Does My MBTI Keep Changing? Take a Function-Based Test | TypeJung',
    description: 'If your MBTI type keeps changing, TypeJung can help you compare the cognitive function pattern behind shifting labels.',
    keywords: ['why does my MBTI keep changing', 'MBTI keeps changing', 'changing MBTI results', 'function based MBTI test'],
    eyebrow: 'Changing MBTI results',
    h1: 'If your MBTI keeps changing, test the pattern underneath',
    intro: [
      'Getting INFJ one month, INFP the next, and ENFP after that does not always mean your personality changed. It may mean the test is measuring mood, role, or self-image.',
      'TypeJung gives you a function map so you can inspect what stays stable beneath changing four-letter results.',
    ],
    sections: [
      {
        heading: 'Why results shift',
        body: [
          'Many MBTI-style quizzes mix behavior, identity, work role, social confidence, stress state, and preference into the same score. When your context changes, the answer pattern can change.',
          'Close scores also make labels unstable. A small wording change can push someone across a letter boundary even if the underlying function profile is similar.',
        ],
        bullets: [
          'Stress can make you answer from a defensive pattern',
          'Work and relationship roles can change visible behavior',
          'Binary letter scoring hides close or mixed function signals',
          'A label can change while the deeper energy pattern remains recognizable',
        ],
      },
      {
        heading: 'What to test instead',
        body: [
          'Instead of chasing the perfect four-letter label, compare the function evidence. Which kinds of perception feel natural? Which judging mode feels trusted? Which inferior-function pressure appears under stress?',
          'A function-based map gives you more to work with than a single unstable type code.',
        ],
      },
      {
        heading: 'Use TypeJung when the label is not enough',
        body: [
          'The free assessment shows a function-stack map and likely type pattern. If the map feels accurate, optional Insight and Mastery reports add deeper stress, relationship, and growth interpretation.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Does changing MBTI mean my personality changed?',
        answer: 'Not necessarily. It often means the test is sensitive to context, mood, wording, or close scores.',
      },
      {
        question: 'Can cognitive functions explain changing results?',
        answer: 'Yes. A function profile can show why nearby type labels compete and where the underlying pattern is more stable.',
      },
      {
        question: 'What should I do if every test gives a different type?',
        answer: 'Stop comparing labels for a moment. Compare the function pattern, stress edge, and dominant-inferior axis instead.',
      },
    ],
    relatedLinks: [
      { href: '/assessment', label: 'Take the free assessment' },
      { href: '/blog/why-mbti-type-keeps-changing', label: 'Read the full guide' },
      { href: '/mbti-alternative', label: 'MBTI alternative' },
      { href: '/cognitive-function-test', label: 'Cognitive function test' },
    ],
  },
  {
    slug: 'jungian-cognitive-functions-test',
    query: 'Jungian cognitive functions test',
    title: 'Jungian Cognitive Functions Test - Free Ni Ne Si Se Ti Te Fi Fe Map | TypeJung',
    description: 'Take a free 42-question Jungian cognitive functions test that maps Ni, Ne, Si, Se, Ti, Te, Fi, and Fe, then shows your function stack and dominant-inferior pattern.',
    keywords: ['Jungian cognitive functions test', 'free Jungian cognitive functions test', 'Jung functions test', 'Ni Ne Si Se Ti Te Fi Fe test', 'Jungian function stack test', 'cognitive function test'],
    eyebrow: 'Jungian functions test',
    h1: 'Free Jungian cognitive functions test',
    intro: [
      'Explore how you take in the world, make decisions, and respond to stress. Answer 42 real-life questions and receive your free cognitive-function map. Allow 20 to 25 minutes; your progress saves on this device.',
      'No signup or payment is required to read your core result. The optional Insight report adds ten AI-generated interpretation sections for CA$7, paid once. Read the sample before you decide.',
    ],
    intent: {
      bestFor: 'People searching specifically for a Jungian cognitive functions test, function stack test, or full Ni Ne Si Se Ti Te Fi Fe assessment.',
      measures: 'Four function channels and attention direction, combined into a derived eight-function map and a suggested stack.',
      privacy: 'Use the free function-stack map first. Paid interpretation is optional and should only be used if the map feels accurate.',
    },
    sections: [
      {
        heading: 'What your free map can tell you',
        body: [
          'TypeJung scores four function channels and attention direction, then derives the eight displayed function-attitudes. Those eight values are not independent psychological measurements.',
          'Use your suggested stack to explore everyday strengths and less familiar patterns under pressure. Read the result as a working interpretation of your answers, with room for uncertainty and examples that do not fit.',
        ],
        table: {
          headers: ['Explore', 'What you receive', 'How to use it'],
          rows: [
            ['Jungian cognitive functions test', 'A free 42-question map of all 8 function-attitudes', 'A starting point for observing your habits'],
            ['Ni Ne Si Se Ti Te Fi Fe test', 'Derived values for each function-attitude', 'Lets you see whether the result is differentiated or close'],
            ['Jungian function stack test', 'A likely dominant, auxiliary, tertiary, and inferior pattern', 'Turns the score profile into a readable stack hypothesis'],
            ['Free cognitive function test', 'A no-card result before optional paid interpretation', 'Decide whether a deeper report would help'],
          ],
        },
        links: [
          { href: '/assessment', label: 'Start the free 42-question Jungian cognitive functions test' },
          { href: '/free-cognitive-function-test', label: 'Compare the free cognitive function test page' },
          { href: '/function-stack-test', label: 'Read the function stack test guide' },
        ],
      },
      {
        heading: 'Start from your everyday experience',
        body: [
          'Choose the answer closest to what actually happens in your life. There is a none option when a question misses you, and you can review previous answers before finishing.',
          'The questions cover behavior, stress, body cues, and attention direction. You work through one question at a time and can pause whenever you need.',
        ],
        bullets: [
          'All 8 function-attitudes: Ni, Ne, Si, Se, Ti, Te, Fi, and Fe',
          'Thinking and feeling as judging functions',
          'Sensation and intuition as perceiving functions',
          'Likely dominant, auxiliary, tertiary, and inferior pattern interpretation',
          'Free core result before any optional paid report',
        ],
        links: [
          { href: '/assessment', label: 'Start the free Jungian cognitive functions test' },
          { href: '/jungian-typology', label: 'Read the Jungian typology guide' },
          { href: '/cognitive-functions', label: 'Read the guide to all 8 Jungian cognitive functions' },
        ],
      },
      {
        heading: 'What the free result includes',
        body: [
          'The free result gives you the main function-stack map and likely function pattern. It is enough to start comparing your type hypothesis against real self-observation.',
          'Paid reports are optional and add deeper interpretation only after you have seen the function-stack map and decided that the result is useful.',
        ],
        bullets: [
          'Relative scores for all 8 function-attitudes',
          'A likely type pattern with room for close alternatives',
          'A dominant-inferior axis for growth and stress reflection',
          'Clear next links into function, type, and stress-pattern guides',
        ],
      },
      {
        heading: 'The 8 Jungian functions covered by the test',
        body: [
          'The test separates perceiving functions from judging functions and keeps introverted and extraverted attitudes distinct. This is the part many short type quizzes blur.',
        ],
        bullets: [
          'Ni and Ne: pattern insight, future meaning, and possibility scanning',
          'Si and Se: memory, continuity, present contact, and concrete experience',
          'Ti and Te: internal logic, precision, execution, and external structure',
          'Fi and Fe: personal values, authenticity, relational tone, and shared values',
        ],
        links: [
          { href: '/cognitive-function-test', label: 'Compare the broader cognitive function test page' },
          { href: '/functions/ni', label: 'Read the Introverted Intuition guide' },
          { href: '/functions/ti', label: 'Read the Introverted Thinking guide' },
        ],
      },
      {
        heading: 'Function stack versus function profile',
        body: [
          'A function stack is a theory-based interpretation of how functions tend to organize in a type. A TypeJung function profile is a derived interpretation of the scored answer channels. The two should inform each other, but they are not the same thing.',
          'TypeJung starts with the profile, then interprets likely stack patterns. That makes it easier to notice when a type code is plausible but not yet certain.',
        ],
        table: {
          headers: ['Concept', 'What it means', 'How TypeJung uses it'],
          rows: [
            ['Function profile', 'The score shape across all 8 functions', 'Shows the derived function-attitude pattern'],
            ['Function stack', 'A model of dominant, auxiliary, tertiary, and inferior positions', 'Helps interpret the score shape'],
            ['Dominant-inferior axis', 'The tension between the most trusted and least conscious poles', 'Frames stress and development'],
          ],
        },
      },
      {
        heading: 'How to use the output',
        body: [
          'Read the highest function as a hypothesis about what your ego trusts. Read the lowest or inferior signal as a place to observe stress, reaction, attraction, and developmental tension. Then retake later to see whether the map becomes more flexible.',
          'If two type patterns are close, compare the function evidence rather than forcing certainty. The goal is a useful self-observation map, not a rigid identity.',
        ],
        links: [
          { href: '/assessment', label: 'Take the free Jungian cognitive functions test' },
          { href: '/inferior-function-test', label: 'Understand your inferior function' },
          { href: '/mbti-alternative', label: 'Compare TypeJung as an MBTI alternative' },
        ],
      },
    ],
    faqs: [
      {
        question: 'What is a Jungian cognitive functions test?',
        answer: 'A Jungian cognitive functions test maps self-reported patterns around the function-attitudes behind type: Ni, Ne, Si, Se, Ti, Te, Fi, and Fe. The goal is to show a pattern, not only a type code.',
      },
      {
        question: 'Does TypeJung test all 8 Jungian cognitive functions?',
        answer: 'Yes. It maps Ni, Ne, Si, Se, Ti, Te, Fi, and Fe as a self-report profile rather than relying only on broad dichotomies.',
      },
      {
        question: 'Is this different from an MBTI test?',
        answer: 'Yes. TypeJung can support a likely type pattern, but the function map is the main output.',
      },
      {
        question: 'Can I take the Jungian cognitive functions test without paying?',
        answer: 'Yes. The 42-question assessment and function-stack map are free. Insight and Mastery are optional one-time CAD upgrades.',
      },
    ],
    relatedLinks: [
      { href: '/assessment', label: 'Take the free Jungian cognitive functions test' },
      { href: '/cognitive-function-test', label: 'Cognitive function test' },
      { href: '/cognitive-functions', label: 'Jungian cognitive functions guide' },
      { href: '/jungian-typology', label: 'Jungian typology guide' },
      { href: '/inferior-function-test', label: 'Inferior function test' },
    ],
  },
  {
    slug: 'jungian-typology',
    query: 'Jungian typology',
    title: 'Jungian Typology Guide - Functions, Type, and Self-Reflection | TypeJung',
    description: 'Learn Jungian typology through cognitive functions, attitude direction, dominant-inferior patterns, and practical self-reflection.',
    keywords: ['Jungian typology', 'Jung psychological types', 'Jungian personality types', 'Jungian functions'],
    eyebrow: 'Jungian typology',
    h1: 'A practical guide to Jungian typology',
    intro: [
      'Jungian typology is a way to understand the patterns behind attention, judgment, stress, and development. It is deeper than a label because it asks which mental functions carry the most energy and which parts of the psyche remain less conscious.',
      'TypeJung turns that model into a free assessment and a set of readable guides so you can compare your own pattern with the theory.',
    ],
    sections: [
      {
        heading: 'The core idea behind Jungian type',
        body: [
          'Carl Jung described type through two attitudes, introversion and extraversion, and four psychological functions: thinking, feeling, sensation, and intuition. Modern cognitive-function language combines those into eight function-attitudes.',
          'That means a useful Jungian typology result should explain more than whether someone is introverted or intuitive. It should show how attention and judgment actually organize themselves.',
        ],
        bullets: [
          'Introverted and extraverted attitudes describe the direction of energy',
          'Thinking and feeling describe judging or evaluation',
          'Sensation and intuition describe perception or information gathering',
          'The dominant-inferior axis often reveals the clearest growth tension',
        ],
      },
      {
        heading: 'Why TypeJung starts with the function-stack map',
        body: [
          'A four-letter type can be useful shorthand, but it can also flatten the person. TypeJung starts with a function-stack map because the relative pattern between functions usually explains more than a single label.',
          'After the assessment, you can compare your strongest channels, likely type pattern, and inferior-function pressure before deciding whether you want a deeper paid report.',
        ],
      },
      {
        heading: 'How to study your result',
        body: [
          'Read the top function as a hypothesis about what your ego trusts most. Read the inferior function as a place where pressure, attraction, avoidance, or overreaction may show up. Then use the result as observation, not identity.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is Jungian typology the same as MBTI?',
        answer: 'No. MBTI popularized four-letter type language, but Jungian typology begins with psychological functions and attitude direction.',
      },
      {
        question: 'What is the most important part of Jungian typology?',
        answer: 'The dominant-inferior relationship is often the most useful because it shows both a strength and a likely developmental edge.',
      },
      {
        question: 'Can TypeJung tell me my exact type?',
        answer: 'TypeJung gives a likely type pattern and a function map. Treat it as a structured self-observation tool, not a final identity label.',
      },
    ],
    relatedLinks: [
      { href: '/assessment', label: 'Take the free assessment' },
      { href: '/cognitive-functions', label: 'Learn the cognitive functions' },
      { href: '/jungian-test', label: 'Jungian test' },
      { href: '/inferior-function-test', label: 'Inferior function test' },
    ],
  },
  {
    slug: 'cognitive-functions',
    query: 'Jungian cognitive functions',
    title: 'Jungian Cognitive Functions Guide - Ni Ne Si Se Ti Te Fi Fe | TypeJung',
    description: 'Understand the 8 Jungian cognitive functions: Ni, Ne, Si, Se, Ti, Te, Fi, and Fe, plus how they shape type and stress patterns.',
    keywords: ['Jungian cognitive functions', '8 cognitive functions', 'Ni Ne Si Se Ti Te Fi Fe', 'cognitive functions guide'],
    eyebrow: 'Cognitive functions',
    h1: 'Understand the 8 Jungian cognitive functions',
    intro: [
      'The 8 cognitive functions are the working parts behind Jungian type. They describe how attention gathers information and how judgment makes decisions.',
      'TypeJung maps these functions through a 42-question self-report assessment, then turns the scores into a function-stack map, likely type pattern, and educational self-reflection.',
    ],
    sections: [
      {
        heading: 'The four perceiving functions',
        body: [
          'Perceiving functions describe how information enters awareness. Intuition looks for pattern and possibility. Sensing stays closer to concrete reality, memory, and present experience.',
        ],
        bullets: [
          'Ni: convergent pattern insight, symbolic meaning, future orientation',
          'Ne: possibilities, alternatives, associations, and divergent ideas',
          'Si: memory, continuity, precedent, and experience-based comparison',
          'Se: direct contact with the present, action, and sensory detail',
        ],
      },
      {
        heading: 'The four judging functions',
        body: [
          'Judging functions describe how decisions are organized. Thinking evaluates through logic and structure. Feeling evaluates through value, relationship, and meaning.',
        ],
        bullets: [
          'Ti: internal precision, categories, and logical models',
          'Te: external order, measurable outcomes, and execution',
          'Fi: personal value, authenticity, and inner alignment',
          'Fe: shared value, emotional tone, and relational coordination',
        ],
      },
      {
        heading: 'Functions are more useful in relationship',
        body: [
          'A single high score can be interesting, but the pattern matters more. Dominant and auxiliary functions usually feel more available. Inferior-function material often appears through stress, attraction, projection, or sudden overreaction.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What are the 8 Jungian cognitive functions?',
        answer: 'The 8 functions are Ni, Ne, Si, Se, Ti, Te, Fi, and Fe. They combine Jung\'s four functions with introverted and extraverted attitudes.',
      },
      {
        question: 'Can I have more than one strong cognitive function?',
        answer: 'Yes. TypeJung scores functions as a profile, so nearby functions can both be meaningful instead of forcing one winner too quickly.',
      },
      {
        question: 'How do cognitive functions relate to MBTI types?',
        answer: 'A four-letter type can be interpreted as a likely function stack, but TypeJung starts with the function evidence before interpreting the type pattern.',
      },
    ],
    relatedLinks: [
      { href: '/cognitive-function-test', label: 'Take the cognitive function test' },
      { href: '/jungian-cognitive-functions-test', label: 'Jungian cognitive functions test' },
      { href: '/functions/ni', label: 'Introverted Intuition' },
      { href: '/functions/fe', label: 'Extraverted Feeling' },
      { href: '/jungian-typology', label: 'Jungian typology guide' },
    ],
  },
  {
    slug: 'shadow-work-test',
    query: 'shadow work test',
    title: 'Shadow Work Test - Jungian Self-Observation Patterns | TypeJung',
    description: 'Use a Jungian self-observation test to explore inferior-function pressure and stress reactions without clinical diagnosis.',
    keywords: ['shadow work test', 'Jungian shadow test', 'shadow work questions', 'inferior function shadow'],
    eyebrow: 'Shadow work test',
    h1: 'A Jungian shadow work test for self-observation',
    intro: [
      'Shadow work is not about finding a villain inside yourself. In Jungian language, it starts by noticing what the ego avoids, disowns, overreacts to, or projects onto other people.',
      'TypeJung approaches shadow-language carefully through cognitive-function patterns, especially the inferior-function edge where stress and self-observation often meet.',
    ],
    sections: [
      {
        heading: 'What a shadow work test can and cannot do',
        body: [
          'A self-assessment can give language for observation. It cannot diagnose trauma, anxiety, depression, or any mental health condition. The safest use is reflective: notice the pattern, test it against real life, and slow down before making it your identity.',
        ],
        bullets: [
          'Use the result as a starting hypothesis',
          'Notice where stress creates overreaction or avoidance',
          'Look for repeated reactions and relationship patterns',
          'Work with a qualified professional for severe or persistent distress',
        ],
      },
      {
        heading: 'Why TypeJung connects shadow work to the inferior function',
        body: [
          'The inferior function often marks the least conscious side of the dominant pattern. When pressure rises, that function can feel awkward, compulsive, or surprisingly intense.',
          'Mapping the dominant-inferior axis gives you a practical way to ask: what am I overusing, and what am I neglecting?',
        ],
      },
      {
        heading: 'How to use the result',
        body: [
          'After the assessment, read the inferior-function section first. Then watch for moments when the same theme appears in stress, conflict, envy, attraction, or body tension. That is where reflection becomes useful.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is TypeJung a clinical shadow work test?',
        answer: 'No. TypeJung is an educational self-exploration tool. It is not therapy, diagnosis, or medical advice.',
      },
      {
        question: 'What is the Jungian shadow?',
        answer: 'The shadow refers to parts of the psyche that are less conscious, disowned, avoided, or projected. In TypeJung, inferior-function pressure is one practical entry point.',
      },
      {
        question: 'Can shadow work be uncomfortable?',
        answer: 'Yes. If reflection feels overwhelming or destabilizing, pause and work with a qualified professional rather than forcing the process alone.',
      },
    ],
    relatedLinks: [
      { href: '/assessment', label: 'Take the free assessment' },
      { href: '/inferior-function-test', label: 'Inferior function test' },
      { href: '/blog/understanding-the-grip', label: 'Understand the grip' },
      { href: '/pricing', label: 'See one-time pricing' },
    ],
  },
  {
    slug: 'why-do-i-get-different-mbti-results',
    query: 'why do I get different MBTI results',
    title: 'Why Do I Get Different MBTI Results? | TypeJung',
    description: 'Different MBTI results usually mean the test read your behaviour, not your function stack. Map all 8 cognitive functions to see the stable pattern underneath.',
    keywords: ['why do I get different MBTI results', 'MBTI result keeps changing', 'different personality test results', 'mistype cognitive functions'],
    eyebrow: 'Why results change',
    h1: 'Why do I get different MBTI results?',
    intro: [
      'Taking the same kind of test twice and getting INFJ, then INFP, then INTJ is one of the most common typology experiences. It usually is not a sign that you do not know yourself.',
      'Letter-first tests measure surface behaviour, which shifts with mood, context, and how you read each question. The function stack underneath tends to be more stable, which is what TypeJung tries to map.',
    ],
    saveLink: {
      title: 'Email yourself the free map path',
      body: 'Send yourself the free assessment link and TYPEJUNG30 code. Map the function pattern first, then decide whether a deeper read is worth it.',
      button: 'Email the free map path',
      tier: 'insight',
    },
    intent: {
      bestFor: 'People who keep getting different four-letter results and want to find the stable pattern underneath the labels.',
      measures: 'All 8 Jungian function-attitudes, likely function-stack order, dominant-inferior axis, attitude direction, and an answer-consistency signal.',
      privacy: 'The free function-stack map requires no card. Paid reports are optional one-time CAD upgrades after the result is visible.',
    },
    sections: [
      {
        heading: 'Why the letters move but the pattern often does not',
        body: [
          'A four-letter result is a summary, and summaries are easy to flip. Answer a few "judging" questions in a tidy week versus a chaotic one and J can become P, even though nothing fundamental about you changed.',
          'Cognitive functions describe the order in which you actually process attention and decisions: what you notice first, how you judge, and what shows up under stress. That order is harder to fake from mood alone, so it is a steadier reference point.',
        ],
        bullets: [
          'Letter tests reward how you answer today; function order reflects a repeatable pattern',
          'Two "nearby" types can share visible behaviour but use different function stacks',
          'A result that swaps between adjacent types is a signal to look at functions, not retake the same test',
        ],
        links: [
          { href: '/assessment', label: 'Map your function stack for free' },
          { href: '/cognitive-function-test', label: 'What a cognitive function test measures' },
        ],
      },
      {
        heading: 'A worked example: INFJ vs INFP',
        body: [
          'These two look almost identical from the outside — both reflective, values-driven, and private. The difference is in the stack, not the vibe.',
          'INFJ leads with introverted intuition (Ni) supported by extraverted feeling (Fe): pattern first, then relational impact. INFP leads with introverted feeling (Fi) supported by extraverted intuition (Ne): personal value first, then branching possibilities. A test that only sees "quiet and idealistic" can land on either.',
        ],
        table: {
          headers: ['Signal', 'INFJ (Ni-Fe-Ti-Se)', 'INFP (Fi-Ne-Si-Te)'],
          rows: [
            ['Starts from', 'A converging pattern or read of the situation', 'A personal value judgment about it'],
            ['Stress edge', 'Inferior Se: overwhelm, sensory excess, impulsive release', 'Inferior Te: harsh external control, blunt logic, list-making'],
            ['Looks similar because', 'Both are introverted, future-leaning, and values-aware', 'Both dislike rigid systems and value authenticity'],
          ],
        },
        links: [
          { href: '/infj-vs-infp-test', label: 'INFJ vs INFP function comparison' },
          { href: '/am-i-infj-or-infp', label: 'Am I INFJ or INFP?' },
        ],
      },
      {
        heading: 'What to do instead of retaking another letter test',
        body: [
          'Map the functions once, then read the dominant-inferior axis and the reliability signal. If the signal is low or two functions are close, treat the result as a working hypothesis and inspect the evidence rather than collecting another label.',
          'TypeJung keeps all eight functions visible for exactly this reason: when nearby types blur, you can see which signals are close instead of being handed a single letter code.',
        ],
        links: [
          { href: '/sample-report', label: 'See what the deeper read adds' },
          { href: '/debrief', label: 'Get a human second read if you are still stuck' },
        ],
      },
    ],
    faqs: [
      {
        question: 'Does a changing MBTI result mean the test is wrong?',
        answer: 'Not exactly. Letter-first tests measure behaviour that shifts with context, so the result moves. Mapping the function stack gives a steadier reference point.',
      },
      {
        question: 'Will TypeJung give me a fixed type?',
        answer: 'TypeJung shows a likely function-stack pattern and a reliability signal. It is designed to be inspected as a hypothesis, not treated as a final identity claim.',
      },
      {
        question: 'Is the function-stack map free?',
        answer: 'Yes. The 42-question assessment and the all-8-function map are free. Insight and Mastery are optional one-time CAD upgrades.',
      },
    ],
    relatedLinks: [
      { href: '/assessment', label: 'Take the free assessment' },
      { href: '/mbti-keeps-changing', label: 'Why MBTI keeps changing' },
      { href: '/cognitive-function-test', label: 'Cognitive function test' },
      { href: '/sample-report', label: 'View sample report' },
    ],
  },
  {
    slug: 'am-i-infj-or-infp',
    query: 'am I INFJ or INFP',
    title: 'Am I INFJ or INFP? Read the Function Stack | TypeJung',
    description: 'Stuck between INFJ and INFP? The difference is Ni-Fe vs Fi-Ne, not who is more emotional. Map your function stack free and see which pattern fits.',
    keywords: ['am I INFJ or INFP', 'INFJ or INFP', 'INFJ vs INFP which am I', 'INFP INFJ mistype'],
    eyebrow: 'Stuck between two types',
    h1: 'Am I INFJ or INFP?',
    intro: [
      'INFJ and INFP is the most common "stuck between two types" pair, because from the outside they look nearly the same: reflective, idealistic, private, and values-driven.',
      'The decision is not about who is more emotional or more organized. It is about which judging function leads — extraverted feeling (Fe) for INFJ or introverted feeling (Fi) for INFP — and which perceiving function pairs with it.',
    ],
    saveLink: {
      title: 'Email yourself the comparison path',
      body: 'Send yourself the free assessment link and TYPEJUNG30 code, then compare your own stack against both types before deciding.',
      button: 'Email the comparison path',
      tier: 'insight',
    },
    intent: {
      bestFor: 'People deciding between INFJ and INFP who want a function-level answer instead of another vibe-based quiz.',
      measures: 'Whether judgment starts from relational impact (Fe) or personal value (Fi), the perceiving pair (Ni vs Ne), the dominant-inferior axis, and a reliability signal.',
      privacy: 'The free map requires no card. Optional paid reports come after you can see the result.',
    },
    sections: [
      {
        heading: 'The real fork: Fe-first or Fi-first',
        body: [
          'INFJ leads with introverted intuition (Ni) and judges with extraverted feeling (Fe). Decisions tend to start from a read of the shared emotional field: what keeps the group or relationship coherent.',
          'INFP leads with introverted feeling (Fi) and perceives with extraverted intuition (Ne). Decisions tend to start from an internal value check — does this fit who I am — and then branch outward into possibilities.',
        ],
        bullets: [
          'Ask: in conflict, do you first sense the relational temperature (Fe) or check it against your personal values (Fi)?',
          'Ask: do your ideas converge toward one read (Ni) or branch into many tangents (Ne)?',
          'Ask: under stress, do you overdo sensory escape (inferior Se) or get harsh and controlling with logic (inferior Te)?',
        ],
      },
      {
        heading: 'Why quizzes keep flip-flopping you',
        body: [
          'Most quizzes score adjectives — "sensitive," "creative," "deep" — that both types share, so a small change in mood tips the result. Function-based mapping looks at process order, which is steadier.',
          'If your result keeps alternating between INFJ and INFP, that alternation is itself information: it usually means the judging axis (Fe vs Fi) was not clearly captured.',
        ],
        table: {
          headers: ['Under stress', 'INFJ — inferior Se', 'INFP — inferior Te'],
          rows: [
            ['Looks like', 'Sensory overload, impulsive indulgence, sudden physical focus', 'Cold, blunt logic, aggressive list-making, harsh efficiency'],
            ['Inner experience', 'Loss of the usual long-range vision', 'Loss of the usual gentle value-led tone'],
          ],
        },
        links: [
          { href: '/inferior-function-test', label: 'Find your inferior function' },
          { href: '/infj-vs-infp-test', label: 'Full INFJ vs INFP comparison' },
        ],
      },
      {
        heading: 'Get a function-level answer',
        body: [
          'Rather than re-reading type descriptions, map your stack once and look at whether Fe or Fi sits higher, and whether Ni or Ne is your perceiving lead. TypeJung shows all eight functions so the close call is visible.',
          'If the map is interesting but still feels 50/50, that is exactly the case a human second read is built for.',
        ],
        links: [
          { href: '/assessment', label: 'Map my stack free' },
          { href: '/debrief', label: 'Get a Personal Type Debrief' },
        ],
      },
    ],
    faqs: [
      {
        question: 'Is INFJ just more organized than INFP?',
        answer: 'No. That is a common myth. The difference is the function stack: Ni-Fe versus Fi-Ne, not tidiness or emotional intensity.',
      },
      {
        question: 'What if my result is balanced between the two?',
        answer: 'TypeJung reports a balanced or low-confidence result as a working hypothesis rather than forcing a winner. The dominant-inferior axis and stress edge are the best tiebreakers.',
      },
      {
        question: 'Can I get a person to help me decide?',
        answer: 'Yes. The optional Personal Type Debrief is a founder-reviewed read of your map, likely mistypes, and stress edge, delivered within 72 hours.',
      },
    ],
    relatedLinks: [
      { href: '/assessment', label: 'Take the free assessment' },
      { href: '/infj-vs-infp-test', label: 'INFJ vs INFP test' },
      { href: '/debrief', label: 'Personal Type Debrief' },
      { href: '/why-do-i-get-different-mbti-results', label: 'Why results keep changing' },
    ],
  },
  {
    slug: 'mbti-changes-with-mood',
    query: 'MBTI changes depending on mood',
    title: 'Does MBTI Change With Your Mood? | TypeJung',
    description: 'If your MBTI result changes with your mood, you are measuring state, not type. Map the function stack underneath to find the pattern that stays put.',
    keywords: ['MBTI changes with mood', 'personality test changes depending on mood', 'MBTI state vs trait', 'why my type changes when sad'],
    eyebrow: 'State vs pattern',
    h1: 'Does your MBTI change with your mood?',
    intro: [
      'A lot of people notice they test as one type when calm and energized, and another when tired, low, or stressed. That is real — but it usually reflects your current state, not a change in your underlying type.',
      'Cognitive functions give a way to separate the two: the order of your functions stays relatively stable, while which ones are loud or quiet shifts with mood and stress.',
    ],
    saveLink: {
      title: 'Email yourself the free map path',
      body: 'Send yourself the free assessment link and TYPEJUNG30 code, then take it on a neutral day to read the steadier pattern.',
      button: 'Email the free map path',
      tier: 'insight',
    },
    intent: {
      bestFor: 'People whose result swings with mood and who want to tell state apart from a stable function pattern.',
      measures: 'Function-stack order, dominant-inferior axis, an inferior-function stress signal, and an answer-consistency score that flags low-confidence results.',
      privacy: 'Free map, no card required. Optional one-time paid reports after the result is visible.',
    },
    sections: [
      {
        heading: 'State versus pattern',
        body: [
          'Mood changes which functions are amplified. When you are stressed, the inferior function gets loud, which can make you answer like a different type entirely — for example a thinker who suddenly answers every emotion question intensely while in the grip.',
          'The function stack is the order, not the volume. Reading the order is how you separate "I am low today" from "this is my type."',
        ],
        bullets: [
          'Mood amplifies the inferior function, which can mimic a different type on a quiz',
          'Function order is steadier than the four-letter summary it produces',
          'A low reliability signal is a cue to retake on a neutral day, not to pick a new label',
        ],
        links: [
          { href: '/assessment', label: 'Map the steadier pattern free' },
          { href: '/inferior-function-test', label: 'See how stress changes your answers' },
        ],
      },
      {
        heading: 'How TypeJung handles a mood-skewed result',
        body: [
          'TypeJung blends four evidence layers — behaviour, inferior-function stress, somatic signals, and attitude direction — and reports a consistency signal. When mood skews your answers, those layers disagree, and the reliability label drops to flag it.',
          'That is more useful than a confident wrong answer: a low signal tells you to read the result as a hypothesis and, if you want, retake it when your baseline is steadier.',
        ],
        table: {
          headers: ['Reliability signal', 'What it suggests', 'What to do'],
          rows: [
            ['High', 'Layers agreed; mood likely did not distort much', 'Read the map with confidence'],
            ['Moderate', 'Some disagreement across layers', 'Treat the stack direction as a working hypothesis'],
            ['Exploratory', 'Layers diverged; possibly mood- or stress-skewed', 'Re-read the evidence, or retake on a neutral day'],
          ],
        },
        links: [
          { href: '/methodology', label: 'How the reliability signal works' },
        ],
      },
    ],
    faqs: [
      {
        question: 'Can stress really change my MBTI result?',
        answer: 'It can change the result of a letter-first test, because stress amplifies your inferior function and changes how you answer. The underlying function order is steadier.',
      },
      {
        question: 'Should I take the test when calm or stressed?',
        answer: 'For the steadiest read, take it on a neutral day. If you take it while stressed, the reliability signal will usually flag the result as lower confidence.',
      },
      {
        question: 'Is the assessment free?',
        answer: 'Yes. The 42-question map is free, with optional one-time CAD upgrades afterward.',
      },
    ],
    relatedLinks: [
      { href: '/assessment', label: 'Take the free assessment' },
      { href: '/mbti-keeps-changing', label: 'Why MBTI keeps changing' },
      { href: '/methodology', label: 'How the map is built' },
      { href: '/why-do-i-get-different-mbti-results', label: 'Why results differ' },
    ],
  },
];
