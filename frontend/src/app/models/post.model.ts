import { Author } from "./space.model";

export interface PostModel {
  id?: number | string;
  id_creator: number; // either id of user who created the post or 0 if guest
  pageID?: string;
  content: string;
  author?: Author;
  guest_name?: string;
  timestamp?: DateTimeEntity;
  links?: string[];
  linksData?: linkData[];
  postID?: string; // uuid of post
  feedID?: string; // uuid of feed
  authorName?: string;
  guest_mail?: string;
  authorID?: number | string;
  pinned?: boolean;
  link_open_count: number;
  reactions_json?: Reactions;
  index?: number;
  id_comments?: number[];
  comments?: PostModel[];
  id_files?: number[];
  files?: any[];
  new?: boolean;
  parent_postID?: string;
  feedUUID?: string;
  type?: PostType;
  title?: string;
  description?: string;
  hide_thumbnail?: boolean;
}

export type ContentType = '' | 'pdf' | 'img' | 'website' | 'youtube' | 'loom' | 'vidyard' | 'pitch' | 'miro';

export type PostType = 'content' | 'text';

export interface Reactions {
  like: number[];
  celebrate: number[];
}

export interface linkData {
  title: string;
  image: string;
  url: string;
  description: string;
}

export interface LinkViewEvent {
  postID: number;
  link: string;
  timestamp?: string;
  viewer?: string;
}

export type DateTimeEntity = {
  value: string;
  format: string;
  timezone: string;
}

export interface PostReactionJSON {
  like: number[];
  celebrate: number[];
}

export type PostReaction = 'like' | 'celebrate';
