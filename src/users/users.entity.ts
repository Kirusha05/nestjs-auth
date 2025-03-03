import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/database/base.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;
}