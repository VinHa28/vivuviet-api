import { ApiProperty } from '@nestjs/swagger';
import { Destination } from '../destination.entity.js';
import { DestinationImageResponse } from './destination-image.response.js';

export class DestinationDetailResponse {
  @ApiProperty({ example: 'ha-noi' })
  code: string;
  @ApiProperty({ example: 'Hà Nội' })
  name: string;
  @ApiProperty({ type: String, nullable: true })
  shortDescription: string | null;
  @ApiProperty({ type: String, nullable: true })
  bannerUrl: string | null;
  @ApiProperty({ type: [DestinationImageResponse] })
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
