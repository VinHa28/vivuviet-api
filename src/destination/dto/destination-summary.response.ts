import { Destination } from "../destination.entity.js";

export class DestinationSummaryResponse {
    code:string;
    name: string;
    shortDescription: string | null;
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