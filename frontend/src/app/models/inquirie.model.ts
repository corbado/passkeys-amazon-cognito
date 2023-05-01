import { AuthUser } from "@corbado/auth/auth-user";
import { CompanyModel,Product,DateModel, PublicFile } from ".";

export interface InquirieModel{
  id: number | string;
  state?: {
    id?: number | string;
    name: string;
  };
  buyerUser: AuthUser;
  name?:string;
  messages:InquirieMessageModel[];
  buyerCompany:CompanyModel;
  sellerCompany: CompanyModel;
  sellerUser?:AuthUser;
  requestDate?: {
    value: string;
    format: string;
    timezone: string;
  };
  banner?:PublicFile;
  products?: Product[];
  billing?:{
    sum:number;
    tax:number;
    total:number;
    month:number;
  }
  reffered_inquiry:boolean;
}

export interface InquirieMessageModel{
  id?:string | number;
  user: AuthUser;
  message:string;
  date?:DateModel;
}