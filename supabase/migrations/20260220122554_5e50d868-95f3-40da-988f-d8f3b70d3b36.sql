
-- ============================================================
-- ATROUN ADMIN DASHBOARD - Full Database Schema
-- ============================================================

-- 1. User Roles (separate table, critical for security)
CREATE TYPE public.app_role AS ENUM ('admin', 'portal_editor', 'investor', 'viewer');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- 2. User Profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name text,
  email text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Portal Access (which portal sections a user can access)
CREATE TABLE public.portal_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  portal_section text NOT NULL, -- 'investor', 'financial_projections', 'impact_metrics', 'reports', 'data_room'
  granted_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, portal_section)
);
ALTER TABLE public.portal_access ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage portal access" ON public.portal_access FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users view own portal access" ON public.portal_access FOR SELECT USING (auth.uid() = user_id);

-- 4. Portal Documents (for investor docs, reports, data room)
CREATE TABLE public.portal_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL, -- 'investor', 'reports', 'data_room'
  title text NOT NULL,
  description text,
  file_url text,
  file_name text,
  file_size bigint,
  file_type text,
  tags text[],
  uploaded_by uuid REFERENCES auth.users(id),
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.portal_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage all documents" ON public.portal_documents FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Portal editors manage documents" ON public.portal_documents FOR ALL USING (public.has_role(auth.uid(), 'portal_editor'));
CREATE POLICY "Authorized users view documents" ON public.portal_documents FOR SELECT
  USING (
    is_published = true AND (
      public.has_role(auth.uid(), 'admin') OR
      public.has_role(auth.uid(), 'portal_editor') OR
      EXISTS (SELECT 1 FROM public.portal_access WHERE user_id = auth.uid() AND portal_section = portal_documents.section)
    )
  );

-- 5. Financial Projections
CREATE TABLE public.financial_projections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer NOT NULL,
  quarter text,
  metric_name text NOT NULL,
  metric_value numeric,
  metric_unit text,
  description text,
  chart_data jsonb,
  display_order integer DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.financial_projections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage financial projections" ON public.financial_projections FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authorized users view financial projections" ON public.financial_projections FOR SELECT
  USING (
    is_published = true AND (
      public.has_role(auth.uid(), 'admin') OR
      EXISTS (SELECT 1 FROM public.portal_access WHERE user_id = auth.uid() AND portal_section = 'financial_projections')
    )
  );

-- 6. Impact Metrics
CREATE TABLE public.impact_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  metric_name text NOT NULL,
  metric_value text,
  unit text,
  period text,
  description text,
  icon text,
  trend text, -- 'up', 'down', 'stable'
  change_percentage numeric,
  display_order integer DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.impact_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage impact metrics" ON public.impact_metrics FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authorized users view impact metrics" ON public.impact_metrics FOR SELECT
  USING (
    is_published = true AND (
      public.has_role(auth.uid(), 'admin') OR
      EXISTS (SELECT 1 FROM public.portal_access WHERE user_id = auth.uid() AND portal_section = 'impact_metrics')
    )
  );

-- 7. Investor Chat Messages (AI assistant with 3-year history)
CREATE TABLE public.investor_chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.investor_chat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own chat sessions" ON public.investor_chat_sessions FOR ALL USING (auth.uid() = user_id);

CREATE TABLE public.investor_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.investor_chat_sessions(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.investor_chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own chat messages" ON public.investor_chat_messages FOR ALL
  USING (EXISTS (SELECT 1 FROM public.investor_chat_sessions WHERE id = session_id AND user_id = auth.uid()));

-- 8. CRM Contacts (from contact form + manual entries)
CREATE TABLE public.crm_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  company text,
  role text,
  source text DEFAULT 'manual', -- 'contact_form', 'manual', 'import'
  tags text[],
  notes text,
  status text DEFAULT 'active', -- 'active', 'inactive', 'unsubscribed'
  subscribed_to_emails boolean DEFAULT true,
  last_contacted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage all contacts" ON public.crm_contacts FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 9. Email Campaigns
CREATE TABLE public.email_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject text NOT NULL,
  body_html text,
  body_text text,
  status text DEFAULT 'draft', -- 'draft', 'scheduled', 'sent', 'cancelled'
  scheduled_at timestamptz,
  sent_at timestamptz,
  recipient_count integer DEFAULT 0,
  open_count integer DEFAULT 0,
  click_count integer DEFAULT 0,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage email campaigns" ON public.email_campaigns FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Storage bucket for portal documents
INSERT INTO storage.buckets (id, name, public) VALUES ('portal-documents', 'portal-documents', false);

-- Storage policies
CREATE POLICY "Admins can upload documents" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'portal-documents' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Portal editors can upload documents" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'portal-documents' AND public.has_role(auth.uid(), 'portal_editor'));
CREATE POLICY "Authorized users can download documents" ON storage.objects FOR SELECT
  USING (bucket_id = 'portal-documents' AND auth.uid() IS NOT NULL);
CREATE POLICY "Admins can delete documents" ON storage.objects FOR DELETE
  USING (bucket_id = 'portal-documents' AND public.has_role(auth.uid(), 'admin'));

-- Timestamps update function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_portal_documents_updated_at BEFORE UPDATE ON public.portal_documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_financial_projections_updated_at BEFORE UPDATE ON public.financial_projections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_impact_metrics_updated_at BEFORE UPDATE ON public.impact_metrics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_crm_contacts_updated_at BEFORE UPDATE ON public.crm_contacts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_email_campaigns_updated_at BEFORE UPDATE ON public.email_campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
