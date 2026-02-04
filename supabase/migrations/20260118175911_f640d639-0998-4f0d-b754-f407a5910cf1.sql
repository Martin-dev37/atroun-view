-- Create table for managing page visibility and custom pages
CREATE TABLE public.pages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    is_custom BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for page content blocks
CREATE TABLE public.page_content (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
    block_type TEXT NOT NULL CHECK (block_type IN ('heading', 'paragraph', 'image', 'video', 'quote', 'list')),
    content JSONB NOT NULL DEFAULT '{}',
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for offline content drafts (synced when online)
CREATE TABLE public.content_drafts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE,
    content_id UUID REFERENCES public.page_content(id) ON DELETE CASCADE,
    draft_data JSONB NOT NULL,
    is_synced BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_drafts ENABLE ROW LEVEL SECURITY;

-- Pages: Everyone can view enabled pages
CREATE POLICY "Anyone can view enabled pages"
ON public.pages
FOR SELECT
USING (is_enabled = true);

-- Pages: Admins can view all pages
CREATE POLICY "Admins can view all pages"
ON public.pages
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Pages: Admins can insert pages
CREATE POLICY "Admins can insert pages"
ON public.pages
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Pages: Admins can update pages
CREATE POLICY "Admins can update pages"
ON public.pages
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Pages: Admins can delete pages
CREATE POLICY "Admins can delete pages"
ON public.pages
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Page content: Public can view content for enabled pages
CREATE POLICY "Anyone can view content for enabled pages"
ON public.page_content
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.pages 
        WHERE pages.id = page_content.page_id 
        AND pages.is_enabled = true
    )
);

-- Page content: Admins can view all content
CREATE POLICY "Admins can view all content"
ON public.page_content
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Page content: Admins can insert content
CREATE POLICY "Admins can insert content"
ON public.page_content
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Page content: Admins can update content
CREATE POLICY "Admins can update content"
ON public.page_content
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Page content: Admins can delete content
CREATE POLICY "Admins can delete content"
ON public.page_content
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Content drafts: Admins can manage their drafts
CREATE POLICY "Admins can view drafts"
ON public.content_drafts
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert drafts"
ON public.content_drafts
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update drafts"
ON public.content_drafts
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete drafts"
ON public.content_drafts
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for updated_at
CREATE TRIGGER update_pages_updated_at
BEFORE UPDATE ON public.pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_page_content_updated_at
BEFORE UPDATE ON public.page_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_drafts_updated_at
BEFORE UPDATE ON public.content_drafts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default pages (existing pages in the app)
INSERT INTO public.pages (slug, title, description, is_enabled, is_custom, display_order) VALUES
    ('home', 'Home', 'Main landing page', true, false, 0),
    ('about', 'About Us', 'Company information and team', true, false, 1),
    ('what-we-do', 'What We Do', 'Our services and processes', true, false, 2),
    ('technology', 'Technology', 'Our technology and innovation', true, false, 3),
    ('markets', 'Markets', 'Target markets and industries', true, false, 4),
    ('sustainability', 'Sustainability', 'Environmental impact and initiatives', true, false, 5),
    ('investors', 'Investors', 'Investment opportunities', true, false, 6),
    ('contact', 'Contact', 'Contact information and form', true, false, 7);

-- Create storage bucket for content media
INSERT INTO storage.buckets (id, name, public) VALUES ('content-media', 'content-media', true);

-- Storage policies for content media
CREATE POLICY "Anyone can view content media"
ON storage.objects
FOR SELECT
USING (bucket_id = 'content-media');

CREATE POLICY "Admins can upload content media"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'content-media' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update content media"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'content-media' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete content media"
ON storage.objects
FOR DELETE
USING (bucket_id = 'content-media' AND has_role(auth.uid(), 'admin'::app_role));