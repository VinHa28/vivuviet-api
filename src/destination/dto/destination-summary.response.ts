import { ApiProperty } from "@nestjs/swagger";
import { Destination } from "../destination.entity.js";

export class DestinationSummaryResponse {
    @ApiProperty({example: 'ha-noi'})
    code:string;

    @ApiProperty({example: 'Hà Nội'})
    name: string;

    @ApiProperty({type: String, nullable: true})
    shortDescription: string | null;

    @ApiProperty({type: String, nullable: true})
    bannerUrl: string | null;

    static from(destination: Destination): DestinationSummaryResponse {
        const response = new DestinationSummaryResponse;
        response.code = destination.code;
        response.name = destination.name;
        response.shortDescription = destination.shortDescription;
        response.bannerUrl = destination.bannerUrl;
        return response;
    }
}