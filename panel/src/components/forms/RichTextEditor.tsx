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

  constructor(loader: any) {
    // ما دیگر به apiInstance نیازی نداریم چون آپلودی به سرور انجام نمی‌شود
    this.loader = loader;
  }

  // این تابع upload است که تغییر کرده
  public upload(): Promise<{ default: string }> {
    // به جای آپلود، از FileReader برای خواندن فایل به صورت DataURL (Base64) استفاده می‌کنیم
    return this.loader.file.then(
      (file: File) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = () => {
            // وقتی خواندن فایل تمام شد، نتیجه که همان رشته Base64 است را برمی‌گردانیم
            console.log("Image converted to Base64 successfully.");
            resolve({ default: reader.result as string });
          };

          reader.onerror = (error) => {
            console.error("Error converting file to Base64:", error);
            reject(error);
          };

          reader.onabort = () => {
            reject();
          };

          // این دستور، فرآیند خواندن فایل را شروع می‌کند
          reader.readAsDataURL(file);
        })
    );
  }

  public abort(): void {
    // در این حالت، نیازی به کار خاصی برای لغو عملیات نیست
    console.log("Upload aborted.");
  }
}

// این تابع بدون تغییر باقی می‌ماند، فقط دیگر api را به آداپتور پاس نمی‌دهد
function MyCustomUploadAdapterPlugin(editor: any) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
    return new MyUploadAdapter(loader);
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
            "bold",
            "italic",
            "link",
            "|",
            "bulletedList",
            "numberedList",
            "|",
            "blockQuote",
            "insertTable",
            "uploadImage",
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
