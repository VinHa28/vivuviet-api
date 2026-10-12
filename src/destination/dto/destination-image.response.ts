import { DestinationImage } from '../destination-image.entity.js';
export class DestinationImageResponse {
  url: string;
  caption: string | null;
  sortOrder: number;

  static from(image: DestinationImage): DestinationImageResponse {
    const response = new DestinationImageResponse();

    response.url = image.url;
    response.caption = image.caption;
    response.sortOrder = image.sortOrder;

    return response;
  }
}
