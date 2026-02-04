import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, Target, Scale, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Section, SectionHeader } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import heroVideo from '@/assets/hero-investors-video.mp4';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  useHeroSection,
  useContentSections,
  useInvestmentHighlights,
  useFundingMilestones,
  useFAQs,
  useCTABlocks,
} from '@/hooks/useCMS';

const iconMap: Record<string, LucideIcon> = {
  Target,
  Scale,
  TrendingUp,
  Shield,
};

// Fallback data
const fallbackFAQs = [
  {
    id: '1',
    question: 'What is the addressable market for freeze-dried ingredients?',
    answer: 'The global freeze-dried food market is valued at approximately $60 billion and growing at 7-8% annually. Key drivers include rising demand for convenient, shelf-stable foods with high nutritional retention.',
    display_order: 1,
    page_context: 'investors',
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    question: 'Why Uganda as a base of operations?',
    answer: 'Uganda offers a compelling combination of agricultural abundance, favorable climate for year-round production, competitive operating costs, and strategic access to both East African and global export markets.',
    display_order: 2,
    page_context: 'investors',
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    question: 'What are the primary risks and how are they managed?',
    answer: 'Key risks include supply chain consistency, operational execution, and market access. We mitigate supply risk through diversified farmer relationships and multi-crop capability.',
    display_order: 3,
    page_context: 'investors',
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '4',
    question: 'How does the phased investment structure work?',
    answer: 'Our development follows a milestone-based approach. Phase 1 focuses on establishing pilot operations, achieving certifications, and validating unit economics with limited capital.',
    display_order: 4,
    page_context: 'investors',
    is_active: true,
    created_at: '',
    updated_at: '',
  },
];

const fallbackHighlights = [
  {
    id: '1',
    icon: 'Target',
    title: 'Clear Market Opportunity',
    description: 'Growing global demand for shelf-stable, nutrient-preserving ingredients meets underserved African agricultural supply chains.',
    display_order: 1,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    icon: 'Scale',
    title: 'Capital-Efficient Model',
    description: 'Modular design allows phased deployment, reducing upfront capital intensity and enabling validation before scale.',
    display_order: 2,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    icon: 'TrendingUp',
    title: 'Scalable Platform',
    description: 'Technology and processes designed for replication across crops and geographies as opportunities emerge.',
    display_order: 3,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '4',
    icon: 'Shield',
    title: 'Risk-Aware Execution',
    description: 'Phased approach validates commercial viability before major capital deployment, with clear milestones and governance.',
    display_order: 4,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
];

const fallbackMilestones = [
  {
    id: '1',
    phase: 'Phase 1: Pilot Facility',
    description: 'Establish processing operations, achieve quality certifications, secure initial export customers, validate unit economics.',
    amount: null,
    timeline: null,
    status: 'planned',
    display_order: 1,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    phase: 'Phase 2: Commercial Scale',
    description: 'Scale processing capacity, expand product range, build distribution relationships, optimize operations.',
    amount: null,
    timeline: null,
    status: 'planned',
    display_order: 2,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    phase: 'Phase 3: Platform Replication',
    description: 'Geographic expansion, multi-crop processing, technology refinement, broader market penetration.',
    amount: null,
    timeline: null,
    status: 'planned',
    display_order: 3,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
];

const Investors = () => {
  const { data: heroSections } = useHeroSection('investors');
  const { data: contentSections } = useContentSections('investors');
  const { data: cmsHighlights } = useInvestmentHighlights();
  const { data: cmsMilestones } = useFundingMilestones();
  const { data: cmsFAQs } = useFAQs('investors');
  const { data: ctaBlocks } = useCTABlocks('investors');

  const hero = heroSections?.[0];
  const investmentThesis = contentSections?.find(s => s.section_key === 'investment_thesis');
  const financialLogic = contentSections?.find(s => s.section_key === 'financial_logic');
  const partnerQualities = contentSections?.find(s => s.section_key === 'partner_qualities');
  const highlights = cmsHighlights?.length ? cmsHighlights : fallbackHighlights;
  const milestones = cmsMilestones?.length ? cmsMilestones : fallbackMilestones;
  const faqs = cmsFAQs?.length ? cmsFAQs : fallbackFAQs;
  const cta = ctaBlocks?.[0];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 md:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-foreground/75" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-sm font-body font-medium tracking-wider uppercase text-sage mb-4"
            >
              {hero?.eyebrow || 'For Investors'}
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-warm-white leading-[1.1]"
            >
              {hero?.title || 'Building Infrastructure for African Agricultural Value Chains'}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg md:text-xl text-warm-white/80 font-body leading-relaxed"
            >
              {hero?.subtitle || 'ATROUN represents an opportunity to invest in processing infrastructure that addresses structural gaps in African agriculture while serving growing global demand for premium, shelf-stable ingredients.'}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Investment Thesis */}
      <Section size="large">
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            title={investmentThesis?.title || 'Investment Thesis'}
            subtitle={investmentThesis?.subtitle || 'A straightforward opportunity at the intersection of agricultural abundance and global market demand.'}
            centered
          />
          <div className="mt-10 font-body text-muted-foreground leading-relaxed space-y-4">
            {investmentThesis?.body_content ? (
              <div dangerouslySetInnerHTML={{ __html: investmentThesis.body_content }} />
            ) : (
              <>
                <p>
                  Uganda and the broader East African region produce significant agricultural abundance, but limited processing infrastructure means much of that value is lost to spoilage or exported as low-margin raw commodities. Post-harvest losses exceed 30% for many perishable crops.
                </p>
                <p>
                  At the same time, global demand for freeze-dried and shelf-stable ingredients is growing at approximately 8% annually, driven by consumer interest in convenient, nutritious, and long-lasting food products.
                </p>
                <p>
                  ATROUN bridges this gap by introducing processing capacity at source, converting perishable produce into export-ready ingredients with extended shelf life and strong margin potential.
                </p>
              </>
            )}
          </div>
        </div>
      </Section>

      {/* Highlights */}
      <Section variant="muted">
        <SectionHeader
          title="Investment Highlights"
          centered
        />
        <div className="mt-12 md:mt-16 grid sm:grid-cols-2 gap-8">
          {highlights.map((item, index) => {
            const IconComponent = iconMap[item.icon || ''] || Target;
            return (
              <div 
                key={item.id}
                className="bg-background p-6 md:p-8 rounded-lg shadow-soft animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold">{item.title}</h3>
                <p className="mt-3 text-muted-foreground font-body leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Phased Approach */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <SectionHeader
              title="Phased Development Approach"
              subtitle="We're building in stages, validating commercial assumptions before deploying significant capital."
            />
            <p className="mt-6 text-muted-foreground font-body leading-relaxed">
              Our development model prioritizes capital efficiency and risk management. Rather than building at scale from day one, we establish pilot operations that prove commercial viability, secure quality certifications, and build customer relationships.
            </p>
          </div>
          <div className="space-y-6">
            {milestones.map((item, index) => (
              <div key={item.id} className="border border-border p-6 rounded-lg">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-body font-semibold">
                    {index + 1}
                  </div>
                  <h4 className="font-display font-semibold">{item.phase}</h4>
                </div>
                <p className="text-sm text-muted-foreground font-body">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Financial Logic */}
      <Section variant="muted">
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            title={financialLogic?.title || 'Financial Logic'}
            subtitle={financialLogic?.subtitle || 'Our model is built on sound unit economics and realistic market assumptions.'}
            centered
          />
          <div className="mt-10 space-y-6">
            <div className="bg-background p-6 md:p-8 rounded-lg shadow-soft">
              <h4 className="font-display font-semibold text-lg">Cost Advantage</h4>
              <p className="mt-2 text-muted-foreground font-body">
                Processing in Uganda leverages competitive labor costs, abundant feedstock, and favorable energy options.
              </p>
            </div>
            <div className="bg-background p-6 md:p-8 rounded-lg shadow-soft">
              <h4 className="font-display font-semibold text-lg">Premium Pricing</h4>
              <p className="mt-2 text-muted-foreground font-body">
                Freeze-dried ingredients command significant premiums over fresh or conventionally dried products.
              </p>
            </div>
            <div className="bg-background p-6 md:p-8 rounded-lg shadow-soft">
              <h4 className="font-display font-semibold text-lg">Multiple Revenue Streams</h4>
              <p className="mt-2 text-muted-foreground font-body">
                Beyond primary ingredient sales, biochar production and potential future carbon certification create additional value streams.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section>
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            title="Frequently Asked Questions"
            subtitle="Common questions from investors and partners about ATROUN's opportunity, approach, and structure."
            centered
          />
          <div className="mt-10">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((item, index) => (
                <AccordionItem key={item.id} value={`item-${index}`} className="border-border">
                  <AccordionTrigger className="text-left font-display font-medium text-base md:text-lg hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground font-body leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Section>

      {/* What We Seek */}
      <Section>
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeader
            title={partnerQualities?.title || 'What We Seek in Partners'}
            subtitle={partnerQualities?.subtitle || "We're looking for investors who share our perspective on building durable infrastructure rather than chasing rapid exits."}
            centered
          />
          <div className="mt-10 grid sm:grid-cols-2 gap-6 text-left">
            <div className="border border-border p-6 rounded-lg">
              <h4 className="font-display font-semibold">Long-Term Orientation</h4>
              <p className="mt-2 text-sm text-muted-foreground font-body">
                Understanding that infrastructure businesses build value over time through operational excellence and market position.
              </p>
            </div>
            <div className="border border-border p-6 rounded-lg">
              <h4 className="font-display font-semibold">Sector Knowledge</h4>
              <p className="mt-2 text-sm text-muted-foreground font-body">
                Familiarity with agricultural value chains, food processing, or African market dynamics adds strategic value.
              </p>
            </div>
            <div className="border border-border p-6 rounded-lg">
              <h4 className="font-display font-semibold">Patient Capital</h4>
              <p className="mt-2 text-sm text-muted-foreground font-body">
                Comfort with phased development and realistic timelines for building operational capacity.
              </p>
            </div>
            <div className="border border-border p-6 rounded-lg">
              <h4 className="font-display font-semibold">Values Alignment</h4>
              <p className="mt-2 text-sm text-muted-foreground font-body">
                Appreciation for businesses that create environmental and social value alongside financial returns.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section variant="primary">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-semibold">
            {cta?.title || 'Start a Conversation'}
          </h2>
          <p className="mt-4 text-lg font-body text-primary-foreground/80">
            {cta?.subtitle || 'We welcome inquiries from investors interested in learning more about ATROUN, our development approach, and potential partnership structures.'}
          </p>
          <div className="mt-8">
            <Button asChild size="lg" variant="secondary" className="font-body">
              <Link to={cta?.cta_primary_link || '/contact'}>
                {cta?.cta_primary_text || 'Contact Us'} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </Layout>
  );
};

export default Investors;