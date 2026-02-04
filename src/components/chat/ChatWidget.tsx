import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Loader2, Trash2, Volume2, VolumeX, Globe, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { useToast } from '@/hooks/use-toast';
import { useChatPersistence } from '@/hooks/useChatPersistence';
import { useTextToSpeech, LANGUAGE_OPTIONS, type SupportedLanguage } from '@/hooks/useTextToSpeech';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import avoMascot from '@/assets/avo-mascot.png';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/company-chat`;

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { messages, setMessages, saveMessage, clearConversation, isLoadingHistory } = useChatPersistence();
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  
  const handleVoiceResult = useCallback((transcript: string) => {
    setInput(transcript);
  }, []);
  const { isListening, isSupported: isSpeechSupported, startListening, stopListening } = useSpeechRecognition(handleVoiceResult);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const streamChat = useCallback(async (
    chatMessages: Message[],
    onDelta: (deltaText: string) => void,
    onDone: () => void
  ) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: chatMessages, targetLanguage: selectedLanguage }),
    });

    if (!resp.ok || !resp.body) {
      if (resp.status === 429) {
        throw new Error("Rate limited. Please try again in a moment.");
      }
      if (resp.status === 402) {
        throw new Error("Service temporarily unavailable.");
      }
      throw new Error("Failed to connect to chat service");
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    if (textBuffer.trim()) {
      for (let raw of textBuffer.split("\n")) {
        if (!raw) continue;
        if (raw.endsWith("\r")) raw = raw.slice(0, -1);
        if (raw.startsWith(":") || raw.trim() === "") continue;
        if (!raw.startsWith("data: ")) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch { /* ignore partial leftovers */ }
      }
    }

    onDone();
  }, [selectedLanguage]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Save user message to database
    await saveMessage('user', userMessage.content);

    let assistantSoFar = "";
    const upsertAssistant = (nextChunk: string) => {
      assistantSoFar += nextChunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat(
        [...messages, userMessage],
        (chunk) => upsertAssistant(chunk),
        async () => {
          setIsLoading(false);
          // Save assistant response to database
          if (assistantSoFar) {
            await saveMessage('assistant', assistantSoFar);
            // Auto-speak if enabled
            if (autoSpeak) {
              speak(assistantSoFar, selectedLanguage);
            }
          }
        }
      );
    } catch (error) {
      console.error("Chat error:", error);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Chat Error",
        description: error instanceof Error ? error.message : "Failed to get response. Please try again.",
      });
    }
  };

  const handleClearHistory = async () => {
    stop();
    await clearConversation();
    toast({ title: "Chat cleared", description: "Your conversation history has been deleted." });
  };

  const handleSpeakMessage = (content: string) => {
    if (isSpeaking) {
      stop();
    } else {
      speak(content, selectedLanguage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Avocado Mascot Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-4 right-4 z-50 w-24 h-28 cursor-pointer",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full"
        )}
        initial={{ y: 0 }}
        animate={{ 
          y: [0, -4, 0, -2, 0],
          rotate: [0, -1, 0, 1, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{ 
          scale: 1.08,
          y: -8,
          transition: { duration: 0.3 }
        }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Close chat" : "Ask me anything about ATROUN!"}
      >
        <motion.img 
          src={avoMascot} 
          alt="Avo - ATROUN Assistant"
          className="w-full h-full object-contain drop-shadow-xl"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }}
        />
        
        {/* Speech bubble hint when closed */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="absolute -top-12 -left-20 bg-background border border-border rounded-lg px-3 py-2 shadow-lg whitespace-nowrap"
            >
              <span className="text-xs font-body text-foreground">Ask me anything! 🥑</span>
              <div className="absolute bottom-0 right-6 translate-y-1/2 rotate-45 w-2 h-2 bg-background border-r border-b border-border" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "fixed bottom-32 right-4 z-50 w-[380px] max-w-[calc(100vw-2rem)]",
              "bg-background border border-border rounded-xl shadow-2xl",
              "flex flex-col overflow-hidden h-[450px]"
            )}
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center overflow-hidden">
                  <img src={avoMascot} alt="Avo" className="w-12 h-12 object-contain" />
                </div>
                <div>
                  <h3 className="font-display font-semibold">ATROUN Assistant</h3>
                  <p className="text-xs text-primary-foreground/80">Ask about freeze-drying & more</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {/* Language selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                    className="p-1.5 hover:bg-primary-foreground/20 rounded-full transition-colors"
                    aria-label="Select language"
                    title="Select language"
                  >
                    <Globe className="w-4 h-4" />
                  </button>
                  {showLanguageMenu && (
                    <div className="absolute top-full right-0 mt-1 bg-background border border-border rounded-lg shadow-lg py-1 min-w-[120px] z-50">
                      {LANGUAGE_OPTIONS.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setSelectedLanguage(lang.code);
                            setShowLanguageMenu(false);
                          }}
                          className={cn(
                            "w-full text-left px-3 py-1.5 text-sm hover:bg-muted transition-colors",
                            selectedLanguage === lang.code && "bg-muted font-medium"
                          )}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* Auto-speak toggle */}
                <button
                  onClick={() => setAutoSpeak(!autoSpeak)}
                  className={cn(
                    "p-1.5 rounded-full transition-colors",
                    autoSpeak ? "bg-primary-foreground/30" : "hover:bg-primary-foreground/20"
                  )}
                  aria-label={autoSpeak ? "Disable auto-speak" : "Enable auto-speak"}
                  title={autoSpeak ? "Auto-speak on" : "Auto-speak off"}
                >
                  {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                {messages.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="p-1.5 hover:bg-primary-foreground/20 rounded-full transition-colors"
                    aria-label="Clear chat history"
                    title="Clear history"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-primary-foreground/20 rounded-full transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoadingHistory ? (
                <div className="text-center py-6">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                  <p className="text-xs text-muted-foreground mt-2">Loading history...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-6">
                  <img src={avoMascot} alt="Avo" className="w-20 h-24 mx-auto mb-3 opacity-70 object-contain" />
                  <p className="text-sm font-body">
                    Hi there! I'm Avo, your ATROUN guide. 🥑
                  </p>
                  <p className="text-xs font-body mt-2 text-muted-foreground/80">
                    Ask me about freeze-drying, our products, sustainability, or investment opportunities!
                  </p>
                </div>
              ) : null}
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex",
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2 text-sm font-body",
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-secondary text-secondary-foreground rounded-bl-md'
                    )}
                  >
                    {message.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                        <button
                          onClick={() => handleSpeakMessage(message.content)}
                          className="mt-1 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                        >
                          <Volume2 className="w-3 h-3" />
                          {isSpeaking ? 'Stop' : 'Listen'}
                        </button>
                      </div>
                    ) : (
                      message.content
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                <div className="flex justify-start">
                  <div className="bg-secondary text-secondary-foreground rounded-2xl rounded-bl-md px-4 py-3">
                    <motion.div
                      className="flex gap-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-primary/60 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </motion.div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border p-3 bg-muted/30">
              <div className="flex gap-2">
                {isSpeechSupported && (
                  <Button
                    onClick={isListening ? stopListening : startListening}
                    disabled={isLoading}
                    size="icon"
                    variant={isListening ? "destructive" : "outline"}
                    className={cn(
                      "shrink-0 rounded-full w-10 h-10",
                      isListening && "animate-pulse"
                    )}
                    title={isListening ? "Stop recording" : "Voice input"}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                )}
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isListening ? "Listening..." : "Ask about ATROUN or freeze-drying..."}
                  className="flex-1 px-4 py-2.5 text-sm rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 font-body"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="shrink-0 rounded-full w-10 h-10"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
