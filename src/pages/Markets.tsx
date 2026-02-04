import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Building, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Section, SectionHeader } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-markets.jpg';

const targetMarkets = [
  {
    region: 'European Union',
    description: 'The EU is the second-largest avocado consumer globally, with growing demand for organic, shelf-stable ingredients in functional foods, nutraceuticals, and natural cosmetics.',
    opportunities: ['Functional food ingredients', 'Cosmetic actives', 'Organic certified products'],
  },
  {
    region: 'Middle East & North Africa',
    description: 'Growing health consciousness and premium food demand, combined with established trade relationships with East Africa.',
    opportunities: ['Health food ingredients', 'Premium retail products', 'Food service inputs'],
  },
  {
    region: 'North America',
    description: 'Large functional food and supplement market with strong consumer interest in plant-based, natural ingredients.',
    opportunities: ['Supplement bases', 'Clean-label ingredients', 'Specialty nutrition'],
  },
  {
    region: 'Asia-Pacific',
    description: 'Rapidly growing markets for functional foods and natural cosmetics, particularly in Japan, South Korea, and emerging Southeast Asian markets.',
    opportunities: ['Cosmetic ingredients', 'Functional food inputs', 'Baby nutrition'],
  },
];

const partnershipModels = [
  {
    icon: Users,
    title: 'Farmer Partnerships',
    description: 'Direct relationships with farming communities provide reliable feedstock while offering farmers stable offtake and fair pricing. We invest in long-term partnerships rather than transactional sourcing.',
  },
  {
    icon: Building,
    title: 'B2B Buyer Relationships',
    description: 'We work with ingredient distributors, food manufacturers, cosmetic formulators, and nutraceutical companies who value quality, consistency, and reliable supply.',
  },
  {
    icon: Globe,
    title: 'Strategic Partnerships',
    description: 'Collaborations with technology providers, logistics partners, and market access organizations that strengthen our value chain and expand our reach.',
  },
  {
    icon: TrendingUp,
    title: 'Investment Partnerships',
    description: 'We seek investors who share our long-term orientation and understand the value of building durable infrastructure in African agricultural value chains.',
  },
];

const Markets = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 md:py-32">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-foreground/85" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-sm font-body font-medium tracking-wider uppercase text-sage mb-4"
            >
              Markets & Partnerships
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-warm-white leading-[1.1]"
            >
              Connecting African Agriculture to Global Markets
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg md:text-xl text-warm-white/80 font-body leading-relaxed"
            >
              ATROUN is positioned to serve growing global demand for shelf-stable, nutrient-preserving ingredients. Our focus on quality, consistency, and reliability makes us a credible partner for B2B buyers across multiple industries.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <Section size="large">
        <SectionHeader
          title="Market Opportunity"
          subtitle="The global market for freeze-dried foods is growing at approximately 8% annually, driven by demand for convenient, nutritious, and long-lasting food options."
          centered
        />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="bg-muted/30 p-6 rounded-lg">
            <p className="text-3xl md:text-4xl font-display font-semibold text-primary">€2.6B</p>
            <p className="mt-2 text-sm text-muted-foreground font-body">European avocado import value (2023)</p>
          </div>
          <div className="bg-muted/30 p-6 rounded-lg">
            <p className="text-3xl md:text-4xl font-display font-semibold text-primary">8%+</p>
            <p className="mt-2 text-sm text-muted-foreground font-body">Annual growth in freeze-dried food market</p>
          </div>
          <div className="bg-muted/30 p-6 rounded-lg">
            <p className="text-3xl md:text-4xl font-display font-semibold text-primary">$35-40M</p>
            <p className="mt-2 text-sm text-muted-foreground font-body">Serviceable market for ATROUN products</p>
          </div>
          <div className="bg-muted/30 p-6 rounded-lg">
            <p className="text-3xl md:text-4xl font-display font-semibold text-primary">Growing</p>
            <p className="mt-2 text-sm text-muted-foreground font-body">Demand for sustainable, ethical sourcing</p>
          </div>
        </div>
      </Section>

      {/* Target Markets */}
      <Section variant="muted">
        <SectionHeader
          title="Target Markets"
          subtitle="We focus on markets with strong demand for quality ingredients and established trade relationships with East Africa."
          centered
        />
        <div className="mt-12 md:mt-16 grid md:grid-cols-2 gap-8">
          {targetMarkets.map((market, index) => (
            <div 
              key={market.region}
              className="bg-background p-6 md:p-8 rounded-lg shadow-soft animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="text-xl font-display font-semibold">{market.region}</h3>
              <p className="mt-3 text-muted-foreground font-body leading-relaxed">
                {market.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {market.opportunities.map((opp) => (
                  <span
                    key={opp}
                    className="inline-block px-3 py-1 text-xs font-body font-medium bg-secondary text-secondary-foreground rounded-full"
                  >
                    {opp}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* End Markets */}
      <Section>
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            title="Industries We Serve"
            subtitle="Our ingredients are designed for B2B applications across multiple industries with growing demand for plant-based, natural, and shelf-stable inputs."
            centered
          />
          <div className="mt-12 space-y-6">
            {[
              {
                industry: 'Functional Foods & Nutraceuticals',
                description: 'Freeze-dried powders for smoothies, supplements, health bars, and specialty nutrition products. Growing consumer demand for natural, nutrient-dense ingredients.',
              },
              {
                industry: 'Cosmetics & Personal Care',
                description: 'Natural actives for skincare, haircare, and beauty formulations. Avocado extracts are valued for their moisturizing and nourishing properties.',
              },
              {
                industry: 'Food Ingredients & Manufacturing',
                description: 'Shelf-stable ingredients for food manufacturers, bakers, and food service operations seeking quality, consistency, and extended shelf life.',
              },
              {
                industry: 'Baby Food & Specialized Nutrition',
                description: 'Nutrient-preserving formats suitable for infant nutrition and specialized dietary applications where quality and safety are paramount.',
              },
            ].map((item) => (
              <div key={item.industry} className="border-l-4 border-accent pl-6 py-2">
                <h4 className="font-display font-semibold text-lg">{item.industry}</h4>
                <p className="mt-1 text-muted-foreground font-body">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Partnership Models */}
      <Section variant="muted">
        <SectionHeader
          title="Partnership Orientation"
          subtitle="ATROUN is built on relationships—with farmers, buyers, service providers, and investors. We seek partners who share our long-term perspective."
          centered
        />
        <div className="mt-12 md:mt-16 grid sm:grid-cols-2 gap-8">
          {partnershipModels.map((item, index) => (
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

      {/* CTA */}
      <Section variant="primary">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-semibold">
            Interested in Partnership?
          </h2>
          <p className="mt-4 text-lg font-body text-primary-foreground/80">
            Whether you're a buyer seeking quality ingredients, an investor exploring opportunities, or an organization looking to collaborate—we'd welcome a conversation.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" variant="secondary" className="font-body">
              <Link to="/contact">
                Get in Touch <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </Layout>
  );
};

export default Markets;
