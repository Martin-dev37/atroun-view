-- ============================================
-- ATROUN CMS Seed Data
-- Run this SQL in Supabase SQL Editor AFTER
-- running cms-schema.sql
-- ============================================

-- ============================================
-- PAGES
-- ============================================
INSERT INTO pages (slug, title, meta_description, is_published) VALUES
('home', 'ATROUN Bio-Dynamics | Agricultural Processing Infrastructure', 'ATROUN develops integrated processing infrastructure to stabilize perishable produce, recover premium ingredients, and create circular material flows—connecting East African agriculture to global markets.', true),
('about', 'About ATROUN | Building Agricultural Processing Infrastructure for Africa', 'ATROUN Bio-Dynamics is a Uganda-based company developing integrated agri-biotech and biorefinery systems for global food, cosmetic, and nutraceutical markets.', true),
('what-we-do', 'What We Do | Transforming Agricultural Biomass into Premium Ingredients', 'ATROUN operates at the intersection of agricultural sourcing, controlled processing, and global market access.', true),
('technology', 'Technology & Platform | Processing Technology Designed for Scale', 'Our platform combines proven lyophilization technology with modular, integrated design principles.', true),
('markets', 'Markets & Partnerships | Connecting African Agriculture to Global Markets', 'ATROUN serves growing global demand for shelf-stable, nutrient-preserving ingredients.', true),
('sustainability', 'Sustainability & Circular Value | Building Systems That Create More Than They Take', 'Sustainability is embedded in how our business model works. By designing for circularity, we align commercial success with positive environmental and social outcomes.', true),
('investors', 'For Investors | Building Infrastructure for African Agricultural Value Chains', 'ATROUN represents an opportunity to invest in processing infrastructure that addresses structural gaps in African agriculture.', true),
('contact', 'Contact ATROUN | Let''s Start a Conversation', 'Whether you''re an investor, buyer seeking quality ingredients, or an organization interested in partnership—we''d welcome the chance to connect.', true);

-- ============================================
-- HERO SECTIONS
-- ============================================
INSERT INTO hero_sections (page_slug, eyebrow, title, subtitle, cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link) VALUES
('home', 'Agri-Biotech · Biorefinery · Uganda', 'Building Systems That Turn Agricultural Abundance into Lasting Value', 'ATROUN develops integrated processing infrastructure to stabilize perishable produce, recover premium ingredients, and create circular material flows—connecting East African agriculture to global markets.', 'What We Do', '/what-we-do', 'For Investors', '/investors'),
('about', 'About ATROUN', 'Building Agricultural Processing Infrastructure for Africa', 'ATROUN Bio-Dynamics is a Uganda-based company developing integrated agri-biotech and biorefinery systems. We focus on transforming perishable agricultural produce into high-value, shelf-stable ingredients for global food, cosmetic, and nutraceutical markets.', NULL, NULL, NULL, NULL),
('what-we-do', 'What We Do', 'Transforming Agricultural Biomass into Premium Ingredients', 'ATROUN operates at the intersection of agricultural sourcing, controlled processing, and global market access. We take perishable produce that would otherwise be lost and convert it into shelf-stable, high-value ingredients.', NULL, NULL, NULL, NULL),
('technology', 'Technology & Platform', 'Processing Technology Designed for Scale', 'Our platform combines proven lyophilization technology with modular, integrated design principles. The result is processing infrastructure that can grow with demand while maintaining quality and cost efficiency.', NULL, NULL, NULL, NULL),
('markets', 'Markets & Partnerships', 'Connecting African Agriculture to Global Markets', 'ATROUN is positioned to serve growing global demand for shelf-stable, nutrient-preserving ingredients. Our focus on quality, consistency, and reliability makes us a credible partner for B2B buyers across multiple industries.', NULL, NULL, NULL, NULL),
('sustainability', 'Sustainability & Circular Value', 'Building Systems That Create More Than They Take', 'Sustainability isn''t a separate initiative at ATROUN—it''s embedded in how our business model works. By designing for circularity, we align commercial success with positive environmental and social outcomes.', NULL, NULL, NULL, NULL),
('investors', 'For Investors', 'Building Infrastructure for African Agricultural Value Chains', 'ATROUN represents an opportunity to invest in processing infrastructure that addresses structural gaps in African agriculture while serving growing global demand for premium, shelf-stable ingredients.', NULL, NULL, NULL, NULL),
('contact', 'Contact', 'Let''s Start a Conversation', 'Whether you''re an investor exploring opportunities, a buyer seeking quality ingredients, or an organization interested in partnership—we''d welcome the chance to connect.', NULL, NULL, NULL, NULL);

-- ============================================
-- HOME HIGHLIGHTS
-- ============================================
INSERT INTO home_highlights (icon, title, description, display_order) VALUES
('Factory', 'Integrated Processing', 'Modular biorefinery systems designed to stabilize agricultural biomass and recover high-value ingredients from local supply chains.', 1),
('Leaf', 'Circular Value Creation', 'Converting organic residues into carbon-stable soil enhancers, closing material loops and building long-term soil health.', 2),
('Globe', 'Global Market Access', 'Shelf-stable, export-ready ingredients aligned with international food, cosmetic, and nutraceutical standards.', 3),
('Users', 'Partnership-Driven Growth', 'Working closely with farmers, suppliers, and buyers to build durable relationships and reliable supply chains.', 4);

-- ============================================
-- HOME STATS
-- ============================================
INSERT INTO home_stats (value, label, description, display_order) VALUES
('30%+', 'Post-harvest losses converted into exportable value', NULL, 1);

-- ============================================
-- CONTENT SECTIONS (Home page sections)
-- ============================================
INSERT INTO content_sections (page_slug, section_key, title, subtitle, body_content, display_order) VALUES
('home', 'problem-opportunity', 'A Structural Challenge Becomes an Opportunity', 'In Uganda, over 30% of perishable agricultural produce is lost after harvest due to limited processing capacity and cold-chain infrastructure. Meanwhile, global demand for shelf-stable, nutrient-preserving ingredients continues to grow.', 'ATROUN addresses this by bringing processing closer to the source. Our systems stabilize fresh produce through lyophilization (freeze-drying), extending shelf life from days to years—without refrigeration, without preservatives, and without compromising nutritional integrity.', 1),
('home', 'technology-preview', 'Technology Built for African Conditions', 'Our platform combines proven lyophilization technology with modular, scalable design principles suited to the realities of East African agriculture.', NULL, 2),
('home', 'cta', 'A Platform Built for Long-Term Relevance', 'ATROUN is designed as a scalable, replicable model—not a single-project venture. We''re building infrastructure that can grow with African agriculture and meet evolving global market demands.', NULL, 3);

-- ============================================
-- COMPANY VALUES
-- ============================================
INSERT INTO company_values (title, description, display_order) VALUES
('Systems Thinking', 'We design for coherence—connecting feedstock sourcing, processing, and market access into integrated value chains rather than isolated interventions.', 1),
('Execution Discipline', 'Progress happens through consistent, measurable work. We prioritize operational rigor over ambitious claims, building credibility through results.', 2),
('Partnership Orientation', 'Farmers, suppliers, buyers, and technical teams are all part of the same system. We invest in relationships that create mutual value over time.', 3),
('Capital Efficiency', 'We structure our operations to maximize value creation per dollar invested, building sustainable growth rather than chasing rapid expansion.', 4);

-- ============================================
-- TEAM MEMBERS (Leadership)
-- ============================================
INSERT INTO team_members (name, role, bio, team_type, display_order) VALUES
('Martin M. Mwangi', 'Founder', 'Martin Mwangi is the Founder of ATROUN BioDynamics, where he leads the development of East Africa''s first integrated avocado biorefinery platform. With experience across project management, agri-processing innovation, and platform-based business development, his work focuses on converting underutilized agricultural resources into scalable, circular bioeconomy systems. Based in Uganda, Martin is building ATROUN with a long-term view toward value addition, climate resilience, and farmer-centered industrial growth.', 'leadership', 1),
('Chief Executive Officer', 'CEO', 'Responsible for the overall strategic direction, day-to-day operations, and execution of ATROUN''s business plan. Works closely with the Founder to translate vision into operational reality, overseeing team leadership, investor relations, and ensuring alignment across all business functions to achieve sustainable growth and market expansion.', 'leadership', 2),
('Technical Director', 'Processing & Quality', 'Oversees all processing operations, quality management systems, and technical development. Responsible for establishing and maintaining the rigorous standards required for international food and cosmetic ingredient markets.', 'leadership', 3),
('Operations Lead', 'Supply Chain & Logistics', 'Manages farmer relationships, feedstock sourcing, and logistics coordination. Builds the supply chain infrastructure that connects agricultural communities to processing facilities with reliability and consistency.', 'leadership', 4),
('Commercial Director', 'Markets & Partnerships', 'Leads market development, customer relationships, and strategic partnerships. Focuses on building durable commercial relationships with B2B buyers across food, nutraceutical, and cosmetic sectors.', 'leadership', 5);

-- ============================================
-- TEAM MEMBERS (Advisory Board)
-- ============================================
INSERT INTO team_members (name, role, bio, team_type, display_order) VALUES
('Dr. Jean-Pierre Habimana', 'Agricultural Technology Advisor', 'Former Director of Crop Science at the International Institute of Tropical Agriculture. Over 25 years of experience in sustainable agriculture systems and post-harvest technology across Sub-Saharan Africa.', 'advisory', 1),
('Chukwuemeka Adeyemi', 'Finance & Investment Advisor', 'Managing Partner at a leading African venture capital firm with extensive experience in agribusiness financing. Previously led agricultural investment portfolios at the African Development Bank.', 'advisory', 2),
('Dr. Marie-Claire Dubois', 'Food Science & Quality Advisor', 'Professor of Food Processing Technology at a leading European university. Specialist in freeze-drying technology and food preservation, with advisory roles at major international food ingredient companies.', 'advisory', 3),
('Emmanuel Tumwine', 'Regulatory & Trade Advisor', 'Former Commissioner at a national standards bureau. Deep expertise in food safety regulations, export certifications, and navigating international trade compliance requirements.', 'advisory', 4),
('Patricia Namutebi', 'Supply Chain & Operations Advisor', 'Global supply chain executive with 20+ years at multinational FMCG companies. Expert in building resilient agricultural supply chains and cold chain logistics in emerging markets.', 'advisory', 5),
('Andrew Ssekandi', 'Legal Advisor', 'Senior Partner at a leading corporate law firm with expertise in agribusiness, international trade law, and cross-border transactions. Advises on regulatory compliance, intellectual property, and commercial agreements.', 'advisory', 6);

-- ============================================
-- CAPABILITIES (What We Do page)
-- ============================================
INSERT INTO capabilities (icon, title, description, display_order) VALUES
('Package', 'Feedstock Sourcing & Aggregation', 'We work directly with farming communities to source fresh produce, focusing on crops that offer strong value addition potential. Our aggregation model provides farmers with reliable offtake and reduces exposure to price volatility.', 1),
('Droplets', 'Lyophilization & Ingredient Recovery', 'Using freeze-drying technology, we stabilize perishable biomass by removing moisture at low temperatures. This preserves nutritional content, flavor, and color while extending shelf life from days to years without refrigeration.', 2),
('Leaf', 'Biochar & Circular Processing', 'Organic residues from processing are converted into biochar through controlled pyrolysis. This transforms waste streams into carbon-stable soil enhancers, closing material loops and generating additional value.', 3),
('Truck', 'Export-Ready Packaging & Distribution', 'Our finished products are packaged to international standards for food, cosmetic, and nutraceutical applications. Lightweight, shelf-stable formats reduce logistics costs and expand market access.', 4);

-- ============================================
-- PRODUCTS
-- ============================================
INSERT INTO products (name, description, display_order) VALUES
('Freeze-Dried Avocado Products', 'Premium freeze-dried avocado powder and pieces that retain the nutritional profile, healthy fats, and natural color of fresh fruit.', 1),
('Freeze-Dried Fruits & Botanicals', 'Expanding range of freeze-dried tropical fruits, herbs, and botanical extracts suited to diverse end-market requirements.', 2),
('Biochar Soil Amendments', 'Carbon-stable biochar produced from processing residues, improving soil structure, water retention, and nutrient efficiency.', 3);

-- ============================================
-- PRODUCT APPLICATIONS
-- ============================================
INSERT INTO product_applications (product_id, application, display_order)
SELECT p.id, app.application, app.display_order
FROM products p
CROSS JOIN (
  SELECT 'Freeze-Dried Avocado Products' as product_name, 'Functional foods' as application, 1 as display_order
  UNION ALL SELECT 'Freeze-Dried Avocado Products', 'Nutraceutical formulations', 2
  UNION ALL SELECT 'Freeze-Dried Avocado Products', 'Cosmetic ingredients', 3
  UNION ALL SELECT 'Freeze-Dried Avocado Products', 'Baby food nutrition', 4
  UNION ALL SELECT 'Freeze-Dried Fruits & Botanicals', 'Food ingredients', 1
  UNION ALL SELECT 'Freeze-Dried Fruits & Botanicals', 'Supplement bases', 2
  UNION ALL SELECT 'Freeze-Dried Fruits & Botanicals', 'Natural cosmetic actives', 3
  UNION ALL SELECT 'Biochar Soil Amendments', 'Agricultural soil enhancement', 1
  UNION ALL SELECT 'Biochar Soil Amendments', 'Carbon sequestration', 2
  UNION ALL SELECT 'Biochar Soil Amendments', 'Regenerative farming inputs', 3
) app
WHERE p.name = app.product_name;

-- ============================================
-- PROCESS STEPS (What We Do page)
-- ============================================
INSERT INTO process_steps (page_context, step_number, title, description, display_order) VALUES
('what-we-do', '01', 'Harvest & Aggregation', 'Fresh produce sourced from partner farming communities and aggregated at collection points.', 1),
('what-we-do', '02', 'Quality Assessment', 'Incoming materials inspected for moisture content, ripeness, and quality standards.', 2),
('what-we-do', '03', 'Controlled Processing', 'Lyophilization preserves nutrients and extends shelf life. Residues directed to biochar production.', 3),
('what-we-do', '04', 'Packaging & Distribution', 'Finished ingredients packaged to international standards and prepared for export.', 4);

-- ============================================
-- PROCESS STEPS (Technology page)
-- ============================================
INSERT INTO process_steps (page_context, step_number, title, description, display_order) VALUES
('technology', '01', 'Fruit Preparation', 'Initial preparation of fresh produce for processing.', 1),
('technology', '02', 'Lyophilization', 'Freeze-drying process to remove moisture at low temperatures.', 2),
('technology', '03', 'Packaging', 'Quality control and packaging to international standards.', 3),
('technology', '04', 'Export', 'Distribution to global markets.', 4);

-- ============================================
-- TECHNOLOGY FEATURES
-- ============================================
INSERT INTO technology_features (title, description, display_order) VALUES
('Modular Design', 'Our systems are built as modular units that can be deployed incrementally and scaled based on feedstock availability and market demand. This reduces capital intensity and allows for phased growth.', 1),
('Controlled Environments', 'Processing occurs in controlled conditions with documented temperature, pressure, and humidity parameters. This ensures batch-to-batch consistency and supports quality certification requirements.', 2),
('Multi-Feedstock Capability', 'While we start with avocados, our platform is designed to process multiple crop categories—fruits, herbs, roots, and vegetables—allowing diversification as market opportunities emerge.', 3),
('Zero-Waste Integration', 'Organic residues from primary processing are directed to biochar production rather than disposal. This closes material loops and generates additional value streams.', 4);

-- ============================================
-- TECHNOLOGY SPECS (Lyophilization Benefits)
-- ============================================
INSERT INTO technology_specs (category, spec_name, spec_value, display_order) VALUES
('lyophilization', 'Nutrient Retention', '95%+', 1),
('lyophilization', 'Shelf Life Extension', '12-36 months', 2),
('lyophilization', 'Weight Reduction', '90%+', 3),
('lyophilization', 'Moisture Removal', '99%', 4),
('lyophilization', 'Global Demand Growth', '↗ 8.5%', 5);

-- ============================================
-- PLATFORM CAPABILITIES
-- ============================================
INSERT INTO platform_capabilities (text, display_order) VALUES
('Feedstock valorization across multiple crop categories', 1),
('Controlled processing environments with quality documentation', 2),
('Ingredient recovery and fractionation for diverse end markets', 3),
('Biochar production from organic residues', 4);

-- ============================================
-- MARKETS
-- ============================================
INSERT INTO markets (name, description, applications, display_order) VALUES
('European Union', 'The EU is the second-largest avocado consumer globally, with growing demand for organic, shelf-stable ingredients in functional foods, nutraceuticals, and natural cosmetics.', ARRAY['Functional food ingredients', 'Cosmetic actives', 'Organic certified products'], 1),
('Middle East & North Africa', 'Growing health consciousness and premium food demand, combined with established trade relationships with East Africa.', ARRAY['Health food ingredients', 'Premium retail products', 'Food service inputs'], 2),
('North America', 'Large functional food and supplement market with strong consumer interest in plant-based, natural ingredients.', ARRAY['Supplement bases', 'Clean-label ingredients', 'Specialty nutrition'], 3),
('Asia-Pacific', 'Rapidly growing markets for functional foods and natural cosmetics, particularly in Japan, South Korea, and emerging Southeast Asian markets.', ARRAY['Cosmetic ingredients', 'Functional food inputs', 'Baby nutrition'], 4);

-- ============================================
-- MARKET ADVANTAGES
-- ============================================
INSERT INTO market_advantages (icon, title, description, display_order) VALUES
('Users', 'Farmer Partnerships', 'Direct relationships with farming communities provide reliable feedstock while offering farmers stable offtake and fair pricing. We invest in long-term partnerships rather than transactional sourcing.', 1),
('Building', 'B2B Buyer Relationships', 'We work with ingredient distributors, food manufacturers, cosmetic formulators, and nutraceutical companies who value quality, consistency, and reliable supply.', 2),
('Globe', 'Strategic Partnerships', 'Collaborations with technology providers, logistics partners, and market access organizations that strengthen our value chain and expand our reach.', 3),
('TrendingUp', 'Investment Partnerships', 'We seek investors who share our long-term orientation and understand the value of building durable infrastructure in African agricultural value chains.', 4);

-- ============================================
-- GEOGRAPHIC REGIONS (Market Stats)
-- ============================================
INSERT INTO geographic_regions (name, description, display_order) VALUES
('€2.6B European avocado import value', 'European avocado import value (2023)', 1),
('8%+ Annual growth', 'Annual growth in freeze-dried food market', 2),
('$35-40M Serviceable market', 'Serviceable market for ATROUN products', 3),
('Growing demand', 'Demand for sustainable, ethical sourcing', 4);

-- ============================================
-- SUSTAINABILITY PILLARS
-- ============================================
INSERT INTO sustainability_pillars (icon, title, description, display_order) VALUES
('Recycle', 'Post-Harvest Loss Reduction', 'By processing perishable produce into shelf-stable ingredients, we capture value that would otherwise be lost to spoilage—reducing waste and increasing farmer income.', 1),
('Leaf', 'Carbon Sequestration', 'Biochar production locks biogenic carbon into stable, long-lived forms. Each ton of biochar represents carbon that stays out of the atmosphere for centuries.', 2),
('TrendingDown', 'Cold-Chain Independence', 'Freeze-dried products eliminate the need for energy-intensive refrigeration during storage and transport, reducing lifecycle emissions.', 3),
('Droplets', 'Soil Regeneration', 'Biochar improves soil structure, water retention, and nutrient efficiency—building resilience to drought and reducing dependency on synthetic inputs.', 4),
('Sun', 'Energy Efficiency', 'Centralized processing reduces fragmented, inefficient handling. Our modular design allows for integration of renewable energy as we scale.', 5),
('Users', 'Community Livelihoods', 'Our operations create skilled and semi-skilled jobs while providing farmers with reliable markets and stable income.', 6);

-- ============================================
-- IMPACT METRICS
-- ============================================
INSERT INTO impact_metrics (value, label, description, display_order) VALUES
('Carbon Stable', 'Locks biogenic carbon for centuries', NULL, 1),
('Soil Health', 'Improves water and nutrient retention', NULL, 2),
('Zero Waste', 'All residues become value', NULL, 3),
('Stable Income', 'Reliable offtake reduces farmer exposure to price volatility', NULL, 4),
('Local Jobs', 'Processing facilities create skilled employment opportunities', NULL, 5),
('Inclusion', 'Priority hiring for women and youth in operational roles', NULL, 6);

-- ============================================
-- INVESTMENT HIGHLIGHTS
-- ============================================
INSERT INTO investment_highlights (icon, title, description, display_order) VALUES
('Target', 'Clear Market Opportunity', 'Growing global demand for shelf-stable, nutrient-preserving ingredients meets underserved African agricultural supply chains.', 1),
('Scale', 'Capital-Efficient Model', 'Modular design allows phased deployment, reducing upfront capital intensity and enabling validation before scale.', 2),
('TrendingUp', 'Scalable Platform', 'Technology and processes designed for replication across crops and geographies as opportunities emerge.', 3),
('Shield', 'Risk-Aware Execution', 'Phased approach validates commercial viability before major capital deployment, with clear milestones and governance.', 4);

-- ============================================
-- FUNDING MILESTONES
-- ============================================
INSERT INTO funding_milestones (phase, description, status, display_order) VALUES
('Phase 1: Pilot Facility', 'Establish processing operations, achieve quality certifications, secure initial export customers, validate unit economics.', 'current', 1),
('Phase 2: Commercial Scale', 'Scale processing capacity, expand product range, build distribution relationships, optimize operations.', 'planned', 2),
('Phase 3: Platform Replication', 'Geographic expansion, multi-crop processing, technology refinement, broader market penetration.', 'planned', 3);

-- ============================================
-- FAQS (Investors page)
-- ============================================
INSERT INTO faqs (page_context, question, answer, display_order) VALUES
('investors', 'What is the addressable market for freeze-dried ingredients?', 'The global freeze-dried food market is valued at approximately $60 billion and growing at 7-8% annually. Key drivers include rising demand for convenient, shelf-stable foods with high nutritional retention. Our focus segments—functional foods, nutraceuticals, and premium food service—represent the highest-margin portions of this market, with strong appetite for traceable, sustainably-sourced ingredients.', 1),
('investors', 'Why Uganda as a base of operations?', 'Uganda offers a compelling combination of agricultural abundance, favorable climate for year-round production, competitive operating costs, and strategic access to both East African and global export markets. The country has established trade agreements, improving infrastructure, and a government supportive of agricultural value addition. Importantly, post-harvest losses in the region exceed 30%, representing both a problem we can address and an opportunity for sourcing quality feedstock.', 2),
('investors', 'What are the primary risks and how are they managed?', 'Key risks include supply chain consistency, operational execution, and market access. We mitigate supply risk through diversified farmer relationships and multi-crop capability. Execution risk is addressed through phased development—validating operations at pilot scale before major capital deployment. Market risk is reduced by securing offtake relationships early and focusing on established B2B channels rather than consumer markets. Currency and regulatory risks are managed through dollarized contracts where possible and proactive compliance frameworks.', 3),
('investors', 'How does the phased investment structure work?', 'Our development follows a milestone-based approach. Phase 1 focuses on establishing pilot operations, achieving certifications, and validating unit economics with limited capital. Subsequent phases deploy expansion capital only after commercial proof points are established. This structure protects investor capital by ensuring each stage proves viability before scaling, while maintaining flexibility to adjust based on market feedback.', 4),
('investors', 'What partnership structures are available?', 'We are open to various partnership structures depending on investor objectives and expertise. These include equity investment in the operating company, project-specific co-investment vehicles, strategic partnerships with offtake commitments, and blended finance structures incorporating development capital. We work with partners to structure arrangements that align incentives and leverage complementary capabilities.', 5),
('investors', 'What is the expected timeline to profitability?', 'We anticipate reaching operational breakeven within 18-24 months of pilot facility launch, with Phase 1 designed to be cash-flow positive before triggering expansion. Full commercial-scale profitability is projected within 3-4 years of initial investment. These projections are based on validated processing yields, current market pricing, and conservative utilization assumptions.', 6),
('investors', 'How do you ensure product quality for export markets?', 'Quality assurance is embedded throughout our operations. We are building toward international food safety certifications aligned with EU and major Asian market requirements. Our processing protocols emphasize documentation, traceability, and consistency. Laboratory testing at critical control points verifies product specifications. This discipline positions us to serve demanding B2B customers who require reliable, auditable supply chains.', 7),
('investors', 'What governance structures are in place?', 'ATROUN maintains governance standards appropriate for institutional investment. This includes independent board oversight, clear reporting frameworks, and financial controls aligned with international standards. We are committed to transparency with investors through regular operational and financial reporting, and we welcome investor representation in governance as partnerships develop.', 8);

-- ============================================
-- CONTACT INFO
-- ============================================
INSERT INTO contact_info (info_type, icon, label, value, link, display_order) VALUES
('email', 'Mail', 'Email', 'atroun.bd@gmail.com', 'mailto:atroun.bd@gmail.com', 1),
('phone', 'Phone', 'Phone', '+256 783 125 129', 'https://wa.me/256783125129', 2),
('location', 'MapPin', 'Location', 'Uganda, East Africa', NULL, 3);

-- ============================================
-- OFFICE LOCATIONS
-- ============================================
INSERT INTO office_locations (name, address, country, is_headquarters, display_order) VALUES
('ATROUN Bio-Dynamics', 'Uganda, East Africa', 'Uganda', true, 1);

-- ============================================
-- NAVIGATION ITEMS
-- ============================================
INSERT INTO navigation_items (label, path, display_order) VALUES
('Home', '/', 1),
('About', '/about', 2),
('What We Do', '/what-we-do', 3),
('Technology', '/technology', 4),
('Markets', '/markets', 5),
('Sustainability', '/sustainability', 6),
('Investors', '/investors', 7),
('Contact', '/contact', 8);

-- ============================================
-- CTA BLOCKS
-- ============================================
INSERT INTO cta_blocks (page_slug, title, subtitle, cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link, variant) VALUES
('home', 'A Platform Built for Long-Term Relevance', 'ATROUN is designed as a scalable, replicable model—not a single-project venture. We''re building infrastructure that can grow with African agriculture and meet evolving global market demands.', 'Investment Overview', '/investors', 'Get in Touch', '/contact', 'primary'),
('what-we-do', 'Explore Our Technology Platform', 'Learn more about the technical foundations that make our integrated processing approach possible.', 'Technology & Platform', '/technology', NULL, NULL, 'primary'),
('markets', 'Interested in Partnership?', 'Whether you''re a buyer seeking quality ingredients, an investor exploring opportunities, or an organization looking to collaborate—we''d welcome a conversation.', 'Get in Touch', '/contact', NULL, NULL, 'primary'),
('investors', 'Start a Conversation', 'We welcome inquiries from investors interested in learning more about ATROUN, our development approach, and potential partnership structures.', 'Contact Us', '/contact', NULL, NULL, 'primary');

-- ============================================
-- CONTENT SECTIONS (About page)
-- ============================================
INSERT INTO content_sections (page_slug, section_key, title, subtitle, body_content, display_order) VALUES
('about', 'story', 'Where We Started', NULL, 'The idea for ATROUN emerged from a straightforward observation: Uganda and the broader East African region produce tremendous agricultural abundance, yet much of that value never reaches markets. Post-harvest losses exceed 30% for many perishable crops. Fresh produce that could command premium prices internationally spoils before it can be processed or shipped.

At the same time, global demand for shelf-stable, nutrient-preserving ingredients continues to grow—in functional foods, nutraceuticals, cosmetics, and specialized nutrition. There''s a clear mismatch between supply and market access.

ATROUN was founded to bridge this gap. By introducing controlled processing infrastructure—specifically lyophilization (freeze-drying) and biochar production—we can stabilize perishable biomass, recover high-value ingredients, and connect local agricultural systems to international buyers seeking quality and reliability.', 1),
('about', 'vision', 'Vision', NULL, 'To become a leading African producer of high-quality freeze-dried food and cosmetic ingredients for global markets.', 2),
('about', 'mission', 'Mission', NULL, 'To build a globally recognized brand in the lyophilized food and cosmetic sectors by offering high-quality, preservative-free products, while fostering sustainable agricultural practices in Uganda.', 3),
('about', 'why-uganda', 'Why Uganda', 'Uganda offers a unique combination of factors that make it an ideal location for agricultural processing infrastructure.', 'The country benefits from favorable government policies supporting agro-industrialization, access to regional trade blocs including the East African Community and COMESA, and preferential trade agreements with the EU and US. Combined with competitive operating costs, these factors create a compelling environment for building export-oriented processing capacity.', 4);

-- ============================================
-- CONTENT SECTIONS (Technology page)
-- ============================================
INSERT INTO content_sections (page_slug, section_key, title, subtitle, body_content, display_order) VALUES
('technology', 'lyophilization', 'Lyophilization: The Core Technology', 'Freeze-drying is a preservation method that removes water at very low temperatures, allowing food to maintain its nutritional value, taste, and structure for extended periods.', 'Unlike conventional drying methods that use heat—degrading nutrients and altering texture—lyophilization works by freezing the product and then reducing pressure to allow frozen water to sublimate directly from solid to vapor.

The result is a lightweight, shelf-stable product that retains the original characteristics of fresh produce. When rehydrated, lyophilized ingredients return to near-original form, making them suitable for demanding applications in food, cosmetics, and nutraceuticals.

This technology is widely used in pharmaceutical and specialty food industries globally. ATROUN brings it to East African agricultural value chains, where it can transform perishable abundance into export-ready ingredients.', 1),
('technology', 'atroun-system', 'The ATROUN System', NULL, 'ATROUN operates as a closed-loop system where material flows, value creation, and impact measurement continuously reinforce each other.', 2),
('technology', 'biochar', 'Biochar: Closing the Loop', 'Organic residues from our lyophilization process—peels, seeds, and off-spec material—are converted into biochar through controlled pyrolysis.', 'Biochar is a carbon-stable soil amendment that improves soil structure, water retention, and nutrient efficiency. By producing it from processing residues, we transform waste streams into valuable agricultural inputs while sequestering carbon that would otherwise return to the atmosphere.

This circular approach generates additional revenue, reduces waste disposal costs, and creates positive environmental outcomes—aligning commercial and sustainability objectives.', 3),
('technology', 'quality', 'Quality as a Design Principle', 'Meeting international standards isn''t an afterthought—it''s built into how we operate from day one.', 'Our facilities are designed with documentation, traceability, and process control as core requirements. Raw material inspection, batch tracking, and quality testing are standard operating procedures.

This discipline positions ATROUN to meet the expectations of international B2B buyers in food, cosmetic, and nutraceutical sectors—where quality consistency and regulatory alignment are baseline requirements for market access.', 4);

-- ============================================
-- CONTENT SECTIONS (Sustainability page)
-- ============================================
INSERT INTO content_sections (page_slug, section_key, title, subtitle, body_content, display_order) VALUES
('sustainability', 'circular-model', 'A Circular Business Model', 'Our integrated approach means that materials flow through our system without waste, creating multiple value streams from a single input.', 'Fresh agricultural produce enters our facility. Through lyophilization, we recover premium, shelf-stable ingredients that retain nutritional value and command strong market prices. The organic residues—peels, seeds, off-spec material—are directed to controlled pyrolysis, producing biochar that improves soil health and sequesters carbon.

This isn''t about adding sustainability as an afterthought. The circular flow is the business model. Every input generates value; nothing is discarded.', 1),
('sustainability', 'biochar-video', 'BioChar, the Future of Sustainable Agriculture, Carbon Sequestration, and a Circular Economy', 'BioChar offers solutions for soil regeneration, climate change mitigation, and waste management by turning biomass into a stable, carbon-rich material used to improve soil health, filter water, and even create building materials. Its porous structure enhances soil fertility, water retention, and nutrient uptake, while its production (pyrolysis) creates valuable energy, positioning biochar as a key player in green technologies beyond just soil amendment.', NULL, 2),
('sustainability', 'claims-approach', 'Our Approach to Sustainability Claims', 'We believe credibility comes from transparency, not marketing language.', 'We''re building a business that creates genuine environmental and social value—but we''re also realistic about where we are in that journey. As an early-stage company, we''re focused on establishing the operational foundations that will support verified impact over time.

Rather than making broad sustainability claims, we document what we do, measure what we can, and build systems that will support third-party verification as we scale. This approach may be less dramatic than some sustainability marketing, but it''s more honest—and ultimately more credible.', 3);

-- ============================================
-- CONTENT SECTIONS (Investors page)
-- ============================================
INSERT INTO content_sections (page_slug, section_key, title, subtitle, body_content, display_order) VALUES
('investors', 'thesis', 'Investment Thesis', 'A straightforward opportunity at the intersection of agricultural abundance and global market demand.', 'Uganda and the broader East African region produce significant agricultural abundance, but limited processing infrastructure means much of that value is lost to spoilage or exported as low-margin raw commodities. Post-harvest losses exceed 30% for many perishable crops.

At the same time, global demand for freeze-dried and shelf-stable ingredients is growing at approximately 8% annually, driven by consumer interest in convenient, nutritious, and long-lasting food products. The functional foods, nutraceuticals, and natural cosmetics sectors all seek reliable suppliers of premium plant-based inputs.

ATROUN bridges this gap by introducing processing capacity at source, converting perishable produce into export-ready ingredients with extended shelf life and strong margin potential. Our integrated approach—combining lyophilization with biochar production—creates multiple value streams while aligning commercial and sustainability objectives.', 1),
('investors', 'phased-approach', 'Phased Development Approach', 'We''re building in stages, validating commercial assumptions before deploying significant capital.', 'Our development model prioritizes capital efficiency and risk management. Rather than building at scale from day one, we establish pilot operations that prove commercial viability, secure quality certifications, and build customer relationships. This approach generates learning and market feedback before major expansion.', 2);

-- ============================================
-- CONTENT SECTIONS (Contact page)
-- ============================================
INSERT INTO content_sections (page_slug, section_key, title, subtitle, body_content, display_order) VALUES
('contact', 'form', 'Send Us a Message', 'Fill out the form below and we''ll get back to you as soon as possible.', NULL, 1),
('contact', 'expectations', 'What to Expect', 'We value every inquiry and aim to respond thoughtfully.', NULL, 2);

-- ============================================
-- SITE SETTINGS
-- ============================================
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
('company_name', 'ATROUN Bio-Dynamics', 'text', 'Company name'),
('company_tagline', 'Building Systems That Turn Agricultural Abundance into Lasting Value', 'text', 'Company tagline'),
('company_email', 'atroun.bd@gmail.com', 'text', 'Primary contact email'),
('company_phone', '+256 783 125 129', 'text', 'Primary contact phone'),
('company_location', 'Uganda, East Africa', 'text', 'Company location');

-- ============================================
-- Done!
-- ============================================
SELECT 'CMS seed data inserted successfully!' as status;
