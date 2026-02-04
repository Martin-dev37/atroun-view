import { Layout } from '@/components/layout/Layout';
import { Section, SectionHeader } from '@/components/ui/section';
import { motion } from 'framer-motion';
import { Leaf, Droplets, Package, Truck, Recycle, Zap } from 'lucide-react';
import heroWhatWeDo from '@/assets/hero-whatwedo.jpg';
import facilityProcessing from '@/assets/facility-processing.jpg';
import productIngredients from '@/assets/product-ingredients.jpg';

const processSteps = [
  {
    icon: Leaf,
    title: 'Sourcing',
    description: 'Direct partnerships with smallholder farmers across East Africa ensure quality raw materials and fair pricing.',
  },
  {
    icon: Droplets,
    title: 'Processing',
    description: 'State-of-the-art lyophilization preserves nutrients, flavor, and extends shelf life without additives.',
  },
  {
    icon: Package,
    title: 'Packaging',
    description: 'Food-grade, sustainable packaging maintains product integrity throughout the supply chain.',
  },
  {
    icon: Truck,
    title: 'Distribution',
    description: 'Global logistics network delivers premium products to markets worldwide.',
  },
];

const products = [
  {
    category: 'Freeze-Dried Fruits',
    items: ['Avocado', 'Mango', 'Passion Fruit', 'Pineapple', 'Banana'],
    description: 'Premium quality freeze-dried fruits perfect for snacking, baking, and food manufacturing.',
  },
  {
    category: 'Fruit Powders',
    items: ['Avocado Powder', 'Mango Powder', 'Mixed Fruit Blends'],
    description: 'Versatile fruit powders for beverages, supplements, and culinary applications.',
  },
  {
    category: 'Bio-Based Ingredients',
    items: ['Avocado Oil', 'Fruit Extracts', 'Natural Colorants'],
    description: 'High-value ingredients for cosmetics, pharmaceuticals, and specialty foods.',
  },
];

const sustainabilityFeatures = [
  {
    icon: Recycle,
    title: 'Zero Waste',
    description: 'Every part of the fruit is utilized—seeds become biochar, peels become compost.',
  },
  {
    icon: Zap,
    title: 'Solar Powered',
    description: 'Our facilities run on renewable energy, minimizing carbon footprint.',
  },
];

export default function WhatWeDo() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroWhatWeDo}
            alt="ATROUN Processing"
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
            What We Do
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-primary-foreground/90 font-body"
          >
            From farm to global markets—integrated biorefinery solutions for premium agricultural products.
          </motion.p>
        </div>
      </section>

      {/* Process Overview */}
      <Section>
        <SectionHeader
          title="Our Integrated Approach"
          subtitle="A seamless value chain that transforms raw agricultural products into premium ingredients."
          centered
        />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <step.icon className="w-8 h-8" />
                </div>
                <div className="mt-4 text-2xl font-display font-bold text-primary">{String(index + 1).padStart(2, '0')}</div>
                <h3 className="mt-2 text-lg font-display font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground font-body">{step.description}</p>
              </div>
              {index < processSteps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />
              )}
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Facility Section */}
      <Section variant="muted">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-video rounded-2xl overflow-hidden shadow-xl"
          >
            <img
              src={facilityProcessing}
              alt="Processing facility"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div>
            <SectionHeader
              title="State-of-the-Art Facility"
              subtitle="Our biorefinery in Uganda combines traditional agricultural knowledge with cutting-edge processing technology."
            />
            <ul className="mt-6 space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span className="text-muted-foreground font-body">ISO-certified food processing facility</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span className="text-muted-foreground font-body">Advanced lyophilization equipment</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span className="text-muted-foreground font-body">Quality control laboratory</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span className="text-muted-foreground font-body">Sustainable energy systems</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Products Section */}
      <Section>
        <SectionHeader
          title="Our Products"
          subtitle="Premium freeze-dried fruits and bio-based ingredients for global markets."
          centered
        />
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl p-6 shadow-sm border border-border"
            >
              <h3 className="text-xl font-display font-semibold">{product.category}</h3>
              <p className="mt-2 text-sm text-muted-foreground font-body">{product.description}</p>
              <ul className="mt-4 space-y-2">
                {product.items.map((item) => (
                  <li key={item} className="text-sm font-body flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Sustainability Features */}
      <Section variant="muted">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeader
              title="Sustainability at Core"
              subtitle="Our operations are designed to minimize environmental impact while maximizing value."
            />
            <div className="mt-8 space-y-6">
              {sustainabilityFeatures.map((feature) => (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold">{feature.title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground font-body">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-video rounded-2xl overflow-hidden shadow-xl"
          >
            <img
              src={productIngredients}
              alt="Sustainable ingredients"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </Section>
    </Layout>
  );
}
