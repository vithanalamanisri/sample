export interface ResumeData {
  id?: string;
  userId?: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
    summary: string;
  };
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  createdAt?: any;
  updatedAt?: any;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  grade?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface ATSAnalysis {
  score: number;
  feedback: string[];
  missingKeywords: string[];
  grammarIssues: string[];
  impactSuggestions: string[];
}

export interface InterviewQuestion {
  id: string;
  question: string;
  type: 'technical' | 'hr';
  expectedAnswer?: string;
}
