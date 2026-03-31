import React from 'react';
import {ActivityIndicator, Pressable, Text, ViewStyle} from 'react-native';
import styles from './PrimaryButton.styles';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface PrimaryButtonProps {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  style?: ViewStyle;
}

function PrimaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  style,
}: PrimaryButtonProps): JSX.Element {
  const isDisabled = disabled || loading;

  const buttonVariantStyle =
    variant === 'primary'
      ? styles.buttonPrimary
      : variant === 'secondary'
      ? styles.buttonSecondary
      : variant === 'danger'
      ? styles.buttonDanger
      : styles.buttonGhost;

  const textVariantStyle =
    variant === 'primary'
      ? styles.textPrimary
      : variant === 'secondary'
      ? styles.textSecondary
      : variant === 'danger'
      ? styles.textDanger
      : styles.textGhost;

  return (
    <Pressable
      style={[
        styles.button,
        buttonVariantStyle,
        isDisabled ? styles.buttonDisabled : null,
        style,
      ]}
      disabled={isDisabled}
      onPress={onPress}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'secondary' ? '#0B4F6C' : '#FFFFFF'}
        />
      ) : (
        <Text style={[styles.text, textVariantStyle]}>{title}</Text>
      )}
    </Pressable>
  );
}

export default PrimaryButton;
