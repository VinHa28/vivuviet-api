import { ApiProperty } from '@nestjs/swagger';
import { Destination } from '../destination.entity.js';

export class DestinationSummaryResponse {
    @ApiProperty({ example: 'phu-quoc' })
    slug: string;

    @ApiProperty({ example: 'Phú Quốc' })
    name: string;

    @ApiProperty({ type: String, nullable: true })
    shortDescription: string | null;

    @ApiProperty({ type: String, nullable: true })
    bannerUrl: string | null;

    static from(destination: Destination): DestinationSummaryResponse {
        const response = new DestinationSummaryResponse();
        response.slug = destination.slug;
        response.name = destination.name;
        response.shortDescription = destination.shortDescription;
        response.bannerUrl = destination.bannerUrl;
        return response;
    }
}