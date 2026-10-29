import { ApiProperty } from "@nestjs/swagger";
import { Province } from "../province.entity.js";

export class ProvinceSummaryResponse {
    @ApiProperty({ example: 'ha-noi' })
    code: string;

    @ApiProperty({ example: 'Hà Nội' })
    name: string;

    @ApiProperty({ type: String, nullable: true })
    shortDescription: string | null;

    @ApiProperty({ type: String, nullable: true })
    bannerUrl: string | null;

    @ApiProperty({
        example: 1,
        description: 'Number of PUBLISHED destinations in this province',
    })
    destinationCount: number;

    static from(province: Province): ProvinceSummaryResponse {
        const response = new ProvinceSummaryResponse();
        response.code = province.code;
        response.name = province.name;
        response.shortDescription = province.shortDescription;
        response.bannerUrl = province.bannerUrl;
        response.destinationCount = province.destinations.length;
        return response;
    }
}