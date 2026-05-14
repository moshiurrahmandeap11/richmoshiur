  /**
   * Type definitions for richmoshiur package
   */

  export interface RichTextEditorProps {
    /** The current content of the editor as HTML string */
    value: string;
    /** Callback function called when editor content changes */
    onChange: (content: string) => void;
    /** Placeholder text shown in the editor */
    placeholder?: string;
  }
