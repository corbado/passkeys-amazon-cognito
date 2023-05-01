export type PopupType =
  "create-post" |
  "create-page" |
  "edit-page" |
  "team" |
  "share-content" |
  "edit-post" |
  "share-space" |
  "copied-to-clipboard" |
  "delete-feed" |
  "login-register" |
  "guest-name" |
  "get-email" |
  "request-password" |
  "";
export type FileType = "pdf" | "img" | "doc";
export type PostData = {
  content: string,
  file: any,
  link?: string,
}