
import React from 'react';
import {View, ViewProps} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = ViewProps;

export const HitSafeAreaView = ({style, ...props}: Props) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      {...props}
      style={[
        {
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          flex: 1,
        },
        style,
      ]}
    />
  );
};