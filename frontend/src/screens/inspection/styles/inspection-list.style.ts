import {StyleSheet} from 'react-native';
import AppColors from '../../../constants/app-colors';

const inspectionListStyle = StyleSheet.create({
  createButtonWrap: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: AppColors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    padding: 16,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  code: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.text,
  },
  text: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginBottom: 6,
  },
});

export default inspectionListStyle;
