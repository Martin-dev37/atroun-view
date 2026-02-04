import { Layout } from '@/components/layout/Layout';
import { Section, SectionHeader } from '@/components/ui/section';
import { motion } from 'framer-motion';
import { Thermometer, Clock, Award, Leaf, ArrowRight } from 'lucide-react';
import heroTechnology from '@/assets/hero-technology.jpg';
import process1 from '@/assets/process-1-preparation.jpg';
import process2 from '@/assets/process-2-lyophilization.jpg';
import process3 from '@/assets/process-3-packaging.jpg';
import process4 from '@/assets/process-4-export.jpg';
import atrounSchema from '@/assets/atroun-schema-cycle.png';

const benefits = [
  {
    icon: Thermometer,
    title: 'Nutrient Preservation',
    description: 'Low-temperature processing preserves up to 97% of vitamins, minerals, and antioxidants.',
  },
  {
    icon: Clock,
    title: 'Extended Shelf Life',
    description: 'Products maintain quality for 2+ years without refrigeration or preservatives.',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Superior taste, color, and texture compared to conventional drying methods.',
  },
  {
    icon: Leaf,
    title: 'Clean Label',
    description: 'No additives, preservatives, or artificial ingredients—just pure fruit.',
  },
];

const processSteps = [
  {
    image: process1,
    title: 'Preparation',
    description: 'Fresh fruits are carefully selected, washed, and prepared within hours of harvest.',
  },
  {
    image: process2,
    title: 'Lyophilization',
    description: 'Freeze-drying at -40°C removes moisture while preserving cellular structure.',
  },
  {
    image: process3,
    title: 'Packaging',
    description: 'Nitrogen-flushed packaging ensures long-term freshness and quality.',
  },
  {
    image: process4,
    title: 'Export',
    description: 'Temperature-controlled logistics deliver products to global markets.',
  },
];

export default function Technology() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroTechnology}
            alt="ATROUN Technology"
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
            Technology & Platform
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-primary-foreground/90 font-body"
          >
            Advanced lyophilization technology for premium agricultural products.
          </motion.p>
        </div>
      </section>

      {/* Lyophilization Overview */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeader
              title="What is Lyophilization?"
              subtitle="Freeze-drying is the gold standard for preserving agricultural products while maintaining nutritional integrity."
            />
            <p className="mt-6 text-muted-foreground font-body leading-relaxed">
              Lyophilization, or freeze-drying, is a dehydration process that removes water from 
              products by freezing them and then reducing the surrounding pressure to allow the 
              frozen water to sublimate directly from solid to gas. This preserves the product's 
              structure, nutrients, and flavor far better than conventional drying methods.
            </p>
            <p className="mt-4 text-muted-foreground font-body leading-relaxed">
              Our proprietary process has been optimized specifically for tropical fruits, 
              ensuring maximum quality retention while achieving the efficiency needed for 
              commercial-scale production.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square rounded-2xl overflow-hidden shadow-xl"
          >
            <img
              src={atrounSchema}
              alt="ATROUN System Diagram"
              className="w-full h-full object-contain bg-background p-4"
            />
          </motion.div>
        </div>
      </Section>

      {/* Benefits */}
      <Section variant="muted">
        <SectionHeader
          title="Technology Benefits"
          subtitle="Why lyophilization delivers superior results."
          centered
        />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-background rounded-xl p-6 shadow-sm text-center"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <benefit.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-display font-semibold">{benefit.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground font-body">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Process Steps */}
      <Section>
        <SectionHeader
          title="Our Process"
          subtitle="From harvest to export—a carefully controlled journey."
          centered
        />
        <div className="mt-12 space-y-12">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`grid lg:grid-cols-2 gap-8 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl font-display font-bold text-primary/20">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <ArrowRight className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-display font-semibold">{step.title}</h3>
                <p className="mt-3 text-muted-foreground font-body leading-relaxed">
                  {step.description}
                </p>
              </div>
              <div className={`relative aspect-video rounded-xl overflow-hidden shadow-lg ${
                index % 2 === 1 ? 'lg:order-1' : ''
              }`}>
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ATROUN System */}
      <Section variant="muted">
        <SectionHeader
          title="The ATROUN System"
          subtitle="An integrated closed-loop approach that maximizes value and minimizes waste."
          centered
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-12 max-w-4xl mx-auto"
        >
          <img
            src={atrounSchema}
            alt="ATROUN Integrated System"
            className="w-full h-auto rounded-xl shadow-lg"
          />
          <p className="mt-8 text-center text-muted-foreground font-body leading-relaxed max-w-2xl mx-auto">
            Our integrated system transforms every part of the fruit into valuable products. 
            Flesh becomes premium freeze-dried products, seeds are processed into biochar for 
            soil enhancement, and organic waste returns to partner farms as nutrient-rich compost.
          </p>
        </motion.div>
      </Section>
    </Layout>
  );
}
