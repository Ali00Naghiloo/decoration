// "use client";
import dynamic from "next/dynamic";
import api from "@/src/lib/api";
import "react-quill/dist/quill.snow.css";
import { useCallback, useState, useRef } from "react";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  // لودینگ برای آپلود عکس
  const [uploading, setUploading] = useState(false);
  const quillRef = useRef<any>(null);

  // Custom image upload handler
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      setUploading(true);
      try {
        const uploadUrl =
          (api.defaults.baseURL?.replace(/\/$/, "") || "") + "/upload";
        const response = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Upload error:", response.status, errorText);
          throw new Error(
            "Failed to upload image: " + response.status + " " + errorText
          );
        }
        const data = await response.json();
        const editor = quillRef.current?.getEditor?.();
        if (editor) {
          const range = editor.getSelection();
          // استفاده از آدرس کامل عکس از data.file.url
          editor.insertEmbed(
            range ? range.index : 0,
            "image",
            data.file?.url || data.url
          );
        }
      } catch (error) {
        console.error("Image upload error:", error);
      } finally {
        setUploading(false);
      }
    };
  }, []);

  const fonts = [
    "yekan",
    "satoshi",
    "serif",
    "sans-serif",
    "monospace",
    "tahoma",
    "arial",
    "roboto",
    "times-new-roman",
  ];
  const sizes = [
    "small",
    false,
    "large",
    "huge",
    "18px",
    "24px",
    "32px",
    "48px",
  ];
  const modules = {
    toolbar: {
      container: [
        [{ font: fonts }, { size: sizes }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        [{ header: 1 }, { header: 2 }, "blockquote", "code-block"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        [{ align: [] }, { direction: "rtl" }],
        ["link", "image", "video", "formula"],
        ["clean"],
        ["table"],
      ],
      handlers: {},
    },
    table: true,
    clipboard: {
      matchVisual: false,
    },
  };

  // Custom fonts CSS for Quill
  if (typeof window !== "undefined") {
    const style = document.createElement("style");
    style.innerHTML = `
      .ql-font-yekan { font-family: 'YekanBakhFaNum-Regular', yekan, sans-serif; }
      .ql-font-satoshi { font-family: 'Satoshi', sans-serif; }
      .ql-font-tahoma { font-family: Tahoma, sans-serif; }
      .ql-font-arial { font-family: Arial, sans-serif; }
      .ql-font-roboto { font-family: Roboto, sans-serif; }
      .ql-font-serif { font-family: serif; }
      .ql-font-sans-serif { font-family: sans-serif; }
      .ql-font-monospace { font-family: monospace; }
      .ql-font-times-new-roman { font-family: 'Times New Roman', serif; }
    `;
    document.head.appendChild(style);
  }

  const formats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "header",
    "blockquote",
    "code-block",
    "list",
    "indent",
    "align",
    "direction",
    "link",
    "image",
    "video",
    "formula",
    "table",
  ];

  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      theme="snow"
      style={{ minHeight: 150, background: "#fff" }}
    />
  );
}
