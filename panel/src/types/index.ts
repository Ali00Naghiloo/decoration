// This interface should match the structure of the data sent by your backend API
export interface Sample {
  _id: string;
  title: string;
  slug: string;
  description: string; // This will be a string of HTML
  images?: string[]; // Multiple images
  video?: string | null; // Video file
  createdAt: string; // Mongoose timestamps are strings in JSON
  updatedAt: string;
}
