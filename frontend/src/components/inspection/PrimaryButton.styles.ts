import {StyleSheet} from 'react-native';
import colors from '../../constants/colors';

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.white,
    borderColor: colors.border,
  },
  buttonDanger: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
  },
  textPrimary: {
    color: colors.white,
  },
  textSecondary: {
    color: colors.primary,
  },
  textDanger: {
    color: colors.white,
  },
  textGhost: {
    color: colors.textSecondary,
  },
});

export default styles;
