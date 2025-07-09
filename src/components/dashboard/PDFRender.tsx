import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PDFRendererProps {
  content: string;
  title: string;
  folderName: string;
}

const PDFRenderer = React.forwardRef<HTMLDivElement, PDFRendererProps>(
  ({ content }, ref) => {
    return (
      <div 
        ref={ref}
        style={{ 
          padding: '40px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: 'white',
          color: '#333',
          lineHeight: '1.6'
        }}
      >
        {/* Content */}
        <div className="markdown-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  margin: '30px 0 20px 0',
                  color: '#111',
                  borderBottom: '2px solid #eee',
                  paddingBottom: '10px',
                  lineHeight: '1.3'
                }}>
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  margin: '25px 0 15px 0',
                  color: '#222',
                  lineHeight: '1.3'
                }}>
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  margin: '20px 0 12px 0',
                  color: '#333',
                  lineHeight: '1.3'
                }}>
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p style={{
                  margin: '0 0 16px 0',
                  lineHeight: '1.6',
                  color: '#444'
                }}>
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul style={{
                  margin: '0 0 16px 0',
                  paddingLeft: '30px',
                  lineHeight: '1.5'
                }}>
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol style={{
                  margin: '0 0 16px 0',
                  paddingLeft: '30px',
                  lineHeight: '1.5'
                }}>
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li style={{
                  marginBottom: '6px',
                  lineHeight: '1.5'
                }}>
                  {children}
                </li>
              ),
              code: ({ children, className }) => {
                const isBlock = className?.includes('language-');
                if (isBlock) {
                  return (
                    <pre style={{
                      backgroundColor: '#f8f9fa',
                      padding: '15px',
                      borderRadius: '5px',
                      margin: '16px 0',
                      border: '1px solid #e9ecef',
                      overflow: 'auto'
                    }}>
                      <code style={{
                        fontFamily: 'Courier New, monospace',
                        fontSize: '13px',
                        color: '#333'
                      }}>
                        {children}
                      </code>
                    </pre>
                  );
                }
                return (
                  <code style={{
                    backgroundColor: '#f5f5f5',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    fontFamily: 'Courier New, monospace',
                    fontSize: '14px',
                    color: '#d63384'
                  }}>
                    {children}
                  </code>
                );
              },
              blockquote: ({ children }) => (
                <blockquote style={{
                  borderLeft: '4px solid #007bff',
                  padding: '12px 16px',
                  margin: '16px 0',
                  fontStyle: 'italic',
                  color: '#666',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '0 5px 5px 0'
                }}>
                  {children}
                </blockquote>
              ),
              table: ({ children }) => (
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  margin: '16px 0'
                }}>
                  {children}
                </table>
              ),
              th: ({ children }) => (
                <th style={{
                  border: '1px solid #ddd',
                  padding: '8px 12px',
                  textAlign: 'left',
                  backgroundColor: '#f8f9fa',
                  fontWeight: '600'
                }}>
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td style={{
                  border: '1px solid #ddd',
                  padding: '8px 12px',
                  textAlign: 'left'
                }}>
                  {children}
                </td>
              ),
              img: ({ src, alt }) => (
                <img 
                  src={src} 
                  alt={alt}
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    margin: '10px 0',
                    border: '1px solid #ddd',
                    borderRadius: '5px'
                  }}
                />
              ),
              hr: () => (
                <hr style={{
                  border: 'none',
                  borderTop: '1px solid #ddd',
                  margin: '25px 0'
                }} />
              )
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    );
  }
);

PDFRenderer.displayName = 'PDFRenderer';

export default PDFRenderer;