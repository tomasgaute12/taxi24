import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { isAnError } from '../utils/error';
import Validator from 'jsonschema';
import { DriversService } from '../services/drivers.service';
import { driversSchema } from '../schemas/drivers.schema';

export default function driversRouter(service: DriversService): Router {
  return Router()
    .get('/getActiveDrivers', async (_, res: Response) => {
      const activeDrivers = await service.getActiveDrivers().catch((error: Error) => error);
      return res.json(activeDrivers);
    })
    .get('/nearbyDrivers', async (req: Request, res: Response) => {
      const lat = req.query.lat as string | undefined;
      const long = req.query.long as string | undefined;
      
      if (lat && long) {
        const latitude = parseFloat(lat);
        const longitude = parseFloat(long);
        const activeDrivers = await service.nearbyDrivers(latitude, longitude).catch((error: Error) => error);
        res.status(StatusCodes.OK).json({message:'Drivers within a 3 km radius',activeDrivers});
      } else {
        return res.status(400).json({ error: 'Required latitude and longitude parameters.' });
      }
    })
    .get('/', async (_, res: Response) => {
      const drivers = await service.search();
      res.status(200).json(drivers);
    })

    .get('/:id', async (req: Request, res: Response) => {
      const { id } = req.params;
      const driver = await service.findById(id).catch((error: Error) => error);
      return res.json(driver);
    })

    .post('/', async (req: Request, res: Response, next: NextFunction) => {
      const validation = Validator.validate(req.body, driversSchema);
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
        res.status(StatusCodes.OK).json({message:'User registered as Driver',result});
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
        res.status(StatusCodes.OK).json({message:'Driver Ubication Updated!',result});
      } else {
        return res.status(400).json({ error: 'Required latitude and longitude parameters.' });
      }
    })
}

