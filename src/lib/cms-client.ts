import { createClient } from '@supabase/supabase-js';

// External CMS Supabase project for website content
const CMS_SUPABASE_URL = 'https://vlenbnbtzalmvlpmmwts.supabase.co';
const CMS_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsZW5ibmJ0emFsbXZscG1td3RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyMTc0NjYsImV4cCI6MjA1Mjc5MzQ2Nn0.oEnV6JBWRISt5JHmTQ_YT65XECxmW2lXG6TwHOG5FYk';

export const cmsClient = createClient(CMS_SUPABASE_URL, CMS_SUPABASE_ANON_KEY);
