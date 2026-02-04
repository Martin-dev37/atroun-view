import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Section, SectionHeader } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import heroImage from '@/assets/hero-contact.jpg';
import {
  useHeroSection,
  useContactInfo,
  useContentSections,
} from '@/hooks/useCMS';

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000, "Message must be less than 2000 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

// Fallback data
const fallbackContactInfo = [
  {
    id: '1',
    info_type: 'email',
    icon: null,
    label: 'Email',
    value: 'atroun.bd@gmail.com',
    link: 'mailto:atroun.bd@gmail.com',
    display_order: 1,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    info_type: 'phone',
    icon: null,
    label: 'Phone',
    value: '+256 783 125 129',
    link: 'https://wa.me/256783125129',
    display_order: 2,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    info_type: 'location',
    icon: null,
    label: 'Location',
    value: 'Uganda, East Africa',
    link: null,
    display_order: 3,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
];

const Contact = () => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const { data: heroSections } = useHeroSection('contact');
  const { data: cmsContactInfo } = useContactInfo();
  const { data: contentSections } = useContentSections('contact');

  const hero = heroSections?.[0];
  const contactInfo = cmsContactInfo?.length ? cmsContactInfo : fallbackContactInfo;
  const formSection = contentSections?.find(s => s.section_key === 'contact_form');
  const expectationsSection = contentSections?.find(s => s.section_key === 'expectations');

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Using 'as any' to bypass TypeScript types that may not match external DB schema
      const { error: dbError } = await (supabase as any)
        .from('contact_submissions')
        .insert({
          name: data.name,
          email: data.email,
          message: data.message,
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to save your message. Please try again.');
      }

      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. We'll get back to you within 48 hours.",
      });

      reset();
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'phone': return Phone;
      case 'location': return MapPin;
      default: return Mail;
    }
  };

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
              {hero?.eyebrow || 'Contact'}
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-warm-white leading-[1.1]"
            >
              {hero?.title || "Let's Start a Conversation"}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg md:text-xl text-warm-white/80 font-body leading-relaxed"
            >
              {hero?.subtitle || "Whether you're an investor exploring opportunities, a buyer seeking quality ingredients, or an organization interested in partnership—we'd welcome the chance to connect."}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <Section size="large">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Form */}
          <div>
            <SectionHeader
              title={formSection?.title || 'Send Us a Message'}
              subtitle={formSection?.subtitle || "Fill out the form below and we'll get back to you as soon as possible."}
            />
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    {...register('name')}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    {...register('email')}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your inquiry, partnership interest, or any questions you have..."
                  rows={6}
                  {...register('message')}
                  className={errors.message ? 'border-destructive' : ''}
                />
                {errors.message && (
                  <p className="text-sm text-destructive">{errors.message.message}</p>
                )}
              </div>

              <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-muted/30 p-8 md:p-10 rounded-lg">
              <h3 className="text-xl font-display font-semibold">Contact Information</h3>
              <div className="mt-6 space-y-6">
                {contactInfo.map((info) => {
                  const IconComponent = getIconForType(info.info_type || '');
                  return (
                    <div key={info.id} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-display font-semibold">{info.label}</h4>
                        {info.link ? (
                          <a 
                            href={info.link} 
                            target={info.link.startsWith('http') ? '_blank' : undefined}
                            rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="mt-1 inline-block text-primary font-body font-medium hover:underline"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="mt-1 text-sm text-muted-foreground font-body">{info.value}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-muted/30 p-8 md:p-10 rounded-lg">
              <h3 className="text-xl font-display font-semibold">Who Should Reach Out</h3>
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="font-display font-semibold text-primary text-sm">Investors</h4>
                  <p className="mt-1 text-muted-foreground font-body text-sm">
                    Institutional investors, impact funds, and development finance institutions.
                  </p>
                </div>
                <div>
                  <h4 className="font-display font-semibold text-primary text-sm">Buyers & Distributors</h4>
                  <p className="mt-1 text-muted-foreground font-body text-sm">
                    Food ingredient distributors and manufacturers.
                  </p>
                </div>
                <div>
                  <h4 className="font-display font-semibold text-primary text-sm">Strategic Partners</h4>
                  <p className="mt-1 text-muted-foreground font-body text-sm">
                    Technology providers and agricultural organizations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Response Expectations */}
      <Section variant="muted">
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeader
            title={expectationsSection?.title || 'What to Expect'}
            subtitle={expectationsSection?.subtitle || 'We value every inquiry and aim to respond thoughtfully.'}
            centered
          />
          <div className="mt-10 grid sm:grid-cols-3 gap-6">
            <div className="bg-background p-6 rounded-lg shadow-soft">
              <p className="text-2xl font-display font-semibold text-primary">Prompt Response</p>
              <p className="mt-2 text-sm text-muted-foreground font-body">
                We aim to acknowledge all inquiries within 48 hours
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-soft">
              <p className="text-2xl font-display font-semibold text-primary">Genuine Engagement</p>
              <p className="mt-2 text-sm text-muted-foreground font-body">
                Substantive discussions with people we can actually help
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-soft">
              <p className="text-2xl font-display font-semibold text-primary">Confidentiality</p>
              <p className="mt-2 text-sm text-muted-foreground font-body">
                Investor and partnership discussions handled with discretion
              </p>
            </div>
          </div>
        </div>
      </Section>
    </Layout>
  );
};

export default Contact;