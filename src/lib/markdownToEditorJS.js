/**
 * Converts markdown-style text to EditorJS JSON format
 * Handles: paragraphs, headings, lists, blockquotes, code blocks, images, links
 */

export function markdownToEditorJS(markdownText) {
  if (!markdownText || typeof markdownText !== 'string') {
    return { blocks: [], version: '2.26.0' };
  }

  const blocks = [];
  const lines = markdownText.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (!line.trim()) {
      i++;
      continue;
    }

    // Check for headings (# ## ### etc.)
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      blocks.push({
        type: 'heading',
        data: {
          text: headingMatch[2],
          level: level,
        },
      });
      i++;
      continue;
    }

    // Check for ordered list (1. 2. etc.)
    const orderedListMatch = line.match(/^\d+\.\s+(.+)$/);
    if (orderedListMatch) {
      const items = [];
      while (i < lines.length) {
        const listLine = lines[i];
        const itemMatch = listLine.match(/^\d+\.\s+(.+)$/);
        if (itemMatch) {
          items.push(itemMatch[1]);
          i++;
        } else {
          break;
        }
      }
      blocks.push({
        type: 'list',
        data: {
          style: 'ordered',
          items: items,
        },
      });
      continue;
    }

    // Check for unordered list (- * +)
    const unorderedListMatch = line.match(/^[\-\*\+]\s+(.+)$/);
    if (unorderedListMatch) {
      const items = [];
      while (i < lines.length) {
        const listLine = lines[i];
        const itemMatch = listLine.match(/^[\-\*\+]\s+(.+)$/);
        if (itemMatch) {
          items.push(itemMatch[1]);
          i++;
        } else {
          break;
        }
      }
      blocks.push({
        type: 'list',
        data: {
          style: 'unordered',
          items: items,
        },
      });
      continue;
    }

    // Check for blockquote (> at start)
    const quoteMatch = line.match(/^>\s+(.+)$/);
    if (quoteMatch) {
      let quoteText = quoteMatch[1];
      i++;
      // Continue reading quote lines
      while (i < lines.length && lines[i].match(/^>\s+(.+)$/)) {
        quoteText += '\n' + lines[i].match(/^>\s+(.+)$/)[1];
        i++;
      }
      blocks.push({
        type: 'quote',
        data: {
          text: quoteText,
          caption: '',
        },
      });
      continue;
    }

    // Check for code block (``` or ~~~)
    if (line.match(/^```|^~~~/) || line.startsWith('    ')) {
      let codeContent = '';
      const codeDelimiter = line.match(/^(```|~~~)/)?.[1];
      
      if (codeDelimiter) {
        i++; // Skip opening fence
        while (i < lines.length && !lines[i].match(/^```|^~~~/)) {
          codeContent += (codeContent ? '\n' : '') + lines[i];
          i++;
        }
        i++; // Skip closing fence
      } else {
        // Indented code block
        while (i < lines.length && (lines[i].startsWith('    ') || !lines[i].trim())) {
          if (lines[i].startsWith('    ')) {
            codeContent += (codeContent ? '\n' : '') + lines[i].substring(4);
          }
          i++;
        }
      }

      if (codeContent) {
        blocks.push({
          type: 'code',
          data: {
            code: codeContent,
          },
        });
      }
      continue;
    }

    // Check for image ![alt](url)
    const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageMatch) {
      blocks.push({
        type: 'image',
        data: {
          url: imageMatch[2],
          caption: imageMatch[1] || '',
        },
      });
      i++;
      continue;
    }

    // Default: treat as paragraph
    let paragraphText = line;
    i++;
    
    // Combine multiple lines until empty line
    while (i < lines.length && lines[i].trim() && 
           !lines[i].match(/^(#{1,6})\s|^\d+\.\s|^[\-\*\+]\s|^>\s|^```|^~~~|^!\[|    /)) {
      paragraphText += '\n' + lines[i];
      i++;
    }

    if (paragraphText.trim()) {
      blocks.push({
        type: 'paragraph',
        data: {
          text: paragraphText.trim(),
        },
      });
    }
  }

  return {
    time: Date.now(),
    blocks: blocks,
    version: '2.26.0',
  };
}

/**
 * Converts EditorJS JSON format back to markdown for editing
 */
export function editorJSToMarkdown(editorJSData) {
  if (!editorJSData || !Array.isArray(editorJSData.blocks)) {
    return '';
  }

  return editorJSData.blocks
    .map((block) => {
      switch (block.type) {
        case 'paragraph':
          return block.data?.text || '';

        case 'heading':
          const level = block.data?.level || 2;
          return `${'#'.repeat(level)} ${block.data?.text || ''}`;

        case 'list':
          const isOrdered = block.data?.style === 'ordered';
          const items = block.data?.items || [];
          return items
            .map((item, idx) =>
              isOrdered ? `${idx + 1}. ${item}` : `- ${item}`
            )
            .join('\n');

        case 'quote':
          return `> ${block.data?.text || ''}`;

        case 'code':
          return `\`\`\`\n${block.data?.code || ''}\n\`\`\``;

        case 'image':
          return `![${block.data?.caption || ''}](${block.data?.url || ''})`;

        case 'delimiter':
          return '---';

        default:
          return '';
      }
    })
    .filter((block) => block.length > 0)
    .join('\n\n');
}
