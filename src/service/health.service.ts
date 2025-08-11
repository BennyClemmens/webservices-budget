import config from 'config';
import packageJson from '../../package.json';

export const ping = () => ({ pong: true });
// () noodzakelijk om een object terug te geven met oneliner

export const getVersion = () => ({
  env: config.get<string>('env'),
  version: packageJson.version,
  name: packageJson.name,
});

// TODO
// db online?
