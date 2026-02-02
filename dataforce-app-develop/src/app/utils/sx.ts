import {ViewStyle, TextStyle, ImageStyle, StyleSheet} from 'react-native';

export type StyleObject = ViewStyle | TextStyle | ImageStyle;

export const sx = (...styleObjects: StyleObject[]): StyleObject => {
  return StyleSheet.flatten(styleObjects);
};
