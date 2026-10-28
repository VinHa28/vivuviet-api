import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    type Relation,
    UpdateDateColumn,
} from 'typeorm';
import { Destination } from '../destination/destination.entity.js';

@Entity('provinces')
export class Province {
    @OneToMany(() => Destination, (destination) => destination.province)
    destinations: Relation<Destination[]>;

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', unique: true, length: 100 })
    code: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'text', name: 'short_description', nullable: true })
    shortDescription: string | null;

    @Column({ type: 'varchar', name: 'banner_url', nullable: true, length: 500 })
    bannerUrl: string | null;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @CreateDateColumn({ type: 'timestamptz', precision: 3, name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz', precision: 3, name: 'updated_at' })
    updatedAt: Date;
}
