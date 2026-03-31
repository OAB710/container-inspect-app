import React from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import styles from './AppLoader.styles';

interface AppLoaderProps {
  message?: string;
}

function AppLoader({
  message = 'Đang tải dữ liệu...',
}: AppLoaderProps): JSX.Element {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

export default AppLoader;