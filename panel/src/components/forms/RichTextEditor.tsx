import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback } from "react";
import { uploadFile } from "@/src/lib/upload";
import { Button } from "@/src/components/ui/button";

import Image from "@tiptap/extension-image";
export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Custom image upload handler
  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;
      const res = await uploadFile(file);
      editor.chain().focus().setImage({ src: res.url }).run();
    },
    [editor]
  );

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <Button
          type="button"
          size="sm"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          variant={editor?.isActive("bold") ? "default" : "outline"}
        >
          <b>B</b>
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          variant={editor?.isActive("italic") ? "default" : "outline"}
        >
          <i>I</i>
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          variant={editor?.isActive("bulletList") ? "default" : "outline"}
        >
          • لیست
        </Button>
        <label className="cursor-pointer">
          <span className="px-2 py-1 bg-gray-200 rounded text-xs">
            آپلود عکس
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
      </div>
      <div className="border rounded min-h-[120px] p-2 bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
