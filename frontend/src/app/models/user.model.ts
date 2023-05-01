import { CompanyModel } from "./company.model";
import { PublicFile } from "./public-file.model";

export interface UserModel {
    id: number|string;
    fullname: string;
    email: string;
    id_feeds: number[];
    companies: CompanyModel[];
    position?: string;
}

export interface UserInfo {
  fullname: string;
  userID: string;
  email: string;
  phone_number: string;
  position: string;
  calendar_link: string;
  linkedin_link: string;
  spreadly_link: string;
  video_link: string;
  picture?: PublicFile;
  presentation: string;
}