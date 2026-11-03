/** Upload rules in one place; the dialog text and the checks both read them. */
export type UploadLimits = { maxBytes: number; extensions: string[] };

export function getUploadLimits(): UploadLimits {
  return {
    maxBytes: 50 * 1024 * 1024,
    extensions: ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "png", "jpg", "jpeg", "tif", "tiff"],
  };
}

export const formatGroups = [
  { label: "PDF", extensions: ["pdf"] },
  { label: "Word", extensions: ["doc", "docx"] },
  { label: "Excel", extensions: ["xls", "xlsx"] },
  { label: "PowerPoint", extensions: ["ppt", "pptx"] },
  { label: "متن ساده", extensions: ["txt"] },
  { label: "تصویر", extensions: ["png", "jpg", "jpeg", "tif", "tiff"] },
];
