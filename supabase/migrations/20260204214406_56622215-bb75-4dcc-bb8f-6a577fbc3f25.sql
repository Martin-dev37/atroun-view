-- Fix function search path
CREATE OR REPLACE FUNCTION public.update_chat_conversation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

-- For chat history, the permissive policies are intentional since:
-- 1. No auth is used (anonymous users)
-- 2. Session-based filtering happens at the application level
-- 3. Chat data is not sensitive personal data
-- Adding session_id validation at policy level for better security

DROP POLICY IF EXISTS "Anyone can create conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Anyone can insert messages" ON public.chat_messages;

CREATE POLICY "Anyone can create conversations with session" ON public.chat_conversations
  FOR INSERT WITH CHECK (session_id IS NOT NULL AND session_id != '');

CREATE POLICY "Anyone can insert messages to existing conversations" ON public.chat_messages
  FOR INSERT WITH CHECK (
    conversation_id IS NOT NULL AND 
    EXISTS (SELECT 1 FROM public.chat_conversations WHERE id = conversation_id)
  );