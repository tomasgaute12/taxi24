import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { isAnError } from '../utils/error';
import Validator from 'jsonschema';
import { PassengersService } from '../services/passengers.service';
import { passengersSchema } from '../schemas/passengers.schema';

export default function passengersRouter(service: PassengersService): Router {
  return Router()
    .get('/', async (_, res: Response) => {
      const passengers = await service.search();
      res.status(200).json(passengers);
    })
    .get('/:id', async (req: Request, res: Response) => {
      const { id } = req.params;
      const passenger = await service.findById(id);
      return res.json(passenger);
    })
    .post('/', async (req: Request, res: Response, next: NextFunction) => {
      const validation = Validator.validate(req.body, passengersSchema);
      if (!validation.valid) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Invalid request body',
          errors: validation.errors.map((error) => error.stack),
        });
      } else {
        const { userId } = req.body
        const result = await service.create(userId,req.body).catch((error: Error) => error);
        if (isAnError(result)) {
          next(result);
          return;
        }
        res.status(StatusCodes.OK).json({message:'User registered as Passenger',result});
      }
    })
    .patch('/ubication/:id', async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const { ubication } = req.body;
      if (ubication.lat && ubication.long) {
        const {lat , long } = ubication;
        req.body.ubication = {lat,long}
        const result = await service.updateUbication(id, req.body).catch((error: Error) => error);
        if (isAnError(result)) {
          next(result);
          return;
        }
        res.status(StatusCodes.OK).json({message:'Passenger Ubication Updated!',result});
      } else {
        return res.status(400).json({ error: 'Required latitude and longitude parameters.' });
      }
    })
}
