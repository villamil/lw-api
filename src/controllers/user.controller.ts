import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { HttpResponse } from '../util/httpResponse';


export class UserController {

  static async create(req: Request, res: Response) {
    try {
      const user = await UserService.save(req.body);
      HttpResponse.success(res, 201, user);
    } catch (error) {
      HttpResponse.fail(res, 400, 10, error)
    }
    
  }
  
}