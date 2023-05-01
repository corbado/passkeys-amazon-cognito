import { PublicFile } from "./public-file.model";

export interface CompanyModel {
    id: number|string;
    uuid?: string;
    name: string;
    // id_public_file_logo?: number | string;
    logo?: PublicFile;
    enabled: boolean;
    id_city: number | string;
    can_sell: boolean;
    website?: string;
    phone_number?: string;
    category?: {id:number|string, name:string};
    location?: string;
}