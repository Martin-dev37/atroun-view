import { useQuery } from '@tanstack/react-query';
import { cmsClient } from '@/lib/cms-client';
import type {
  Page,
  HeroSection,
  ContentSection,
  HomeHighlight,
  HomeStat,
  CompanyValue,
  TeamMember,
  Milestone,
  Capability,
  Product,
  ProcessStep,
  TechnologyFeature,
  TechnologySpec,
  PlatformCapability,
  Market,
  MarketAdvantage,
  GeographicRegion,
  SustainabilityPillar,
  ImpactMetric,
  SDGAlignment,
  InvestmentHighlight,
  FundingMilestone,
  UseOfFunds,
  FAQ,
  ContactInfo,
  OfficeLocation,
  NavigationItem,
  FooterContent,
  SocialLink,
  SiteSetting,
  CTABlock,
} from '@/types/cms';

// Direct fetch helper that bypasses type checking for CMS tables

// Direct fetch helper that bypasses type checking for CMS tables
async function fetchCMSTable<T>(
  tableName: string,
  options?: {
    eq?: [string, unknown][];
    orderBy?: [string, { ascending?: boolean }];
    single?: boolean;
  }
): Promise<T[] | T | null> {
  try {
    let query = (cmsClient as any).from(tableName).select('*');
    
    if (options?.eq) {
      options.eq.forEach(([column, value]) => {
        query = query.eq(column, value);
      });
    }
    
    if (options?.orderBy) {
      query = query.order(options.orderBy[0], options.orderBy[1]);
    }
    
    if (options?.single) {
      const { data, error } = await query.single();
      if (error) throw error;
      return data as T;
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as T[];
  } catch (error) {
    console.error(`Error fetching from ${tableName}:`, error);
    return options?.single ? null : [];
  }
}

// Page hooks
export function usePublishedPages() {
  return useQuery({
    queryKey: ['cms_published_pages'],
    queryFn: () => fetchCMSTable<Page>('pages', {
      eq: [['is_published', true]],
    }) as Promise<Page[]>,
  });
}

export function usePage(slug: string) {
  return useQuery({
    queryKey: ['cms_page', slug],
    queryFn: () => fetchCMSTable<Page>('pages', {
      eq: [['slug', slug], ['is_published', true]],
      single: true,
    }),
  });
}

export function useHeroSection(pageSlug: string) {
  return useQuery({
    queryKey: ['cms_hero_section', pageSlug],
    queryFn: () => fetchCMSTable<HeroSection>('hero_sections', {
      eq: [['page_slug', pageSlug]],
      orderBy: ['display_order', { ascending: true }],
    }) as Promise<HeroSection[]>,
  });
}

export function useContentSections(pageSlug: string) {
  return useQuery({
    queryKey: ['cms_content_sections', pageSlug],
    queryFn: () => fetchCMSTable<ContentSection>('content_sections', {
      eq: [['page_slug', pageSlug]],
      orderBy: ['display_order', { ascending: true }],
    }) as Promise<ContentSection[]>,
  });
}

export function useContentSection(pageSlug: string, sectionKey: string) {
  return useQuery({
    queryKey: ['cms_content_section', pageSlug, sectionKey],
    queryFn: () => fetchCMSTable<ContentSection>('content_sections', {
      eq: [['page_slug', pageSlug], ['section_key', sectionKey]],
      single: true,
    }),
  });
}

// Home page hooks
export function useHomeHighlights() {
  return useQuery({
    queryKey: ['cms_home_highlights'],
    queryFn: () => fetchCMSTable<HomeHighlight>('home_highlights', {
      eq: [['is_active', true]],
      orderBy: ['display_order', { ascending: true }],
    }) as Promise<HomeHighlight[]>,
  });
}

export function useHomeStats() {
  return useQuery({
    queryKey: ['cms_home_stats'],
    queryFn: () => fetchCMSTable<HomeStat>('home_stats', {
      eq: [['is_active', true]],
      orderBy: ['display_order', { ascending: true }],
    }) as Promise<HomeStat[]>,
  });
}

// About page hooks
export function useCompanyValues() {
  return useQuery({
    queryKey: ['cms_company_values'],
    queryFn: () => fetchCMSTable<CompanyValue>('company_values', {
      eq: [['is_active', true]],
      orderBy: ['display_order', { ascending: true }],
    }) as Promise<CompanyValue[]>,
  });
}

export function useTeamMembers(teamType?: string) {
  return useQuery({
    queryKey: ['cms_team_members', teamType],
    queryFn: () => fetchCMSTable<TeamMember>('team_members', {
      eq: teamType 
        ? [['is_active', true], ['team_type', teamType]] 
        : [['is_active', true]],
      orderBy: ['display_order', { ascending: true }],
    }) as Promise<TeamMember[]>,
  });
}

export function useMilestones() {
  return useQuery({
    queryKey: ['cms_milestones'],
    queryFn: () => fetchCMSTable<Milestone>('milestones', {
      eq: [['is_active', true]],
      orderBy: ['display_order', { ascending: true }],
    }) as Promise<Milestone[]>,
  });
}

// What We Do hooks
export function useCapabilities() {
  return useQuery({
    queryKey: ['cms_capabilities'],
    queryFn: () => fetchCMSTable<Capability>('capabilities', {
      eq: [['is_active', true]],
      orderBy: ['display_order', { ascending: true }],
    }) as Promise<Capability[]>,
  });
}

export function useProducts() {
  return useQuery({
    queryKey: ['cms_products'],
    queryFn: async () => {
      const products = await fetchCMSTable<Product>('products', {
        eq: [['is_active', true]],
        orderBy: ['display_order', { ascending: true }],
      }) as Product[];
      
      // Fetch applications for each product
      const productsWithApps = await Promise.all(
        products.map(async (product) => {
          const applications = await fetchCMSTable('product_applications', {
            eq: [['product_id', product.id]],
            orderBy: ['display_order', { ascending: true }],
          });
          
          return { ...product, applications: applications || [] };
        })
      );
      
      return productsWithApps as Product[];
    },
  });
}

export function useProcessSteps(pageContext: string = 'what-we-do') {
  return useQuery({
    queryKey: ['cms_process_steps', pageContext],
    queryFn: () => fetchCMSTable<ProcessStep>('process_steps', {
      eq: [['is_active', true], ['page_context', pageContext]],
      orderBy: ['display_order', { ascending: true }],
    }) as Promise<ProcessStep[]>,
  });
}

// Technology hooks
export function useTechnologyFeatures() {
  return useQuery({
    queryKey: ['cms_technology_features'],
    queryFn: () => fetchCMSTable<TechnologyFeature>('technology_features', {
      eq: [['is_active', true]],
      orderBy: ['display_order', { ascending: true }],
    }) as Promise<TechnologyFeature[]>,
  });
}

export function useTechnologySpecs(category?: string) {
  return useQuery({
    queryKey: ['cms_technology_specs', category],
    queryFn: () => fetchCMSTable<TechnologySpec>('technology_specs', {
      eq: category 
        ? [['is_active', true], ['category', category]] 
        : [['is_active', true]],
      orderBy: ['display_order', { ascending: true }],
    }) as Promise<TechnologySpec[]>,
  });
}

export function usePlatformCapabilities() {
  return useQuery({
    queryKey: ['cms_platform_capabilities'],
    queryFn: () => fetchCMSTable<PlatformCapability>('platform_capabilities', {
      eq: [['is_active', true]],
      orderBy: ['display_order', { ascending: true }],
    }) as Promise<PlatformCapability[]>,
  });
}

// Markets hooks
export function useMarkets() {
  return useQuery({
    queryKey: ['cms_markets'],
    queryFn: () => fetchCMSTable<Market>('markets', {
      eq: [['is_active', true]],
      orderBy: ['display_order', { ascending: true }],
    }) as Promise<Market[]>,
  });
}

export function useMarketAdvantages() {
  return useQuery({
    queryKey: ['cms_market_advantages'],
    queryFn: () => fetchCMSTable<MarketAdvantage>('market_advantages', {
      eq: [['is_active', true]],
      orderBy: ['display_order', { ascending: true }],
    }) as Promise<MarketAdvantage[]>,
  });
}

export function useGeographicRegions() {
  return useQuery({
    queryKey: ['cms_geographic_regions'],
    queryFn: () => fetchCMSTable<GeographicRegion>('geographic_regions', {
      eq: [['is_active', true]],
      orderBy: ['display_order', { ascending: true }],
    }) as Promise<GeographicRegion[]>,
  });
}

// Sustainability hooks
export function useSustainabilityPillars() {
  return useQuery({
    queryKey: ['cms_sustainability_pillars'],
    queryFn: () => fetchCMSTable<SustainabilityPillar>('sustainability_pillars', {
      eq: [['is_active', true]],
      orderBy: ['display_order', { ascending: true }],
    }) as Promise<SustainabilityPillar[]>,
  });
}

export function useImpactMetrics() {
  return useQuery({
    queryKey: ['cms_impact_metrics'],
    queryFn: () => fetchCMSTable<ImpactMetric>('cms_impact_metrics', {
      eq: [['is_active', true]],
      orderBy: ['display_order', { ascending: true }],
    }) as Promise<ImpactMetric[]>,
  });
}

export function useSDGAlignments() {
  return useQuery({
    queryKey: ['cms_sdg_alignments'],
    queryFn: () => fetchCMSTable<SDGAlignment>('sdg_alignments', {
      eq: [['is_active', true]],
      orderBy: ['display_order', { ascending: true }],
    }) as Promise<SDGAlignment[]>,
  });
}

// Investors hooks
export function useInvestmentHighlights() {
  return useQuery({
    queryKey: ['cms_investment_highlights'],
    queryFn: () => fetchCMSTable<InvestmentHighlight>('investment_highlights', {
      eq: [['is_active', true]],
      orderBy: ['display_order', { ascending: true }],
    }) as Promise<InvestmentHighlight[]>,
  });
}

export function useFundingMilestones() {
  return useQuery({
    queryKey: ['cms_funding_milestones'],
    queryFn: () => fetchCMSTable<FundingMilestone>('funding_milestones', {
      eq: [['is_active', true]],
      orderBy: ['display_order', { ascending: true }],
    }) as Promise<FundingMilestone[]>,
  });
}

export function useUseOfFunds() {
  return useQuery({
    queryKey: ['cms_use_of_funds'],
    queryFn: () => fetchCMSTable<UseOfFunds>('use_of_funds', {
      eq: [['is_active', true]],
      orderBy: ['display_order', { ascending: true }],
    }) as Promise<UseOfFunds[]>,
  });
}

export function useFAQs(pageContext: string = 'investors') {
  return useQuery({
    queryKey: ['cms_faqs', pageContext],
    queryFn: () => fetchCMSTable<FAQ>('faqs', {
      eq: [['is_active', true], ['page_context', pageContext]],
      orderBy: ['display_order', { ascending: true }],
    }) as Promise<FAQ[]>,
  });
}

// Contact hooks
export function useContactInfo() {
  return useQuery({
    queryKey: ['cms_contact_info'],
    queryFn: () => fetchCMSTable<ContactInfo>('contact_info', {
      eq: [['is_active', true]],
      orderBy: ['display_order', { ascending: true }],
    }) as Promise<ContactInfo[]>,
  });
}

export function useOfficeLocations() {
  return useQuery({
    queryKey: ['cms_office_locations'],
    queryFn: () => fetchCMSTable<OfficeLocation>('office_locations', {
      eq: [['is_active', true]],
      orderBy: ['display_order', { ascending: true }],
    }) as Promise<OfficeLocation[]>,
  });
}

// Navigation and layout hooks
export function useNavigationItems() {
  return useQuery({
    queryKey: ['cms_navigation_items'],
    queryFn: () => fetchCMSTable<NavigationItem>('navigation_items', {
      eq: [['is_active', true]],
      orderBy: ['display_order', { ascending: true }],
    }) as Promise<NavigationItem[]>,
  });
}

export function useFooterContent(section?: string) {
  return useQuery({
    queryKey: ['cms_footer_content', section],
    queryFn: () => fetchCMSTable<FooterContent>('footer_content', {
      eq: section 
        ? [['is_active', true], ['section', section]] 
        : [['is_active', true]],
      orderBy: ['display_order', { ascending: true }],
    }) as Promise<FooterContent[]>,
  });
}

export function useSocialLinks() {
  return useQuery({
    queryKey: ['cms_social_links'],
    queryFn: () => fetchCMSTable<SocialLink>('social_links', {
      eq: [['is_active', true]],
      orderBy: ['display_order', { ascending: true }],
    }) as Promise<SocialLink[]>,
  });
}

export function useSiteSetting(key: string) {
  return useQuery({
    queryKey: ['cms_site_setting', key],
    queryFn: () => fetchCMSTable<SiteSetting>('site_settings', {
      eq: [['setting_key', key]],
      single: true,
    }),
  });
}

export function useCTABlocks(pageSlug: string) {
  return useQuery({
    queryKey: ['cms_cta_blocks', pageSlug],
    queryFn: () => fetchCMSTable<CTABlock>('cta_blocks', {
      eq: [['page_slug', pageSlug], ['is_active', true]],
      orderBy: ['display_order', { ascending: true }],
    }) as Promise<CTABlock[]>,
  });
}
