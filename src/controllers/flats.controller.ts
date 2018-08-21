import { Request, Response } from 'express';
import { FlatsService } from '../services/flats.service';
import { HttpResponse } from '../util/httpResponse';


export class FlatsController {

  static async create(req: Request, res: Response) {
    try {
      const user = await FlatsService.save(req.body);
      HttpResponse.success(res, 201, user);
    } catch (error) {
      HttpResponse.fail(res, 400, 10, error)
    }
    
  }
  
}