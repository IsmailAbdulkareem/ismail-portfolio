import Link from "next/link";
import type { ReactNode } from "react";

// Turns model text into React nodes without dangerouslySetInnerHTML. Supports
// [label](url) links, bare https links, bare site paths (/projects/slug) and
// **bold**. Only https, mailto and same-site relative URLs become links
// (backslashes are rejected so "/\host" can't act as a protocol-relative URL).
const TOKEN =
  /\[([^\]\n]+)\]\(((?:https:\/\/|mailto:|\/(?![/\\]))[^\s)\\]*)\)|(https:\/\/[^\s<>()]*[^\s<>().,;:!?'"])|(?<![\w/.])(\/(?:about|projects|services|contact)(?:\/[a-z0-9-]+)?)(?![\w/])|\*\*([^*\n]+)\*\*/gi;

const linkClass = "text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent";

function renderLink(href: string, label: string, key: number, onInternalLink?: () => void) {
  if (href.startsWith("/")) {
    return (
      <Link key={key} href={href} onClick={onInternalLink} className={linkClass}>
        {label}
      </Link>
    );
  }
  return (
    <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
      {label}
    </a>
  );
}

export function ChatText({ text, onInternalLink }: { text: string; onInternalLink?: () => void }) {
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(TOKEN)) {
    const [whole, mdLabel, mdHref, bareUrl, sitePath, bold] = match;
    const start = match.index ?? 0;
    if (start > last) nodes.push(text.slice(last, start));
    const key = start;
    if (mdHref) nodes.push(renderLink(mdHref, mdLabel, key, onInternalLink));
    else if (bareUrl) nodes.push(renderLink(bareUrl, bareUrl, key, onInternalLink));
    else if (sitePath) nodes.push(renderLink(sitePath, sitePath, key, onInternalLink));
    else if (bold) nodes.push(<strong key={key} className="font-semibold text-fg">{bold}</strong>);
    else nodes.push(whole);
    last = start + whole.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}
