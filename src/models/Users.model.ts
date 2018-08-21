import { Column, Entity, OneToOne, JoinColumn, ManyToOne, JoinTable, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Base } from './Base.model';
import { Flats } from './Flats.model';


@Entity()
export class User extends Base {

  @Column()
  name!: string;

  @OneToOne(type => Flats)
  @JoinColumn()
  flat!: Flats;

}