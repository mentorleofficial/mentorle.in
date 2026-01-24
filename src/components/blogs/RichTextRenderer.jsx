/**
 * Rich Text Renderer Component
 * Renders rich text JSON content from the blog post editor
 */

export default function RichTextRenderer({ content }) {
  if (!content) return null;

  // Parse content if it's a string
  let parsedContent = content;
  if (typeof content === 'string') {
    try {
      parsedContent = JSON.parse(content);
    } catch {
      // If it fails to parse, treat as plain text
      return (
        <div className="text-slate-700 text-base sm:text-lg leading-relaxed whitespace-pre-wrap break-words">
          {content}
        </div>
      );
    }
  }

  // Handle different content structures
  if (parsedContent.blocks && Array.isArray(parsedContent.blocks)) {
    // EditorJS format
    return <EditorJSRenderer blocks={parsedContent.blocks} />;
  }

  if (Array.isArray(parsedContent)) {
    // Array of content blocks
    return (
      <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
        {parsedContent.map((block, idx) => (
          <ContentBlock key={idx} block={block} />
        ))}
      </div>
    );
  }

  // If it's an object but not EditorJS format, try to extract text
  if (typeof parsedContent === 'object' && parsedContent !== null) {
    const textContent = parsedContent.text || parsedContent.content || JSON.stringify(parsedContent);
    return (
      <div className="text-slate-700 text-base sm:text-lg leading-relaxed whitespace-pre-wrap break-words">
        {textContent}
      </div>
    );
  }

  // Fallback to plain text
  return (
    <div className="text-slate-700 text-base sm:text-lg leading-relaxed whitespace-pre-wrap break-words">
      {String(parsedContent)}
    </div>
  );
}

/**
 * Renders EditorJS format blocks
 */
function EditorJSRenderer({ blocks }) {
  if (!blocks || blocks.length === 0) {
    return <p className="text-slate-500 italic">No content available</p>;
  }

  return (
    <div className="space-y-6">
      {blocks.map((block, idx) => {
        if (!block || !block.type) return null;

        switch (block.type) {
          case 'paragraph':
            return (
              <p key={idx} className="text-slate-700 text-base sm:text-lg leading-relaxed whitespace-pre-wrap break-words">
                {renderInlineContent(block.data?.text || '')}
              </p>
            );

          case 'heading':
            const headingLevel = block.data?.level || 2;
            const HeadingTag = `h${headingLevel}`;
            const headingClasses = {
              1: 'text-4xl sm:text-5xl font-bold text-slate-900 mt-8 mb-4',
              2: 'text-3xl sm:text-4xl font-bold text-slate-900 mt-8 mb-4',
              3: 'text-2xl sm:text-3xl font-bold text-slate-800 mt-6 mb-3',
              4: 'text-xl sm:text-2xl font-semibold text-slate-800 mt-4 mb-2',
              5: 'text-lg font-semibold text-slate-800 mt-4 mb-2',
              6: 'text-base font-semibold text-slate-800 mt-4 mb-2',
            }[headingLevel] || 'text-lg font-semibold text-slate-800 mt-4 mb-2';

            return (
              <HeadingTag key={idx} className={headingClasses}>
                {renderInlineContent(block.data?.text || '')}
              </HeadingTag>
            );

          case 'list':
            const isOrdered = block.data?.style === 'ordered';
            const ListTag = isOrdered ? 'ol' : 'ul';
            const listClasses = isOrdered ? 'list-decimal' : 'list-disc';
            
            return (
              <ListTag key={idx} className={`space-y-2 pl-6 text-slate-700 text-base sm:text-lg leading-relaxed ${listClasses}`}>
                {block.data?.items && Array.isArray(block.data.items) && block.data.items.length > 0
                  ? block.data.items.map((item, itemIdx) => {
                      const itemText = typeof item === 'string' ? item : item?.content || item || '';
                      return (
                        <li key={itemIdx} className="whitespace-pre-wrap break-words">
                          {renderInlineContent(itemText)}
                        </li>
                      );
                    })
                  : null}
              </ListTag>
            );

          case 'quote':
          case 'blockquote':
            return (
              <blockquote key={idx} className="border-l-4 border-purple-500 pl-6 py-2 bg-purple-50 rounded-r-lg px-6 italic text-slate-700 text-base sm:text-lg leading-relaxed">
                <p className="whitespace-pre-wrap break-words">
                  {renderInlineContent(block.data?.text || '')}
                </p>
                {block.data?.caption && (
                  <footer className="text-sm text-slate-600 mt-2 not-italic font-normal">
                    — {block.data.caption}
                  </footer>
                )}
              </blockquote>
            );

          case 'image':
            return (
              <figure key={idx} className="my-8 rounded-xl overflow-hidden">
                <img
                  src={block.data?.url}
                  alt={block.data?.caption || 'Article image'}
                  className="w-full rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                  loading="lazy"
                />
                {block.data?.caption && (
                  <figcaption className="text-center text-sm text-slate-600 mt-3 bg-slate-50 p-3 rounded-b-xl">
                    {block.data.caption}
                  </figcaption>
                )}
              </figure>
            );

          case 'code':
            return (
              <pre key={idx} className="bg-slate-900 text-slate-100 p-6 rounded-xl overflow-x-auto shadow-lg border border-slate-800 my-6">
                <code className="text-sm sm:text-base font-mono whitespace-pre">
                  {block.data?.code || ''}
                </code>
              </pre>
            );

          case 'table':
            return (
              <div key={idx} className="overflow-x-auto my-6 rounded-xl border border-slate-200 shadow-sm">
                <table className="w-full border-collapse">
                  <tbody>
                    {block.data?.content && Array.isArray(block.data.content)
                      ? block.data.content.map((row, rowIdx) => (
                          <tr
                            key={rowIdx}
                            className={rowIdx === 0 ? 'bg-purple-50' : rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                          >
                            {Array.isArray(row)
                              ? row.map((cell, cellIdx) => (
                                  <td
                                    key={cellIdx}
                                    className="border border-slate-200 px-4 py-3 text-left text-slate-700 whitespace-pre-wrap break-words"
                                  >
                                    {cell}
                                  </td>
                                ))
                              : null}
                          </tr>
                        ))
                      : null}
                  </tbody>
                </table>
              </div>
            );

          case 'video':
            return (
              <div key={idx} className="my-6 rounded-xl overflow-hidden shadow-lg">
                <video
                  src={block.data?.url}
                  controls
                  className="w-full bg-slate-900"
                />
              </div>
            );

          case 'embed':
            return (
              <div key={idx} className="my-6 rounded-xl overflow-hidden shadow-lg">
                <iframe
                  src={block.data?.embed || block.data?.url}
                  className="w-full aspect-video"
                  allowFullScreen
                  title="Embedded content"
                />
              </div>
            );

          case 'delimiter':
            return <hr key={idx} className="my-8 border-t-2 border-slate-200" />;

          case 'raw':
            return (
              <div
                key={idx}
                className="my-6 p-4 bg-slate-100 rounded-lg border border-slate-200 text-slate-700"
                dangerouslySetInnerHTML={{ __html: block.data?.html || '' }}
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

/**
 * Renders a single content block (used for non-EditorJS formats)
 */
function ContentBlock({ block }) {
  if (typeof block === 'string') {
    return <p className="text-slate-700 text-base sm:text-lg leading-relaxed whitespace-pre-wrap break-words">{block}</p>;
  }

  if (!block || typeof block !== 'object') {
    return null;
  }

  if (block.type === 'paragraph') {
    return (
      <p className="text-slate-700 text-base sm:text-lg leading-relaxed whitespace-pre-wrap break-words">
        {block.content || block.text || ''}
      </p>
    );
  }

  if (block.type === 'heading') {
    const level = block.level || 2;
    const HeadingTag = `h${level}`;
    const headingClasses = `font-bold text-slate-900 my-4 ${
      level === 1
        ? 'text-4xl sm:text-5xl'
        : level === 2
        ? 'text-3xl sm:text-4xl'
        : level === 3
        ? 'text-2xl sm:text-3xl'
        : 'text-xl sm:text-2xl'
    }`;
    return (
      <HeadingTag className={headingClasses}>
        {block.content || block.text || ''}
      </HeadingTag>
    );
  }

  if (block.type === 'image') {
    return (
      <figure className="my-8 rounded-xl overflow-hidden">
        <img
          src={block.src || block.url}
          alt={block.alt || block.caption || 'Article image'}
          className="w-full rounded-xl shadow-lg"
          loading="lazy"
        />
        {(block.caption || block.alt) && (
          <figcaption className="text-center text-sm text-slate-600 mt-3 bg-slate-50 p-3 rounded-b-xl">
            {block.caption || block.alt}
          </figcaption>
        )}
      </figure>
    );
  }

  return null;
}

/**
 * Renders inline formatted content (bold, italic, links, etc.)
 * Supports markdown-style formatting: **bold**, *italic*, [link](url)
 */
function renderInlineContent(text) {
  if (!text) return '';

  // Split by line breaks first
  const lines = text.split('\n');
  
  return lines.map((line, lineIdx) => {
    if (!line) {
      return lineIdx > 0 ? <br key={lineIdx} /> : null;
    }

    // Simple parser for markdown formatting
    const parseMarkdown = (str) => {
      const parts = [];
      let currentIdx = 0;

      while (currentIdx < str.length) {
        // Look for bold **text**
        const boldMatch = str.slice(currentIdx).match(/^\*\*([^*]+?)\*\*/);
        if (boldMatch) {
          parts.push(
            <strong key={`b-${parts.length}`} className="font-bold text-slate-900">
              {boldMatch[1]}
            </strong>
          );
          currentIdx += boldMatch[0].length;
          continue;
        }

        // Look for italic *text* (not surrounded by *)
        const italicMatch = str.slice(currentIdx).match(/^\*(?!\*)([^*]+?)\*(?!\*)/);
        if (italicMatch) {
          parts.push(
            <em key={`i-${parts.length}`} className="italic text-slate-700">
              {italicMatch[1]}
            </em>
          );
          currentIdx += italicMatch[0].length;
          continue;
        }

        // Look for links [text](url)
        const linkMatch = str.slice(currentIdx).match(/^\[([^\]]+?)\]\(([^)]+?)\)/);
        if (linkMatch) {
          parts.push(
            <a
              key={`l-${parts.length}`}
              href={linkMatch[2]}
              className="text-purple-600 hover:text-purple-700 underline"
              target={linkMatch[2].startsWith('http') ? '_blank' : undefined}
              rel={linkMatch[2].startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {linkMatch[1]}
            </a>
          );
          currentIdx += linkMatch[0].length;
          continue;
        }

        // Look for code `code`
        const codeMatch = str.slice(currentIdx).match(/^`([^`]+?)`/);
        if (codeMatch) {
          parts.push(
            <code key={`c-${parts.length}`} className="bg-slate-100 px-2 py-1 rounded font-mono text-sm text-slate-900">
              {codeMatch[1]}
            </code>
          );
          currentIdx += codeMatch[0].length;
          continue;
        }

        // Regular text - consume until next special character
        const regularMatch = str.slice(currentIdx).match(/^[^*\[\`]+/);
        if (regularMatch) {
          parts.push(regularMatch[0]);
          currentIdx += regularMatch[0].length;
          continue;
        }

        // Single character that doesn't match any pattern
        parts.push(str[currentIdx]);
        currentIdx++;
      }

      return parts;
    };

    const parsedContent = parseMarkdown(line);

    return (
      <span key={lineIdx}>
        {lineIdx > 0 && <br />}
        {parsedContent}
      </span>
    );
  });
}
