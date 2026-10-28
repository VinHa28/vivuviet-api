import { ApiProperty } from '@nestjs/swagger';
import { DestinationImage } from '../destination-image.entity.js';
export class DestinationImageResponse {
  @ApiProperty()
  url: string;
  @ApiProperty({ type: String, nullable: true })
  caption: string | null;
  @ApiProperty({ example: 0 })
  sortOrder: number;

  static from(image: DestinationImage): DestinationImageResponse {
    const response = new DestinationImageResponse();

    response.url = image.url;
    response.caption = image.caption;
    response.sortOrder = image.sortOrder;

    return response;
  }
}
