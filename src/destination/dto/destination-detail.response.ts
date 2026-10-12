import { Destination } from "../destination.entity.js";
import { DestinationImageResponse } from "./destination-image.response.js";

export class DestinationDetailResponse {
    code:string;
    name:string;
    shortDescription: string | null;
    bannerUrl: string | null;
    images: DestinationImageResponse[];

   static from(destination: Destination): DestinationDetailResponse {
    const response = new DestinationDetailResponse();
    response.code = destination.code;
    response.name = destination.name;
    response.shortDescription = destination.shortDescription;
    response.bannerUrl = destination.bannerUrl;
    response.images = destination.images.map((image) =>
      DestinationImageResponse.from(image),
    );
    return response;
  }
}