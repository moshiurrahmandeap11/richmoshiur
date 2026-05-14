import React, { FC, useState, useRef, useEffect, ClipboardEvent, KeyboardEvent } from 'react';
import styles from './RichtextEditor.module.css';

/**
 * Props for the RichTextEditor component
 */
export interface RichTextEditorProps {
  /** The current content of the editor as HTML string */
  value: string;
  /** Callback function called when editor content changes */
  onChange: (content: string) => void;
  /** Placeholder text shown in the editor */
  placeholder?: string;
}

/**
 * RichTextEditor Component
 * 
 * A React component providing a rich text editing interface with formatting tools,
 * list support, and link insertion capabilities.
 * 
 * @example
 * ```tsx
 * import { RichTextEditor } from 'richmoshiur';
 * 
 * function App() {
 *   const [content, setContent] = useState('');
 *   
 *   return (
 *     <RichTextEditor
 *       value={content}
 *       onChange={setContent}
 *       placeholder="Start typing..."
 *     />
 *   );
 * }
 * ```
 */
const RichTextEditor: FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start typing...',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showLinkInput, setShowLinkInput] = useState<boolean>(false);
  const [linkUrl, setLinkUrl] = useState<string>('');
  const [linkText, setLinkText] = useState<string>('');

  // Initialize content only once
  useEffect(() => {
    if (editorRef.current && value && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleBold = (): void => {
    editorRef.current?.focus();
    document.execCommand('bold', false);
    updateContent();
  };

  const handleItalic = (): void => {
    editorRef.current?.focus();
    document.execCommand('italic', false);
    updateContent();
  };

  const handleUnderline = (): void => {
    editorRef.current?.focus();
    document.execCommand('underline', false);
    updateContent();
  };

  const handleOrderedList = (): void => {
    editorRef.current?.focus();
    document.execCommand('insertOrderedList', false);
    updateContent();
  };

  const handleUnorderedList = (): void => {
    editorRef.current?.focus();
    document.execCommand('insertUnorderedList', false);
    updateContent();
  };

  const handleAddLink = (): void => {
    if (!linkUrl.trim()) {
      alert('Please enter a URL');
      return;
    }

    try {
      new URL(linkUrl);
    } catch {
      alert('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    editorRef.current?.focus();

    const selection = window.getSelection();
    if (!selection) return;

    const selectedText = selection.toString();
    const displayText = selectedText || linkText || linkUrl;

    const link = document.createElement('a');
    link.href = linkUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = displayText;
    link.style.cssText =
      'color: #3b82f6; text-decoration: underline; cursor: pointer;';

    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(link);
      range.setStartAfter(link);
      range.setEndAfter(link);
      selection.removeAllRanges();
      selection.addRange(range);

      const space = document.createTextNode(' ');
      range.insertNode(space);
    } else {
      editorRef.current?.appendChild(link);
      editorRef.current?.appendChild(document.createTextNode(' '));
    }

    updateContent();
    setShowLinkInput(false);
    setLinkUrl('');
    setLinkText('');
  };

  const updateContent = (): void => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const textNode = document.createTextNode(text);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    updateContent();
  };

  const handleClearFormatting = (): void => {
    editorRef.current?.focus();
    document.execCommand('removeFormat', false);
    document.execCommand('unlink', false);
    updateContent();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Enter') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const listItem = (range.startContainer.parentElement as HTMLElement)?.closest('li');
        if (listItem && listItem.textContent?.trim() === '') {
          e.preventDefault();
          document.execCommand('insertParagraph', false);
        }
      }
    }
  };

  return (
    <div className={styles.richTextEditor}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <button
          type="button"
          onClick={handleBold}
          className={styles.toolbarButton}
          title="Bold"
        >
          <strong>B</strong>
        </button>

        <button
          type="button"
          onClick={handleItalic}
          className={styles.toolbarButton}
          title="Italic"
        >
          <em>I</em>
        </button>

        <button
          type="button"
          onClick={handleUnderline}
          className={styles.toolbarButton}
          title="Underline"
        >
          <u>U</u>
        </button>

        <div className={styles.separator}></div>

        <button
          type="button"
          onClick={handleUnorderedList}
          className={styles.toolbarButton}
          title="Bullet List"
        >
          <span className={styles.buttonContent}>
            <span>•</span>
            <span className={styles.buttonLabel}>List</span>
          </span>
        </button>

        <button
          type="button"
          onClick={handleOrderedList}
          className={styles.toolbarButton}
          title="Numbered List"
        >
          <span className={styles.buttonContent}>
            <span>1.</span>
            <span className={styles.buttonLabel}>List</span>
          </span>
        </button>

        <div className={styles.separator}></div>

        <button
          type="button"
          onClick={() => setShowLinkInput(!showLinkInput)}
          className={styles.toolbarButton}
          title="Add Link"
        >
          <span className={styles.buttonContent}>
            <span>🔗</span>
            <span className={styles.buttonLabel}>Link</span>
          </span>
        </button>

        <div className={styles.separator}></div>

        <button
          type="button"
          onClick={handleClearFormatting}
          className={styles.toolbarButton}
          title="Clear Formatting"
        >
          <span className={styles.buttonContent}>
            <span>🧹</span>
            <span className={styles.buttonLabel}>Clear</span>
          </span>
        </button>
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className={styles.linkInput}>
          <div className={styles.linkInputGrid}>
            <div>
              <label className={styles.inputLabel}>URL *</label>
              <input
                type="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className={styles.input}
                autoFocus
              />
            </div>
            <div>
              <label className={styles.inputLabel}>Display Text (Optional)</label>
              <input
                type="text"
                placeholder="Click here"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className={styles.input}
              />
              <p className={styles.inputHelp}>
                Leave empty to use selected text or URL
              </p>
            </div>
            <div className={styles.linkButtons}>
              <button
                type="button"
                onClick={handleAddLink}
                className={styles.insertButton}
              >
                Insert Link
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLinkInput(false);
                  setLinkUrl('');
                  setLinkText('');
                }}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={updateContent}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        className={styles.editor}
        dir="ltr"
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;