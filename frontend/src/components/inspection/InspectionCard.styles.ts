import {StyleSheet} from 'react-native';
import colors from '../../constants/colors';

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  code: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 12,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeDraft: {
    backgroundColor: colors.badgeDraftBg,
  },
  badgeDone: {
    backgroundColor: colors.badgeDoneBg,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  value: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
});

export default styles;