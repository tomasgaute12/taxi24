import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { UsersService } from '../services/users.service';
import { isAnError } from '../utils/error';
import Validator from 'jsonschema';
import { usersSchema } from '../schemas/users.schema';

export default function usersRouter(service: UsersService): Router {
  return Router()
    .get('/', async (_, res: Response) => {
      const users = await service.search();
      res.status(200).json(users);
    })
    .post('/', async (req: Request, res: Response, next: NextFunction) => {
      const validation = Validator.validate(req.body, usersSchema);
      if (!validation.valid) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Invalid request body',
          errors: validation.errors.map((error) => error.stack),
        });
      } else {
        const result = await service.create(req.body).catch((error: Error) => error);
        if (isAnError(result)) {
          next(result);
          return;
        }
      }
    })
    .patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const result = await service.update(id, req.body).catch((error: Error) => error);
      if (isAnError(result)) {
        next(result);
        return;
      }
      res.status(StatusCodes.NO_CONTENT).json();
    })
    .delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const result = await service.delete(id).catch((error: Error) => error);
      if (isAnError(result)) {
        next(result);
        return;
      }
      res.status(StatusCodes.OK).json({message:'User Deleted'});
    })

}
