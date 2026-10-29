import { ApiProperty } from '@nestjs/swagger';
import { Destination } from '../entities/destination.entity.js';

export class DestinationSummaryResponse {
    @ApiProperty({ example: 'phu-quoc' })
    slug: string;

    @ApiProperty({ example: 'Phú Quốc' })
    name: string;

    @ApiProperty({ example: 'an-giang' })
    provinceCode: string;

    @ApiProperty({ type: String, nullable: true })
    shortDescription: string | null;

    @ApiProperty({ type: String, nullable: true })
    bannerUrl: string | null;
    
    static from(
        destination: Destination,
        provinceCode: string = destination.province.code,
    ): DestinationSummaryResponse {
        const response = new DestinationSummaryResponse();
        response.slug = destination.slug;
        response.name = destination.name;
        response.provinceCode = provinceCode;
        response.shortDescription = destination.shortDescription;
        response.bannerUrl = destination.bannerUrl;
        return response;
    }
}