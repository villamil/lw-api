import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { Base } from './Base.model';
import { User } from './Users.model';
import { Flats } from './Flats.model';

@Entity()
export class UserFlats extends Base {

  @OneToOne(type => User)
  @JoinColumn()
  user!: User;

  @OneToOne(type => Flats)
  @JoinColumn()
  flat!: Flats;

}