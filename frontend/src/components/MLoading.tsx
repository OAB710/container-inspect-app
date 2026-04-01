import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import AppColors from '../constants/app-colors';

const MLoading = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={AppColors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MLoading;