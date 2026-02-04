import { Layout } from '@/components/layout/Layout';
import { Section, SectionHeader } from '@/components/ui/section';
import { motion } from 'framer-motion';
import { Leaf, Recycle, Sun, Droplets, TreePine, Users } from 'lucide-react';
import heroSustainability from '@/assets/hero-sustainability.jpg';

const pillars = [
  {
    icon: Recycle,
    title: 'Zero Waste Operations',
    description: 'Every byproduct becomes a valuable resource—nothing goes to landfill.',
    details: ['Fruit waste becomes compost', 'Seeds converted to biochar', 'Water recycled and reused'],
  },
  {
    icon: Sun,
    title: 'Renewable Energy',
    description: 'Our facility runs on solar power, minimizing carbon emissions.',
    details: ['100% solar-powered processing', 'Energy-efficient equipment', 'Carbon-neutral goal by 2026'],
  },
  {
    icon: Droplets,
    title: 'Water Conservation',
    description: 'Advanced water management systems reduce consumption by 70%.',
    details: ['Rainwater harvesting', 'Closed-loop cooling systems', 'Drip irrigation support'],
  },
  {
    icon: TreePine,
    title: 'Carbon Sequestration',
    description: 'Biochar production actively removes carbon from the atmosphere.',
    details: ['Biochar locks carbon for 1000+ years', 'Supports soil regeneration', 'Measurable carbon credits'],
  },
];

const sdgGoals = [
  { number: 2, title: 'Zero Hunger', description: 'Supporting smallholder farmers with stable income' },
  { number: 8, title: 'Decent Work', description: 'Creating quality jobs in rural communities' },
  { number: 12, title: 'Responsible Consumption', description: 'Zero-waste production systems' },
  { number: 13, title: 'Climate Action', description: 'Carbon-negative through biochar production' },
];

const impactStats = [
  { value: '500+', label: 'Partner Farmers' },
  { value: '70%', label: 'Water Reduction' },
  { value: '0', label: 'Waste to Landfill' },
  { value: '100%', label: 'Renewable Energy' },
];

export default function Sustainability() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroSustainability}
            alt="Sustainability"
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
            Sustainability
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-primary-foreground/90 font-body"
          >
            Building a regenerative future for African agriculture.
          </motion.p>
        </div>
      </section>

      {/* Impact Stats */}
      <Section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {impactStats.map((stat, index) => (
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

      {/* Sustainability Pillars */}
      <Section variant="muted">
        <SectionHeader
          title="Our Sustainability Pillars"
          subtitle="A comprehensive approach to environmental stewardship."
          centered
        />
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-background rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <pillar.icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-semibold">{pillar.title}</h3>
                  <p className="mt-2 text-muted-foreground font-body">{pillar.description}</p>
                  <ul className="mt-4 space-y-2">
                    {pillar.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-2 text-sm font-body">
                        <Leaf className="w-4 h-4 text-primary" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Circular Economy */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeader
              title="Circular Economy Model"
              subtitle="Our closed-loop system transforms agricultural waste into valuable resources."
            />
            <p className="mt-6 text-muted-foreground font-body leading-relaxed">
              At ATROUN, we've designed our operations around circularity. Fruit waste becomes 
              nutrient-rich compost that returns to partner farms. Seeds are converted into 
              biochar—a carbon-negative soil amendment that improves crop yields while 
              sequestering carbon for centuries.
            </p>
            <p className="mt-4 text-muted-foreground font-body leading-relaxed">
              This approach not only eliminates waste but creates additional revenue streams 
              and environmental benefits, demonstrating that sustainability and profitability 
              can go hand in hand.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square bg-muted rounded-xl flex items-center justify-center"
          >
            <Recycle className="w-32 h-32 text-primary/20" />
            <div className="absolute inset-8 flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm font-body text-muted-foreground">
                  Closed-loop value chain
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* SDG Alignment */}
      <Section variant="muted">
        <SectionHeader
          title="UN SDG Alignment"
          subtitle="Our operations contribute to multiple Sustainable Development Goals."
          centered
        />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sdgGoals.map((goal, index) => (
            <motion.div
              key={goal.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-background rounded-xl p-6 shadow-sm text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-xl">
                {goal.number}
              </div>
              <h3 className="mt-4 font-display font-semibold">{goal.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground font-body">{goal.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Community Impact */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-video bg-muted rounded-xl flex items-center justify-center"
          >
            <Users className="w-24 h-24 text-primary/20" />
          </motion.div>
          <div>
            <SectionHeader
              title="Community Impact"
              subtitle="Empowering smallholder farmers and rural communities."
            />
            <ul className="mt-6 space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span className="text-muted-foreground font-body">Fair prices and guaranteed offtake for partner farmers</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span className="text-muted-foreground font-body">Training in sustainable agricultural practices</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span className="text-muted-foreground font-body">Free biochar distribution for soil improvement</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span className="text-muted-foreground font-body">Local job creation in processing and logistics</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
