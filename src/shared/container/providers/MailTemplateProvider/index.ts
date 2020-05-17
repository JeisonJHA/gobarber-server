import { container } from 'tsyringe';

import IMailTemplateProvider from './models/IMailTemplateProvider';
import HandlebarsMailTempateProvider from './implementations/HandlebarsMailTempateProvider';

const providers = {
  handleBars: HandlebarsMailTempateProvider,
};

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  providers.handleBars
);
