import { Flats } from '../models/Flats.model';
import { getRepository } from 'typeorm';

interface IFlatsData {
  id?: string;
  name: string;
}

export class FlatsService {

  static async save(flatData: IFlatsData): Promise<Flats | undefined> {
    const repository = getRepository(Flats);
    let flat = await repository.findOne({
      where: {
        id: flatData.id,
        deleted: false,
      }
    });
    if (!flat) {
      flat = new Flats();
    }
    flat.name = flatData.name;
    return repository.save(flat);
  }


  
}