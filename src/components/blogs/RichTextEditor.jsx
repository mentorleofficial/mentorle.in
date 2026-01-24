"use client";

import { useRef, useState } from "react";
import { Bold, Italic, Link, List, ListOrdered, Quote, Code, Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { markdownToEditorJS } from "@/lib/markdownToEditorJS";
import RichTextRenderer from "./RichTextRenderer";

export default function RichTextEditor({ value, onChange, onFocus, placeholder = "Write your post content here..." }) {
  const textareaRef = useRef(null);
  const [showPreview, setShowPreview] = useState(true);

  const insertText = (before, after = "", placeholder = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);

    let newText;
    if (selectedText) {
      newText = beforeText + before + selectedText + after + afterText;
    } else {
      newText = beforeText + before + placeholder + after + afterText;
    }

    onChange(newText);

    // Set cursor position
    setTimeout(() => {
      const newCursorPos = start + before.length + (selectedText || placeholder).length + after.length;
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertLink = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);

    const linkText = selectedText || "link text";
    const linkUrl = prompt("Enter URL:", "https://");
    
    if (linkUrl) {
      const newText = beforeText + `[${linkText}](${linkUrl})` + afterText;
      onChange(newText);
      
      setTimeout(() => {
        const newCursorPos = start + linkText.length + linkUrl.length + 4;
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  const insertImage = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const beforeText = value.substring(0, start);
    const afterText = value.substring(start);

    const imageUrl = prompt("Enter image URL:", "https://");
    const altText = prompt("Enter alt text (optional):", "");
    
    if (imageUrl) {
      const imageMarkdown = altText 
        ? `![${altText}](${imageUrl})`
        : `![](${imageUrl})`;
      const newText = beforeText + imageMarkdown + afterText;
      onChange(newText);
      
      setTimeout(() => {
        const newCursorPos = start + imageMarkdown.length;
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 border rounded-lg bg-slate-50">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertText("**", "**", "bold text")}
            title="Bold (Ctrl+B)"
            className="hover:bg-purple-100 hover:text-purple-700"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertText("*", "*", "italic text")}
            title="Italic (Ctrl+I)"
            className="hover:bg-purple-100 hover:text-purple-700"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertLink}
            title="Insert Link"
            className="hover:bg-purple-100 hover:text-purple-700"
          >
            <Link className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertImage}
            title="Insert Image"
            className="hover:bg-purple-100 hover:text-purple-700"
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertText("- ", "", "list item")}
            title="Unordered List"
            className="hover:bg-purple-100 hover:text-purple-700"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertText("1. ", "", "list item")}
            title="Ordered List"
            className="hover:bg-purple-100 hover:text-purple-700"
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertText("> ", "", "quote")}
            title="Quote"
            className="hover:bg-purple-100 hover:text-purple-700"
          >
            <Quote className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertText("`", "`", "code")}
            title="Inline Code"
            className="hover:bg-purple-100 hover:text-purple-700"
          >
            <Code className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Preview Toggle */}
        <Button
          type="button"
          variant={showPreview ? "default" : "outline"}
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          className="ml-auto"
        >
          {showPreview ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
          {showPreview ? "Hide Preview" : "Show Preview"}
        </Button>
      </div>

      {/* Editor and Preview */}
      <div className={`grid gap-4 ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Editor */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700">Editor</Label>
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            placeholder={placeholder}
            rows={20}
            className="font-mono text-sm resize-none border-slate-300 focus:border-purple-500 focus:ring-purple-500"
          />
          <p className="text-xs text-slate-500">
            Markdown formatting is supported. Use the toolbar above or type markdown syntax directly.
          </p>
        </div>

        {/* Live Preview */}
        {showPreview && (
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">Live Preview</Label>
            <div className="border border-slate-300 rounded-lg p-6 bg-white min-h-[500px] max-h-[600px] overflow-y-auto">
              {value ? (
                <RichTextRenderer content={markdownToEditorJS(value)} />
              ) : (
                <p className="text-slate-400 italic">Start typing to see the preview...</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

