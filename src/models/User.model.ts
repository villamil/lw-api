import { Column, Entity, Index, ManyToMany, ManyToOne, JoinTable, BeforeInsert, BeforeUpdate } from 'typeorm';

export class User {
  @Index({unique: true})
  @Column()
  email!: string;

  @Column() 
  firstName!: string;

  @Column() 
  lastName!: string;

  @Column() 
  password!: string;
}