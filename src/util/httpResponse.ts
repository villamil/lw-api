import { Response } from 'express';

export abstract class HttpResponse {

  static readonly MESSAGE_EMAIL_NOT_FOUND: string = 'Email not found';

  static readonly CODE_ERROR: number = 10;
  static readonly CODE_VALIDATION_ERROR: number = 11;
  static readonly CODE_NOT_FOUND: number = 12;
  static readonly CODE_UNAUTHORIZED: number = 13;

  static readonly ALREADY_REGISTERED = {
    code: 13,
    message: 'Email is already registered'
  };

  static readonly TOKEN_EXPIRED = {
    code: 14,
    message: 'Token expired'
  };  

  private static send(response: Response, httpCode: number, payload: any): void {
    response.status(httpCode).json(payload);
  }

  static success(response: Response, httpCode: number, data?: any): void {
    const payload = { data };

    HttpResponse.send(response, httpCode, payload);
  }

  static ok(response: Response, data?: any): void {
    HttpResponse.success(response, 200, data);
  }

  static fail(response: Response, httpCode: number, code: number, message?: string): void {
    const payload = {
      error:
      {
        code,
        message
      }
    };

    HttpResponse.send(response, httpCode, payload);
  }

  static unauthorized(response: Response, message?: string): void {
    HttpResponse.fail(response, 401, HttpResponse.CODE_UNAUTHORIZED, message);
  }

  static notFound(response: Response): void {
    HttpResponse.fail(response, 404, HttpResponse.CODE_NOT_FOUND);
  }

  static error(response: Response): void {
    HttpResponse.fail(response, 500, HttpResponse.CODE_ERROR);
  }

  static invalid(response: Response, message: string): void {
    HttpResponse.fail(response, 400, HttpResponse.CODE_VALIDATION_ERROR, message);
  }
}