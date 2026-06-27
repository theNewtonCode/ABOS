export interface DbProfile {
  id: string
  name: string
  role: string
  degree: string
  location: string
  experience: string
  stack: string
  bio: string
  avatar_url: string | null
  available: boolean
  status_message: string | null
  open_to: string[] | null
  linkedin_url: string | null
  github_url: string | null
  fiverr_url: string | null
  upwork_url: string | null
  email: string | null
  updated_at: string
}

export interface DbSkill {
  id: string
  name: string
  value: number
  category: string
  sort_order: number
  visible: boolean
  updated_at: string
}

export interface DbProject {
  id: string
  name: string
  description: string
  tags: string[] | null
  preview_image_url: string | null
  pdf_url: string | null
  live_url: string | null
  github_url: string | null
  featured: boolean
  visible: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface DbAchievement {
  id: string
  title: string
  issuer: string
  date: string
  image_url: string | null
  verify_url: string | null
  visible: boolean
  sort_order: number
  updated_at: string
}

export interface DbBlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  external_url: string | null
  published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface DbCreativeProject {
  id: string
  name: string
  platform: string
  description: string | null
  url: string | null
  icon: string | null
  visible: boolean
  sort_order: number
  updated_at: string
}

export interface DbSiteConfig {
  key: string
  value: string
  updated_at: string
}
