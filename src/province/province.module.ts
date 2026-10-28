import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Province } from "./province.entity.js";

@Module({
    imports: [TypeOrmModule.forFeature([Province])],
    providers: [],
    controllers: []
})
export class ProvinceModule {

}