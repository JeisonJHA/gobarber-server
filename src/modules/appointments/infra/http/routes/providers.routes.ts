import { Router } from 'express';

import auth from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';

const appointmentRoutes = Router();
const providersController = new ProvidersController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();

appointmentRoutes.use(auth);

appointmentRoutes.get('/', providersController.index);
appointmentRoutes.get(
  '/:provider_id/day-availability',
  providerDayAvailabilityController.index
);
appointmentRoutes.get(
  '/:provider_id/month-availability',
  providerMonthAvailabilityController.index
);

export default appointmentRoutes;
