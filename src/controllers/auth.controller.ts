import express from 'express';
import { Joi, validate } from 'express-validation';
import Controller from '../@shared/controllers/controller';
import AuthService from '../services/auth.service';
 
const registerValidation = {
    body: Joi.object({
        data: Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required().email()
            .external(async (value, helper) => {
                const authService = new AuthService();
                const exists = await authService.checkEmailExists(value);
                
                if (exists) {
                    throw new Joi.ValidationError('Email already exists', {
                        message: 'Email already exists',
                    }, 'email');
                } 

                return true
            }),
            password: Joi.string().required().min(6),
        }).required(),
    }),
};

const loginValidation = {
    body: Joi.object({
        data: Joi.object({
            email: Joi.string().required().email(),
            password: Joi.string().required().min(6),
        }).required(),
    }),
};

export default class AuthController extends Controller {
  public router = express.Router();
 
  constructor() {
    super();

    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post('/auth/register', validate(registerValidation), this.register);
    this.router.post('/auth/login', validate(loginValidation), this.login);
  }
 
  public async register(request: express.Request, response: express.Response) {
    try {
        const authService = new AuthService();
        const createdUser = await authService.register(request.body.data.name, request.body.data.email, request.body.data.password);
        
        response.status(201).json({
            data: {
                id: createdUser.getId(),
                name: createdUser.getName(),
                email: createdUser.getEmail(),
            }
        });
    } catch (ex) {
        console.error(ex);

        response.status(500).json({
            error: 'Internal server error',
        });
    }
  }

  public async login(request: express.Request, response: express.Response) {
    try {
        const authService = new AuthService();
        const token = await authService.login(request.body.data.email, request.body.data.password);

        if(!token) {
            response.status(401).json({
                error: 'Invalid credentials',
            });

            return;
        }

        response.status(200).json({
            data: {
                token: token,
            }
        });
    } catch (ex) {
        console.error(ex);

        response.status(500).json({
            error: 'Internal server error',
        });
    }
  }
}