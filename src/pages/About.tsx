import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Section, SectionHeader } from '@/components/ui/section';
import heroImage from '@/assets/hero-about-biorefinery.jpg';
import martinMwangiPhoto from '@/assets/martin-mwangi.jpg';
import { User } from 'lucide-react';

const values = [
  {
    title: 'Systems Thinking',
    description: 'We design for coherence—connecting feedstock sourcing, processing, and market access into integrated value chains rather than isolated interventions.',
  },
  {
    title: 'Execution Discipline',
    description: 'Progress happens through consistent, measurable work. We prioritize operational rigor over ambitious claims, building credibility through results.',
  },
  {
    title: 'Partnership Orientation',
    description: 'Farmers, suppliers, buyers, and technical teams are all part of the same system. We invest in relationships that create mutual value over time.',
  },
  {
    title: 'Capital Efficiency',
    description: 'We structure our operations to maximize value creation per dollar invested, building sustainable growth rather than chasing rapid expansion.',
  },
];

const leadershipTeam = [
  {
    name: 'Martin M. Mwangi',
    role: 'Founder',
    bio: 'Martin Mwangi is the Founder of ATROUN BioDynamics, where he leads the development of East Africa\'s first integrated avocado biorefinery platform. With experience across project management, agri-processing innovation, and platform-based business development, his work focuses on converting underutilized agricultural resources into scalable, circular bioeconomy systems. Based in Uganda, Martin is building ATROUN with a long-term view toward value addition, climate resilience, and farmer-centered industrial growth.',
    image: martinMwangiPhoto,
  },
  {
    name: 'Chief Executive Officer',
    role: 'CEO',
    bio: 'Responsible for the overall strategic direction, day-to-day operations, and execution of ATROUN\'s business plan. Works closely with the Founder to translate vision into operational reality, overseeing team leadership, investor relations, and ensuring alignment across all business functions to achieve sustainable growth and market expansion.',
  },
  {
    name: 'Technical Director',
    role: 'Processing & Quality',
    bio: 'Oversees all processing operations, quality management systems, and technical development. Responsible for establishing and maintaining the rigorous standards required for international food and cosmetic ingredient markets.',
  },
  {
    name: 'Operations Lead',
    role: 'Supply Chain & Logistics',
    bio: 'Manages farmer relationships, feedstock sourcing, and logistics coordination. Builds the supply chain infrastructure that connects agricultural communities to processing facilities with reliability and consistency.',
  },
  {
    name: 'Commercial Director',
    role: 'Markets & Partnerships',
    bio: 'Leads market development, customer relationships, and strategic partnerships. Focuses on building durable commercial relationships with B2B buyers across food, nutraceutical, and cosmetic sectors.',
  },
];

const advisoryBoard = [
  {
    name: 'Dr. Jean-Pierre Habimana',
    role: 'Agricultural Technology Advisor',
    bio: 'Former Director of Crop Science at the International Institute of Tropical Agriculture. Over 25 years of experience in sustainable agriculture systems and post-harvest technology across Sub-Saharan Africa.',
  },
  {
    name: 'Chukwuemeka Adeyemi',
    role: 'Finance & Investment Advisor',
    bio: 'Managing Partner at a leading African venture capital firm with extensive experience in agribusiness financing. Previously led agricultural investment portfolios at the African Development Bank.',
  },
  {
    name: 'Dr. Marie-Claire Dubois',
    role: 'Food Science & Quality Advisor',
    bio: 'Professor of Food Processing Technology at a leading European university. Specialist in freeze-drying technology and food preservation, with advisory roles at major international food ingredient companies.',
  },
  {
    name: 'Emmanuel Tumwine',
    role: 'Regulatory & Trade Advisor',
    bio: 'Former Commissioner at a national standards bureau. Deep expertise in food safety regulations, export certifications, and navigating international trade compliance requirements.',
  },
  {
    name: 'Patricia Namutebi',
    role: 'Supply Chain & Operations Advisor',
    bio: 'Global supply chain executive with 20+ years at multinational FMCG companies. Expert in building resilient agricultural supply chains and cold chain logistics in emerging markets.',
  },
  {
    name: 'Andrew Ssekandi',
    role: 'Legal Advisor',
    bio: 'Senior Partner at a leading corporate law firm with expertise in agribusiness, international trade law, and cross-border transactions. Advises on regulatory compliance, intellectual property, and commercial agreements.',
  },
];

const About = () => {
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
              About ATROUN
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-warm-white leading-[1.1]"
            >
              Building Agricultural Processing Infrastructure for Africa
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg md:text-xl text-warm-white/80 font-body leading-relaxed"
            >
              ATROUN Bio-Dynamics is a Uganda-based company developing integrated agri-biotech and biorefinery systems. We focus on transforming perishable agricultural produce into high-value, shelf-stable ingredients for global food, cosmetic, and nutraceutical markets.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Story */}
      <Section size="large">
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            title="Where We Started"
            centered
          />
          <div className="mt-8 prose prose-lg prose-slate mx-auto font-body">
            <p className="text-muted-foreground leading-relaxed">
              The idea for ATROUN emerged from a straightforward observation: Uganda and the broader East African region produce tremendous agricultural abundance, yet much of that value never reaches markets. Post-harvest losses exceed 30% for many perishable crops. Fresh produce that could command premium prices internationally spoils before it can be processed or shipped.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              At the same time, global demand for shelf-stable, nutrient-preserving ingredients continues to grow—in functional foods, nutraceuticals, cosmetics, and specialized nutrition. There's a clear mismatch between supply and market access.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              ATROUN was founded to bridge this gap. By introducing controlled processing infrastructure—specifically lyophilization (freeze-drying) and biochar production—we can stabilize perishable biomass, recover high-value ingredients, and connect local agricultural systems to international buyers seeking quality and reliability.
            </p>
          </div>
        </div>
      </Section>

      {/* Vision & Mission */}
      <Section variant="muted">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          <div className="bg-background p-8 md:p-10 rounded-lg shadow-soft">
            <p className="text-sm font-body font-medium tracking-wider uppercase text-accent mb-4">Vision</p>
            <h3 className="text-2xl md:text-3xl font-display font-semibold">
              To become a leading African producer of high-quality freeze-dried food and cosmetic ingredients for global markets.
            </h3>
          </div>
          <div className="bg-background p-8 md:p-10 rounded-lg shadow-soft">
            <p className="text-sm font-body font-medium tracking-wider uppercase text-accent mb-4">Mission</p>
            <h3 className="text-2xl md:text-3xl font-display font-semibold">
              To build a globally recognized brand in the lyophilized food and cosmetic sectors by offering high-quality, preservative-free products, while fostering sustainable agricultural practices in Uganda.
            </h3>
          </div>
        </div>
      </Section>

      {/* Leadership Team */}
      <Section variant="muted">
        <SectionHeader
          title="Leadership"
          subtitle="Our team combines expertise in agricultural systems, food processing, and international markets."
          centered
        />
        <div className="mt-12 md:mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {leadershipTeam.map((member, index) => (
            <div 
              key={member.name}
              className="bg-background p-6 rounded-lg shadow-soft animate-fade-in text-center"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4 overflow-hidden">
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-primary" />
                )}
              </div>
              <h3 className="text-lg font-display font-semibold">{member.name}</h3>
              <p className="text-sm text-accent font-body font-medium mt-1">{member.role}</p>
              <p className="mt-4 text-sm text-muted-foreground font-body leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Advisory Board */}
      <Section>
        <SectionHeader
          title="Advisory Board"
          subtitle="We are guided by experienced professionals who bring deep expertise across agriculture, finance, food science, and international trade."
          centered
        />
        <div className="mt-12 md:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {advisoryBoard.map((advisor, index) => (
            <div 
              key={advisor.name}
              className="border border-border p-6 rounded-lg animate-fade-in text-center"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-display font-semibold">{advisor.name}</h3>
              <p className="text-sm text-accent font-body font-medium mt-1">{advisor.role}</p>
              <p className="mt-4 text-sm text-muted-foreground font-body leading-relaxed">
                {advisor.bio}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Values */}
      <Section>
        <SectionHeader
          title="How We Work"
          subtitle="Our approach is grounded in a few core principles that guide how we build, operate, and grow."
          centered
        />
        <div className="mt-12 md:mt-16 grid sm:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <div 
              key={value.title}
              className="border border-border p-6 md:p-8 rounded-lg animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="text-xl font-display font-semibold">{value.title}</h3>
              <p className="mt-3 text-muted-foreground font-body leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Location */}
      <Section variant="muted">
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeader
            title="Why Uganda"
            subtitle="Uganda offers a unique combination of factors that make it an ideal location for agricultural processing infrastructure."
            centered
          />
          <div className="mt-12 grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-display font-semibold text-primary">70%+</p>
              <p className="mt-2 text-sm text-muted-foreground font-body">Population engaged in agriculture</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-display font-semibold text-primary">Year-Round</p>
              <p className="mt-2 text-sm text-muted-foreground font-body">Growing seasons with two annual harvests</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-display font-semibold text-primary">Strategic</p>
              <p className="mt-2 text-sm text-muted-foreground font-body">Access to East African and global markets</p>
            </div>
          </div>
          <p className="mt-10 text-muted-foreground font-body leading-relaxed">
            The country benefits from favorable government policies supporting agro-industrialization, access to regional trade blocs including the East African Community and COMESA, and preferential trade agreements with the EU and US. Combined with competitive operating costs, these factors create a compelling environment for building export-oriented processing capacity.
          </p>
        </div>
      </Section>
    </Layout>
  );
};

export default About;
