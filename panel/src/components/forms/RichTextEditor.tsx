// src/components/Editor.tsx

"use client";

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
  return (
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
        table: {
          contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
        },
      }}
      onReady={() => {
        console.log("Editor is ready for LOCAL/BASE64 image upload.");
      }}
      onChange={(event, editor) => {
        onChange(editor.getData());
      }}
    />
  );
}
