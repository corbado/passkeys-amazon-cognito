import { CompanyModel, PublicFile } from ".";
import { PostModel } from "./post.model";
import { SpacePage } from "./space-page.model";

export interface SpaceModel {
  id: number;
  id_creator: number;
  creator?: Author;
  feedID: string; // UUID v4 of the feed
  title: string;
  content_title: string;
  id_posts: number[]; // id of the feed posts in the DB
  posts: PostModel[];
  onboarding?: boolean; // only exists and is true if the feed is the onboarding feed
  author?: Author;
  id_users_notifications?: number[];
  subscription_log?: string[];
  view_count: number;
  last_post_timestamp?: string;
  rights?: SpaceRights;
  emails_notifications?: string[];
  new?: boolean;
  isDuplicate?: boolean;
  guestView?: boolean;
  visData?: {customView: string, bannerURL: string, logoURL: string};
  pinned?: boolean;
  banner_url?: string;
  posts_order?: number[];
  sub_menus?: string[];
  pages?: SpacePage[];
  password?: string;
  password_protected?: boolean;
  page_title?: string;
}

export interface SpaceVis {
  title: string,
  author?: Author,
  creator: Author,
  feedID: string,
  posts: PostModel[],
  onboarding: boolean,
  rights?: SpaceRights,
}

export type SpaceRights = '' | 'all' | 'user-comments' | 'guest-comments' | 'none'; // both '' and 'all' lead to everyone being allowed to comment/post, 'none' lets only the creator of the feed comment/post

export interface Author {
  id?: number,
  name: string,
  picture?: PublicFile, // TODO wtf?
  email?: string,
  company?: CompanyModel,
  position?: string,
  calendar_link?: string,
  linkedin_link?: string,
  spreadly_link?: string,
  phone_number?: string,
  company_logo_url?: string,
}

export interface SpaceContent {
  posts: PostModel[],
  authors: Author[],
  files?: PublicFile[]
}

export interface SubscriptionEvent {
  userID: number;
  subscription: boolean; // true for sub, false for unsub
  timestamp?: any; // generated on the backend
}
