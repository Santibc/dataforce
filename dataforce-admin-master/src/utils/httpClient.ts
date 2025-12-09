import axios from 'axios';
import { environment } from 'src/environment/environment';

export const httpClient = axios.create({
  baseURL: environment.backEnd,
});
