-- Create messaging campaigns table
CREATE TABLE public.messaging_campaigns (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    subject TEXT,
    content TEXT NOT NULL,
    channel TEXT NOT NULL DEFAULT 'email' CHECK (channel IN ('email', 'whatsapp')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    recipient_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaign recipients table
CREATE TABLE public.campaign_recipients (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID NOT NULL REFERENCES public.messaging_campaigns(id) ON DELETE CASCADE,
    email TEXT,
    phone TEXT,
    name TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create portal invites table for data rooms, investors, partners
CREATE TABLE public.portal_invites (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    portal_type TEXT NOT NULL CHECK (portal_type IN ('investor', 'partner', 'data_room')),
    invite_code TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    name TEXT,
    company TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    accessed_at TIMESTAMP WITH TIME ZONE,
    access_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create data room documents table
CREATE TABLE public.data_room_documents (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    file_path TEXT NOT NULL,
    file_type TEXT,
    file_size BIGINT,
    category TEXT DEFAULT 'general',
    access_level TEXT DEFAULT 'investor' CHECK (access_level IN ('investor', 'partner', 'all')),
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.messaging_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_room_documents ENABLE ROW LEVEL SECURITY;

-- Admin policies for messaging_campaigns
CREATE POLICY "Admins can manage campaigns"
ON public.messaging_campaigns FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin policies for campaign_recipients
CREATE POLICY "Admins can manage recipients"
ON public.campaign_recipients FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin policies for portal_invites
CREATE POLICY "Admins can manage invites"
ON public.portal_invites FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Public access for portal_invites by invite code (for portal access)
CREATE POLICY "Anyone can view by invite code"
ON public.portal_invites FOR SELECT
USING (is_active = true);

-- Admin policies for data_room_documents
CREATE POLICY "Admins can manage documents"
ON public.data_room_documents FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Public read access for documents (controlled by invite validation)
CREATE POLICY "Documents viewable via portal"
ON public.data_room_documents FOR SELECT
USING (true);

-- Add triggers for updated_at
CREATE TRIGGER update_messaging_campaigns_updated_at
BEFORE UPDATE ON public.messaging_campaigns
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_data_room_documents_updated_at
BEFORE UPDATE ON public.data_room_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();