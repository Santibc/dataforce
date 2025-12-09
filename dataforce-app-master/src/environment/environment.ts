// @ts-ignore
import {PRODUCTION} from 'react-native-dotenv';

const develop = {
  backEnd: 'https://dataforce-back.vadiun.net/api/',
};

const production = {
  backEnd: 'http://pedrito/api/',
};

const environment = PRODUCTION === 'true' ? production : develop;

export default environment;
