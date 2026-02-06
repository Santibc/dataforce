// @ts-ignore
import {PRODUCTION} from 'react-native-dotenv';

const develop = {
  backEnd: 'http://10.0.2.2:8000/api/',  // 10.0.2.2 es localhost desde el emulador Android
};

const production = {
  backEnd: 'https://back.app.bosmetrics.com/api/',
};

const environment = PRODUCTION === 'true' ? production : develop;

export default environment;
