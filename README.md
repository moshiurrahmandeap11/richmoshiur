# richmoshiur

`richmoshiur` is a lightweight React rich text editor component built for modern applications. It offers a polished editing toolbar, list support, link insertion, formatting cleanup, and a clean React API.

## Features

- Bold, italic, and underline formatting
- Ordered and unordered lists
- Inline link insertion with URL validation
- Paste handling that preserves plain text content
- CSS module styling for encapsulated editor styles
- Library-ready bundle output with ESM and CommonJS support

## Installation

```bash
npm install richmoshiur
```

## Usage

```jsx
import { useState } from 'react';
import RichTextEditor from 'richmoshiur';

function App() {
  const [content, setContent] = useState("");

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      placeholder="Start typing..."
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `""` | The editor content as HTML. |
| `onChange` | `function` | required | Called when editor content changes. |
| `placeholder` | `string` | `Start typing...` | Placeholder text displayed inside the editor. |

## Development

Build the package locally:

```bash
npm run build
```

## Publishing

The package is ready to publish. If your npm account requires two-factor authentication, include an OTP when publishing:

```bash
npm publish --access public --otp=123456
```

Replace `123456` with your current npm authenticator code.

## License

MIT
