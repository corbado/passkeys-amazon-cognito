import { SafeResourceUrl } from "@angular/platform-browser";
import { CompanyModel } from ".";
import { CarouselItemModel } from "./carousel-conf.model";
import { PublicFile } from "./public-file.model";

export interface Product {
  id: number | string;
  name: string;
  subtitle: string;
  description: string;
  thumbnail: PublicFile;
  rating: number;
  order: number;
  price: number;
  publish: boolean;
  price_on_request:boolean;
  enabled: boolean;
  company: CompanyModel;
  isMonthlyCost: boolean;
  isVariableCost: boolean;
  tags: string[];
  category: {
    id: number | string;
    name: string;
    color: string;
  };
  images?: {
    sponsor: PublicFile[];
    whw: PublicFile;
    detail: PublicFile[] | CarouselItemModel[];
  };
  video?: string | SafeResourceUrl;
  details?:
  {
    id?: number | string;
    name: string;
    icon: string;
    order: string;
    value: any;
  }[];
  required?: {
    products: Product[];
    details?: string[];
  };
  sales_content?: {
    id: string,
    name: string,
    type: string,
    thumbnail: PublicFile,
    link: string
  }[];
  frequently_asked_questions?: {
    faq: {
      id: number | string;
      question: string;
      answer: string;
      section?: string;
    }[];
    whw: {
      id: number | string;
      question: string;
      answer: string;
      section: string;
    }[];
  };
  related_products?: Product[];
  additional_requirements?: string;
  customer_rating?: {
    name: string;
    commentary: string;
    picture: PublicFile;
  }[];
  count?: number;
  hideSections?:string[];
}