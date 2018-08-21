import { PrimaryGeneratedColumn, Column } from 'typeorm';

export abstract class Base {
  
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  createdAt!: Date;

  @Column({ default: false })
  deleted!: Boolean;

}