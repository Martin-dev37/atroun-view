-- ============================================
-- ATROUN CMS Database Schema
-- Run this SQL in Cloud View > Run SQL
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE TABLES
-- ============================================

-- Pages metadata
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  meta_description TEXT,
  meta_keywords TEXT,
  og_image VARCHAR(500),
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hero sections for each page
CREATE TABLE IF NOT EXISTS hero_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_slug VARCHAR(100) REFERENCES pages(slug) ON DELETE CASCADE,
  eyebrow VARCHAR(255),
  title TEXT NOT NULL,
  subtitle TEXT,
  background_image VARCHAR(500),
  background_video VARCHAR(500),
  cta_primary_text VARCHAR(100),
  cta_primary_link VARCHAR(255),
  cta_secondary_text VARCHAR(100),
  cta_secondary_link VARCHAR(255),
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generic content sections
CREATE TABLE IF NOT EXISTS content_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_slug VARCHAR(100) REFERENCES pages(slug) ON DELETE CASCADE,
  section_key VARCHAR(100) NOT NULL,
  title TEXT,
  subtitle TEXT,
  body_content TEXT,
  image VARCHAR(500),
  image_alt VARCHAR(255),
  variant VARCHAR(50) DEFAULT 'default',
  display_order INT DEFAULT 0,
  is_centered BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_slug, section_key)
);

-- ============================================
-- HOME PAGE SPECIFIC
-- ============================================

-- Home highlights/features
CREATE TABLE IF NOT EXISTS home_highlights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  icon VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Statistics/metrics displayed on home
CREATE TABLE IF NOT EXISTS home_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  value VARCHAR(50) NOT NULL,
  label VARCHAR(255) NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ABOUT PAGE
-- ============================================

-- Company values
CREATE TABLE IF NOT EXISTS company_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  icon VARCHAR(50),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team members
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  bio TEXT,
  image VARCHAR(500),
  linkedin_url VARCHAR(500),
  email VARCHAR(255),
  team_type VARCHAR(50) DEFAULT 'leadership',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Milestones/timeline
CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year VARCHAR(10) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WHAT WE DO PAGE
-- ============================================

-- Core capabilities
CREATE TABLE IF NOT EXISTS capabilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  icon VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(500),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product applications (many-to-many)
CREATE TABLE IF NOT EXISTS product_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  application VARCHAR(255) NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Process steps
CREATE TABLE IF NOT EXISTS process_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_context VARCHAR(50) DEFAULT 'what-we-do',
  step_number VARCHAR(10) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(500),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TECHNOLOGY PAGE
-- ============================================

-- Technology features
CREATE TABLE IF NOT EXISTS technology_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  icon VARCHAR(50),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Technology specifications
CREATE TABLE IF NOT EXISTS technology_specs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category VARCHAR(100) NOT NULL,
  spec_name VARCHAR(255) NOT NULL,
  spec_value VARCHAR(255) NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Platform capabilities list items
CREATE TABLE IF NOT EXISTS platform_capabilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MARKETS PAGE
-- ============================================

-- Target markets
CREATE TABLE IF NOT EXISTS markets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  icon VARCHAR(50),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  applications TEXT[],
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Market advantages
CREATE TABLE IF NOT EXISTS market_advantages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  icon VARCHAR(50),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Geographic regions
CREATE TABLE IF NOT EXISTS geographic_regions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  countries TEXT[],
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SUSTAINABILITY PAGE
-- ============================================

-- Sustainability pillars
CREATE TABLE IF NOT EXISTS sustainability_pillars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  icon VARCHAR(50),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Environmental impact metrics
CREATE TABLE IF NOT EXISTS impact_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  icon VARCHAR(50),
  value VARCHAR(100) NOT NULL,
  label VARCHAR(255) NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SDG alignments
CREATE TABLE IF NOT EXISTS sdg_alignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sdg_number INT NOT NULL,
  sdg_name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INVESTORS PAGE
-- ============================================

-- Investment highlights
CREATE TABLE IF NOT EXISTS investment_highlights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  icon VARCHAR(50),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Funding milestones
CREATE TABLE IF NOT EXISTS funding_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phase VARCHAR(100) NOT NULL,
  amount VARCHAR(100),
  timeline VARCHAR(100),
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'planned',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Use of funds breakdown
CREATE TABLE IF NOT EXISTS use_of_funds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category VARCHAR(255) NOT NULL,
  percentage INT,
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQs (can be used for investors and other pages)
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_context VARCHAR(50) DEFAULT 'investors',
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CONTACT PAGE
-- ============================================

-- Contact information
CREATE TABLE IF NOT EXISTS contact_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  info_type VARCHAR(50) NOT NULL,
  icon VARCHAR(50),
  label VARCHAR(255) NOT NULL,
  value TEXT NOT NULL,
  link VARCHAR(500),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Office locations
CREATE TABLE IF NOT EXISTS office_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100),
  country VARCHAR(100),
  phone VARCHAR(50),
  email VARCHAR(255),
  map_embed_url TEXT,
  is_headquarters BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SHARED/GLOBAL
-- ============================================

-- Navigation items
CREATE TABLE IF NOT EXISTS navigation_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label VARCHAR(100) NOT NULL,
  path VARCHAR(255) NOT NULL,
  parent_id UUID REFERENCES navigation_items(id) ON DELETE SET NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Footer content
CREATE TABLE IF NOT EXISTS footer_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section VARCHAR(50) NOT NULL,
  content_key VARCHAR(100) NOT NULL,
  content_value TEXT NOT NULL,
  link VARCHAR(500),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(section, content_key)
);

-- Social media links
CREATE TABLE IF NOT EXISTS social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform VARCHAR(50) NOT NULL,
  url VARCHAR(500) NOT NULL,
  icon VARCHAR(50),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  setting_type VARCHAR(50) DEFAULT 'text',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CTA (Call to Action) blocks - reusable across pages
CREATE TABLE IF NOT EXISTS cta_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_slug VARCHAR(100) REFERENCES pages(slug) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  cta_primary_text VARCHAR(100),
  cta_primary_link VARCHAR(255),
  cta_secondary_text VARCHAR(100),
  cta_secondary_link VARCHAR(255),
  variant VARCHAR(50) DEFAULT 'primary',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE technology_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE technology_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_advantages ENABLE ROW LEVEL SECURITY;
ALTER TABLE geographic_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sustainability_pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE sdg_alignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE funding_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE use_of_funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE office_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cta_blocks ENABLE ROW LEVEL SECURITY;

-- Public read access for all CMS tables (public website)
CREATE POLICY "Public read access" ON pages FOR SELECT USING (true);
CREATE POLICY "Public read access" ON hero_sections FOR SELECT USING (true);
CREATE POLICY "Public read access" ON content_sections FOR SELECT USING (true);
CREATE POLICY "Public read access" ON home_highlights FOR SELECT USING (true);
CREATE POLICY "Public read access" ON home_stats FOR SELECT USING (true);
CREATE POLICY "Public read access" ON company_values FOR SELECT USING (true);
CREATE POLICY "Public read access" ON team_members FOR SELECT USING (true);
CREATE POLICY "Public read access" ON milestones FOR SELECT USING (true);
CREATE POLICY "Public read access" ON capabilities FOR SELECT USING (true);
CREATE POLICY "Public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Public read access" ON product_applications FOR SELECT USING (true);
CREATE POLICY "Public read access" ON process_steps FOR SELECT USING (true);
CREATE POLICY "Public read access" ON technology_features FOR SELECT USING (true);
CREATE POLICY "Public read access" ON technology_specs FOR SELECT USING (true);
CREATE POLICY "Public read access" ON platform_capabilities FOR SELECT USING (true);
CREATE POLICY "Public read access" ON markets FOR SELECT USING (true);
CREATE POLICY "Public read access" ON market_advantages FOR SELECT USING (true);
CREATE POLICY "Public read access" ON geographic_regions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON sustainability_pillars FOR SELECT USING (true);
CREATE POLICY "Public read access" ON impact_metrics FOR SELECT USING (true);
CREATE POLICY "Public read access" ON sdg_alignments FOR SELECT USING (true);
CREATE POLICY "Public read access" ON investment_highlights FOR SELECT USING (true);
CREATE POLICY "Public read access" ON funding_milestones FOR SELECT USING (true);
CREATE POLICY "Public read access" ON use_of_funds FOR SELECT USING (true);
CREATE POLICY "Public read access" ON faqs FOR SELECT USING (true);
CREATE POLICY "Public read access" ON contact_info FOR SELECT USING (true);
CREATE POLICY "Public read access" ON office_locations FOR SELECT USING (true);
CREATE POLICY "Public read access" ON navigation_items FOR SELECT USING (true);
CREATE POLICY "Public read access" ON footer_content FOR SELECT USING (true);
CREATE POLICY "Public read access" ON social_links FOR SELECT USING (true);
CREATE POLICY "Public read access" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read access" ON cta_blocks FOR SELECT USING (true);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_hero_sections_page ON hero_sections(page_slug);
CREATE INDEX idx_content_sections_page ON content_sections(page_slug);
CREATE INDEX idx_team_members_type ON team_members(team_type);
CREATE INDEX idx_process_steps_context ON process_steps(page_context);
CREATE INDEX idx_faqs_context ON faqs(page_context);
CREATE INDEX idx_cta_blocks_page ON cta_blocks(page_slug);

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hero_sections_updated_at BEFORE UPDATE ON hero_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_sections_updated_at BEFORE UPDATE ON content_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_home_highlights_updated_at BEFORE UPDATE ON home_highlights FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_home_stats_updated_at BEFORE UPDATE ON home_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_company_values_updated_at BEFORE UPDATE ON company_values FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_capabilities_updated_at BEFORE UPDATE ON capabilities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_process_steps_updated_at BEFORE UPDATE ON process_steps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_technology_features_updated_at BEFORE UPDATE ON technology_features FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_technology_specs_updated_at BEFORE UPDATE ON technology_specs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_platform_capabilities_updated_at BEFORE UPDATE ON platform_capabilities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_markets_updated_at BEFORE UPDATE ON markets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_market_advantages_updated_at BEFORE UPDATE ON market_advantages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_geographic_regions_updated_at BEFORE UPDATE ON geographic_regions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sustainability_pillars_updated_at BEFORE UPDATE ON sustainability_pillars FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_impact_metrics_updated_at BEFORE UPDATE ON impact_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sdg_alignments_updated_at BEFORE UPDATE ON sdg_alignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_investment_highlights_updated_at BEFORE UPDATE ON investment_highlights FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_funding_milestones_updated_at BEFORE UPDATE ON funding_milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_use_of_funds_updated_at BEFORE UPDATE ON use_of_funds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_info_updated_at BEFORE UPDATE ON contact_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_office_locations_updated_at BEFORE UPDATE ON office_locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_navigation_items_updated_at BEFORE UPDATE ON navigation_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_footer_content_updated_at BEFORE UPDATE ON footer_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_social_links_updated_at BEFORE UPDATE ON social_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cta_blocks_updated_at BEFORE UPDATE ON cta_blocks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
