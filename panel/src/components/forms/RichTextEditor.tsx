"use client";

import { useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import type { AxiosInstance } from "axios";

// Import your configured Axios instance
// نمونه Axios پیکربندی شده خود را وارد کنید
import api from "@/src/lib/api";

// =================================================================================================
// STEP 1: Import the Editor and Plugins to create a custom build
// مرحله ۱: وارد کردن ادیتور و پلاگین‌ها برای ساخت یک بیلد سفارشی
// =================================================================================================
import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";
import { Essentials } from "@ckeditor/ckeditor5-essentials";
import { Paragraph } from "@ckeditor/ckeditor5-paragraph";
import { Bold, Italic, Underline } from "@ckeditor/ckeditor5-basic-styles";
import { Heading } from "@ckeditor/ckeditor5-heading";
import { Alignment } from "@ckeditor/ckeditor5-alignment";
import { Link } from "@ckeditor/ckeditor5-link";
import { List } from "@ckeditor/ckeditor5-list";
import { BlockQuote } from "@ckeditor/ckeditor5-block-quote";
import { Table, TableToolbar } from "@ckeditor/ckeditor5-table";
import { MediaEmbed } from "@ckeditor/ckeditor5-media-embed";
import { FontFamily, FontSize } from "@ckeditor/ckeditor5-font";
import { Autoformat } from "@ckeditor/ckeditor5-autoformat";

// THESE ARE THE PLUGINS FOR IMAGE RESIZING AND UPLOADING
// این پلاگین‌ها برای تغییر اندازه و آپلود عکس هستند
import {
  Image,
  ImageUpload,
  ImageToolbar,
  ImageStyle,
  ImageResize,
  ImageCaption,
} from "@ckeditor/ckeditor5-image";

// --- The props for your component ---
interface EditorProps {
  value: string;
  onChange: (data: string) => void;
}

// --- Your custom upload adapter class (NO CHANGES NEEDED HERE) ---
// --- کلاس آداپتور آپلود سفارشی شما (اینجا نیازی به تغییر نیست) ---
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

// --- The plugin function that integrates the adapter (NO CHANGES NEEDED HERE) ---
function MyCustomUploadAdapterPlugin(editor: any) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
    return new MyUploadAdapter(loader, api);
  };
}

// --- The main Editor component ---
export default function Editor({ value, onChange }: EditorProps) {
  const editorRef = useRef<any>(null);

  const editorConfig = {
    // ========================================================================================
    // STEP 2: Provide the list of plugins to the editor configuration
    // مرحله ۲: لیست پلاگین‌ها را در تنظیمات ادیتور قرار دهید
    // ========================================================================================
    plugins: [
      Essentials,
      Paragraph,
      Bold,
      Italic,
      Underline,
      Heading,
      Alignment,
      Link,
      List,
      BlockQuote,
      Table,
      TableToolbar,
      MediaEmbed,
      FontFamily,
      FontSize,
      Autoformat,
      // All Image plugins are required for resizing and uploading
      Image,
      ImageUpload,
      ImageToolbar,
      ImageStyle,
      ImageResize,
      ImageCaption,
      // Your custom upload plugin must be included here
      MyCustomUploadAdapterPlugin,
    ],

    toolbar: {
      items: [
        "heading",
        "|",
        "fontFamily",
        "fontSize",
        "|",
        "bold",
        "italic",
        "underline",
        "|",
        "alignment",
        "|",
        "numberedList",
        "bulletedList",
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

    // ========================================================================================
    // STEP 3: Configure the image resize options
    // مرحله ۳: گزینه‌های تغییر اندازه عکس را پیکربندی کنید
    // ========================================================================================
    image: {
      toolbar: [
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:side",
        "|",
        "toggleImageCaption",
        "imageTextAlternative",
        "|",
        "resizeImage", // The new button for the resize dropdown
      ],
      resizeOptions: [
        { name: "resizeImage:original", value: null, icon: "original" },
        { name: "resizeImage:50", value: "50", icon: "medium" },
        { name: "resizeImage:75", value: "75", icon: "large" },
      ],
    },

    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
    },
    fontFamily: {
      options: [
        "default",
        "Yekan Bakh, Arial, sans-serif",
        "Arial, Helvetica, sans-serif",
        "Courier New, Courier, monospace",
        "Georgia, serif",
        "Times New Roman, Times, serif",
      ],
      supportAllValues: true,
    },
    language: "fa",
  };

  return (
    <CKEditor
      editor={ClassicEditor}
      config={editorConfig}
      data={value}
      onReady={(editor) => {
        editorRef.current = editor;
      }}
      onChange={(event, editor) => {
        onChange(editor.getData());
      }}
    />
  );
}
