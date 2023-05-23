import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { isAnError } from '../utils/error';
import Validator from 'jsonschema';
import { InvoicesService } from '../services/invoices.service';

export default function invoicesRouter(service: InvoicesService): Router {
  return Router()
    .get('/:id', async (req: Request, res: Response) => {
      const { id } = req.params;
      const invoice = await service.findById(id);
      return res.json(invoice);
    }) 
    .delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const result = await service.delete(id).catch((error: Error) => error);
      if (isAnError(result)) {
        next(result);
        return;
      }
      res.status(StatusCodes.OK).json({message:'Invoice Deleted'});
    })

}
