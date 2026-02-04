import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Section, SectionHeader } from '@/components/ui/section';
import { Leaf, Droplets, Sun, Users, Recycle, TrendingDown, Sprout, CloudSun, GlassWater, Building2, Flame } from 'lucide-react';
import heroVideo from '@/assets/hero-sustainability-video.mp4';

const impactAreas = [
  {
    icon: Recycle,
    title: 'Post-Harvest Loss Reduction',
    description: 'By processing perishable produce into shelf-stable ingredients, we capture value that would otherwise be lost to spoilage—reducing waste and increasing farmer income.',
  },
  {
    icon: Leaf,
    title: 'Carbon Sequestration',
    description: 'Biochar production locks biogenic carbon into stable, long-lived forms. Each ton of biochar represents carbon that stays out of the atmosphere for centuries.',
  },
  {
    icon: TrendingDown,
    title: 'Cold-Chain Independence',
    description: 'Freeze-dried products eliminate the need for energy-intensive refrigeration during storage and transport, reducing lifecycle emissions.',
  },
  {
    icon: Droplets,
    title: 'Soil Regeneration',
    description: 'Biochar improves soil structure, water retention, and nutrient efficiency—building resilience to drought and reducing dependency on synthetic inputs.',
  },
  {
    icon: Sun,
    title: 'Energy Efficiency',
    description: 'Centralized processing reduces fragmented, inefficient handling. Our modular design allows for integration of renewable energy as we scale.',
  },
  {
    icon: Users,
    title: 'Community Livelihoods',
    description: 'Our operations create skilled and semi-skilled jobs while providing farmers with reliable markets and stable income.',
  },
];

const Sustainability = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 md:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/75 to-foreground/60" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-sm font-body font-medium tracking-wider uppercase text-sage mb-4"
            >
              Sustainability & Circular Value
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-warm-white leading-[1.1]"
            >
              Building Systems That Create More Than They Take
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg md:text-xl text-warm-white/80 font-body leading-relaxed"
            >
              Sustainability isn't a separate initiative at ATROUN—it's embedded in how our business model works. By designing for circularity, we align commercial success with positive environmental and social outcomes.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Circular Model */}
      <Section size="large">
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            title="A Circular Business Model"
            subtitle="Our integrated approach means that materials flow through our system without waste, creating multiple value streams from a single input."
            centered
          />
          <div className="mt-10 font-body text-muted-foreground leading-relaxed space-y-4">
            <p>
              Fresh agricultural produce enters our facility. Through lyophilization, we recover premium, shelf-stable ingredients that retain nutritional value and command strong market prices. The organic residues—peels, seeds, off-spec material—are directed to controlled pyrolysis, producing biochar that improves soil health and sequesters carbon.
            </p>
            <p>
              This isn't about adding sustainability as an afterthought. The circular flow is the business model. Every input generates value; nothing is discarded.
            </p>
          </div>
        </div>
      </Section>

      {/* Featured Video Section */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            title="BioChar, the Future of Sustainable Agriculture, Carbon Sequestration, and a Circular Economy"
            subtitle="BioChar offers solutions for soil regeneration, climate change mitigation, and waste management by turning biomass into a stable, carbon-rich material used to improve soil health, filter water, and even create building materials. Its porous structure enhances soil fertility, water retention, and nutrient uptake, while its production (pyrolysis) creates valuable energy, positioning biochar as a key player in green technologies beyond just soil amendment."
            centered
          />
          <div className="mt-10">
            <div className="relative rounded-xl overflow-hidden shadow-lg aspect-video">
              <video
                controls
                playsInline
                className="w-full h-full object-cover"
              >
                <source src={heroVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </Section>

      {/* Key Future Applications */}
      <Section variant="muted">
        <SectionHeader
          title="Key Future Applications of BioChar"
          subtitle="BioChar's versatility positions it as a transformative solution across multiple industries."
          centered
        />
        <div className="mt-12 md:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Sprout,
              title: 'Agriculture',
              description: 'Restores degraded soils, boosts crop yields, reduces fertilizer/water needs, and acts as a long-term carbon sink.',
            },
            {
              icon: CloudSun,
              title: 'Climate Change',
              description: 'Captures atmospheric carbon dioxide (CO2) that would otherwise return to the atmosphere, offering significant potential for net-zero goals.',
            },
            {
              icon: GlassWater,
              title: 'Water Treatment',
              description: 'Its high surface area filters contaminants, providing affordable solutions for clean drinking water.',
            },
            {
              icon: Building2,
              title: 'Construction',
              description: 'Used as an additive in materials like concrete and insulation to lower carbon footprints and improve properties.',
            },
            {
              icon: Flame,
              title: 'Energy & Waste',
              description: 'Produces heat and valuable byproducts during its creation from organic waste, promoting circular economy principles.',
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-background p-6 rounded-lg shadow-soft"
            >
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <item.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-display font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground font-body leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Impact Areas */}
      <Section variant="muted">
        <SectionHeader
          title="Where We Create Impact"
          subtitle="Our model generates measurable benefits across environmental, economic, and social dimensions."
          centered
        />
        <div className="mt-12 md:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {impactAreas.map((item, index) => (
            <div 
              key={item.title}
              className="bg-background p-6 rounded-lg shadow-soft animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-display font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground font-body leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Climate Approach */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <SectionHeader
              title="Climate-Aligned Operations"
              subtitle="Our processing model addresses multiple climate-relevant challenges simultaneously."
            />
            <div className="mt-8 space-y-6">
              {[
                {
                  title: 'Emissions Avoided',
                  description: 'Surplus biomass diverted from open decomposition reduces methane emissions. Shelf-stable products eliminate cold-chain dependencies.',
                },
                {
                  title: 'Carbon Captured',
                  description: 'Biochar production converts organic residues into stable carbon that remains sequestered for centuries rather than returning to the atmosphere.',
                },
                {
                  title: 'Resilience Built',
                  description: 'Biochar soil amendments improve agricultural resilience to drought and climate variability, supporting adaptation in farming communities.',
                },
              ].map((item) => (
                <div key={item.title} className="border-l-4 border-accent pl-6">
                  <h4 className="font-display font-semibold">{item.title}</h4>
                  <p className="mt-1 text-muted-foreground font-body text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-muted/30 p-8 md:p-10 rounded-lg">
            <h3 className="text-xl font-display font-semibold">Measurable Impact</h3>
            <p className="mt-4 text-muted-foreground font-body leading-relaxed">
              We track and document our environmental performance across key metrics:
            </p>
            <ul className="mt-6 space-y-3">
              {[
                'Biomass diverted from waste streams',
                'Biochar produced and carbon sequestered',
                'Cold-chain emissions avoided',
                'Energy intensity per unit of output',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground font-body text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground font-body">
              This data supports ESG reporting requirements and positions ATROUN for future carbon certification and climate finance alignment.
            </p>
          </div>
        </div>
      </Section>

      {/* Community Impact */}
      <Section variant="muted">
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeader
            title="Community-Centered Growth"
            subtitle="Our operations are designed to create value for the communities where we work, not extract from them."
            centered
          />
          <div className="mt-10 grid sm:grid-cols-3 gap-6">
            <div className="bg-background p-6 rounded-lg shadow-soft">
              <p className="text-2xl font-display font-semibold text-primary">Stable Income</p>
              <p className="mt-2 text-sm text-muted-foreground font-body">Reliable offtake reduces farmer exposure to price volatility</p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-soft">
              <p className="text-2xl font-display font-semibold text-primary">Local Jobs</p>
              <p className="mt-2 text-sm text-muted-foreground font-body">Processing facilities create skilled employment opportunities</p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-soft">
              <p className="text-2xl font-display font-semibold text-primary">Inclusion</p>
              <p className="mt-2 text-sm text-muted-foreground font-body">Priority hiring for women and youth in operational roles</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Approach to Claims */}
      <Section>
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            title="Our Approach to Sustainability Claims"
            subtitle="We believe credibility comes from transparency, not marketing language."
            centered
          />
          <div className="mt-8 font-body text-muted-foreground leading-relaxed space-y-4">
            <p>
              We're building a business that creates genuine environmental and social value—but we're also realistic about where we are in that journey. As an early-stage company, we're focused on establishing the operational foundations that will support verified impact over time.
            </p>
            <p>
              Rather than making broad sustainability claims, we document what we do, measure what we can, and build systems that will support third-party verification as we scale. This approach may be less dramatic than some sustainability marketing, but it's more honest—and ultimately more credible.
            </p>
          </div>
        </div>
      </Section>
    </Layout>
  );
};

export default Sustainability;
