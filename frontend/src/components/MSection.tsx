import React, { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppColors from '../constants/app-colors';

interface MSectionProps extends PropsWithChildren {
  title: string;
}

const MSection: React.FC<MSectionProps> = ({ title, children }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.text,
    marginBottom: 12,
  },
  content: {
    gap: 12,
  },
});

export default MSection;