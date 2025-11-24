export interface GeneralInfo {
  labName: string
  labShortName: string
  department: string
  university: string
  affiliation: string
  address: string
  recruitingTitle: string
}

export interface ProfessorProfile {
  name: string
  title: string
  affiliation: string
  email: string
  phone: string
  office: string[]
  img: string
  cvLink: string
  bio: string[]
  education: TimelineEntry[]
  career: TimelineEntry[]
}

export interface TimelineEntry {
  year: string
  desc: string
}

export interface MemberProfile {
  name: string
  order: number
  degree: string
  email: string
  currentPos: string
  img: string
}

export interface ResearchIntro {
  ko: string[]
  en: string[]
}

export interface ResearchHighlight {
  title: string
  desc: string
  detail: string
  img: string
  order: number
  slug: string
}

export interface ResearchData {
  intro: ResearchIntro
  highlights: ResearchHighlight[]
}

export interface PublicationEntry {
  year: number
  text: string
  doi: string
  slug: string
}

export interface NewsPost {
  title: string
  date: string
  content: string
  slug: string
  image?: string
}

export interface GalleryImage {
  title: string
  date: string
  img: string
  slug: string
}
