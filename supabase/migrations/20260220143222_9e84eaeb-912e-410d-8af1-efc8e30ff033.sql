
-- ============================================
-- ATROUN CMS Database Schema - Migration to Lovable Cloud
-- ============================================

-- Pages metadata
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
CREATE TABLE IF NOT EXISTS public.hero_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug VARCHAR(100) REFERENCES public.pages(slug) ON DELETE CASCADE,
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
CREATE TABLE IF NOT EXISTS public.content_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug VARCHAR(100) REFERENCES public.pages(slug) ON DELETE CASCADE,
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

-- Home highlights/features
CREATE TABLE IF NOT EXISTS public.home_highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Home statistics
CREATE TABLE IF NOT EXISTS public.home_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  value VARCHAR(50) NOT NULL,
  label VARCHAR(255) NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Company values
CREATE TABLE IF NOT EXISTS public.company_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon VARCHAR(50),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team members
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
CREATE TABLE IF NOT EXISTS public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year VARCHAR(10) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Core capabilities
CREATE TABLE IF NOT EXISTS public.capabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(500),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product applications
CREATE TABLE IF NOT EXISTS public.product_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  application VARCHAR(255) NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Process steps
CREATE TABLE IF NOT EXISTS public.process_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Technology features
CREATE TABLE IF NOT EXISTS public.technology_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon VARCHAR(50),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Technology specifications
CREATE TABLE IF NOT EXISTS public.technology_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(100) NOT NULL,
  spec_name VARCHAR(255) NOT NULL,
  spec_value VARCHAR(255) NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Platform capabilities
CREATE TABLE IF NOT EXISTS public.platform_capabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Target markets
CREATE TABLE IF NOT EXISTS public.markets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
CREATE TABLE IF NOT EXISTS public.market_advantages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon VARCHAR(50),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Geographic regions
CREATE TABLE IF NOT EXISTS public.geographic_regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  countries TEXT[],
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sustainability pillars
CREATE TABLE IF NOT EXISTS public.sustainability_pillars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon VARCHAR(50),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CMS Impact metrics (separate from portal impact_metrics)
CREATE TABLE IF NOT EXISTS public.cms_impact_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
CREATE TABLE IF NOT EXISTS public.sdg_alignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sdg_number INT NOT NULL,
  sdg_name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Investment highlights
CREATE TABLE IF NOT EXISTS public.investment_highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon VARCHAR(50),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Funding milestones
CREATE TABLE IF NOT EXISTS public.funding_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Use of funds
CREATE TABLE IF NOT EXISTS public.use_of_funds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(255) NOT NULL,
  percentage INT,
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQs
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_context VARCHAR(50) DEFAULT 'investors',
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact information
CREATE TABLE IF NOT EXISTS public.contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
CREATE TABLE IF NOT EXISTS public.office_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Navigation items
CREATE TABLE IF NOT EXISTS public.navigation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label VARCHAR(100) NOT NULL,
  path VARCHAR(255) NOT NULL,
  parent_id UUID REFERENCES public.navigation_items(id) ON DELETE SET NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Footer content
CREATE TABLE IF NOT EXISTS public.footer_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform VARCHAR(50) NOT NULL,
  url VARCHAR(500) NOT NULL,
  icon VARCHAR(50),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  setting_type VARCHAR(50) DEFAULT 'text',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CTA blocks
CREATE TABLE IF NOT EXISTS public.cta_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug VARCHAR(100) REFERENCES public.pages(slug) ON DELETE CASCADE,
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
-- ROW LEVEL SECURITY - Public read, admin write
-- ============================================

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technology_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technology_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_advantages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geographic_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sustainability_pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_impact_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sdg_alignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funding_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.use_of_funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.office_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cta_blocks ENABLE ROW LEVEL SECURITY;

-- Public read policies for all CMS tables (website content is public)
CREATE POLICY "Public read pages" ON public.pages FOR SELECT USING (true);
CREATE POLICY "Public read hero_sections" ON public.hero_sections FOR SELECT USING (true);
CREATE POLICY "Public read content_sections" ON public.content_sections FOR SELECT USING (true);
CREATE POLICY "Public read home_highlights" ON public.home_highlights FOR SELECT USING (true);
CREATE POLICY "Public read home_stats" ON public.home_stats FOR SELECT USING (true);
CREATE POLICY "Public read company_values" ON public.company_values FOR SELECT USING (true);
CREATE POLICY "Public read team_members" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Public read milestones" ON public.milestones FOR SELECT USING (true);
CREATE POLICY "Public read capabilities" ON public.capabilities FOR SELECT USING (true);
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read product_applications" ON public.product_applications FOR SELECT USING (true);
CREATE POLICY "Public read process_steps" ON public.process_steps FOR SELECT USING (true);
CREATE POLICY "Public read technology_features" ON public.technology_features FOR SELECT USING (true);
CREATE POLICY "Public read technology_specs" ON public.technology_specs FOR SELECT USING (true);
CREATE POLICY "Public read platform_capabilities" ON public.platform_capabilities FOR SELECT USING (true);
CREATE POLICY "Public read markets" ON public.markets FOR SELECT USING (true);
CREATE POLICY "Public read market_advantages" ON public.market_advantages FOR SELECT USING (true);
CREATE POLICY "Public read geographic_regions" ON public.geographic_regions FOR SELECT USING (true);
CREATE POLICY "Public read sustainability_pillars" ON public.sustainability_pillars FOR SELECT USING (true);
CREATE POLICY "Public read cms_impact_metrics" ON public.cms_impact_metrics FOR SELECT USING (true);
CREATE POLICY "Public read sdg_alignments" ON public.sdg_alignments FOR SELECT USING (true);
CREATE POLICY "Public read investment_highlights" ON public.investment_highlights FOR SELECT USING (true);
CREATE POLICY "Public read funding_milestones" ON public.funding_milestones FOR SELECT USING (true);
CREATE POLICY "Public read use_of_funds" ON public.use_of_funds FOR SELECT USING (true);
CREATE POLICY "Public read faqs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Public read contact_info" ON public.contact_info FOR SELECT USING (true);
CREATE POLICY "Public read office_locations" ON public.office_locations FOR SELECT USING (true);
CREATE POLICY "Public read navigation_items" ON public.navigation_items FOR SELECT USING (true);
CREATE POLICY "Public read footer_content" ON public.footer_content FOR SELECT USING (true);
CREATE POLICY "Public read social_links" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public read cta_blocks" ON public.cta_blocks FOR SELECT USING (true);

-- Admin write policies (INSERT, UPDATE, DELETE) for all CMS tables
CREATE POLICY "Admin manage pages" ON public.pages FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage hero_sections" ON public.hero_sections FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage content_sections" ON public.content_sections FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage home_highlights" ON public.home_highlights FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage home_stats" ON public.home_stats FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage company_values" ON public.company_values FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage team_members" ON public.team_members FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage milestones" ON public.milestones FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage capabilities" ON public.capabilities FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage products" ON public.products FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage product_applications" ON public.product_applications FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage process_steps" ON public.process_steps FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage technology_features" ON public.technology_features FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage technology_specs" ON public.technology_specs FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage platform_capabilities" ON public.platform_capabilities FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage markets" ON public.markets FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage market_advantages" ON public.market_advantages FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage geographic_regions" ON public.geographic_regions FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage sustainability_pillars" ON public.sustainability_pillars FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage cms_impact_metrics" ON public.cms_impact_metrics FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage sdg_alignments" ON public.sdg_alignments FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage investment_highlights" ON public.investment_highlights FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage funding_milestones" ON public.funding_milestones FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage use_of_funds" ON public.use_of_funds FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage faqs" ON public.faqs FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage contact_info" ON public.contact_info FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage office_locations" ON public.office_locations FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage navigation_items" ON public.navigation_items FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage footer_content" ON public.footer_content FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage social_links" ON public.social_links FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage site_settings" ON public.site_settings FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage cta_blocks" ON public.cta_blocks FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Auto-update triggers for updated_at
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_hero_sections_updated_at BEFORE UPDATE ON public.hero_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_content_sections_updated_at BEFORE UPDATE ON public.content_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_home_highlights_updated_at BEFORE UPDATE ON public.home_highlights FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_home_stats_updated_at BEFORE UPDATE ON public.home_stats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_company_values_updated_at BEFORE UPDATE ON public.company_values FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON public.milestones FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_capabilities_updated_at BEFORE UPDATE ON public.capabilities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_process_steps_updated_at BEFORE UPDATE ON public.process_steps FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_technology_features_updated_at BEFORE UPDATE ON public.technology_features FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_technology_specs_updated_at BEFORE UPDATE ON public.technology_specs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_platform_capabilities_updated_at BEFORE UPDATE ON public.platform_capabilities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_markets_updated_at BEFORE UPDATE ON public.markets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_market_advantages_updated_at BEFORE UPDATE ON public.market_advantages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_geographic_regions_updated_at BEFORE UPDATE ON public.geographic_regions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_sustainability_pillars_updated_at BEFORE UPDATE ON public.sustainability_pillars FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_cms_impact_metrics_updated_at BEFORE UPDATE ON public.cms_impact_metrics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_sdg_alignments_updated_at BEFORE UPDATE ON public.sdg_alignments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_investment_highlights_updated_at BEFORE UPDATE ON public.investment_highlights FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_funding_milestones_updated_at BEFORE UPDATE ON public.funding_milestones FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_use_of_funds_updated_at BEFORE UPDATE ON public.use_of_funds FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_contact_info_updated_at BEFORE UPDATE ON public.contact_info FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_office_locations_updated_at BEFORE UPDATE ON public.office_locations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_navigation_items_updated_at BEFORE UPDATE ON public.navigation_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_footer_content_updated_at BEFORE UPDATE ON public.footer_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_social_links_updated_at BEFORE UPDATE ON public.social_links FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_cta_blocks_updated_at BEFORE UPDATE ON public.cta_blocks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Performance indexes
CREATE INDEX idx_hero_sections_page ON public.hero_sections(page_slug);
CREATE INDEX idx_content_sections_page ON public.content_sections(page_slug);
CREATE INDEX idx_cta_blocks_page ON public.cta_blocks(page_slug);
CREATE INDEX idx_faqs_context ON public.faqs(page_context);
CREATE INDEX idx_process_steps_context ON public.process_steps(page_context);
CREATE INDEX idx_team_members_type ON public.team_members(team_type);
CREATE INDEX idx_technology_specs_category ON public.technology_specs(category);
