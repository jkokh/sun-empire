import path from 'path';
import dotenv from 'dotenv-flow';
import i18n from 'i18n';
import en from './locales/en';
import ru from './locales/ru';
import es from './locales/es';

dotenv.config();

import { Configuration, Inject } from '@tsed/di';
import { PlatformApplication } from '@tsed/common';
import '@tsed/platform-express';
import '@tsed/ajv';
import '@tsed/swagger';
import { config } from './config';
import * as api from './controllers/api/index';
import * as pages from './controllers/pages/index';
import { PrismaClientKnownRequestErrorFilter } from './middleware/PrismaClientKnownRequestError';
import { ValidationErrorFilter } from './errorFilters/ValidationErrorFilter';
import { GlobalViewOptions } from './services/GlobalViewOptions';
import { GlobalErrorFilter } from './errorFilters/GlobalErrorFilter';
import { flatten } from './locales/flatten';
import { PICTURES_FOLDER } from './constants/picturesFolder';


i18n.configure({
  locales: ['en', 'ru', 'es'],
  staticCatalog: {
    en: flatten(en),
    ru: flatten(ru),
    es: flatten(es),
  },
  defaultLocale: 'ru',
  autoReload: true,
  syncFiles: true,
  queryParameter: 'lang',
  cookie: 'locale',
});

@Configuration({
  ...config,
  errors: {
    PrismaClientKnownRequestError: PrismaClientKnownRequestErrorFilter
  },
  imports: [GlobalViewOptions],
  acceptMimes: ['application/json'],
  httpPort: {
    port: process.env.PORT || 8084,
    host: '0.0.0.0'
  },
  httpsPort: false, // CHANGE
  disableComponentsScan: true,
  ajv: {
    returnsCoercedValues: true
  },
  mount: {
    '/api': [
      ...Object.values(api)
    ],
    '/': [
      ...Object.values(pages)
    ]
  },
  multer: {
    dest:  PICTURES_FOLDER,
  },
  statics: {
    '/': path.join(__dirname, '..', process.env.NODE_ENV !== 'local' ? '/dist/public' : '/frontend'),
    '/pictures': PICTURES_FOLDER
  },
  swagger: [
    {
      path: '/doc',
      specVersion: '3.0.1'
    }
  ],
  middlewares: [
    'cors',
    'cookie-parser',
    'compression',
    'method-override',
    'json-parser',
    { use: 'urlencoded-parser', options: { extended: true } },
    i18n.init,
  ],
  views: {
    root: path.join(__dirname, 'views/pages'),
    extensions: {
      pug: 'pug'
    },
    viewEngine: 'pug' // specify Pug as the view engine
  },
  cors: {
    origin: ['http://localhost:5173'], // Allow your Vite server origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  exclude: [
    '**/*.spec.ts'
  ],
  exceptions: {
    catch: [ValidationErrorFilter, GlobalErrorFilter]
  }
})
export class Server {
  @Inject()
  protected app: PlatformApplication;

  @Configuration()
  protected settings: Configuration;

  // disable the X-Powered-By header
  $beforeRoutesInit(): void {
    this.app.getApp().disable('x-powered-by');
  }
}
