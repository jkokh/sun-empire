import { readFileSync } from 'fs';
import { envs } from './envs';
import loggerConfig from './logger/index';
import { Configuration } from '@tsed/di';
const pkg = JSON.parse(readFileSync('./package.json', { encoding: 'utf8' }));

export const config: Partial<Configuration> = {
  version: pkg.version,
  envs,
  logger: loggerConfig,
  // additional shared configuration
};
