import api from "./api";

// Generic file upload API for any file type (banner, sample, etc.)
export const uploadFile = async (
  file: File
): Promise<{ id: string; url: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data.file;
};
