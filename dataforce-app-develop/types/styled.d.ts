import 'styled-components';
import {Theme} from '@vadiun/react-native-eevee';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
