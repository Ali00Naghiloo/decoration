// Types used by the Panel app — keep in sync with backend Sample model.
// Fields that contain textual content are stored as translated objects
// so the panel can edit per-language values (e.g. title: { fa, en }).
export interface ITranslatedField {
  fa?: string;
  en?: string;
}

export interface Sample {
  _id: string;
  // title is a per-language object now
  title: ITranslatedField;
  slug: string;
  // description holds sanitized HTML per language
  description: ITranslatedField;
  status?: number; // وضعیت نمایش
  // short summary (translated)
  des?: ITranslatedField;
  images?: string[]; // Multiple images
  cover?: string | null;
  videoUrl?: string | null; // Video URL (backend uses videoUrl)
  mediaUrl?: string | null;
  mediaType?: string[]; // ["image","video"]
  lang?: "fa" | "en"; // fallback/original language
  // keep translations wrapper if backend provides it (backwards compat)
  translations?: {
    title?: ITranslatedField;
    description?: ITranslatedField;
    des?: ITranslatedField;
  };
  createdAt: string; // Mongoose timestamps are strings in JSON
  updatedAt: string;
}
