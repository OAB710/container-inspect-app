import React from 'react';
import { StyleSheet, Text } from 'react-native';
import AppColors from '../constants/app-colors';

interface MLabelProps {
  text: string;
  required?: boolean;
}

const MLabel: React.FC<MLabelProps> = ({ text, required = false }) => {
  return (
    <Text style={styles.label}>
      {text}
      {required ? <Text style={styles.required}> *</Text> : null}
    </Text>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.text,
    marginBottom: 8,
  },
  required: {
    color: AppColors.danger,
  },
});

export default MLabel;