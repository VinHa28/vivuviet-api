import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Province } from './province.entity.js';
import { ProvinceService } from './province.service.js';
import { PublicProvincesController } from './public-provinces.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Province])],
  providers: [ProvinceService],
  controllers: [PublicProvincesController],
})
export class ProvinceModule {}
