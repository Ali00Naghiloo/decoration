// This interface should match the structure of the data sent by your backend API
export interface Sample {
  _id: string;
  title: string;
  slug: string;
  description: string; // This will be a string of HTML
  status?: number; // وضعیت نمایش
  des?: string; // توضیح خلاصه
  images?: string[]; // Multiple images
  cover?: string | null;
  videoUrl?: string | null; // Video URL (backend uses videoUrl)
  mediaUrl?: string | null;
  mediaType?: string[]; // ["image","video"]
  lang?: "fa" | "en"; // language of the sample
  createdAt: string; // Mongoose timestamps are strings in JSON
  updatedAt: string;
}
