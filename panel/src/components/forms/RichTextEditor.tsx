// src/components/Editor.tsx

"use client";

import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import type { AxiosInstance } from "axios";
import api from "@/src/lib/api";

interface EditorProps {
  value: string;
  onChange: (data: string) => void;
}

// ========================================================================
// تغییر اصلی اینجاست: ما MyUploadAdapter را برای تبدیل عکس به Base64 بازنویسی می‌کنیم
// ========================================================================
class MyUploadAdapter {
  private loader: any;
  private api: AxiosInstance;

  constructor(loader: any, apiInstance: AxiosInstance) {
    this.loader = loader;
    this.api = apiInstance;
  }

  public upload(): Promise<{ default: string }> {
    return this.loader.file.then(
      (file: File) =>
        new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append("file", file);
          this.api
            .post("/upload", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            })
            .then((res) => {
              const url =
                res.data?.data?.file?.url ||
                res.data?.file?.url ||
                res.data?.url;
              if (!url) {
                return reject(
                  new Error("Invalid server response: No URL found.")
                );
              }
              resolve({ default: url });
            })
            .catch((error) => {
              const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Upload failed.";
              reject(errorMessage);
            });
        })
    );
  }

  public abort(): void {
    console.log("Upload aborted.");
  }
}

// و این تابع را هم به حالت قبلی برگردانید
function MyCustomUploadAdapterPlugin(editor: any) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
    return new MyUploadAdapter(loader, api);
  };
}

export default function Editor({ value, onChange }: EditorProps) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
          <span className="text-2xl font-bold text-gray-700 animate-pulse">
            در حال بارگذاری ادیتور...
          </span>
        </div>
      )}
      <CKEditor
        editor={ClassicEditor}
        data={value || ""}
        config={{
          language: "fa",
          extraPlugins: [MyCustomUploadAdapterPlugin],
          toolbar: {
            items: [
              "heading",
              "|",
              "fontFamily",
              "fontSize",
              "fontColor",
              "fontBackgroundColor",
              "|",
              "bold",
              "italic",
              "underline",
              "strikethrough",
              "|",
              "alignment",
              "|",
              "numberedList",
              "bulletedList",
              "outdent",
              "indent",
              "|",
              "link",
              "uploadImage",
              "blockQuote",
              "insertTable",
              "mediaEmbed",
              "|",
              "undo",
              "redo",
            ],
          },
          fontSize: {
            options: [9, 11, 13, 15, 17, 19, 21, 23, 25, "default"],
            supportAllValues: false,
          },
          table: {
            contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
          },
        }}
        onReady={() => {
          setLoading(false);
        }}
        onChange={(event, editor) => {
          onChange(editor.getData());
        }}
      />
    </div>
  );
}
