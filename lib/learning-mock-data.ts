export type RoadmapStep = {
  title: string
  description: string
  duration: string
  resources: string[]
}

export type GeneratedRoadmap = {
  topic: string
  level: string
  commitment: string
  steps: RoadmapStep[]
}

export type Assessment = {
  title: string
  date: string
  score: number
  status: 'Passed' | 'Needs review'
}

export type Achievement = {
  title: string
  description: string
  unlocked: boolean
  icon: 'sparkles' | 'flame' | 'code' | 'target'
}

export type ActivityDay = {
  date: string
  minutes: number
  count: number
}

export const POPULAR_PATHS = ['React', 'Node.js', 'Python', 'AI Engineering', 'DevOps', 'Full Stack']

const ROADMAP_TEMPLATES: Record<string, Omit<RoadmapStep, 'title'>[]> = {
  default: [
    { description: 'Build a clear foundation in the concepts and tools that shape this field.', duration: 'Weeks 1–2', resources: ['Core concepts', 'Guided tutorials'] },
    { description: 'Turn fundamentals into practice with small, focused exercises and projects.', duration: 'Weeks 3–4', resources: ['Practice prompts', 'Mini project'] },
    { description: 'Learn the patterns used in production work and make deliberate trade-offs.', duration: 'Weeks 5–6', resources: ['Architecture patterns', 'Code reviews'] },
    { description: 'Ship a portfolio-quality project that demonstrates your new skills.', duration: 'Weeks 7–8', resources: ['Capstone project', 'Portfolio checklist'] },
  ],
  react: [
    { description: 'Learn components, JSX, props, state, and the modern React mental model.', duration: 'Weeks 1–2', resources: ['React fundamentals', 'Component exercises'] },
    { description: 'Practice effects, data fetching, forms, and reusable custom hooks.', duration: 'Weeks 3–4', resources: ['Hooks', 'Form patterns'] },
    { description: 'Build accessible, responsive interfaces with routing and shared state.', duration: 'Weeks 5–6', resources: ['Routing', 'State management'] },
    { description: 'Create and deploy a polished product with testing and performance checks.', duration: 'Weeks 7–8', resources: ['Testing', 'Deployment'] },
  ],
  python: [
    { description: 'Master Python syntax, control flow, functions, and core data structures.', duration: 'Weeks 1–2', resources: ['Language basics', 'Problem sets'] },
    { description: 'Work with files, APIs, packages, and error handling in small scripts.', duration: 'Weeks 3–4', resources: ['APIs', 'Automation scripts'] },
    { description: 'Choose a specialization and practice clean, testable project structure.', duration: 'Weeks 5–6', resources: ['Project structure', 'Testing'] },
    { description: 'Deliver an end-to-end project and document the decisions you made.', duration: 'Weeks 7–8', resources: ['Capstone project', 'Documentation'] },
  ],
}

export function createMockRoadmap(topic: string, level: string, commitment: string): GeneratedRoadmap {
  const key = topic.toLowerCase().includes('react') ? 'react' : topic.toLowerCase().includes('python') ? 'python' : 'default'
  const phases = ['Foundation', 'Practice', 'Build', 'Launch']
  return {
    topic,
    level,
    commitment,
    steps: ROADMAP_TEMPLATES[key].map((step, index) => ({ ...step, title: `${phases[index]} ${topic}` })),
  }
}

export const RECENT_ASSESSMENTS: Assessment[] = [
  { title: 'Quick Sort fundamentals', date: 'Today', score: 92, status: 'Passed' },
  { title: 'Binary Search patterns', date: 'Yesterday', score: 78, status: 'Passed' },
  { title: 'Dynamic programming basics', date: 'Jul 23', score: 58, status: 'Needs review' },
]

export const ACHIEVEMENTS: Achievement[] = [
  { title: 'First path', description: 'Generated your first roadmap', unlocked: true, icon: 'sparkles' },
  { title: 'Weekly rhythm', description: 'Learned for 7 days', unlocked: true, icon: 'flame' },
  { title: 'Algorithm explorer', description: 'Mastered 10 algorithms', unlocked: false, icon: 'code' },
  { title: 'Focused learner', description: 'Logged 20 learning hours', unlocked: false, icon: 'target' },
]

export const ACTIVITY_DAYS: ActivityDay[] = Array.from({ length: 364 }, (_, index) => {
  const date = new Date()
  date.setDate(date.getDate() - (363 - index))
  const active = index % 11 === 0 ? 0 : ((index * 7 + Math.floor(index / 9)) % 5)
  return { date: date.toISOString().slice(0, 10), count: active, minutes: active * 18 }
})

export const TIME_SPENT = Array.from({ length: 14 }, (_, index) => ({
  label: index === 13 ? 'Today' : `${13 - index}d`,
  minutes: 20 + ((index * 19 + 11) % 65),
}))
