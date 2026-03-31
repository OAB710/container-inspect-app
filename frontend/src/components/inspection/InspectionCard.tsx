import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {Inspection} from '../../types/inspection.types';
import styles from './InspectionCard.styles';

interface InspectionCardProps {
  item: Inspection;
  onPress?: () => void;
}

function InspectionCard({item, onPress}: InspectionCardProps): JSX.Element {
  const isDraft = item.status === 'draft';

  const inspectionCode = item.inspection_code || `GD-${item.id}`;
  const containerNo =
    item.container?.container_no || `ID: ${item.container_id ?? '--'}`;
  const surveyorName =
    item.surveyor?.full_name ||
    item.surveyor?.username ||
    `ID: ${item.surveyor_id ?? '--'}`;
  const inspectionDate = item.inspection_date || 'Chưa có ngày giám định';

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <Text style={styles.code}>{inspectionCode}</Text>

        <View
          style={[
            styles.badge,
            isDraft ? styles.badgeDraft : styles.badgeDone,
          ]}>
          <Text style={styles.badgeText}>{isDraft ? 'Nháp' : 'Hoàn tất'}</Text>
        </View>
      </View>

      <Text style={styles.label}>
        Container: <Text style={styles.value}>{containerNo}</Text>
      </Text>

      <Text style={styles.label}>
        Người giám định: <Text style={styles.value}>{surveyorName}</Text>
      </Text>

      <Text style={styles.label}>
        Ngày giám định: <Text style={styles.value}>{inspectionDate}</Text>
      </Text>
    </Pressable>
  );
}

export default InspectionCard;
