import { Link } from 'react-router-dom';
import { ArrowRight, Package, Droplets, Leaf, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Section, SectionHeader } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-whatwedo.jpg';
import productImage from '@/assets/product-ingredients.jpg';
import heroHomeImage from '@/assets/hero-home-agriculture.jpg';

const capabilities = [
  {
    icon: Package,
    title: 'Feedstock Sourcing & Aggregation',
    description: 'We work directly with farming communities to source fresh produce, focusing on crops that offer strong value addition potential. Our aggregation model provides farmers with reliable offtake and reduces exposure to price volatility.',
  },
  {
    icon: Droplets,
    title: 'Lyophilization & Ingredient Recovery',
    description: 'Using freeze-drying technology, we stabilize perishable biomass by removing moisture at low temperatures. This preserves nutritional content, flavor, and color while extending shelf life from days to years without refrigeration.',
  },
  {
    icon: Leaf,
    title: 'Biochar & Circular Processing',
    description: 'Organic residues from processing are converted into biochar through controlled pyrolysis. This transforms waste streams into carbon-stable soil enhancers, closing material loops and generating additional value.',
  },
  {
    icon: Truck,
    title: 'Export-Ready Packaging & Distribution',
    description: 'Our finished products are packaged to international standards for food, cosmetic, and nutraceutical applications. Lightweight, shelf-stable formats reduce logistics costs and expand market access.',
  },
];

const products = [
  {
    name: 'Freeze-Dried Avocado Products',
    applications: ['Functional foods', 'Nutraceutical formulations', 'Cosmetic ingredients', 'Baby food nutrition'],
    description: 'Premium freeze-dried avocado powder and pieces that retain the nutritional profile, healthy fats, and natural color of fresh fruit.',
  },
  {
    name: 'Freeze-Dried Fruits & Botanicals',
    applications: ['Food ingredients', 'Supplement bases', 'Natural cosmetic actives'],
    description: 'Expanding range of freeze-dried tropical fruits, herbs, and botanical extracts suited to diverse end-market requirements.',
  },
  {
    name: 'Biochar Soil Amendments',
    applications: ['Agricultural soil enhancement', 'Carbon sequestration', 'Regenerative farming inputs'],
    description: 'Carbon-stable biochar produced from processing residues, improving soil structure, water retention, and nutrient efficiency.',
  },
];

const WhatWeDo = () => {
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
              What We Do
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-warm-white leading-[1.1]"
            >
              Transforming Agricultural Biomass into Premium Ingredients
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg md:text-xl text-warm-white/80 font-body leading-relaxed"
            >
              ATROUN operates at the intersection of agricultural sourcing, controlled processing, and global market access. We take perishable produce that would otherwise be lost and convert it into shelf-stable, high-value ingredients.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <Section size="large">
        <SectionHeader
          title="Our Integrated Approach"
          subtitle="We don't operate in isolation. Each stage of our process connects to the next, creating a coherent system from farm to end market."
          centered
        />
        <div className="mt-12 md:mt-16 grid md:grid-cols-2 gap-8">
          {capabilities.map((item, index) => (
            <div 
              key={item.title}
              className="bg-muted/30 p-6 md:p-8 rounded-lg animate-fade-in"
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

      {/* Products */}
      <Section variant="muted">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <SectionHeader
              title="What We Produce"
              subtitle="Our initial focus is on avocado-based ingredients, with planned expansion into additional high-value crops suited to the East African agricultural context."
            />
            <div className="mt-8">
              <img
                src={productImage}
                alt="ATROUN freeze-dried products"
                className="rounded-lg shadow-soft w-full aspect-[4/3] object-cover"
              />
            </div>
          </div>
          <div className="space-y-8">
            {products.map((product) => (
              <div key={product.name} className="bg-background p-6 rounded-lg shadow-soft">
                <h3 className="text-lg font-display font-semibold">{product.name}</h3>
                <p className="mt-2 text-muted-foreground font-body text-sm leading-relaxed">
                  {product.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.applications.map((app) => (
                    <span
                      key={app}
                      className="inline-block px-3 py-1 text-xs font-body font-medium bg-secondary text-secondary-foreground rounded-full"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Process Flow */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 lg:order-1">
            <img
              src="/lovable-uploads/47078f44-976a-40a1-863a-3bfcbe7c89d0.png"
              alt="ATROUN processing facility"
              className="rounded-lg shadow-elevated w-full aspect-[4/3] object-cover"
            />
          </div>
          <div className="order-1 lg:order-2">
            <SectionHeader
              title="From Harvest to Market"
              subtitle="Our process is designed for consistency, quality, and traceability at every stage."
            />
            <div className="mt-8 space-y-6">
              {[
                { step: '01', title: 'Harvest & Aggregation', desc: 'Fresh produce sourced from partner farming communities and aggregated at collection points.' },
                { step: '02', title: 'Quality Assessment', desc: 'Incoming materials inspected for moisture content, ripeness, and quality standards.' },
                { step: '03', title: 'Controlled Processing', desc: 'Lyophilization preserves nutrients and extends shelf life. Residues directed to biochar production.' },
                { step: '04', title: 'Packaging & Distribution', desc: 'Finished ingredients packaged to international standards and prepared for export.' },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-body font-semibold">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-display font-semibold">{item.title}</h4>
                    <p className="text-sm text-muted-foreground font-body mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section variant="primary">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-semibold">
            Explore Our Technology Platform
          </h2>
          <p className="mt-4 text-lg font-body text-primary-foreground/80">
            Learn more about the technical foundations that make our integrated processing approach possible.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" variant="secondary" className="font-body">
              <Link to="/technology">
                Technology & Platform <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </Layout>
  );
};

export default WhatWeDo;
