"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";

// The widget (and the AI SDK with it) is only downloaded once the visitor
// shows intent, so it stays out of the initial bundle.
const loadWidget = () => import("./ChatWidget").then((mod) => mod.ChatWidget);
const ChatWidget = dynamic(loadWidget, { ssr: false });
const preload = () => {
  loadWidget().catch(() => {}); // a failed prefetch is retried on open
};

const chatIcon = (
  <svg aria-hidden viewBox="0 0 24 24" fill="none" className="size-6">
    <path
      d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.6a.5.5 0 0 1-.8-.4V16h-.5A.5.5 0 0 1 4 15.5v-10Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M8.5 9.5h7M8.5 12.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const closeIcon = (
  <svg aria-hidden viewBox="0 0 24 24" fill="none" className="size-5">
    <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export function ChatLauncher() {
  const [open, setOpen] = useState(false);
  // Stays mounted after the first open so the conversation survives closing.
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  const toggle = () => {
    if (open) return close();
    setMounted(true);
    setOpen(true);
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        onPointerEnter={preload}
        onFocus={preload}
        aria-label={open ? "Close chat" : "Chat with Ismail's assistant"}
        aria-expanded={open}
        aria-controls={mounted ? "chat-panel" : undefined}
        // On mobile the open sheet covers this button, so it never needs hiding.
        className="fixed right-[calc(1rem+env(safe-area-inset-right))] bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 grid size-14 place-items-center rounded-full border border-white/[0.1] bg-surface/85 text-fg shadow-[0_10px_40px_-10px_rgb(86_199_255/0.45)] backdrop-blur-md transition-[border-color,transform,box-shadow] duration-300 hover:border-accent/40 hover:shadow-[0_10px_40px_-8px_rgb(86_199_255/0.6)] focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none active:scale-95 sm:right-6 sm:bottom-6"
      >
        {open ? closeIcon : chatIcon}
      </button>
      {mounted && <ChatWidget open={open} onClose={close} />}
    </>
  );
}
