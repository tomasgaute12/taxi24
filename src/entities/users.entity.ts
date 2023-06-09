import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Users } from '../models/users';
@Entity({ name: 'users' })
export class UsersEntity implements Users {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ name: 'name', type: 'varchar', length: 128, nullable: false })
    name: string;

  @Column({ name: 'lastname', type: 'varchar', length: 128, nullable: false })
    lastname: string;

  @Column({ name: 'phone', type: 'varchar', length: 64, nullable: false })
    phone: string;

  @Column({ name: 'email', type: 'varchar', length: 128, nullable: false })
    email: string;

  @Column({ name: 'username', type: 'varchar', length: 64, nullable: false })
    username: string;

  @Column({ name: 'password', type: 'varchar' })
    password: string;

  @Column({ name: 'created_at', type: 'timestamp', nullable: false, default: () => 'now()' })
    createdAt: Date;

  @Column({ name: 'extras', type: 'jsonb', nullable: false, default: JSON.stringify({ firstRun: false }) })
    extras: object;

}
