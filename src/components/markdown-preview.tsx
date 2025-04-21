"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import type { ReactNode } from "react";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export function MarkdownPreview({
  content,
  className = "",
}: MarkdownPreviewProps) {
  const components: Components = {
    h1: ({ children, ...props }) => (
      <h1 className="mt-8 mb-4 text-4xl font-bold" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="mt-6 mb-3 text-3xl font-bold" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="mt-4 mb-2 text-2xl font-bold" {...props}>
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4 className="mt-3 mb-2 text-xl font-bold" {...props}>
        {children}
      </h4>
    ),
    h5: ({ children, ...props }) => (
      <h5 className="mt-2 mb-1 text-lg font-bold" {...props}>
        {children}
      </h5>
    ),
    h6: ({ children, ...props }) => (
      <h6 className="mt-2 mb-1 text-base font-bold" {...props}>
        {children}
      </h6>
    ),
    p: ({ children, ...props }) => (
      <p className="mb-4 leading-relaxed" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul className="mb-4 list-disc pl-6" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="mb-4 list-decimal pl-6" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="mb-1" {...props}>
        {children}
      </li>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="my-4 border-l-4 border-gray-300 pl-4 italic"
        {...props}
      >
        {children}
      </blockquote>
    ),
    code: ({ className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className ?? "");
      return match ? (
        <code className={className} {...props}>
          {children}
        </code>
      ) : (
        <code
          className="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800"
          {...props}
        >
          {children}
        </code>
      );
    },
  };

  return (
    <div
      className={`prose prose-sm dark:prose-invert prose-headings:font-bold prose-p:leading-relaxed prose-a:text-blue-600 dark:prose-a:text-blue-400 w-full ${className}`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
