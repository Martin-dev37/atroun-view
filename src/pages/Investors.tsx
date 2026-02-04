import { Layout } from '@/components/layout/Layout';
import { Section, SectionHeader } from '@/components/ui/section';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Users, Globe, ChevronRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import heroInvestors from '@/assets/hero-investors.jpg';

const highlights = [
  { value: '$4.2B', label: 'Global Market Size' },
  { value: '8.5%', label: 'Annual Growth Rate' },
  { value: '500+', label: 'Partner Farmers' },
  { value: '$2.5M', label: 'Seed Round Target' },
];

const investmentThesis = [
  {
    icon: TrendingUp,
    title: 'High-Growth Market',
    description: 'The freeze-dried food market is projected to reach $7.8B by 2030, driven by demand for clean-label, nutritious products.',
  },
  {
    icon: Target,
    title: 'First-Mover Advantage',
    description: 'ATROUN is the first integrated biorefinery for tropical fruits in East Africa, with established farmer networks and processing infrastructure.',
  },
  {
    icon: Users,
    title: 'Impact-Driven Model',
    description: 'Our circular economy approach creates multiple revenue streams while delivering measurable social and environmental impact.',
  },
  {
    icon: Globe,
    title: 'Export-Ready',
    description: 'Products designed for premium international markets in Europe, North America, and Middle East.',
  },
];

const roadmap = [
  {
    phase: 'Phase 1',
    title: 'Foundation (Current)',
    items: ['Pilot facility operational', 'Farmer network established', 'Initial export partnerships'],
  },
  {
    phase: 'Phase 2',
    title: 'Scale (2025-2026)',
    items: ['Facility expansion 5x capacity', 'ISO/HACCP certification', 'European market entry'],
  },
  {
    phase: 'Phase 3',
    title: 'Growth (2027+)',
    items: ['Second facility in Kenya', 'Product line expansion', 'Series A fundraise'],
  },
];

const faqs = [
  {
    question: 'What is the minimum investment amount?',
    answer: 'We are currently raising a $2.5M seed round with minimum investment of $50,000. For smaller investments, we may offer convertible notes or SAFE agreements.',
  },
  {
    question: 'What are the use of funds?',
    answer: 'Funds will be allocated to facility expansion (40%), working capital for farmer partnerships (30%), international certifications (15%), and team expansion (15%).',
  },
  {
    question: 'What is the expected timeline for returns?',
    answer: 'We project profitability by end of Year 2, with potential exit opportunities through strategic acquisition or Series A within 4-5 years.',
  },
  {
    question: 'How do you measure impact?',
    answer: 'We track farmer income improvements, carbon sequestration through biochar, water usage reduction, and jobs created. All metrics are third-party verified.',
  },
  {
    question: 'What certifications are you pursuing?',
    answer: 'We are pursuing ISO 22000, HACCP, organic certification (EU and USDA), and Fair Trade certification for our products and operations.',
  },
];

export default function Investors() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroInvestors}
            alt="Investment Opportunity"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/70" />
        </div>
        <div className="relative container text-center text-primary-foreground">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight"
          >
            Investor Relations
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-primary-foreground/90 font-body"
          >
            Join us in building the future of sustainable African agriculture.
          </motion.p>
        </div>
      </section>

      {/* Key Highlights */}
      <Section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-display font-bold text-primary">{stat.value}</div>
              <p className="mt-2 text-muted-foreground font-body">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Investment Thesis */}
      <Section variant="muted">
        <SectionHeader
          title="Investment Thesis"
          subtitle="Why ATROUN represents a compelling investment opportunity."
          centered
        />
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          {investmentThesis.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-background rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-semibold">{item.title}</h3>
                  <p className="mt-2 text-muted-foreground font-body">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Roadmap */}
      <Section>
        <SectionHeader
          title="Growth Roadmap"
          subtitle="Our phased approach to scaling impact and returns."
          centered
        />
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {roadmap.map((phase, index) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-primary text-primary-foreground rounded-xl p-6">
                <span className="text-sm font-body opacity-80">{phase.phase}</span>
                <h3 className="mt-1 text-xl font-display font-semibold">{phase.title}</h3>
              </div>
              <div className="mt-4 space-y-3">
                {phase.items.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary" />
                    <span className="text-sm font-body text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* FAQs */}
      <Section variant="muted">
        <SectionHeader
          title="Investor FAQs"
          subtitle="Common questions from potential investors."
          centered
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-background rounded-lg border-none shadow-sm"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline font-display font-semibold text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-muted-foreground font-body">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-display font-semibold">
            Ready to Learn More?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground font-body max-w-2xl mx-auto">
            Request our detailed investor deck and schedule a call with our team.
          </p>
          <motion.a
            href="/contact"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-body font-medium hover:bg-primary/90 transition-colors"
          >
            Request Investor Deck
            <ChevronRight className="w-5 h-5" />
          </motion.a>
        </div>
      </Section>
    </Layout>
  );
}
