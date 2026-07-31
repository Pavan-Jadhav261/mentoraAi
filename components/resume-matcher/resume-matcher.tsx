'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Search, 
  ArrowRight, 
  Sparkles, 
  RefreshCw, 
  TrendingUp,
  Plus, 
  Trash2,
  X,
  Building,
  Check,
  ChevronRight,
  Filter
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Theme tokens & styles
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  blue:   'var(--accent-blue)',
  green:  'var(--accent-green)',
  orange: 'var(--accent-orange)',
  yellow: 'var(--accent-yellow)',
  purple: 'var(--accent-purple)',
}

// ─────────────────────────────────────────────────────────────────────────────
// Rich Mock Data based on Target Job Profiles
// ─────────────────────────────────────────────────────────────────────────────
type Job = {
  id: string
  title: string
  company: string
  logo: string
  location: string
  type: 'Remote' | 'Hybrid' | 'On-site'
  salary: string
  minSalary: number
  matchRate: number
  matchedSkills: string[]
  missingSkills: string[]
  description: string
}

type ResumeProfile = {
  title: string
  score: number
  atsScore: number
  keywordsScore: number
  formattingScore: number
  experienceScore: number
  matchedKeywords: string[]
  missingKeywords: string[]
  strengths: string[]
  improvements: string[]
}

const RESUME_PROFILES: Record<string, ResumeProfile> = {
  'frontend': {
    title: 'Frontend Engineer',
    score: 84,
    atsScore: 88,
    keywordsScore: 82,
    formattingScore: 90,
    experienceScore: 78,
    matchedKeywords: ['React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'TailwindCSS', 'Next.js', 'Git', 'REST APIs', 'Vite'],
    missingKeywords: ['Redux Toolkit', 'GraphQL', 'Jest', 'Cypress', 'Docker', 'Web Accessibility (a11y)', 'CI/CD'],
    strengths: [
      'Strong usage of modern framework keywords (React, Next.js).',
      'Formatting is clean, single-page layout fits ATS standards.',
      'Includes links to active GitHub repository and portfolio.'
    ],
    improvements: [
      'Add testing libraries keywords like Jest or Cypress.',
      'Quantify experience bullets (e.g. "improved loading speed by 40%").',
      'Integrate containerization concepts (Docker) for cloud readiness.'
    ]
  },
  'fullstack': {
    title: 'Full Stack Developer',
    score: 79,
    atsScore: 82,
    keywordsScore: 75,
    formattingScore: 85,
    experienceScore: 74,
    matchedKeywords: ['React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'SQL', 'Git', 'JavaScript', 'REST APIs', 'Docker'],
    missingKeywords: ['Redis', 'AWS (S3/EC2)', 'Prisma', 'Next.js', 'TypeScript', 'Microservices', 'GraphQL'],
    strengths: [
      'Good database coverage (both SQL and NoSQL listed).',
      'Solid foundations in system structure and API design.',
      'No complex graphic charts which improves ATS readability.'
    ],
    improvements: [
      'Include state management keywords and TypeScript.',
      'Add cloud deployment keywords (specifically AWS or GCP).',
      'Rewrite descriptions to focus on system scale and database optimization.'
    ]
  },
  'ai': {
    title: 'AI / Data Scientist',
    score: 76,
    atsScore: 74,
    keywordsScore: 70,
    formattingScore: 80,
    experienceScore: 80,
    matchedKeywords: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'SQL', 'Git', 'Data Visualization', 'Machine Learning'],
    missingKeywords: ['PyTorch', 'TensorFlow', 'LLMs', 'Prompt Engineering', 'LangChain', 'Docker', 'FastAPI', 'MLOps'],
    strengths: [
      'Solid mathematical and analytical foundation.',
      'Extensive data manipulation experience with Python ecosystem.',
      'Education and academic projects are highlighted clearly.'
    ],
    improvements: [
      'Include modern AI and generative frameworks (LangChain, LLMs).',
      'Add API deployment frameworks like FastAPI or Flask.',
      'Describe model metrics in experience bullets (e.g. "F1-score of 92%").'
    ]
  }
}

const JOBS_DATABASE: Record<string, Job[]> = {
  'frontend': [
    {
      id: 'fe-1',
      title: 'Senior Frontend Engineer',
      company: 'Vercel',
      logo: '▲',
      location: 'Remote, US',
      type: 'Remote',
      salary: '$145,000 - $180,000',
      minSalary: 145000,
      matchRate: 94,
      matchedSkills: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Git', 'Vite'],
      missingSkills: ['GraphQL', 'Web Accessibility (a11y)'],
      description: 'Join the team building the future of web deployment. You will craft high-performance web dashboard apps and contribute to core frameworks.'
    },
    {
      id: 'fe-2',
      title: 'UI Engineer (React)',
      company: 'Supabase',
      logo: '⚡',
      location: 'San Francisco, CA',
      type: 'Hybrid',
      salary: '$130,000 - $165,000',
      minSalary: 130000,
      matchRate: 88,
      matchedSkills: ['React', 'TypeScript', 'JavaScript', 'CSS3', 'REST APIs'],
      missingSkills: ['Redux Toolkit', 'Jest'],
      description: 'Help us make database administration simple and gorgeous. Focus heavily on stateful tables, visual query builders, and database dashboards.'
    },
    {
      id: 'fe-3',
      title: 'Frontend Developer',
      company: 'Stripe',
      logo: 'S',
      location: 'New York, NY',
      type: 'On-site',
      salary: '$120,000 - $150,000',
      minSalary: 120000,
      matchRate: 78,
      matchedSkills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Git'],
      missingSkills: ['Cypress', 'Docker', 'CI/CD'],
      description: 'Build embeddable payment forms and dashboard metrics panels used by millions of sellers around the globe.'
    },
    {
      id: 'fe-4',
      title: 'Senior Web Developer',
      company: 'Figma',
      logo: 'F',
      location: 'Remote, US/Canada',
      type: 'Remote',
      salary: '$150,000 - $190,000',
      minSalary: 150000,
      matchRate: 91,
      matchedSkills: ['React', 'TypeScript', 'TailwindCSS', 'Next.js', 'Vite'],
      missingSkills: ['Redux Toolkit', 'Cypress'],
      description: 'Deliver rich, real-time collaboration canvas elements and designer-to-developer transition interfaces.'
    }
  ],
  'fullstack': [
    {
      id: 'fs-1',
      title: 'Full Stack Engineer',
      company: 'Linear',
      logo: 'L',
      location: 'Remote',
      type: 'Remote',
      salary: '$140,000 - $175,000',
      minSalary: 140000,
      matchRate: 92,
      matchedSkills: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'Git', 'JavaScript'],
      missingSkills: ['Prisma', 'TypeScript'],
      description: 'Work on our offline-first synchronization engine and lightning-fast issue tracking boards. Build robust APIs and client views.'
    },
    {
      id: 'fs-2',
      title: 'Software Developer (Full Stack)',
      company: 'Resend',
      logo: '✉',
      location: 'Remote, EMEA',
      type: 'Remote',
      salary: '$115,000 - $140,000',
      minSalary: 115000,
      matchRate: 85,
      matchedSkills: ['Node.js', 'Express', 'React', 'MongoDB', 'REST APIs'],
      missingSkills: ['AWS (S3/EC2)', 'Redis'],
      description: 'Craft beautiful transactional email APIs, analytics dash systems, and backend server-side render pipelines.'
    },
    {
      id: 'fs-3',
      title: 'Full Stack Engineer',
      company: 'Clerk',
      logo: 'C',
      location: 'San Francisco, CA',
      type: 'Hybrid',
      salary: '$120,000 - $160,000',
      minSalary: 120000,
      matchRate: 79,
      matchedSkills: ['React', 'Node.js', 'SQL', 'PostgreSQL', 'Git'],
      missingSkills: ['Next.js', 'GraphQL', 'Microservices'],
      description: 'Expand user authentication buttons, login screens, multi-tenant databases, and session handlers.'
    }
  ],
  'ai': [
    {
      id: 'ai-1',
      title: 'AI Applications Engineer',
      company: 'OpenAI',
      logo: 'O',
      location: 'San Francisco, CA',
      type: 'On-site',
      salary: '$190,000 - $260,000',
      minSalary: 190000,
      matchRate: 95,
      matchedSkills: ['Python', 'SQL', 'Machine Learning', 'Git', 'Data Visualization'],
      missingSkills: ['LLMs', 'Prompt Engineering', 'LangChain'],
      description: 'Bring generative AI models to millions of consumer and corporate operations. Build integrations, pipelines, and chat assistants.'
    },
    {
      id: 'ai-2',
      title: 'ML Software Engineer',
      company: 'Hugging Face',
      logo: '🤗',
      location: 'Remote',
      type: 'Remote',
      salary: '$150,000 - $190,000',
      minSalary: 150000,
      matchRate: 89,
      matchedSkills: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'Git'],
      missingSkills: ['PyTorch', 'TensorFlow', 'MLOps'],
      description: 'Maintain cloud server repositories for model weight distributions, interactive web spaces, and fine-tune tools.'
    },
    {
      id: 'ai-3',
      title: 'Data Scientist (Analytics)',
      company: 'Scale AI',
      logo: 'S',
      location: 'San Francisco, CA',
      type: 'Hybrid',
      salary: '$135,000 - $170,000',
      minSalary: 135000,
      matchRate: 76,
      matchedSkills: ['Python', 'SQL', 'Pandas', 'Data Visualization'],
      missingSkills: ['FastAPI', 'Docker', 'PyTorch'],
      description: 'Run quality analyses on massive sensor, image, and text feeds to optimize ML labeling and dataset evaluations.'
    }
  ]
}

export default function ResumeMatcher() {
  // Navigation & Workflow state
  const [step, setStep] = useState<'upload' | 'analyzing' | 'dashboard'>('upload')
  
  // Input fields
  const [resumeText, setResumeText] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const [targetRole, setTargetRole] = useState<'frontend' | 'fullstack' | 'ai'>('frontend')
  const [customKeyword, setCustomKeyword] = useState('')
  
  // Analyzing state messages
  const [analyzingMessage, setAnalyzingMessage] = useState('Reading document text...')
  
  // Job filters
  const [jobTypeFilter, setJobTypeFilter] = useState<'all' | 'Remote' | 'Hybrid' | 'On-site'>('all')
  const [minSalaryFilter, setMinSalaryFilter] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Tailor comparison state
  const [activeCompareJob, setActiveCompareJob] = useState<Job | null>(null)
  const [tailorSuccess, setTailorSuccess] = useState(false)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [appliedJob, setAppliedJob] = useState<Job | null>(null)

  // Simulation loading timeline
  useEffect(() => {
    if (step !== 'analyzing') return
    
    const timers = [
      setTimeout(() => setAnalyzingMessage('Extracting contact info & education...'), 1000),
      setTimeout(() => setAnalyzingMessage('Cross-referencing technology stack with ATS database...'), 2200),
      setTimeout(() => setAnalyzingMessage('Evaluating semantic readability & formatting...'), 3500),
      setTimeout(() => setAnalyzingMessage('Querying internet API endpoints for matching positions...'), 4800),
      setTimeout(() => setStep('dashboard'), 6000)
    ]
    
    return () => timers.forEach(t => clearTimeout(t))
  }, [step])

  // Process profile data
  const profile = useMemo(() => {
    return RESUME_PROFILES[targetRole]
  }, [targetRole])

  // Get matching jobs dynamically
  const rawJobs = useMemo(() => {
    return JOBS_DATABASE[targetRole] ?? []
  }, [targetRole])

  // Filtered jobs list
  const filteredJobs = useMemo(() => {
    return rawJobs.filter(job => {
      const matchType = jobTypeFilter === 'all' || job.type === jobTypeFilter
      const matchSalary = job.minSalary >= minSalaryFilter
      const query = searchQuery.toLowerCase()
      const matchSearch = 
        job.title.toLowerCase().includes(query) || 
        job.company.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query)
      return matchType && matchSalary && matchSearch
    })
  }, [rawJobs, jobTypeFilter, minSalaryFilter, searchQuery])

  // Simulated drag-and-drop file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      // Simulate reading file text
      setResumeText(`[Parsed Resume: ${file.name}]\nSoftware developer specializing in web technologies. Experienced in building responsive user interfaces, scaling web servers, and working in agile methodologies. Skills: JavaScript, React, PostgreSQL, Docker, Git.`)
    }
  }

  // Handle manual keywords adding
  const handleAddKeyword = () => {
    if (!customKeyword.trim()) return
    // Simple custom simulation: add to matching list
    profile.matchedKeywords.push(customKeyword.trim())
    setCustomKeyword('')
  }

  // Handle tailing/optimizing resume for a job
  const handleOptimizeResume = (job: Job) => {
    setActiveCompareJob(job)
    setTailorSuccess(false)
  }

  const handleApplyNow = (job: Job) => {
    setAppliedJob(job)
    setShowApplyModal(true)
  }

  return (
    <div className="space-y-8">
      {/* Step 1: Upload and Input UI */}
      {step === 'upload' && (
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-8 lg:grid-cols-3"
        >
          {/* File Upload Box */}
          <div className="lg:col-span-2 space-y-6">
            <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
              <h2 className="font-display font-bold text-xl text-[var(--foreground)] mb-6 flex items-center gap-2">
                <UploadCloud size={20} className="text-[var(--accent-blue)]" />
                Upload Resume File
              </h2>
              
              <div className="relative border-2 border-dashed border-[var(--border)] rounded-2xl p-8 hover:border-[var(--accent-blue)]/50 transition-colors bg-[var(--background)]/30 text-center flex flex-col items-center justify-center group cursor-pointer">
                <input 
                  type="file" 
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
                <div className="size-16 rounded-2xl bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud size={28} />
                </div>
                <p className="text-sm font-semibold text-[var(--foreground)] mb-1">
                  Drag and drop your file here
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Supports PDF, DOCX, or TXT (Max 5MB)
                </p>
              </div>

              {fileName && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 flex items-center gap-3 p-3 rounded-xl border border-[var(--accent-blue)]/20 bg-[var(--accent-blue)]/5 text-sm"
                >
                  <FileText className="text-[var(--accent-blue)] shrink-0" size={18} />
                  <span className="font-mono truncate font-semibold text-[var(--foreground)]">{fileName}</span>
                  <button 
                    onClick={() => { setFileName(null); setResumeText('') }}
                    className="ml-auto text-[var(--muted-foreground)] hover:text-red-500 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              )}
            </section>

            {/* Resume Text Box */}
            <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-xl text-[var(--foreground)]">
                  Paste Resume Content
                </h2>
                {resumeText && (
                  <button 
                    onClick={() => setResumeText('')}
                    className="text-xs text-red-500 hover:underline flex items-center gap-1"
                  >
                    Clear text
                  </button>
                )}
              </div>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Or paste your resume text here directly..."
                className="w-full h-48 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:border-[var(--accent-blue)] focus:ring-2 focus:ring-[var(--accent-blue)]/20 outline-none resize-y"
              />
            </section>
          </div>

          {/* Sidebar Config Options */}
          <div className="space-y-6">
            <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 space-y-6">
              <h2 className="font-display font-bold text-xl text-[var(--foreground)] flex items-center gap-2">
                <Sparkles size={20} className="text-[var(--accent-yellow)]" />
                Target Profile
              </h2>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
                  Select Target Role
                </label>
                <div className="space-y-2">
                  {[
                    { key: 'frontend', label: 'Frontend Engineer' },
                    { key: 'fullstack', label: 'Full Stack Developer' },
                    { key: 'ai', label: 'AI & Machine Learning' }
                  ].map(role => (
                    <button
                      key={role.key}
                      onClick={() => setTargetRole(role.key as any)}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-semibold transition-all flex items-center justify-between ${
                        targetRole === role.key 
                          ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]/5 text-[var(--accent-blue)]' 
                          : 'border-[var(--border)] hover:bg-[var(--background)] text-[var(--foreground)]'
                      }`}
                    >
                      {role.label}
                      {targetRole === role.key && <CheckCircle size={16} />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border)]">
                <button
                  onClick={() => setStep('analyzing')}
                  disabled={!resumeText.trim()}
                  className="w-full py-3 rounded-xl bg-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/90 text-white font-semibold text-sm transition-all shadow-md shadow-[var(--accent-blue)]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                >
                  Analyze Resume
                  <ArrowRight size={16} />
                </button>
              </div>
            </section>
          </div>
        </motion.div>
      )}

      {/* Step 2: Analyzer processing state */}
      {step === 'analyzing' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center min-h-[30rem] text-center"
        >
          <div className="relative flex items-center justify-center size-24 mb-6">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
              className="absolute inset-0 border-4 border-t-[var(--accent-blue)] border-r-transparent border-b-transparent border-l-transparent rounded-full"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
              className="absolute inset-2 border-4 border-b-[var(--accent-purple)] border-t-transparent border-r-transparent border-l-transparent rounded-full opacity-60"
            />
            <FileText className="text-[var(--accent-blue)]" size={32} />
          </div>

          <h2 className="font-display font-bold text-2xl text-[var(--foreground)] mb-2">
            Analyzing Resume Stack
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] max-w-sm h-6">
            {analyzingMessage}
          </p>
        </motion.div>
      )}

      {/* Step 3: Main Dashboard Content */}
      {step === 'dashboard' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {/* Main header stats grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Score Ring Card */}
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_80%_at_50%_0%,color-mix(in_srgb,var(--accent-blue)_8%,transparent),transparent_70%)]" />
              
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">
                Overall Resume Score
              </h3>

              <div className="relative size-36 flex items-center justify-center">
                {/* SVG Radial Progress */}
                <svg className="size-full transform -rotate-90">
                  <circle 
                    cx="72" cy="72" r="62" 
                    stroke="var(--border)" 
                    strokeWidth="10" 
                    fill="transparent" 
                  />
                  <motion.circle 
                    cx="72" cy="72" r="62" 
                    stroke="var(--accent-blue)" 
                    strokeWidth="10" 
                    fill="transparent" 
                    strokeDasharray={2 * Math.PI * 62}
                    initial={{ strokeDashoffset: 2 * Math.PI * 62 }}
                    animate={{ strokeDashoffset: (2 * Math.PI * 62) * (1 - profile.score / 100) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                    style={{ filter: `drop-shadow(0 0 6px ${C.blue})` }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="font-display font-bold text-4xl text-[var(--foreground)]">{profile.score}</span>
                  <span className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider font-semibold">ATS Ready</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-xs text-[var(--accent-green)] font-semibold">
                <TrendingUp size={14} />
                <span>Better than 88% of applicants</span>
              </div>
            </div>

            {/* Detailed breakdowns */}
            <div className="md:col-span-2 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5">
              <h3 className="font-display font-bold text-lg text-[var(--foreground)] mb-2">
                Scoring Metrics
              </h3>

              {[
                { label: 'ATS Compatibility', score: profile.atsScore, color: C.blue },
                { label: 'Keywords Match', score: profile.keywordsScore, color: C.purple },
                { label: 'Formatting & Layout', score: profile.formattingScore, color: C.green },
                { label: 'Work Experience Depth', score: profile.experienceScore, color: C.orange }
              ].map(metric => (
                <div key={metric.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[var(--foreground)]">{metric.label}</span>
                    <span style={{ color: metric.color }}>{metric.score}%</span>
                  </div>
                  <div className="h-2 bg-[var(--background)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.score}%` }}
                      transition={{ duration: 1.2 }}
                      className="h-full rounded-full"
                      style={{ background: metric.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist & Keywords section */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Strengths & Improvements */}
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-6">
              <div>
                <h3 className="font-display font-bold text-lg text-[var(--foreground)] mb-4 flex items-center gap-2">
                  <CheckCircle className="text-[var(--accent-green)]" size={20} />
                  Resume Strengths
                </h3>
                <ul className="space-y-3">
                  {profile.strengths.map((str, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start text-sm text-[var(--muted-foreground)]">
                      <Check className="text-[var(--accent-green)] shrink-0 mt-0.5" size={16} />
                      {str}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-[var(--border)]">
                <h3 className="font-display font-bold text-lg text-[var(--foreground)] mb-4 flex items-center gap-2">
                  <AlertCircle className="text-[var(--accent-orange)]" size={20} />
                  Areas to Optimize
                </h3>
                <ul className="space-y-3">
                  {profile.improvements.map((imp, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start text-sm text-[var(--muted-foreground)]">
                      <ChevronRight className="text-[var(--accent-orange)] shrink-0 mt-0.5" size={16} />
                      {imp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Keyword Analysis Box */}
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-6">
              <div>
                <h3 className="font-display font-bold text-lg text-[var(--foreground)] mb-3">
                  ATS Keywords Scan
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] mb-4">
                  ATS systems parse resumes for core keywords. Include missing tags to trigger scoring boosts.
                </p>
              </div>

              <div className="space-y-4">
                {/* Matched */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--accent-green)] mb-2">
                    Matched Skills ({profile.matchedKeywords.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.matchedKeywords.map(kw => (
                      <span key={kw} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[var(--accent-green)]/10 text-[var(--accent-green)] border border-[var(--accent-green)]/15">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--accent-orange)] mb-2">
                    Missing Keywords ({profile.missingKeywords.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.missingKeywords.map(kw => (
                      <span key={kw} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[var(--accent-orange)]/15 text-[var(--accent-orange)] border border-[var(--accent-orange)]/25">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Add Custom Skill */}
              <div className="pt-4 border-t border-[var(--border)] flex gap-2">
                <input 
                  type="text" 
                  value={customKeyword}
                  onChange={(e) => setCustomKeyword(e.target.value)}
                  placeholder="Add custom keyword..."
                  className="flex-1 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent-blue)]"
                />
                <button
                  onClick={handleAddKeyword}
                  className="px-3 py-1.5 rounded-xl bg-[var(--accent-blue)] text-white text-xs font-bold flex items-center gap-1 hover:bg-[var(--accent-blue)]/90"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
            </div>
          </div>

          {/* Job matching list section */}
          <div className="pt-8 border-t border-[var(--border)] space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-2xl text-[var(--foreground)]">
                  Live Job Recommendations
                </h2>
                <p className="text-sm text-[var(--muted-foreground)]">
                  These tech roles are currently listed on the web and match your resume.
                </p>
              </div>

              {/* Reset analyzer button */}
              <button
                onClick={() => setStep('upload')}
                className="self-start md:self-auto px-4 py-2 rounded-xl border border-[var(--border)] text-xs text-[var(--foreground)] hover:bg-[var(--surface)] transition-all flex items-center gap-1.5"
              >
                <RefreshCw size={12} />
                Analyze Another Resume
              </button>
            </div>

            {/* Filter controls bar */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 flex flex-wrap items-center gap-4">
              {/* Search input */}
              <div className="relative flex-1 min-w-[240px]">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jobs, companies, or locations..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] outline-none focus:border-[var(--accent-blue)]"
                />
              </div>

              {/* Job type dropdown */}
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-[var(--muted-foreground)]" />
                <select
                  value={jobTypeFilter}
                  onChange={(e) => setJobTypeFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent-blue)]"
                >
                  <option value="all">All Types</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

              {/* Min Salary Filter */}
              <div className="flex items-center gap-2">
                <DollarSign size={14} className="text-[var(--muted-foreground)]" />
                <select
                  value={minSalaryFilter}
                  onChange={(e) => setMinSalaryFilter(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent-blue)]"
                >
                  <option value="0">Any Salary</option>
                  <option value="120000">$120k+ / yr</option>
                  <option value="140000">$140k+ / yr</option>
                  <option value="160000">$160k+ / yr</option>
                </select>
              </div>
            </div>

            {/* Jobs feed grid */}
            <div className="grid gap-4 lg:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {filteredJobs.map(job => (
                  <motion.div
                    key={job.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="group rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--accent-blue)]/50 transition-all flex flex-col gap-4 relative overflow-hidden"
                  >
                    {/* Header info */}
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex gap-3">
                        <div className="size-10 rounded-xl bg-[var(--background)] border border-[var(--border)] flex items-center justify-center text-lg font-bold">
                          {job.logo}
                        </div>
                        <div>
                          <h3 className="font-semibold text-base text-[var(--foreground)] leading-tight group-hover:text-[var(--accent-blue)] transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                            {job.company}
                          </p>
                        </div>
                      </div>

                      {/* Match Badge */}
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--accent-blue)]/10 text-[var(--accent-blue)]">
                        {job.matchRate}% Match
                      </span>
                    </div>

                    <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[var(--muted-foreground)]">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                      <span className="flex items-center gap-1"><Briefcase size={12} /> {job.type}</span>
                      <span className="flex items-center gap-1"><DollarSign size={12} /> {job.salary}</span>
                    </div>

                    {/* Key skills comparisons */}
                    <div className="pt-3 border-t border-[var(--border)] flex flex-col gap-2">
                      <div className="flex flex-wrap gap-1">
                        {job.matchedSkills.slice(0, 3).map(skill => (
                          <span key={skill} className="px-2 py-0.5 rounded bg-[var(--accent-green)]/10 text-[var(--accent-green)] text-[10px] font-semibold">
                            ✓ {skill}
                          </span>
                        ))}
                        {job.missingSkills.slice(0, 2).map(skill => (
                          <span key={skill} className="px-2 py-0.5 rounded bg-[var(--accent-orange)]/10 text-[var(--accent-orange)] text-[10px] font-semibold">
                            + {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CTA Actions */}
                    <div className="flex gap-2 pt-1 mt-auto">
                      <button
                        onClick={() => handleOptimizeResume(job)}
                        className="flex-1 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--background)] text-xs font-bold text-[var(--foreground)] transition-colors"
                      >
                        Optimize Resume
                      </button>
                      <button
                        onClick={() => handleApplyNow(job)}
                        className="flex-1 py-1.5 rounded-lg bg-[var(--accent-blue)] text-white hover:bg-[var(--accent-blue)]/90 text-xs font-bold transition-colors"
                      >
                        Apply Now
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredJobs.length === 0 && (
                <div className="lg:col-span-2 text-center py-12 rounded-3xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted-foreground)] text-sm">
                  No matching jobs found matching the selected filters.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Compare & Tailor Side Panel (Glow overlay) */}
      <AnimatePresence>
        {activeCompareJob && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCompareJob(null)}
              className="absolute inset-0 bg-black"
            />

            {/* Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-lg h-full bg-[var(--surface)] border-l border-[var(--border)] shadow-2xl flex flex-col p-6 z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                <div>
                  <h3 className="font-display font-bold text-lg text-[var(--foreground)]">
                    Tailoring Comparison
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Compare your stack with {activeCompareJob.company}&apos;s requirements.
                  </p>
                </div>
                <button 
                  onClick={() => setActiveCompareJob(null)}
                  className="p-1 rounded-full hover:bg-[var(--border)] text-[var(--muted-foreground)]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Match overview Card */}
              <div className="my-5 p-4 rounded-2xl bg-[var(--background)] border border-[var(--border)] flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-[var(--foreground)]">{activeCompareJob.title}</h4>
                  <p className="text-xs text-[var(--muted-foreground)]">{activeCompareJob.company}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[var(--muted-foreground)] font-semibold">Resume Fit</div>
                  <div className="font-display font-bold text-xl text-[var(--accent-blue)]">{activeCompareJob.matchRate}%</div>
                </div>
              </div>

              {/* Optimization tasks list */}
              <div className="flex-1 overflow-y-auto space-y-5 pr-1 py-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Required Skills comparison
                </h4>

                <div className="space-y-3">
                  {activeCompareJob.matchedSkills.map(skill => (
                    <div key={skill} className="flex items-center justify-between p-3 rounded-xl border border-[var(--accent-green)]/15 bg-[var(--accent-green)]/5">
                      <div className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                        <div className="size-5 rounded-full bg-[var(--accent-green)]/15 text-[var(--accent-green)] flex items-center justify-center">
                          <Check size={12} />
                        </div>
                        {skill}
                      </div>
                      <span className="text-[10px] uppercase font-bold text-[var(--accent-green)]">Matched</span>
                    </div>
                  ))}

                  {activeCompareJob.missingSkills.map(skill => (
                    <div key={skill} className="flex items-center justify-between p-3 rounded-xl border border-[var(--accent-orange)]/25 bg-[var(--accent-orange)]/5">
                      <div className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                        <div className="size-5 rounded-full bg-[var(--accent-orange)]/15 text-[var(--accent-orange)] flex items-center justify-center font-bold text-xs">
                          +
                        </div>
                        {skill}
                      </div>
                      <span className="text-[10px] uppercase font-bold text-[var(--accent-orange)]">Missing</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-[var(--accent-blue)]/5 border border-[var(--accent-blue)]/10 space-y-2 mt-6">
                  <h5 className="text-xs font-bold text-[var(--accent-blue)] flex items-center gap-1">
                    <Sparkles size={13} />
                    Mentora AI Suggestion
                  </h5>
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                    By incorporating the missing skills keywords <strong>{activeCompareJob.missingSkills.join(', ')}</strong> directly into your experience bullets, your match score is estimated to rise to <strong>98%</strong>.
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-[var(--border)]">
                {tailorSuccess ? (
                  <motion.div 
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="p-3 text-center text-xs font-bold bg-[var(--accent-green)]/15 text-[var(--accent-green)] rounded-xl border border-[var(--accent-green)]/35"
                  >
                    ✓ Resume successfully optimized with target keywords!
                  </motion.div>
                ) : (
                  <button
                    onClick={() => {
                      setTailorSuccess(true)
                      // update overall scores temporarily
                      profile.score = Math.min(98, profile.score + 8)
                      profile.keywordsScore = Math.min(96, profile.keywordsScore + 12)
                      // move skills to matched list
                      activeCompareJob.missingSkills.forEach(sk => {
                        if (!activeCompareJob.matchedSkills.includes(sk)) {
                          activeCompareJob.matchedSkills.push(sk)
                        }
                      })
                      activeCompareJob.missingSkills = []
                      activeCompareJob.matchRate = 98
                    }}
                    className="w-full py-3 rounded-xl bg-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/90 text-white font-semibold text-sm transition-all"
                  >
                    Auto-Tailor Resume for this Job
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Apply success dialog */}
      <AnimatePresence>
        {showApplyModal && appliedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowApplyModal(false)}
              className="absolute inset-0 bg-black"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-2xl z-10 text-center"
            >
              <div className="size-16 rounded-full bg-[var(--accent-green)]/10 text-[var(--accent-green)] flex items-center justify-center mx-auto mb-4">
                <Check size={28} />
              </div>
              <h3 className="font-display font-bold text-xl text-[var(--foreground)] mb-1">
                Application Submitted!
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] mb-6">
                Your optimized resume was sent to the recruitment pipeline for <strong>{appliedJob.company}</strong>.
              </p>

              <div className="bg-[var(--background)] p-4 rounded-2xl border border-[var(--border)] text-left mb-6 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--foreground)]">
                  <Building size={14} className="text-[var(--accent-blue)]" />
                  {appliedJob.company}
                </div>
                <div className="text-sm font-bold text-[var(--foreground)] pl-6">
                  {appliedJob.title}
                </div>
                <div className="text-xs text-[var(--muted-foreground)] pl-6">
                  {appliedJob.location} · {appliedJob.salary}
                </div>
              </div>

              <button
                onClick={() => setShowApplyModal(false)}
                className="w-full py-2.5 rounded-xl bg-[var(--accent-blue)] text-white text-sm font-semibold hover:bg-[var(--accent-blue)]/90"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
