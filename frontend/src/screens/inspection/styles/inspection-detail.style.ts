import {StyleSheet} from 'react-native';
import AppColors from '../../../constants/app-colors';

const inspectionDetailStyle = StyleSheet.create({
  headerWrap: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: AppColors.text,
    marginBottom: 8,
  },
  headerDesc: {
    fontSize: 14,
    color: AppColors.textSecondary,
    lineHeight: 20,
    marginTop: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  damageHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  damageTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.text,
    flex: 1,
  },
  footerActions: {
    marginTop: 8,
  },
  gap12: {
    height: 12,
  },
  gap16: {
    height: 16,
  },
  emptyText: {
    fontSize: 14,
    color: AppColors.textSecondary,
  },
});

export default inspectionDetailStyle;
