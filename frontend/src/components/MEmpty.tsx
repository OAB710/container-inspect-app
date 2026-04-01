import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppColors from '../constants/app-colors';

interface MEmptyProps {
  text?: string;
}

const MEmpty: React.FC<MEmptyProps> = ({ text = 'Không có dữ liệu' }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    color: AppColors.textSecondary,
  },
});

export default MEmpty;