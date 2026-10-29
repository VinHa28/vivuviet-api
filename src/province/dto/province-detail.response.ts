import { ApiProperty } from "@nestjs/swagger";
import { DestinationSummaryResponse } from "../../destination/dto/destination-summary.response.js";
import { Province } from '../entities/province.entity.js';

export class ProvinceDetailResponse {
    @ApiProperty({ example: 'an-giang' })
    code: string;

    @ApiProperty({ example: 'An Giang' })
    name: string;

    @ApiProperty({ type: String, nullable: true })
    shortDescription: string | null;

    @ApiProperty({ type: String, nullable: true })
    bannerUrl: string | null;

    @ApiProperty({ type: DestinationSummaryResponse, isArray: true })
    destinations: DestinationSummaryResponse[];

    static from(province: Province): ProvinceDetailResponse {
        const response = new ProvinceDetailResponse();
        response.code = province.code;
        response.name = province.name;
        response.shortDescription = province.shortDescription;
        response.bannerUrl = province.bannerUrl;
        response.destinations = province.destinations.map((d) =>
            DestinationSummaryResponse.from(d, province.code),
        );
        return response;
    }
}