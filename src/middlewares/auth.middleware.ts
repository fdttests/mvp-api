import { NextFunction, Request, Response } from "express";
import AuthService from "../services/auth.service";

export default class AuthMiddleware {
  public async handle(request: Request, response: Response, next: NextFunction) {
    try {
        const authService = new AuthService();
        const token = request.headers.authorization?.split(' ')[1];

        if (!token) {
            response.status(401).json({
                error: 'Authorization token not provided',
            });

            return;
        }            

        const decoded = await authService.validateToken(token);
        (<any>request).auth = decoded;

        next();
    } catch (ex) {
        response.status(401).json({
            error: 'Invalid authorization token',
        });
    }
  }
}