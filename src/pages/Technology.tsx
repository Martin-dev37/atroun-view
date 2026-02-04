import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Section, SectionHeader } from '@/components/ui/section';
import heroImage from '@/assets/hero-technology.jpg';
import atrounSchemaCycle from '@/assets/atroun-schema-cycle.png';
import processPreparation from '@/assets/process-1-preparation.jpg';
import processLyophilization from '@/assets/process-2-lyophilization.jpg';
import processPackaging from '@/assets/process-3-packaging.jpg';
import processExport from '@/assets/process-4-export.jpg';

const processSteps = [
  { image: processPreparation, label: 'Fruit Preparation', step: '01' },
  { image: processLyophilization, label: 'Lyophilization', step: '02' },
  { image: processPackaging, label: 'Packaging', step: '03' },
  { image: processExport, label: 'Export', step: '04' },
];

const techPrinciples = [
  {
    title: 'Modular Design',
    description: 'Our systems are built as modular units that can be deployed incrementally and scaled based on feedstock availability and market demand. This reduces capital intensity and allows for phased growth.',
  },
  {
    title: 'Controlled Environments',
    description: 'Processing occurs in controlled conditions with documented temperature, pressure, and humidity parameters. This ensures batch-to-batch consistency and supports quality certification requirements.',
  },
  {
    title: 'Multi-Feedstock Capability',
    description: 'While we start with avocados, our platform is designed to process multiple crop categories—fruits, herbs, roots, and vegetables—allowing diversification as market opportunities emerge.',
  },
  {
    title: 'Zero-Waste Integration',
    description: 'Organic residues from primary processing are directed to biochar production rather than disposal. This closes material loops and generates additional value streams.',
  },
];

const lyophilizationBenefits = [
  { title: 'Nutrient Retention', value: '95%+', description: 'Vitamins, minerals, and bioactive compounds preserved' },
  { title: 'Shelf Life Extension', value: '12-36 months', description: 'Without refrigeration or preservatives' },
  { title: 'Weight Reduction', value: '90%+', description: 'Lighter products reduce shipping costs' },
  { title: 'Moisture Removal', value: '99%', description: 'Halts microbial growth and enzymatic reactions' },
  { title: 'Global Demand Growth', value: '↗ 8.5%', description: 'Annual CAGR for shelf-stable nutrient-rich ingredients' },
];

const Technology = () => {
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
              Technology & Platform
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-warm-white leading-[1.1]"
            >
              Processing Technology Designed for Scale
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg md:text-xl text-warm-white/80 font-body leading-relaxed"
            >
              Our platform combines proven lyophilization technology with modular, integrated design principles. The result is processing infrastructure that can grow with demand while maintaining quality and cost efficiency.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Lyophilization Explained */}
      <Section size="large">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <SectionHeader
              title="Lyophilization: The Core Technology"
              subtitle="Freeze-drying is a preservation method that removes water at very low temperatures, allowing food to maintain its nutritional value, taste, and structure for extended periods."
            />
            <div className="mt-8 space-y-4 font-body text-muted-foreground leading-relaxed">
              <p>
                Unlike conventional drying methods that use heat—degrading nutrients and altering texture—lyophilization works by freezing the product and then reducing pressure to allow frozen water to sublimate directly from solid to vapor.
              </p>
              <p>
                The result is a lightweight, shelf-stable product that retains the original characteristics of fresh produce. When rehydrated, lyophilized ingredients return to near-original form, making them suitable for demanding applications in food, cosmetics, and nutraceuticals.
              </p>
              <p>
                This technology is widely used in pharmaceutical and specialty food industries globally. ATROUN brings it to East African agricultural value chains, where it can transform perishable abundance into export-ready ingredients.
              </p>
            </div>
          </div>
          <div>
            {/* Process Flow Collage */}
            <div className="grid grid-cols-2 gap-3">
              {processSteps.map((step, index) => (
                <div 
                  key={step.step} 
                  className="relative group overflow-hidden rounded-lg shadow-soft animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img
                    src={step.image}
                    alt={step.label}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <span className="text-xs font-body font-medium text-white/70">{step.step}</span>
                    <p className="text-sm font-display font-semibold text-white">{step.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* The ATROUN System */}
      <Section variant="muted">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeader
            title="The ATROUN System"
            centered
          />
          <div className="mt-8">
            <img 
              src={atrounSchemaCycle} 
              alt="ATROUN Schema Cycle - Closed-loop system diagram" 
              className="w-full max-w-3xl mx-auto rounded-lg shadow-soft"
            />
          </div>
          <p className="mt-6 text-muted-foreground font-body leading-relaxed max-w-2xl mx-auto">
            ATROUN operates as a closed-loop system where material flows, value creation, and impact measurement continuously reinforce each other.
          </p>
        </div>
      </Section>

      {/* Benefits Grid */}
      <Section>
        <SectionHeader
          title="Why Lyophilization Works"
          subtitle="The technology delivers measurable advantages that translate directly to product quality and commercial viability."
          centered
        />
        <div className="mt-12 md:mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {lyophilizationBenefits.map((item, index) => (
            <div 
              key={item.title}
              className="bg-background p-6 rounded-lg shadow-soft text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <p className="text-3xl md:text-4xl font-display font-semibold text-primary">{item.value}</p>
              <h3 className="mt-2 text-lg font-display font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground font-body">{item.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Platform Principles */}
      <Section>
        <SectionHeader
          title="Platform Design Principles"
          subtitle="Beyond the core technology, our platform is built around operational principles that support long-term growth and resilience."
          centered
        />
        <div className="mt-12 md:mt-16 grid md:grid-cols-2 gap-8">
          {techPrinciples.map((item, index) => (
            <div 
              key={item.title}
              className="border border-border p-6 md:p-8 rounded-lg animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="text-xl font-display font-semibold">{item.title}</h3>
              <p className="mt-3 text-muted-foreground font-body leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Biochar Section */}
      <Section variant="muted">
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeader
            title="Biochar: Closing the Loop"
            subtitle="Organic residues from our lyophilization process—peels, seeds, and off-spec material—are converted into biochar through controlled pyrolysis."
            centered
          />
          <div className="mt-8 font-body text-muted-foreground leading-relaxed space-y-4">
            <p>
              Biochar is a carbon-stable soil amendment that improves soil structure, water retention, and nutrient efficiency. By producing it from processing residues, we transform waste streams into valuable agricultural inputs while sequestering carbon that would otherwise return to the atmosphere.
            </p>
            <p>
              This circular approach generates additional revenue, reduces waste disposal costs, and creates positive environmental outcomes—aligning commercial and sustainability objectives.
            </p>
          </div>
          <div className="mt-10 grid sm:grid-cols-3 gap-6 text-center">
            <div className="bg-background p-6 rounded-lg shadow-soft">
              <p className="text-2xl font-display font-semibold text-primary">Carbon Stable</p>
              <p className="mt-1 text-sm text-muted-foreground font-body">Locks biogenic carbon for centuries</p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-soft">
              <p className="text-2xl font-display font-semibold text-primary">Soil Health</p>
              <p className="mt-1 text-sm text-muted-foreground font-body">Improves water and nutrient retention</p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-soft">
              <p className="text-2xl font-display font-semibold text-primary">Zero Waste</p>
              <p className="mt-1 text-sm text-muted-foreground font-body">All residues become value</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Quality & Standards */}
      <Section>
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            title="Quality as a Design Principle"
            subtitle="Meeting international standards isn't an afterthought—it's built into how we operate from day one."
            centered
          />
          <div className="mt-8 font-body text-muted-foreground leading-relaxed space-y-4">
            <p>
              Our facilities are designed with documentation, traceability, and process control as core requirements. Raw material inspection, batch tracking, and quality testing are standard operating procedures.
            </p>
            <p>
              This discipline positions ATROUN to meet the expectations of international B2B buyers in food, cosmetic, and nutraceutical sectors—where quality consistency and regulatory alignment are baseline requirements for market access.
            </p>
          </div>
        </div>
      </Section>
    </Layout>
  );
};

export default Technology;
