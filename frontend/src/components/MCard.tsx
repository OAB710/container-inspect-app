import React, {PropsWithChildren} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import AppColors from '../constants/app-colors';

interface MCardProps extends PropsWithChildren {
  style?: ViewStyle | ViewStyle[];
}

const MCard: React.FC<MCardProps> = ({children, style}) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    padding: 16,
  },
});

export default MCard;
