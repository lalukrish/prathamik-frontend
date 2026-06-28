export interface WorkExperience {
  role: string
  company: string
  startDate: string
  endDate: string
  location: string
  responsibilities?: string[]
}

export interface Education {
  degree: string
  institution: string
  startDate: string
  endDate: string
}

export interface Project {
  name: string
  startDate: string
  endDate: string
  description: string
  technologies: string[]
}

export interface Scoring {
  strengths: string[]
  weaknesses: string[]
  overallScore: number
  matchedSkills: string[]
  missingSkills: string[]
  experienceScore: number
  skillMatchScore: number
  communicationScore: number
}

export interface InterviewData {
  id?: string
  accessToken?: string
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "SCHEDULED" | "EXPIRED"
  scheduledStartAt?: string
  scheduledEndAt?: string
  totalQuestions?: number
  totalScore?: number
  riskLevel?: string
  cheatScore?: number
  startedAt?: string
  completedAt?: string
  submittedAt?: string
  expiresAt?: string
}

export interface ApiResponse {
  id: string
  status: string
  overallScore: number
  aiSummary?: string
  matchedSkills?: string[]
  missingSkills?: string[]
  createdAt: string
  jobId?: string
  parsedData?: { scoring: Scoring }
  interviews?: InterviewData[]
  scores?: Record<string, number>
  candidate: {
    id: string
    name: string
    email: string
    phone: string
    currentRole: string
    linkedinUrl?: string
    skills: string[]
    totalExperience: number
    currentCTC: number
    expectedSalary: number
    noticePeriod: number
    isOnNoticePeriod: boolean
    parsedData?: {
      summary: string
      aiSummary: string
      profile: { name: string; location: string; currentRole: string; linkedinUrl: string }
      workExperience: WorkExperience[]
      education: Education[]
      projects: Project[]
      skills: string[]
    }
  }
}

export type ApplicationStatus = "APPLIED" | "SHORTLISTED" | "REJECTED" | "INTERVIEW" | "SELECTED"
export type ModalType = null | "experience" | "summary" | "notes" | "ai" | "interview"