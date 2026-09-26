"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import Link from "next/link";
import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { WHATSAPP_CHAT_URL } from "@/data/site";
import { CHAT_BUSY_MESSAGE, CHAT_LIMITS, CHAT_RATE_LIMIT_MESSAGE } from "@/lib/chat/limits";
import { cn } from "@/lib/utils";
import { ChatText } from "./ChatText";

const STORAGE_KEY = "chat-conversation-id";
const GREETING =
  "Hi! I'm Ismail's assistant. Ask me about his work, services and projects — or tell me what you'd like to build.";
const SUGGESTIONS = ["What do you build?", "How does pricing work?", "I want to start a project"];

// One id per browser tab session, so a reload keeps the same server transcript.
function getConversationId() {
  try {
    const existing = sessionStorage.getItem(STORAGE_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

// The API returns JSON errors for rejected requests (e.g. 429); stream errors
// already arrive as the friendly busy message.
function errorMessage(error: Error) {
  try {
    if (JSON.parse(error.message)?.error === CHAT_RATE_LIMIT_MESSAGE) return CHAT_RATE_LIMIT_MESSAGE;
  } catch {
    // Not JSON: a stream error or network failure.
  }
  return CHAT_BUSY_MESSAGE;
}

const textOf = (message: UIMessage) =>
  message.parts.flatMap((part) => (part.type === "text" ? [part.text] : [])).join("\n\n");

const bubbleBase = "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed whitespace-pre-wrap break-words";

const MessageBubble = memo(function MessageBubble({
  role,
  text,
  onInternalLink,
}: {
  role: UIMessage["role"];
  text: string;
  onInternalLink: () => void;
}) {
  const fromUser = role === "user";
  return (
    <li className={cn("flex", fromUser ? "justify-end" : "justify-start")}>
      <p
        className={cn(
          bubbleBase,
          fromUser
            ? "rounded-br-md bg-accent/15 text-fg ring-1 ring-accent/20"
            : "rounded-bl-md border border-white/[0.06] bg-white/[0.03] text-fg/90",
        )}
      >
        {fromUser ? text : <ChatText text={text} onInternalLink={onInternalLink} />}
      </p>
    </li>
  );
});

const typingIndicator = (
  <li className="flex justify-start" aria-hidden>
    <span className="flex gap-1 rounded-2xl rounded-bl-md border border-white/[0.06] bg-white/[0.03] px-4 py-3.5">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="size-1.5 animate-pulse rounded-full bg-muted"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  </li>
);

const sendIcon = (
  <svg aria-hidden viewBox="0 0 16 16" fill="none" className="size-4">
    <path d="M8 13V3m0 0L4 7m4-4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const stopIcon = (
  <svg aria-hidden viewBox="0 0 16 16" className="size-3.5">
    <rect x="3" y="3" width="10" height="10" rx="2" fill="currentColor" />
  </svg>
);

const closeIcon = (
  <svg aria-hidden viewBox="0 0 24 24" fill="none" className="size-5">
    <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export function ChatWidget({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [conversationId] = useState(getConversationId);
  const [transport] = useState(
    () => new DefaultChatTransport({ api: "/api/chat", body: { conversationId } }),
  );
  const { messages, sendMessage, status, error, stop, regenerate } = useChat({
    id: conversationId,
    transport,
    throttle: 50,
  });
  const [input, setInput] = useState("");
  // The full-screen mobile sheet would hide the page being opened.
  const onInternalLink = useCallback(() => {
    if (window.matchMedia("(max-width: 639px)").matches) onClose();
  }, [onClose]);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  // Follow new content only while the visitor is reading the bottom.
  const stickToBottom = useRef(true);

  const busy = status === "submitted" || status === "streaming";
  const lastMessage = messages.at(-1);
  const lastPart = lastMessage?.parts.at(-1);
  const showTyping =
    busy && (lastMessage?.role !== "assistant" || lastPart?.type !== "text" || !lastPart.text);
  // Announce only finished replies, not every streamed token.
  const announcement =
    status === "ready" && lastMessage?.role === "assistant" ? textOf(lastMessage) : "";

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    const list = listRef.current;
    if (list && stickToBottom.current) list.scrollTop = list.scrollHeight;
  }, [messages, showTyping, error, open]);

  const onScroll = () => {
    const list = listRef.current;
    if (list) stickToBottom.current = list.scrollHeight - list.scrollTop - list.clientHeight < 80;
  };

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    stickToBottom.current = true;
    sendMessage({ text: trimmed.slice(0, CHAT_LIMITS.text) });
    setInput("");
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    send(input);
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      send(input);
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {open && (
          <motion.div
            id="chat-panel"
            role="dialog"
            aria-label="Chat with Ismail's assistant"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] flex origin-bottom-right flex-col overflow-hidden bg-surface pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] sm:inset-auto sm:right-6 sm:bottom-24 sm:h-[560px] sm:max-h-[calc(100dvh-8rem)] sm:w-[380px] sm:rounded-3xl sm:border sm:border-white/[0.08] sm:bg-surface/95 sm:p-0 sm:shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)] sm:backdrop-blur-xl"
          >
            <header className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span aria-hidden className="relative flex size-2">
                  <span className="absolute inset-0 animate-pulse-ring rounded-full bg-accent" />
                  <span className="relative size-2 rounded-full bg-accent" />
                </span>
                <h2 className="text-[15px] font-medium tracking-tight text-fg">Ask about my work</h2>
              </div>
              <a
                href={WHATSAPP_CHAT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto rounded-full border border-[#25D366]/35 px-3 py-1.5 text-xs text-fg/85 transition-colors hover:bg-[#25D366]/15 focus-visible:ring-2 focus-visible:ring-[#25D366]/60 focus-visible:outline-none"
              >
                WhatsApp me
              </a>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close chat"
                className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-white/[0.06] hover:text-fg focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:outline-none"
              >
                {closeIcon}
              </button>
            </header>

            <div
              ref={listRef}
              onScroll={onScroll}
              className="flex-1 overflow-y-auto overscroll-contain px-4 py-5"
            >
              <ul className="space-y-3">
                <MessageBubble role="assistant" text={GREETING} onInternalLink={onInternalLink} />
                {messages.map((message) => {
                  const text = textOf(message);
                  return text ? (
                    <MessageBubble key={message.id} role={message.role} text={text} onInternalLink={onInternalLink} />
                  ) : null;
                })}
                {showTyping ? typingIndicator : null}
              </ul>

              {messages.length === 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => send(suggestion)}
                      className="rounded-full border border-white/[0.1] px-3.5 py-1.5 text-[13px] text-fg/80 transition-colors hover:border-accent/40 hover:text-fg focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:outline-none"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              ) : null}

              {error && !busy ? (
                <div role="alert" className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/[0.06] px-3.5 py-3 text-[13px] text-fg/85">
                  <p>{errorMessage(error)}</p>
                  <div className="mt-2.5 flex gap-4">
                    <button
                      type="button"
                      onClick={() => regenerate()}
                      className="font-medium text-accent hover:underline focus-visible:underline focus-visible:outline-none"
                    >
                      Try again
                    </button>
                    <Link href="/contact" onClick={onInternalLink} className="text-fg/80 underline decoration-white/30 underline-offset-4 hover:decoration-accent">
                      Contact form
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>

            <p aria-live="polite" className="sr-only">
              {announcement}
            </p>

            <form onSubmit={onSubmit} className="flex items-end gap-2 border-t border-white/[0.06] p-3">
              <label htmlFor="chat-input" className="sr-only">
                Your message
              </label>
              <textarea
                ref={inputRef}
                id="chat-input"
                rows={1}
                value={input}
                maxLength={CHAT_LIMITS.text}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Ask a question…"
                className="max-h-32 min-h-11 flex-1 resize-none rounded-2xl border border-white/[0.08] bg-bg/60 px-4 py-2.5 text-[14px] text-fg [field-sizing:content] placeholder:text-muted/60 focus:border-white/[0.14] focus:ring-2 focus:ring-accent/30 focus:outline-none"
              />
              {busy ? (
                <button
                  type="button"
                  onClick={() => stop()}
                  aria-label="Stop generating"
                  className="grid size-11 shrink-0 place-items-center rounded-full border border-white/[0.12] text-fg transition-colors hover:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:outline-none"
                >
                  {stopIcon}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  aria-label="Send message"
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-fg text-bg transition-[background-color,opacity] hover:bg-white/85 focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none disabled:opacity-40"
                >
                  {sendIcon}
                </button>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
