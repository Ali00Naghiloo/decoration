export interface ITranslatedField {
  fa?: string;
  en?: string;
}

export interface SampleTypes {
  id?: string;
  title: ITranslatedField;
  category: string;
  description?: ITranslatedField;
  des?: ITranslatedField;
  cover?: string | null;
  images?: string[];
  videoUrl?: string | null;
  lang?: "fa" | "en";
}
