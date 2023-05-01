import { CompanyModel} from "@corbado/models/company.model";
import { PublicFile } from '@corbado/models/public-file.model';
export interface AuthUser {
  id: number;
  fullname: string;
  company: CompanyModel;
  email: string;
  idToken: string;
  refreshToken: string;
  phone_number?: string;
  cognitoUUID: string;
  userID?: string;
  confirmed?: boolean,
  calendar_link?: string;
  linkedin_link?: string;
  spreadly_link?: string;
  video_link?: string;
  presentation?: string;
  id_feeds?: number[];
  picture?: PublicFile;
  position?: string;
  expires: number;
  role: RolModel;
  last_refresh?: number;
  email_notifications: boolean;
  max_feeds: number;
  billing_json?: any;
}
export interface RolModel{
  id: number | string;
  name: string;
}

export type SettingsType = 'profile' | 'company' | 'billing' | 'email' | 'push' | 'crm' | 'automation';