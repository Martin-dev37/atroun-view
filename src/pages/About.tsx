import { Layout } from '@/components/layout/Layout';
import { Section, SectionHeader } from '@/components/ui/section';
import { motion } from 'framer-motion';
import { Leaf, Users, Globe, Target } from 'lucide-react';
import heroAbout from '@/assets/hero-about-biorefinery.jpg';
import martinMwangi from '@/assets/martin-mwangi.jpg';

const values = [
  {
    icon: Leaf,
    title: 'Sustainability First',
    description: 'Every decision we make prioritizes environmental stewardship and regenerative practices.',
  },
  {
    icon: Users,
    title: 'Farmer Partnership',
    description: 'We believe in equitable partnerships that uplift smallholder farming communities.',
  },
  {
    icon: Globe,
    title: 'Global Impact',
    description: 'Connecting African agriculture to premium international markets while preserving local ecosystems.',
  },
  {
    icon: Target,
    title: 'Innovation Driven',
    description: 'Leveraging cutting-edge biorefinery technology to unlock new value from traditional crops.',
  },
];

const leadership = [
  {
    name: 'Martin Mwangi',
    role: 'Founder & CEO',
    image: martinMwangi,
    bio: 'Martin brings over 15 years of experience in agribusiness and sustainable development across East Africa. His vision for ATROUN stems from a deep understanding of the challenges and opportunities in African agriculture.',
  },
];

const advisors = [
  {
    name: 'Dr. Sarah Kimani',
    role: 'Agricultural Science Advisor',
    expertise: 'Crop optimization and sustainable farming practices',
  },
  {
    name: 'James Ochieng',
    role: 'Business Development Advisor',
    expertise: 'International trade and market expansion',
  },
  {
    name: 'Prof. Elizabeth Wanjiru',
    role: 'Research & Innovation Advisor',
    expertise: 'Food technology and bioprocessing',
  },
];

export default function About() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroAbout}
            alt="ATROUN Biorefinery"
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
            About ATROUN
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-primary-foreground/90 font-body"
          >
            Building the future of sustainable agriculture in Africa through innovation and partnership.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeader
              title="Our Mission"
              subtitle="To transform African agriculture by creating integrated biorefinery systems that maximize value for farmers while minimizing environmental impact."
            />
            <p className="mt-6 text-muted-foreground font-body leading-relaxed">
              ATROUN Bio-Dynamics was founded with a clear purpose: to bridge the gap between 
              smallholder farmers in East Africa and premium global markets. We achieve this 
              through our proprietary lyophilization technology and integrated supply chain 
              that ensures quality, traceability, and sustainability at every step.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-video rounded-2xl overflow-hidden shadow-xl"
          >
            <img
              src={heroAbout}
              alt="ATROUN facility"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </Section>

      {/* Values Section */}
      <Section variant="muted">
        <SectionHeader
          title="Our Values"
          subtitle="The principles that guide everything we do at ATROUN."
          centered
        />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <value.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-display font-semibold">{value.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground font-body">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Leadership Section */}
      <Section>
        <SectionHeader
          title="Leadership"
          subtitle="Meet the team driving ATROUN's vision forward."
          centered
        />
        <div className="mt-12 max-w-2xl mx-auto">
          {leadership.map((person, index) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col md:flex-row gap-8 items-center text-center md:text-left"
            >
              <div className="w-48 h-48 rounded-full overflow-hidden flex-shrink-0 shadow-lg">
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-2xl font-display font-semibold">{person.name}</h3>
                <p className="text-primary font-body font-medium">{person.role}</p>
                <p className="mt-4 text-muted-foreground font-body leading-relaxed">{person.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Advisory Board */}
      <Section variant="muted">
        <SectionHeader
          title="Advisory Board"
          subtitle="Expert guidance shaping our strategic direction."
          centered
        />
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {advisors.map((advisor, index) => (
            <motion.div
              key={advisor.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-background rounded-xl p-6 shadow-sm text-center"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-display font-semibold">{advisor.name}</h3>
              <p className="text-sm text-primary font-body">{advisor.role}</p>
              <p className="mt-2 text-sm text-muted-foreground font-body">{advisor.expertise}</p>
            </motion.div>
          ))}
        </div>
      </Section>
    </Layout>
  );
}
