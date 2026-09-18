"use client";

import { useMemo } from "react";
import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";

// Initialize MarkdownIt with tables, breaks, linkify, and typographer
const md = new MarkdownIt({
  html: false, // Disallow raw HTML for safety
  xhtmlOut: false,
  breaks: true, // Convert '\n' in paragraphs into <br>
  langPrefix: "language-",
  linkify: true, // Autoconvert URL-like text to links
  typographer: true,
  quotes: "“”‘’",
});

// Customize link rendering to open in external windows safely with styling
const defaultLinkRender =
  md.renderer.rules.link_open ||
  function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrPush(["target", "_blank"]);
  tokens[idx].attrPush(["rel", "noopener noreferrer"]);
  tokens[idx].attrPush([
    "class",
    "text-[#184530] dark:text-[#B8F55C] font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity",
  ]);
  return defaultLinkRender(tokens, idx, options, env, self);
};

// Customize table rendering with modern daisyUI/Tailwind table styling
md.renderer.rules.table_open = function () {
  return '<div class="overflow-x-auto my-3 rounded-xl border border-[#DEE7DF] dark:border-[#1F382B] shadow-2xs"><table class="table table-xs w-full text-left border-collapse bg-white dark:bg-[#12241C] text-xs">';
};

md.renderer.rules.table_close = function () {
  return "</table></div>";
};

md.renderer.rules.thead_open = function () {
  return '<thead class="bg-[#F8FAF7] dark:bg-[#162B21] text-[#556A60] dark:text-[#A5B8AD] border-b border-[#DEE7DF] dark:border-[#1F382B] font-bold uppercase tracking-wider text-[10.5px]">';
};

md.renderer.rules.th_open = function () {
  return '<th class="py-2 px-3 font-bold border-r last:border-r-0 border-[#DEE7DF] dark:border-[#1F382B]">';
};

md.renderer.rules.td_open = function () {
  return '<td class="py-2 px-3 border-t border-r last:border-r-0 border-[#EEF3EF] dark:border-[#1F382B] text-[#11231B] dark:text-[#F2F7F4]">';
};

md.renderer.rules.tr_open = function () {
  return '<tr class="hover:bg-[#F8FAF7] dark:hover:bg-[#162B21] transition-colors">';
};

// Customize codeblock rendering
md.renderer.rules.fence = function (tokens, idx) {
  const token = tokens[idx];
  const info = token.info ? token.info.trim() : "";
  const lang = info ? info.split(/\s+/g)[0] : "";
  const code = token.content;

  return `<div class="my-2.5 rounded-xl bg-[#0C1712] text-[#F2F7F4] border border-[#1F382B] overflow-hidden text-[11px] font-mono shadow-xs">
    ${
      lang
        ? `<div class="px-3 py-1 bg-[#12241C] border-b border-[#1F382B] text-[10px] uppercase font-bold text-[#B8F55C] tracking-wider flex justify-between items-center">
            <span>${lang}</span>
           </div>`
        : ""
    }
    <pre class="p-3 overflow-x-auto leading-relaxed"><code>${DOMPurify.sanitize(code)}</code></pre>
  </div>`;
};

// Customize inline code
md.renderer.rules.code_inline = function (tokens, idx) {
  const token = tokens[idx];
  return `<code class="px-1.5 py-0.5 rounded-md bg-[#EBF1EB] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C] font-mono text-[11px] border border-[#DEE7DF] dark:border-[#234235] font-semibold">${DOMPurify.sanitize(token.content)}</code>`;
};

// Customize blockquote
md.renderer.rules.blockquote_open = function () {
  return '<blockquote class="my-2.5 pl-3 border-l-3 border-[#184530] dark:border-[#B8F55C] text-[#556A60] dark:text-[#A5B8AD] italic text-xs bg-[#E5EFE7]/40 dark:bg-[#18362B]/20 py-1.5 rounded-r-lg">';
};

md.renderer.rules.blockquote_close = function () {
  return "</blockquote>";
};

/**
 * Robust React Markdown Renderer powered by markdown-it and DOMPurify
 */
export default function MarkdownRenderer({ content, className = "" }) {
  const renderedHtml = useMemo(() => {
    if (!content) return "";
    try {
      const rawHtml = md.render(content);
      return DOMPurify.sanitize(rawHtml, {
        ADD_ATTR: ["target", "rel", "class"],
      });
    } catch (err) {
      console.error("[MarkdownRenderer] Error parsing markdown:", err);
      return DOMPurify.sanitize(content);
    }
  }, [content]);

  if (!content) return null;

  return (
    <div
      className={`markdown-body prose prose-sm max-w-none text-xs leading-relaxed text-[#11231B] dark:text-[#F2F7F4] break-words ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
}
