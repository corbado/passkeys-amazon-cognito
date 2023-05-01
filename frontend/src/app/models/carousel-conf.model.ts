import { PublicFile } from "./public-file.model";

export interface CarouselItemModel extends PublicFile{
    order?: number;
    name?: string;
    url: string;
    marginLeft?: number;
}
