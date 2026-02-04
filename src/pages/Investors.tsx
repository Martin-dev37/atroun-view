import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, Target, Scale } from 'lucide-react';
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

const faqItems = [
  {
    question: 'What is the addressable market for freeze-dried ingredients?',
    answer: 'The global freeze-dried food market is valued at approximately $60 billion and growing at 7-8% annually. Key drivers include rising demand for convenient, shelf-stable foods with high nutritional retention. Our focus segments—functional foods, nutraceuticals, and premium food service—represent the highest-margin portions of this market, with strong appetite for traceable, sustainably-sourced ingredients.',
  },
  {
    question: 'Why Uganda as a base of operations?',
    answer: 'Uganda offers a compelling combination of agricultural abundance, favorable climate for year-round production, competitive operating costs, and strategic access to both East African and global export markets. The country has established trade agreements, improving infrastructure, and a government supportive of agricultural value addition. Importantly, post-harvest losses in the region exceed 30%, representing both a problem we can address and an opportunity for sourcing quality feedstock.',
  },
  {
    question: 'What are the primary risks and how are they managed?',
    answer: 'Key risks include supply chain consistency, operational execution, and market access. We mitigate supply risk through diversified farmer relationships and multi-crop capability. Execution risk is addressed through phased development—validating operations at pilot scale before major capital deployment. Market risk is reduced by securing offtake relationships early and focusing on established B2B channels rather than consumer markets. Currency and regulatory risks are managed through dollarized contracts where possible and proactive compliance frameworks.',
  },
  {
    question: 'How does the phased investment structure work?',
    answer: 'Our development follows a milestone-based approach. Phase 1 focuses on establishing pilot operations, achieving certifications, and validating unit economics with limited capital. Subsequent phases deploy expansion capital only after commercial proof points are established. This structure protects investor capital by ensuring each stage proves viability before scaling, while maintaining flexibility to adjust based on market feedback.',
  },
  {
    question: 'What partnership structures are available?',
    answer: 'We are open to various partnership structures depending on investor objectives and expertise. These include equity investment in the operating company, project-specific co-investment vehicles, strategic partnerships with offtake commitments, and blended finance structures incorporating development capital. We work with partners to structure arrangements that align incentives and leverage complementary capabilities.',
  },
  {
    question: 'What is the expected timeline to profitability?',
    answer: 'We anticipate reaching operational breakeven within 18-24 months of pilot facility launch, with Phase 1 designed to be cash-flow positive before triggering expansion. Full commercial-scale profitability is projected within 3-4 years of initial investment. These projections are based on validated processing yields, current market pricing, and conservative utilization assumptions.',
  },
  {
    question: 'How do you ensure product quality for export markets?',
    answer: 'Quality assurance is embedded throughout our operations. We are building toward international food safety certifications aligned with EU and major Asian market requirements. Our processing protocols emphasize documentation, traceability, and consistency. Laboratory testing at critical control points verifies product specifications. This discipline positions us to serve demanding B2B customers who require reliable, auditable supply chains.',
  },
  {
    question: 'What governance structures are in place?',
    answer: 'ATROUN maintains governance standards appropriate for institutional investment. This includes independent board oversight, clear reporting frameworks, and financial controls aligned with international standards. We are committed to transparency with investors through regular operational and financial reporting, and we welcome investor representation in governance as partnerships develop.',
  },
];

const investmentHighlights = [
  {
    icon: Target,
    title: 'Clear Market Opportunity',
    description: 'Growing global demand for shelf-stable, nutrient-preserving ingredients meets underserved African agricultural supply chains.',
  },
  {
    icon: Scale,
    title: 'Capital-Efficient Model',
    description: 'Modular design allows phased deployment, reducing upfront capital intensity and enabling validation before scale.',
  },
  {
    icon: TrendingUp,
    title: 'Scalable Platform',
    description: 'Technology and processes designed for replication across crops and geographies as opportunities emerge.',
  },
  {
    icon: Shield,
    title: 'Risk-Aware Execution',
    description: 'Phased approach validates commercial viability before major capital deployment, with clear milestones and governance.',
  },
];

const Investors = () => {
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
              For Investors
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-warm-white leading-[1.1]"
            >
              Building Infrastructure for African Agricultural Value Chains
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg md:text-xl text-warm-white/80 font-body leading-relaxed"
            >
              ATROUN represents an opportunity to invest in processing infrastructure that addresses structural gaps in African agriculture while serving growing global demand for premium, shelf-stable ingredients.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Investment Thesis */}
      <Section size="large">
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            title="Investment Thesis"
            subtitle="A straightforward opportunity at the intersection of agricultural abundance and global market demand."
            centered
          />
          <div className="mt-10 font-body text-muted-foreground leading-relaxed space-y-4">
            <p>
              Uganda and the broader East African region produce significant agricultural abundance, but limited processing infrastructure means much of that value is lost to spoilage or exported as low-margin raw commodities. Post-harvest losses exceed 30% for many perishable crops.
            </p>
            <p>
              At the same time, global demand for freeze-dried and shelf-stable ingredients is growing at approximately 8% annually, driven by consumer interest in convenient, nutritious, and long-lasting food products. The functional foods, nutraceuticals, and natural cosmetics sectors all seek reliable suppliers of premium plant-based inputs.
            </p>
            <p>
              ATROUN bridges this gap by introducing processing capacity at source, converting perishable produce into export-ready ingredients with extended shelf life and strong margin potential. Our integrated approach—combining lyophilization with biochar production—creates multiple value streams while aligning commercial and sustainability objectives.
            </p>
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
          {investmentHighlights.map((item, index) => (
            <div 
              key={item.title}
              className="bg-background p-6 md:p-8 rounded-lg shadow-soft animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold">{item.title}</h3>
              <p className="mt-3 text-muted-foreground font-body leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
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
              Our development model prioritizes capital efficiency and risk management. Rather than building at scale from day one, we establish pilot operations that prove commercial viability, secure quality certifications, and build customer relationships. This approach generates learning and market feedback before major expansion.
            </p>
          </div>
          <div className="space-y-6">
            {[
              {
                phase: 'Phase 1: Pilot Facility',
                investment: 'Initial investment',
                focus: 'Establish processing operations, achieve quality certifications, secure initial export customers, validate unit economics.',
              },
              {
                phase: 'Phase 2: Commercial Scale',
                investment: 'Expansion capital',
                focus: 'Scale processing capacity, expand product range, build distribution relationships, optimize operations.',
              },
              {
                phase: 'Phase 3: Platform Replication',
                investment: 'Growth capital',
                focus: 'Geographic expansion, multi-crop processing, technology refinement, broader market penetration.',
              },
            ].map((item, index) => (
              <div key={item.phase} className="border border-border p-6 rounded-lg">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-body font-semibold">
                    {index + 1}
                  </div>
                  <h4 className="font-display font-semibold">{item.phase}</h4>
                </div>
                <p className="text-sm text-muted-foreground font-body">{item.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Financial Logic */}
      <Section variant="muted">
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            title="Financial Logic"
            subtitle="Our model is built on sound unit economics and realistic market assumptions."
            centered
          />
          <div className="mt-10 space-y-6">
            <div className="bg-background p-6 md:p-8 rounded-lg shadow-soft">
              <h4 className="font-display font-semibold text-lg">Cost Advantage</h4>
              <p className="mt-2 text-muted-foreground font-body">
                Processing in Uganda leverages competitive labor costs, abundant feedstock, and favorable energy options. This positions ATROUN to produce at margins that support both investment returns and market competitiveness.
              </p>
            </div>
            <div className="bg-background p-6 md:p-8 rounded-lg shadow-soft">
              <h4 className="font-display font-semibold text-lg">Premium Pricing</h4>
              <p className="mt-2 text-muted-foreground font-body">
                Freeze-dried ingredients command significant premiums over fresh or conventionally dried products. Our quality focus and documentation discipline support positioning in higher-value market segments.
              </p>
            </div>
            <div className="bg-background p-6 md:p-8 rounded-lg shadow-soft">
              <h4 className="font-display font-semibold text-lg">Multiple Revenue Streams</h4>
              <p className="mt-2 text-muted-foreground font-body">
                Beyond primary ingredient sales, biochar production and potential future carbon certification create additional value streams that improve overall returns and reduce single-product risk.
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
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-border">
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
            title="What We Seek in Partners"
            subtitle="We're looking for investors who share our perspective on building durable infrastructure rather than chasing rapid exits."
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
            Start a Conversation
          </h2>
          <p className="mt-4 text-lg font-body text-primary-foreground/80">
            We welcome inquiries from investors interested in learning more about ATROUN, our development approach, and potential partnership structures.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" variant="secondary" className="font-body">
              <Link to="/contact">
                Contact Us <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </Layout>
  );
};

export default Investors;
