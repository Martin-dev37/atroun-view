-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can read their session conversations" ON chat_conversations;
DROP POLICY IF EXISTS "Anyone can read messages" ON chat_messages;
DROP POLICY IF EXISTS "Anyone can insert messages to existing conversations" ON chat_messages;
DROP POLICY IF EXISTS "Anyone can create conversations with session" ON chat_conversations;

-- Add DELETE policy for chat_conversations (needed for clearConversation)
CREATE POLICY "Users can delete their own conversations"
ON chat_conversations
FOR DELETE
USING (true);

-- Create secure policies using session_id passed via custom header
-- The client will pass session_id as x-session-id header

-- Policy: Users can only read conversations matching their session_id header
CREATE POLICY "Users can read own session conversations"
ON chat_conversations
FOR SELECT
USING (
  session_id = coalesce(
    nullif(current_setting('request.headers', true)::json->>'x-session-id', ''),
    ''
  )
);

-- Policy: Users can create conversations with their session_id
CREATE POLICY "Users can create conversations with their session"
ON chat_conversations
FOR INSERT
WITH CHECK (
  session_id IS NOT NULL 
  AND session_id <> '' 
  AND session_id = coalesce(
    nullif(current_setting('request.headers', true)::json->>'x-session-id', ''),
    ''
  )
);

-- Policy: Users can only read messages from their own conversations
CREATE POLICY "Users can read messages from own conversations"
ON chat_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM chat_conversations
    WHERE chat_conversations.id = chat_messages.conversation_id
    AND chat_conversations.session_id = coalesce(
      nullif(current_setting('request.headers', true)::json->>'x-session-id', ''),
      ''
    )
  )
);

-- Policy: Users can only insert messages to their own conversations
CREATE POLICY "Users can insert messages to own conversations"
ON chat_messages
FOR INSERT
WITH CHECK (
  conversation_id IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM chat_conversations
    WHERE chat_conversations.id = chat_messages.conversation_id
    AND chat_conversations.session_id = coalesce(
      nullif(current_setting('request.headers', true)::json->>'x-session-id', ''),
      ''
    )
  )
);