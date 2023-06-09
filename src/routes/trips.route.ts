import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { isAnError } from '../utils/error';
import Validator from 'jsonschema';
import { TripsService } from '../services/trips.service';
import { tripsSchema } from '../schemas/trips.schema';

export default function tripsRouter(service: TripsService): Router {
  return Router()
    .get('/activeTrips', async (_, res: Response) => {
      const trips = await service.getActiveTrips().catch((error: Error) => error);
      res.status(200).json(trips);
    })
    .get('/:id', async (req: Request, res: Response) => {
      const { id } = req.params;
      const trip = await service.findById(id).catch((error: Error) => error);
      return res.json(trip);
    })
    .post('/', async (req: Request, res: Response, next: NextFunction) => {
      const validation = Validator.validate(req.body, tripsSchema);
      if (!validation.valid) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Invalid request body',
          errors: validation.errors.map((error) => error.stack),
        });
      } else {
        const { passengerId } = req.body
        const result = await service.create(passengerId,req.body).catch((error: Error) => error);
        if (isAnError(result)) {
          next(result);
          return;
        }
        res.status(StatusCodes.OK).json({message:'Trip created successfully!',result});
      }
    })
    .patch('/completeTrip/:id', async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const result = await service.completeTrip(id).catch((error: Error) => error);
      if (isAnError(result)) {
        next(result);
        return;
      }
      res.status(StatusCodes.OK).json({message:'Trip Over!',invoice:result});
    })
    .delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const result = await service.delete(id).catch((error: Error) => error);
      if (isAnError(result)) {
        next(result);
        return;
      }
      res.status(StatusCodes.NO_CONTENT).json();
    })

}
