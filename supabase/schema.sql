-- ============================================================
-- UdayOS Portfolio — Supabase Schema
-- Run once in the Supabase SQL editor
-- ============================================================

CREATE TABLE profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  degree TEXT NOT NULL,
  location TEXT NOT NULL,
  experience TEXT NOT NULL,
  stack TEXT NOT NULL,
  bio TEXT NOT NULL,
  avatar_url TEXT,
  available BOOLEAN DEFAULT true,
  status_message TEXT,
  open_to TEXT[],
  linkedin_url TEXT,
  github_url TEXT,
  fiverr_url TEXT,
  upwork_url TEXT,
  email TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  value INTEGER NOT NULL CHECK (value >= 0 AND value <= 100),
  category TEXT DEFAULT 'general',
  sort_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[],
  preview_image_url TEXT,
  pdf_url TEXT,
  live_url TEXT,
  github_url TEXT,
  featured BOOLEAN DEFAULT false,
  visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT NOT NULL,
  image_url TEXT,
  verify_url TEXT,
  visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  external_url TEXT,
  published BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE creative_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  platform TEXT NOT NULL,
  description TEXT,
  url TEXT,
  icon TEXT,
  visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE site_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO site_config (key, value) VALUES
  ('alert_visible', 'true'),
  ('alert_message', 'Uday is currently open for freelance projects'),
  ('boot_version', 'v2.6.25'),
  ('site_status', 'online');

-- Row Level Security
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read profile"
  ON profile FOR SELECT USING (true);
CREATE POLICY "Public read skills"
  ON skills FOR SELECT USING (visible = true);
CREATE POLICY "Public read projects"
  ON projects FOR SELECT USING (visible = true);
CREATE POLICY "Public read achievements"
  ON achievements FOR SELECT USING (visible = true);
CREATE POLICY "Public read blog"
  ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Public read creative"
  ON creative_projects FOR SELECT USING (visible = true);
CREATE POLICY "Public read config"
  ON site_config FOR SELECT USING (true);
