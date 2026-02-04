// CMS Database Types for ATROUN Website

export interface Page {
  id: string;
  slug: string;
  title: string;
  meta_description: string | null;
  meta_keywords: string | null;
  og_image: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface HeroSection {
  id: string;
  page_slug: string;
  eyebrow: string | null;
  title: string;
  subtitle: string | null;
  background_image: string | null;
  background_video: string | null;
  cta_primary_text: string | null;
  cta_primary_link: string | null;
  cta_secondary_text: string | null;
  cta_secondary_link: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ContentSection {
  id: string;
  page_slug: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  body_content: string | null;
  image: string | null;
  image_alt: string | null;
  variant: string;
  display_order: number;
  is_centered: boolean;
  created_at: string;
  updated_at: string;
}

export interface HomeHighlight {
  id: string;
  icon: string;
  title: string;
  description: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HomeStat {
  id: string;
  value: string;
  label: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompanyValue {
  id: string;
  icon: string | null;
  title: string;
  description: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image: string | null;
  linkedin_url: string | null;
  email: string | null;
  team_type: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Capability {
  id: string;
  icon: string;
  title: string;
  description: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  applications?: ProductApplication[];
}

export interface ProductApplication {
  id: string;
  product_id: string;
  application: string;
  display_order: number;
  created_at: string;
}

export interface ProcessStep {
  id: string;
  page_context: string;
  step_number: string;
  title: string;
  description: string;
  image: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TechnologyFeature {
  id: string;
  icon: string | null;
  title: string;
  description: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TechnologySpec {
  id: string;
  category: string;
  spec_name: string;
  spec_value: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlatformCapability {
  id: string;
  text: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Market {
  id: string;
  icon: string | null;
  name: string;
  description: string;
  applications: string[] | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MarketAdvantage {
  id: string;
  icon: string | null;
  title: string;
  description: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GeographicRegion {
  id: string;
  name: string;
  description: string;
  countries: string[] | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SustainabilityPillar {
  id: string;
  icon: string | null;
  title: string;
  description: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ImpactMetric {
  id: string;
  icon: string | null;
  value: string;
  label: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SDGAlignment {
  id: string;
  sdg_number: number;
  sdg_name: string;
  description: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InvestmentHighlight {
  id: string;
  icon: string | null;
  title: string;
  description: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FundingMilestone {
  id: string;
  phase: string;
  amount: string | null;
  timeline: string | null;
  description: string;
  status: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UseOfFunds {
  id: string;
  category: string;
  percentage: number | null;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  page_context: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactInfo {
  id: string;
  info_type: string;
  icon: string | null;
  label: string;
  value: string;
  link: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OfficeLocation {
  id: string;
  name: string;
  address: string;
  city: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  map_embed_url: string | null;
  is_headquarters: boolean;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  parent_id: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FooterContent {
  id: string;
  section: string;
  content_key: string;
  content_value: string;
  link: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  setting_type: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CTABlock {
  id: string;
  page_slug: string;
  title: string;
  subtitle: string | null;
  cta_primary_text: string | null;
  cta_primary_link: string | null;
  cta_secondary_text: string | null;
  cta_secondary_link: string | null;
  variant: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
