import React from 'react';
import {Text, View} from 'react-native';
import styles from './AppEmptyState.styles';

interface AppEmptyStateProps {
  title?: string;
  message?: string;
}

function AppEmptyState({
  title = 'Chưa có dữ liệu',
  message = 'Hiện chưa có thông tin để hiển thị',
}: AppEmptyStateProps): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

export default AppEmptyState;
