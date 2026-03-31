import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../../constants/colors';

interface InfoRowProps {
  label: string;
  value: string | number | undefined;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    flex: 0.45,
  },
  value: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textPrimary,
    flex: 0.5,
    textAlign: 'right',
  },
});

function InfoRow({label, value}: InfoRowProps): JSX.Element {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || '--'}</Text>
    </View>
  );
}

export default InfoRow;
