import { Layout } from '@/components/layout/Layout';
import { Section, SectionHeader } from '@/components/ui/section';
import { motion } from 'framer-motion';
import { Globe, TrendingUp, Users, Building, Handshake, Target } from 'lucide-react';
import heroMarkets from '@/assets/hero-markets.jpg';

const marketSegments = [
  {
    icon: Building,
    title: 'Food & Beverage Industry',
    description: 'Ingredients for premium food manufacturers, beverage companies, and restaurant chains.',
    growth: '12% CAGR',
  },
  {
    icon: Users,
    title: 'Health & Wellness',
    description: 'Natural ingredients for supplements, functional foods, and nutraceuticals.',
    growth: '18% CAGR',
  },
  {
    icon: Globe,
    title: 'Cosmetics & Personal Care',
    description: 'Bio-based ingredients for skincare, haircare, and natural beauty products.',
    growth: '15% CAGR',
  },
];

const targetRegions = [
  { name: 'Europe', percentage: 45 },
  { name: 'North America', percentage: 30 },
  { name: 'Middle East', percentage: 15 },
  { name: 'Asia Pacific', percentage: 10 },
];

const partnershipModels = [
  {
    icon: Handshake,
    title: 'Contract Manufacturing',
    description: 'Custom freeze-dried products under your brand specifications.',
  },
  {
    icon: Target,
    title: 'White Label',
    description: 'Ready-to-market products with your branding and packaging.',
  },
  {
    icon: TrendingUp,
    title: 'Ingredient Supply',
    description: 'Bulk supply of freeze-dried ingredients for your production.',
  },
];

export default function Markets() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroMarkets}
            alt="Global Markets"
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
            Markets & Partnerships
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-primary-foreground/90 font-body"
          >
            Connecting African agriculture to premium global markets.
          </motion.p>
        </div>
      </section>

      {/* Market Opportunity */}
      <Section>
        <SectionHeader
          title="Market Opportunity"
          subtitle="The global freeze-dried food market is experiencing unprecedented growth, driven by demand for clean-label, nutritious, and convenient products."
          centered
        />
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary text-primary-foreground rounded-xl p-8 text-center"
          >
            <div className="text-5xl font-display font-bold">$4.2B</div>
            <p className="mt-2 font-body opacity-80">Global Market Size (2024)</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-primary text-primary-foreground rounded-xl p-8 text-center"
          >
            <div className="text-5xl font-display font-bold">8.5%</div>
            <p className="mt-2 font-body opacity-80">Annual Growth Rate</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-primary text-primary-foreground rounded-xl p-8 text-center"
          >
            <div className="text-5xl font-display font-bold">$7.8B</div>
            <p className="mt-2 font-body opacity-80">Projected by 2030</p>
          </motion.div>
        </div>
      </Section>

      {/* Market Segments */}
      <Section variant="muted">
        <SectionHeader
          title="Target Market Segments"
          subtitle="We serve diverse industries with specialized product solutions."
          centered
        />
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {marketSegments.map((segment, index) => (
            <motion.div
              key={segment.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-background rounded-xl p-6 shadow-sm"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <segment.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-display font-semibold">{segment.title}</h3>
              <p className="mt-2 text-muted-foreground font-body">{segment.description}</p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-body font-medium text-primary">
                <TrendingUp className="w-4 h-4" />
                {segment.growth}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Geographic Focus */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeader
              title="Geographic Focus"
              subtitle="Strategic market prioritization based on demand, regulatory alignment, and growth potential."
            />
            <div className="mt-8 space-y-4">
              {targetRegions.map((region) => (
                <div key={region.name}>
                  <div className="flex justify-between text-sm font-body mb-1">
                    <span>{region.name}</span>
                    <span className="text-muted-foreground">{region.percentage}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${region.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square bg-muted rounded-xl flex items-center justify-center"
          >
            <Globe className="w-32 h-32 text-primary/20" />
            <p className="absolute text-center text-muted-foreground font-body px-8">
              Global distribution network serving 4 continents
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Partnership Models */}
      <Section variant="muted">
        <SectionHeader
          title="Partnership Models"
          subtitle="Flexible engagement options tailored to your business needs."
          centered
        />
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {partnershipModels.map((model, index) => (
            <motion.div
              key={model.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-background rounded-xl p-6 shadow-sm text-center"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <model.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-display font-semibold">{model.title}</h3>
              <p className="mt-2 text-muted-foreground font-body">{model.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-display font-semibold">
            Ready to Partner?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground font-body max-w-2xl mx-auto">
            Let's discuss how ATROUN can supply premium freeze-dried products for your business.
          </p>
          <motion.a
            href="/contact"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-body font-medium hover:bg-primary/90 transition-colors"
          >
            Contact Us
            <Globe className="w-5 h-5" />
          </motion.a>
        </div>
      </Section>
    </Layout>
  );
}
