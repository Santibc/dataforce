import AsyncStorage from '@react-native-async-storage/async-storage';
import {createLaravelHttpClient} from '@vadiun/http-client';
import environment from 'environment/environment';

export const httpClient = createLaravelHttpClient({
  url: environment.backEnd,
  token: () => AsyncStorage.getItem('token') as Promise<string>,
});
