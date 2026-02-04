import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const SESSION_KEY = 'atroun_chat_session';

function getSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export function useChatPersistence() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const sessionId = getSessionId();

  // Load existing conversation on mount
  useEffect(() => {
    async function loadConversation() {
      try {
        // Find existing conversation for this session
        const { data: conversations } = await supabase
          .from('chat_conversations')
          .select('id')
          .eq('session_id', sessionId)
          .order('updated_at', { ascending: false })
          .limit(1);

        if (conversations && conversations.length > 0) {
          const convId = conversations[0].id;
          setConversationId(convId);

          // Load messages
          const { data: msgs } = await supabase
            .from('chat_messages')
            .select('role, content')
            .eq('conversation_id', convId)
            .order('created_at', { ascending: true });

          if (msgs) {
            setMessages(msgs as Message[]);
          }
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadConversation();
  }, [sessionId]);

  // Create or get conversation
  const ensureConversation = useCallback(async (): Promise<string> => {
    if (conversationId) return conversationId;

    const { data, error } = await supabase
      .from('chat_conversations')
      .insert({ session_id: sessionId })
      .select('id')
      .single();

    if (error) throw error;
    setConversationId(data.id);
    return data.id;
  }, [conversationId, sessionId]);

  // Save a message
  const saveMessage = useCallback(async (role: 'user' | 'assistant', content: string) => {
    try {
      const convId = await ensureConversation();
      await supabase
        .from('chat_messages')
        .insert({ conversation_id: convId, role, content });
    } catch (error) {
      console.error('Failed to save message:', error);
    }
  }, [ensureConversation]);

  // Clear conversation
  const clearConversation = useCallback(async () => {
    if (conversationId) {
      await supabase
        .from('chat_conversations')
        .delete()
        .eq('id', conversationId);
    }
    setConversationId(null);
    setMessages([]);
  }, [conversationId]);

  return {
    messages,
    setMessages,
    saveMessage,
    clearConversation,
    isLoadingHistory: isLoading,
  };
}
