import { User } from '../models/Users.model';
import { getRepository } from 'typeorm';
import { UserFlats } from '../models/UserFlats.model';
import { Flats } from '../models/Flats.model';

interface IUserData {
  flatId: string;
  name: string;
}

export class UserService {

  static async save(userData: IUserData): Promise<UserFlats | undefined> {
    const userRepository = getRepository(User);
    let user = new User();
    user.name = userData.name;
    const createdUser = await userRepository.save(user);
    
    const flatRepository = getRepository(UserFlats);
    let userFlat = new UserFlats();
    userFlat.user = user;
    userFlat.flat = new Flats();
    userFlat.flat.id = userData.flatId;
    

    return flatRepository.save(userFlat);

  }



}