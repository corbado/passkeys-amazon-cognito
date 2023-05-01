export interface PublicFile {
  id?: number | string;
  name?: string;
  url: string;
  view_count?: number;
}

export type FileType = 'pdf' | 'img' | 'link' | '';