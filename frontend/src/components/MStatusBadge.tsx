import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import AppColors from '../constants/app-colors';
import {InspectionStatus} from '../types/inspection';
import {formatInspectionStatusLabel} from '../utils/inspectionDisplay';

interface MStatusBadgeProps {
  status: InspectionStatus;
}

const MStatusBadge: React.FC<MStatusBadgeProps> = ({status}) => {
  return (
    <View
      style={[
        styles.badge,
        status === 'completed' ? styles.completedBadge : styles.draftBadge,
      ]}>
      <Text
        style={[
          styles.text,
          status === 'completed' ? styles.completedText : styles.draftText,
        ]}>
        {formatInspectionStatusLabel(status)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  draftBadge: {
    backgroundColor: '#FEF3C7',
  },
  completedBadge: {
    backgroundColor: '#DCFCE7',
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
  draftText: {
    color: AppColors.warning,
  },
  completedText: {
    color: AppColors.success,
  },
});

export default MStatusBadge;
