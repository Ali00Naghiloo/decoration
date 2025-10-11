"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import TextAlign from "@tiptap/extension-text-align";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
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
    extensions: [
      StarterKit,
      Image,
      Underline,
      Strike,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      ListItem,
      BulletList,
      OrderedList,
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Custom image upload handler
  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file); // Ensure the field name matches the backend

      if (editor) {
        try {
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Failed to upload image");
          }

          const data = await response.json();
          editor.chain().focus().setImage({ src: data.url }).run();
        } catch (error) {
          console.error("Image upload error:", error);
        }
      }
    },
    [editor]
  );

  if (typeof window === "undefined") {
    return null; // Prevent rendering on the server
  }

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
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          variant={editor?.isActive("underline") ? "default" : "outline"}
        >
          <u>U</u>
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          variant={editor?.isActive("strike") ? "default" : "outline"}
        >
          <s>S</s>
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={() => editor?.chain().focus().setTextAlign("left").run()}
          variant={
            editor?.isActive({ textAlign: "left" }) ? "default" : "outline"
          }
        >
          چپ
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={() => editor?.chain().focus().setTextAlign("center").run()}
          variant={
            editor?.isActive({ textAlign: "center" }) ? "default" : "outline"
          }
        >
          وسط
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={() => editor?.chain().focus().setTextAlign("right").run()}
          variant={
            editor?.isActive({ textAlign: "right" }) ? "default" : "outline"
          }
        >
          راست
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          variant={editor?.isActive("orderedList") ? "default" : "outline"}
        >
          1. لیست
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
