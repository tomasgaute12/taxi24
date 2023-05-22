import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UsersEntity } from './users.entity';
import { Users } from '../models/users';
import { DriverState, Drivers, Ubication } from '../models/drivers';


@Entity({ name: 'drivers' })
export class DriversEntity implements Drivers {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ name: 'licenseNumber', type: 'varchar', nullable: false })
    licenseNumber: string;
  
  @Column({ name: 'carModel', type: 'varchar', nullable: false })
    carModel: string;

  @Column({ name: 'carPlateNumber', type: 'varchar', nullable: false })
    carPlateNumber: string;

  @Column({ name: 'isActive', type: 'boolean', nullable: false })
    isActive: boolean;

  @Column({ name: 'ubication', type: 'jsonb', nullable: false })
    ubication: Ubication;

  @Column({ name: 'state', type: 'varchar', nullable: false, default: 'RELEASED' })
    state: DriverState;

  @Column({ name: 'created_at', type: 'timestamp', nullable: false, default: () => 'now()' })
    createdAt: Date;

  @Column({ name: 'extras', type: 'jsonb', nullable: false, default: JSON.stringify({ firstRun: false }) })
    extras: object;
  
  @ManyToOne(() => UsersEntity, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'user', referencedColumnName: 'id' })
    user: Users;

}
