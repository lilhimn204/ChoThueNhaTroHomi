import { cn } from "@/lib/utils";

type MarkdownBlock =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "unordered-list"; items: string[] }
  | { type: "ordered-list"; items: string[] }
  | { type: "quote"; text: string };

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  const blocks = parseMarkdown(content);

  if (!blocks.length) {
    return (
      <p className={cn("text-sm text-[var(--color-text-muted)]", className)}>
        Chưa có nội dung để xem trước.
      </p>
    );
  }

  return (
    <div className={cn("space-y-5 text-base leading-8 text-[var(--color-text-strong)]", className)}>
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const HeadingTag = `h${block.level}` as const;
          const headingClass =
            block.level === 1
              ? "text-3xl font-semibold tracking-tight"
              : block.level === 2
                ? "text-2xl font-semibold"
                : "text-xl font-semibold";

          return (
            <HeadingTag
              key={`${block.type}-${index}-${block.text}`}
              className={cn("pt-2 text-[var(--color-text-strong)]", headingClass)}
            >
              {block.text}
            </HeadingTag>
          );
        }

        if (block.type === "unordered-list") {
          return (
            <ul
              key={`${block.type}-${index}-${block.items.join("|")}`}
              className="space-y-2 pl-5"
            >
              {block.items.map((item) => (
                <li key={item} className="list-disc pl-1 text-[var(--color-text-strong)]">
                  {item}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "ordered-list") {
          return (
            <ol
              key={`${block.type}-${index}-${block.items.join("|")}`}
              className="space-y-2 pl-5"
            >
              {block.items.map((item) => (
                <li key={item} className="list-decimal pl-1 text-[var(--color-text-strong)]">
                  {item}
                </li>
              ))}
            </ol>
          );
        }

        if (block.type === "quote") {
          return (
            <blockquote
              key={`${block.type}-${index}-${block.text}`}
              className="rounded-2xl border-l-4 border-[var(--color-brand-500)] bg-[var(--color-surface-soft)] px-4 py-3 text-[var(--color-text-muted)]"
            >
              {block.text}
            </blockquote>
          );
        }

        return (
          <p key={`${block.type}-${index}-${block.text}`} className="whitespace-pre-line">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

function parseMarkdown(content: string) {
  const blocks: MarkdownBlock[] = [];
  const lines = content.split(/\r?\n/);
  let paragraph: string[] = [];
  let unorderedItems: string[] = [];
  let orderedItems: string[] = [];

  const flushParagraph = () => {
    if (!paragraph.length) {
      return;
    }

    blocks.push({ type: "paragraph", text: paragraph.join("\n").trim() });
    paragraph = [];
  };

  const flushLists = () => {
    if (unorderedItems.length) {
      blocks.push({ type: "unordered-list", items: unorderedItems });
      unorderedItems = [];
    }

    if (orderedItems.length) {
      blocks.push({ type: "ordered-list", items: orderedItems });
      orderedItems = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushLists();
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushLists();
      blocks.push({
        type: "heading",
        level: heading[1].length as 1 | 2 | 3,
        text: heading[2].trim(),
      });
      continue;
    }

    const unordered = line.match(/^[-*]\s+(.+)$/);
    if (unordered) {
      flushParagraph();
      orderedItems = orderedItems.length ? [] : orderedItems;
      unorderedItems.push(unordered[1].trim());
      continue;
    }

    const ordered = line.match(/^\d+\.\s+(.+)$/);
    if (ordered) {
      flushParagraph();
      unorderedItems = unorderedItems.length ? [] : unorderedItems;
      orderedItems.push(ordered[1].trim());
      continue;
    }

    if (line.startsWith(">")) {
      flushParagraph();
      flushLists();
      blocks.push({ type: "quote", text: line.replace(/^>\s?/, "").trim() });
      continue;
    }

    flushLists();
    paragraph.push(line);
  }

  flushParagraph();
  flushLists();

  return blocks;
}
