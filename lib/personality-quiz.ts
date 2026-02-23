// Travel Personality Quiz Data & Logic

export type PersonalityType = 
  | "BookTripy"
  | "CultureTripy"
  | "SocialTripy"
  | "ViewTripy"
  | "FoodTripy"
  | "FlowTripy"
  | "ActionTripy"

export interface PersonalityArchetype {
  id: PersonalityType
  name: string
  emoji: string
  description: string
  traits: string[]
  color: string
}

export const personalityArchetypes: Record<PersonalityType, PersonalityArchetype> = {
  BookTripy: {
    id: "BookTripy",
    name: "BookTripy",
    emoji: "📚",
    description: "Quiet moments, deep conversations, and meaningful connections",
    traits: ["Reflective", "Curious", "Deep thinker", "Quality over quantity"],
    color: "from-amber-500 to-orange-600"
  },
  CultureTripy: {
    id: "CultureTripy",
    name: "CultureTripy",
    emoji: "🏛️",
    description: "Museums, history, and the soul of old towns",
    traits: ["Knowledgeable", "Appreciative", "Patient", "Detail-oriented"],
    color: "from-purple-500 to-indigo-600"
  },
  SocialTripy: {
    id: "SocialTripy",
    name: "SocialTripy",
    emoji: "🍻",
    description: "Bars, meetups, and making friends everywhere",
    traits: ["Outgoing", "Adventurous", "Spontaneous", "People-person"],
    color: "from-pink-500 to-rose-600"
  },
  ViewTripy: {
    id: "ViewTripy",
    name: "ViewTripy",
    emoji: "🌇",
    description: "Epic views, heights, and capturing the moment",
    traits: ["Aesthetic", "Patient", "Early riser", "Photography lover"],
    color: "from-cyan-500 to-blue-600"
  },
  FoodTripy: {
    id: "FoodTripy",
    name: "FoodTripy",
    emoji: "🍜",
    description: "Local food, street eats, and market wandering",
    traits: ["Adventurous eater", "Cultural explorer", "Sensory-driven", "Local-focused"],
    color: "from-orange-500 to-red-600"
  },
  FlowTripy: {
    id: "FlowTripy",
    name: "FlowTripy",
    emoji: "🌊",
    description: "No plans, mood-based, going with the flow",
    traits: ["Flexible", "Present", "Intuitive", "Low-stress"],
    color: "from-teal-500 to-emerald-600"
  },
  ActionTripy: {
    id: "ActionTripy",
    name: "ActionTripy",
    emoji: "🔥",
    description: "Activities, hiking, and pushing boundaries",
    traits: ["Energetic", "Thrill-seeker", "Physically active", "Goal-oriented"],
    color: "from-red-500 to-orange-600"
  }
}

export interface QuizQuestion {
  id: number
  title: string
  scenario: string
  options: {
    text: string
    emoji: string
    scores: Partial<Record<PersonalityType, number>>
  }[]
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    title: "Eiffel Tower Moment",
    scenario: "You're under the Eiffel Tower. What feels right?",
    options: [
      { text: "Go all the way up, I want the full moment", emoji: "🗼", scores: { ViewTripy: 3, ActionTripy: 1 } },
      { text: "Sit under it, read / chill / people-watch", emoji: "📖", scores: { BookTripy: 3, FlowTripy: 1 } },
      { text: "Talk to someone nearby, share the moment", emoji: "☕", scores: { SocialTripy: 3, FlowTripy: 1 } },
      { text: "Walk away, the city is calling me", emoji: "🚶", scores: { FlowTripy: 3, ActionTripy: 1 } }
    ]
  },
  {
    id: 2,
    title: "Arrival Moment",
    scenario: "You just arrived in a new city. First real move?",
    options: [
      { text: "Drop bags & disappear into streets", emoji: "🏃", scores: { FlowTripy: 3, ActionTripy: 2 } },
      { text: "Sit somewhere quiet and observe", emoji: "👀", scores: { BookTripy: 3, CultureTripy: 1 } },
      { text: "Open maps & plan", emoji: "🗺️", scores: { CultureTripy: 2, ViewTripy: 2 } },
      { text: "Find food immediately", emoji: "🍜", scores: { FoodTripy: 4 } }
    ]
  },
  {
    id: 3,
    title: "Iconic Place",
    scenario: "You're at a world-famous spot (Colosseum / Times Square / Sagrada Família):",
    options: [
      { text: "Get the classic photo", emoji: "📸", scores: { ViewTripy: 3, SocialTripy: 1 } },
      { text: "Step aside and feel the place", emoji: "🧘", scores: { BookTripy: 3, CultureTripy: 2 } },
      { text: "Watch people instead of the landmark", emoji: "👥", scores: { SocialTripy: 2, BookTripy: 2 } },
      { text: "Leave fast, too crowded", emoji: "🚪", scores: { FlowTripy: 2, ActionTripy: 2 } }
    ]
  },
  {
    id: 4,
    title: "First Evening",
    scenario: "It's your first night in a new city. You:",
    options: [
      { text: "Go out even if tired", emoji: "🌙", scores: { SocialTripy: 3, ActionTripy: 2 } },
      { text: "Short walk then early sleep", emoji: "🛏️", scores: { BookTripy: 2, FlowTripy: 2 } },
      { text: "Sit somewhere cozy", emoji: "☕", scores: { BookTripy: 3, FoodTripy: 1 } },
      { text: "Scroll to see what's happening tonight", emoji: "📱", scores: { SocialTripy: 2, FlowTripy: 2 } }
    ]
  },
  {
    id: 5,
    title: "Famous Spot Pressure",
    scenario: "Everyone says 'you MUST see this'. You:",
    options: [
      { text: "Go, no question", emoji: "✅", scores: { CultureTripy: 3, ViewTripy: 2 } },
      { text: "Go early/late to avoid crowds", emoji: "🌅", scores: { ViewTripy: 3, BookTripy: 1 } },
      { text: "Skip it completely", emoji: "🙅", scores: { FlowTripy: 3, ActionTripy: 1 } },
      { text: "Only go if it fits your mood", emoji: "🤷", scores: { FlowTripy: 4 } }
    ]
  },
  {
    id: 6,
    title: "Lost Scenario",
    scenario: "You're lost... but not in danger.",
    options: [
      { text: "Love it", emoji: "😍", scores: { FlowTripy: 4, ActionTripy: 1 } },
      { text: "Mild stress but ok", emoji: "😅", scores: { BookTripy: 2, CultureTripy: 2 } },
      { text: "Annoyed, open GPS", emoji: "😤", scores: { CultureTripy: 2, ViewTripy: 2 } },
      { text: "Ask someone immediately", emoji: "🗣️", scores: { SocialTripy: 4 } }
    ]
  },
  {
    id: 7,
    title: "Weather Chaos",
    scenario: "Your plan is ruined by weather.",
    options: [
      { text: "Adapt, new plan", emoji: "🔄", scores: { FlowTripy: 3, ActionTripy: 2 } },
      { text: "Stay in & slow down", emoji: "🏠", scores: { BookTripy: 4 } },
      { text: "Find indoor culture", emoji: "🏛️", scores: { CultureTripy: 4 } },
      { text: "Bad mood all day", emoji: "😞", scores: { ViewTripy: 2, ActionTripy: 1 } }
    ]
  },
  {
    id: 8,
    title: "Energy Dip",
    scenario: "Midday, low energy. You:",
    options: [
      { text: "Coffee and push", emoji: "☕", scores: { ActionTripy: 3, ViewTripy: 1 } },
      { text: "Long break", emoji: "😴", scores: { BookTripy: 3, FlowTripy: 2 } },
      { text: "Change activity type", emoji: "🔀", scores: { FlowTripy: 3, FoodTripy: 1 } },
      { text: "Call it a day", emoji: "🏁", scores: { BookTripy: 2, FlowTripy: 2 } }
    ]
  },
  {
    id: 9,
    title: "Social Spark",
    scenario: "A stranger talks to you in a cool place. You feel:",
    options: [
      { text: "Energized", emoji: "⚡", scores: { SocialTripy: 4 } },
      { text: "Curious but cautious", emoji: "🤔", scores: { BookTripy: 2, CultureTripy: 2 } },
      { text: "Polite but distant", emoji: "😊", scores: { BookTripy: 3, ViewTripy: 1 } },
      { text: "Please no", emoji: "😅", scores: { BookTripy: 3, FlowTripy: 1 } }
    ]
  },
  {
    id: 10,
    title: "Spending Moment",
    scenario: "You find a unique experience, pricey.",
    options: [
      { text: "Easy yes", emoji: "💸", scores: { ActionTripy: 3, ViewTripy: 2 } },
      { text: "Think hard, maybe", emoji: "🤔", scores: { BookTripy: 2, CultureTripy: 2 } },
      { text: "Nope", emoji: "🙅", scores: { FlowTripy: 2, FoodTripy: 2 } },
      { text: "Depends who I'm with", emoji: "👥", scores: { SocialTripy: 4 } }
    ]
  },
  {
    id: 11,
    title: "Memory Style",
    scenario: "Best travel memories are:",
    options: [
      { text: "Conversations", emoji: "💬", scores: { SocialTripy: 4 } },
      { text: "Feelings & atmosphere", emoji: "✨", scores: { BookTripy: 3, FlowTripy: 2 } },
      { text: "Photos", emoji: "📷", scores: { ViewTripy: 4 } },
      { text: "Stories I tell later", emoji: "📖", scores: { ActionTripy: 2, SocialTripy: 2 } }
    ]
  },
  {
    id: 12,
    title: "Silence vs Buzz",
    scenario: "In iconic places you prefer:",
    options: [
      { text: "Quiet corners", emoji: "🤫", scores: { BookTripy: 4 } },
      { text: "Lively energy", emoji: "🎉", scores: { SocialTripy: 4 } },
      { text: "Balanced vibe", emoji: "⚖️", scores: { CultureTripy: 2, FlowTripy: 2 } },
      { text: "Depends on time", emoji: "🕐", scores: { FlowTripy: 4 } }
    ]
  }
]

export interface QuizResult {
  primary: PersonalityType
  primaryPercentage: number
  secondary: PersonalityType
  secondaryPercentage: number
  allScores: Record<PersonalityType, number>
}

export function calculateResults(answers: Record<number, number>): QuizResult {
  const scores: Record<PersonalityType, number> = {
    BookTripy: 0,
    CultureTripy: 0,
    SocialTripy: 0,
    ViewTripy: 0,
    FoodTripy: 0,
    FlowTripy: 0,
    ActionTripy: 0
  }

  // Calculate raw scores
  for (const [questionId, optionIndex] of Object.entries(answers)) {
    const question = quizQuestions.find(q => q.id === parseInt(questionId))
    if (question) {
      const option = question.options[optionIndex]
      if (option) {
        for (const [type, score] of Object.entries(option.scores)) {
          scores[type as PersonalityType] += score
        }
      }
    }
  }

  // Calculate total for percentages
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0)

  // Sort by score
  const sorted = Object.entries(scores)
    .sort(([, a], [, b]) => b - a) as [PersonalityType, number][]

  const [primary, primaryScore] = sorted[0]
  const [secondary, secondaryScore] = sorted[1]

  return {
    primary,
    primaryPercentage: Math.round((primaryScore / totalScore) * 100),
    secondary,
    secondaryPercentage: Math.round((secondaryScore / totalScore) * 100),
    allScores: scores
  }
}
