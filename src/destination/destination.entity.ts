import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from 'typeorm';
import { DestinationImage } from './destination-image.entity.js';

@Entity('destinations')
export class Destination {
  @OneToMany(() => DestinationImage, (image) => image.destination)
  images: Relation<DestinationImage[]>;
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', name: 'short_description', nullable: true })
  shortDescription: string | null;

  @Column({ type: 'varchar', length: 500, name: 'banner_url', nullable: true })
  bannerUrl: string | null;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz', precision: 3, name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', precision: 3, name: 'updated_at' })
  updatedAt: Date;
}
