import React from 'react';
import {Pressable, Text, View} from 'react-native';
import styles from './AppErrorState.styles';

interface AppErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

function AppErrorState({
  message = 'Đã có lỗi xảy ra',
  onRetry,
}: AppErrorStateProps): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oops</Text>
      <Text style={styles.message}>{message}</Text>

      {onRetry ? (
        <Pressable style={styles.button} onPress={onRetry}>
          <Text style={styles.buttonText}>Thử lại</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export default AppErrorState;
