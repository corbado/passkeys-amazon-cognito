import { AuthUser } from "@corbado/auth/auth-user";
import { DateModel } from "./";

export interface NotificationModel {
  id?: number | string;
 type:NotificationCategory;
 relatedId?:number | string;
 seen?:boolean;
 createdDate?:DateModel;
 recipientUser:AuthUser;
 senderUser?:AuthUser;
}

interface NotificationCategory {
  id ?: number | string;
  name : string;
}