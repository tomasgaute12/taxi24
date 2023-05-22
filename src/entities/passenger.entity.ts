import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Passengers, Ubication } from '../models/passengers';
import { UsersEntity } from './users.entity';
import { Users } from '../models/users';

@Entity({ name: 'passengers' })
export class PassengersEntity implements Passengers {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ name: 'ubication', type: 'jsonb', nullable: false })
    ubication: Ubication;

  @Column({ name: 'created_at', type: 'timestamp', nullable: false, default: () => 'now()' })
    createdAt: Date;

  @Column({ name: 'extras', type: 'jsonb', nullable: false, default: JSON.stringify({ firstRun: false }) })
    extras: object;
  
  @ManyToOne(() => UsersEntity, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'user', referencedColumnName: 'id' })
    user: Users;

}
