import path from "path";

// Files are stored outside of public/ so they are never directly
// web-accessible as a static asset — the only way to read one back is
// through the authenticated, ownership-checked download route
// (app/api/service-requests/[id]/attachments/[attachmentId]/download).
//
// This is local-disk storage for functional testing, not a production
// storage architecture. Known follow-up once we're ready to talk about
// real deployment: swap this for object storage (S3-compatible) behind
// the same download route, and add virus scanning on upload — neither is
// built here since the storage backend will change anyway.
export const UPLOAD_ROOT = path.join(process.cwd(), "uploads", "attachments");

export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

export const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".png", ".jpg", ".jpeg", ".zip"];

const EXTENSION_MIME_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".zip": "application/zip",
};

export function extensionMimeType(ext: string) {
  return EXTENSION_MIME_TYPES[ext.toLowerCase()] || "application/octet-stream";
}

// Storage keys are always server-generated — 32 hex chars plus a known
// extension — never derived from user input. Validating the shape on the
// way back out is a defense-in-depth path-traversal guard, even though
// nothing user-controlled should ever reach this value.
const STORAGE_KEY_PATTERN = /^[a-f0-9]{32}\.[a-z0-9]+$/i;

export function isValidStorageKey(key: string) {
  return STORAGE_KEY_PATTERN.test(key);
}

export function contentDispositionHeader(fileName: string) {
  const asciiFallback = fileName.replace(/[^\x20-\x7E]/g, "_").replace(/"/g, "'");
  const encoded = encodeURIComponent(fileName);
  return `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encoded}`;
}
