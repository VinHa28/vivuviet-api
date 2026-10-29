import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Province } from '../../province/entities/province.entity.js';
import { DestinationStatus } from '../enums/destination-status.enum.js';

@Entity('destinations')
export class Destination {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'province_id' })
  provinceId: number;

  @ManyToOne(() => Province, (province) => province.destinations, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'province_id' })
  province: Relation<Province>;

  @Column({ type: 'varchar', length: 100, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', name: 'short_description', nullable: true })
  shortDescription: string | null;

  @Column({ type: 'varchar', length: 500, name: 'banner_url', nullable: true })
  bannerUrl: string | null;

  @Column({
    type: 'enum',
    enum: DestinationStatus,
    default: DestinationStatus.DRAFT,
  })
  status: DestinationStatus;

  @CreateDateColumn({ type: 'timestamptz', precision: 3, name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', precision: 3, name: 'updated_at' })
  updatedAt: Date;
}