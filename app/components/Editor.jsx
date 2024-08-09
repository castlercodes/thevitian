// src/components/Editor.js
import React from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';

const Editor = ({ content, onUpdate }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => onUpdate(editor.getHTML()),
  });

  return <EditorContent editor={editor} />;
};

export default Editor;
