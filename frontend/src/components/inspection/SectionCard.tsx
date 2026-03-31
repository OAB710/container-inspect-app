import React, {PropsWithChildren} from 'react';
import {Text, View} from 'react-native';
import styles from './SectionCard.styles';

interface SectionCardProps {
  title: string;
}

function SectionCard({
  title,
  children,
}: PropsWithChildren<SectionCardProps>): JSX.Element {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}

export default SectionCard;
