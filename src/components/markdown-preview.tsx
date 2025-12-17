"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import type { Components } from "react-markdown";
import type { ReactNode } from "react";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

type HeadingProps = {
  children: ReactNode;
  level: 1 | 2 | 3 | 4 | 5 | 6;
} & React.HTMLAttributes<HTMLHeadingElement>;

const Heading = ({ children, level, ...props }: HeadingProps) => {
  const classes = [
    "font-bold",
    level === 1 ? "mt-8 mb-4 text-4xl" : "",
    level === 2 ? "mt-6 mb-3 text-3xl" : "",
    level === 3 ? "mt-4 mb-2 text-2xl" : "",
    level === 4 ? "mt-3 mb-2 text-xl" : "",
    level === 5 ? "mt-2 mb-1 text-lg" : "",
    level === 6 ? "mt-2 mb-1 text-base" : "",
  ]
    .filter(Boolean)
    .join(" ");

  switch (level) {
    case 1:
      return (
        <h1 className={classes} {...props}>
          {children}
        </h1>
      );
    case 2:
      return (
        <h2 className={classes} {...props}>
          {children}
        </h2>
      );
    case 3:
      return (
        <h3 className={classes} {...props}>
          {children}
        </h3>
      );
    case 4:
      return (
        <h4 className={classes} {...props}>
          {children}
        </h4>
      );
    case 5:
      return (
        <h5 className={classes} {...props}>
          {children}
        </h5>
      );
    case 6:
      return (
        <h6 className={classes} {...props}>
          {children}
        </h6>
      );
    default:
      return null;
  }
};

const markdownComponents: Components = {
  h1: ({ children, ...props }) => (
    <Heading level={1} {...props}>
      {children}
    </Heading>
  ),
  h2: ({ children, ...props }) => (
    <Heading level={2} {...props}>
      {children}
    </Heading>
  ),
  h3: ({ children, ...props }) => (
    <Heading level={3} {...props}>
      {children}
    </Heading>
  ),
  h4: ({ children, ...props }) => (
    <Heading level={4} {...props}>
      {children}
    </Heading>
  ),
  h5: ({ children, ...props }) => (
    <Heading level={5} {...props}>
      {children}
    </Heading>
  ),
  h6: ({ children, ...props }) => (
    <Heading level={6} {...props}>
      {children}
    </Heading>
  ),
  p: ({ children, ...props }) => (
    <p className="mb-4 leading-relaxed" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul className="mb-4 list-disc pl-6" role="list" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="mb-4 list-decimal pl-6" role="list" {...props}>
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
      <code
        className={className}
        role="code"
        aria-label={`Code block in ${match[1]} language`}
        {...props}
      >
        {children}
      </code>
    ) : (
      <code
        className="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800"
        role="code"
        {...props}
      >
        {children}
      </code>
    );
  },
  a: ({ children, href, ...props }) => (
    <a
      href={href}
      className="text-blue-600 hover:underline dark:text-blue-400"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  img: ({ src, alt, ...props }) => (
    // @ts-expect-error well aware of the problem here, choosing to ignore it right now
    <Image
      src={src ?? ""}
      alt={alt ?? ""}
      className="my-4 rounded-lg"
      loading="lazy"
      {...props}
    />
  ),
  table: ({ children, ...props }) => (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }) => (
    <th
      className="border border-gray-300 bg-gray-100 px-4 py-2 text-left dark:bg-gray-800"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border border-gray-300 px-4 py-2" {...props}>
      {children}
    </td>
  ),
};

export function MarkdownPreview({
  content,
  className = "",
}: MarkdownPreviewProps) {
  return (
    <div
      className={`prose prose-sm dark:prose-invert prose-headings:font-bold prose-p:leading-relaxed prose-a:text-blue-600 dark:prose-a:text-blue-400 w-full ${className}`}
      role="article"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
