import React from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import BulletList from '@tiptap/extension-bullet-list';
import Heading from '@tiptap/extension-heading';
import './style/TipTap.css'; // Import the CSS file

const TipTap = ({ content, onUpdate }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      BulletList,
      Heading.configure({
        levels: [1, 2, 3],
      }),
    ],
    content,
    onUpdate: ({ editor }) => onUpdate(editor.getHTML()),
  });

  const isActive = (format) => {
    if (!editor) return false;
    switch (format) {
      case 'bold':
        return editor.isActive('bold');
      case 'italic':
        return editor.isActive('italic');
      case 'bullet-list':
        return editor.isActive('bulletList');
      case 'heading-1':
        return editor.isActive('heading', { level: 1 });
      case 'heading-2':
        return editor.isActive('heading', { level: 2 });
      case 'heading-3':
        return editor.isActive('heading', { level: 3 });
      default:
        return false;
    }
  };

  const handleButtonClick = (action) => {
    editor.chain().focus().run();
    action();
  };

  return (
    <div className="tiptap-editor-container">
      <div className="tiptap-toolbar">
        <button
          type="button"
          className={`tiptap-toolbar-btn ${isActive('bold') ? 'active' : ''}`}
          onClick={() => handleButtonClick(() => editor.chain().focus().toggleBold().run())}
        >
          Bold
        </button>
        <button
          type="button"
          className={`tiptap-toolbar-btn ${isActive('italic') ? 'active' : ''}`}
          onClick={() => handleButtonClick(() => editor.chain().focus().toggleItalic().run())}
        >
          Italic
        </button>
        <button
          type="button"
          className={`tiptap-toolbar-btn ${isActive('bullet-list') ? 'active' : ''}`}
          onClick={() => handleButtonClick(() => editor.chain().focus().toggleBulletList().run())}
        >
          Bullet List
        </button>
        <button
          type="button"
          className={`tiptap-toolbar-btn ${isActive('heading-1') ? 'active' : ''}`}
          onClick={() => handleButtonClick(() => editor.chain().focus().toggleHeading({ level: 1 }).run())}
        >
          H1
        </button>
        <button
          type="button"
          className={`tiptap-toolbar-btn ${isActive('heading-2') ? 'active' : ''}`}
          onClick={() => handleButtonClick(() => editor.chain().focus().toggleHeading({ level: 2 }).run())}
        >
          H2
        </button>
        <button
          type="button"
          className={`tiptap-toolbar-btn ${isActive('heading-3') ? 'active' : ''}`}
          onClick={() => handleButtonClick(() => editor.chain().focus().toggleHeading({ level: 3 }).run())}
        >
          H3
        </button>
      </div>
      <EditorContent editor={editor} className="tiptap-editor-content" />
    </div>
  );
};

export default TipTap;
