import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { Base } from './Base.model';
import { User } from './Users.model';

@Entity()
export class Flats extends Base {

  @Column()
  name!: string;

}