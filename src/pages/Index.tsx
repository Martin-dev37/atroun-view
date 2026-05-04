import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Factory, Globe, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Section, SectionHeader } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { useHeroSection, useHomeHighlights, useContentSections, useCTABlocks } from '@/hooks/useCMS';
import heroImage from '@/assets/hero-home-agriculture.jpg';
import productImage from '@/assets/product-ingredients.jpg';

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Factory,
  Leaf,
  Globe,
  Users,
};

// Fallback data for when CMS is loading or empty
const fallbackHighlights = [
  {
    icon: 'Factory',
    title: 'Integrated Processing',
    description: 'Modular biorefinery systems designed to stabilize agricultural biomass and recover high-value ingredients from local supply chains.',
  },
  {
    icon: 'Leaf',
    title: 'Circular Value Creation',
    description: 'Converting organic residues into carbon-stable soil enhancers, closing material loops and building long-term soil health.',
  },
  {
    icon: 'Globe',
    title: 'Global Market Access',
    description: 'Shelf-stable, export-ready ingredients aligned with international food, cosmetic, and nutraceutical standards.',
  },
  {
    icon: 'Users',
    title: 'Partnership-Driven Growth',
    description: 'Working closely with farmers, suppliers, and buyers to build durable relationships and reliable supply chains.',
  },
];

const Index = () => {
  const { data: heroSections } = useHeroSection('home');
  const { data: highlights } = useHomeHighlights();
  const { data: contentSections } = useContentSections('home');
  const { data: ctaBlocks } = useCTABlocks('home');

  const hero = heroSections?.[0];
  const problemSection = contentSections?.find((s) => s.section_key === 'problem-opportunity');
  const techSection = contentSections?.find((s) => s.section_key === 'technology-preview');
  const ctaBlock = ctaBlocks?.[0];

  const displayHighlights = highlights?.length ? highlights : fallbackHighlights;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${hero?.background_image || heroImage})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-sm font-body font-medium tracking-wider uppercase text-sage mb-4"
            >
              {hero?.eyebrow || 'Agri-Biotech · Biorefinery · Uganda'}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-warm-white leading-[1.1]"
            >
              {hero?.title || "Transforming Uganda's Abundant Agricultural Produce into Lasting Value"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg md:text-xl text-warm-white/80 font-body leading-relaxed"
            >
              {hero?.subtitle ||
                'Using integrated agro-processing infrastructure, ATROUN transforms perishable agricultural produce by freeze-drying into premium powder ingredients for export—while ensuring circular material flows and maximum value recovery by converting by-products and wastes into high-quality biochar.'}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Button asChild size="lg" variant="secondary" className="font-body">
                <Link to={hero?.cta_primary_link || '/what-we-do'}>
                  {hero?.cta_primary_text || 'What We Do'} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="light" className="font-body">
                <Link to={hero?.cta_secondary_link || '/investors'}>
                  {hero?.cta_secondary_text || 'For Investors'}
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem & Opportunity */}
      <Section size="large">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <SectionHeader
              title={problemSection?.title || 'A Structural Challenge Becomes an Opportunity'}
              subtitle={
                problemSection?.subtitle ||
                'In Uganda, over 30% of perishable agricultural produce is lost after harvest due to limited processing capacity and cold-chain infrastructure. Meanwhile, global demand for shelf-stable, nutrient-preserving ingredients continues to grow.'
              }
            />
            <p className="mt-6 text-muted-foreground font-body leading-relaxed">
              {problemSection?.body_content ||
                'ATROUN addresses this by bringing processing closer to the source. Our systems stabilize fresh produce through lyophilization (freeze-drying), extending shelf life from days to years—without refrigeration, without preservatives, and without compromising nutritional integrity.'}
            </p>
            <div className="mt-8">
              <Button asChild variant="default" className="font-body">
                <Link to="/about">
                  Learn About ATROUN <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <img
              src={problemSection?.image || productImage}
              alt={problemSection?.image_alt || 'Freeze-dried avocado ingredients'}
              className="rounded-lg shadow-elevated w-full aspect-square object-cover"
            />
            <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-elevated max-w-xs hidden md:block">
              <p className="text-2xl font-display font-semibold">30%+</p>
              <p className="text-sm font-body text-primary-foreground/80 mt-1">
                Post-harvest losses converted into exportable value
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Highlights Grid */}
      <Section variant="muted">
        <SectionHeader
          title="How We Create Value"
          subtitle="Our approach integrates agricultural sourcing, controlled processing, and market access into a coherent system designed for scale and resilience."
          centered
        />
        <div className="mt-12 md:mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayHighlights.map((item, index) => {
            const IconComponent = iconMap[item.icon] || Factory;
            return (
              <div
                key={item.title}
                className="bg-background p-6 rounded-lg shadow-soft animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-display font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground font-body leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Technology Preview */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 lg:order-1">
            <img
              alt={techSection?.image_alt || 'ATROUN processing facility'}
              className="rounded-lg shadow-elevated w-full aspect-[4/3] object-cover"
              src={techSection?.image || '/lovable-uploads/47078f44-976a-40a1-863a-3bfcbe7c89d0.png'}
            />
          </div>
          <div className="order-1 lg:order-2">
            <SectionHeader
              title={techSection?.title || 'Technology Built for African Conditions'}
              subtitle={
                techSection?.subtitle ||
                'Our platform combines proven lyophilization technology with modular, scalable design principles suited to the realities of East African agriculture.'
              }
            />
            <ul className="mt-8 space-y-4">
              {(techSection?.body_content
                ? techSection.body_content.split('\n').filter(Boolean)
                : [
                    'Feedstock valorization across multiple crop categories',
                    'Controlled processing environments with quality documentation',
                    'Ingredient recovery and fractionation for diverse end markets',
                    'Biochar production from organic residues',
                  ]
              ).map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground font-body">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button asChild variant="default" className="font-body">
                <Link to="/technology">
                  Explore Our Platform <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section variant="primary" size="large">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold">
            {ctaBlock?.title || 'A Platform Built for Long-Term Relevance'}
          </h2>
          <p className="mt-6 text-lg md:text-xl font-body text-primary-foreground/80 leading-relaxed">
            {ctaBlock?.subtitle ||
              "ATROUN is designed as a scalable, replicable model—not a single-project venture. We're building infrastructure that can grow with African agriculture and meet evolving global market demands."}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4 text-primary">
            <Button asChild size="lg" variant="secondary" className="font-body">
              <Link to={ctaBlock?.cta_primary_link || '/investors'}>
                {ctaBlock?.cta_primary_text || 'Investment Overview'} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="light" className="font-body">
              <Link to={ctaBlock?.cta_secondary_link || '/contact'}>
                {ctaBlock?.cta_secondary_text || 'Get in Touch'}
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </Layout>
  );
};

export default Index;
