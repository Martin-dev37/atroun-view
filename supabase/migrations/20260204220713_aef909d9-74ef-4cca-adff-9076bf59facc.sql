-- Fix the overly permissive DELETE policy
DROP POLICY IF EXISTS "Users can delete their own conversations" ON chat_conversations;

CREATE POLICY "Users can delete own session conversations"
ON chat_conversations
FOR DELETE
USING (
  session_id = coalesce(
    nullif(current_setting('request.headers', true)::json->>'x-session-id', ''),
    ''
  )
);