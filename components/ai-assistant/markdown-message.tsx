'use client';

import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

interface MarkdownMessageProps {
  content: string;
}

export function MarkdownMessage({ content }: MarkdownMessageProps) {
  return (
    <ReactMarkdown
      components={{
        // Paragraphs with proper spacing
        p: ({ children }) => (
          <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
        ),
        
        // Bold text
        strong: ({ children }) => (
          <strong className="font-bold text-fd-foreground">{children}</strong>
        ),
        
        // Italic text
        em: ({ children }) => (
          <em className="italic">{children}</em>
        ),
        
        // Unordered lists (bullet points)
        ul: ({ children }) => (
          <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>
        ),
        
        // Ordered lists (numbered)
        ol: ({ children }) => (
          <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>
        ),
        
        // List items
        li: ({ children }) => (
          <li className="mb-1 leading-relaxed">{children}</li>
        ),
        
        // Links - use Next.js Link for internal, regular anchor for external
        a: ({ href, children }) => {
          const isInternal = href?.startsWith('/');
          
          if (isInternal) {
            return (
              <Link 
                href={href || '#'} 
                className="text-fd-primary underline hover:no-underline"
              >
                {children}
              </Link>
            );
          }
          
          return (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-fd-primary underline hover:no-underline"
            >
              {children}
            </a>
          );
        },
        
        // Code inline
        code: ({ children }) => (
          <code className="px-1.5 py-0.5 bg-fd-accent rounded text-sm font-mono">
            {children}
          </code>
        ),
        
        // Code blocks
        pre: ({ children }) => (
          <pre className="p-3 bg-fd-accent rounded-lg overflow-x-auto mb-3 text-sm">
            {children}
          </pre>
        ),
        
        // Headings (if AI generates them)
        h1: ({ children }) => (
          <h1 className="text-lg font-bold mb-2 mt-4">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-base font-bold mb-2 mt-3">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-bold mb-1 mt-2">{children}</h3>
        ),
        
        // Horizontal rule
        hr: () => <hr className="my-4 border-fd-border" />,
        
        // Blockquote
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-fd-primary pl-4 italic my-3">
            {children}
          </blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
