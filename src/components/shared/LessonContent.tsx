import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { formatLessonContent } from '../../utils/lesson-formatter';

interface LessonContentProps {
  content: string;
  className?: string;
}

export function LessonContent({ content, className = '' }: LessonContentProps) {
  const normalized = formatLessonContent(content);

  return (
    <div className={`prose max-w-none text-neutral-800 dark:text-neutral-200 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, [remarkMath, { singleDollar: true }]]}
        rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false }]]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mt-8 mb-4 first:mt-0 pb-2 border-b border-neutral-200 dark:border-neutral-800">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mt-8 mb-3 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mt-6 mb-3">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-base md:text-lg leading-7 md:leading-8 text-neutral-700 dark:text-neutral-300 mb-4">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="my-4 space-y-2 list-disc pl-6 text-neutral-700 dark:text-neutral-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-4 space-y-2 list-decimal pl-6 text-neutral-700 dark:text-neutral-300">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="pl-1 leading-7 text-neutral-700 dark:text-neutral-300">
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-neutral-900 dark:text-white">
              {children}
            </strong>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-5 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/40 p-4 rounded-r-xl text-neutral-700 dark:text-neutral-300">
              {children}
            </blockquote>
          ),
          code: ({ inline, children }: any) =>
            inline ? (
              <code className="rounded bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 font-mono text-sm text-neutral-800 dark:text-neutral-200">
                {children}
              </code>
            ) : (
              <pre className="rounded-xl bg-neutral-900 text-neutral-100 p-4 overflow-x-auto my-4 text-sm font-mono">
                <code>{children}</code>
              </pre>
            ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <table className="w-full text-left border-collapse text-sm md:text-base">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="bg-neutral-100 dark:bg-neutral-800 p-3 font-semibold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-700">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="p-3 border-b border-neutral-100 dark:border-neutral-800/60 text-neutral-700 dark:text-neutral-300">
              {children}
            </td>
          ),
        }}
      >
        {normalized}
      </ReactMarkdown>
    </div>
  );
}

export default LessonContent;
