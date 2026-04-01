import {StyleSheet} from 'react-native';
import AppColors from '../../../constants/app-colors';

const damageFormStyle = StyleSheet.create({
  helperText: {
    fontSize: 14,
    color: AppColors.textSecondary,
    lineHeight: 20,
  },
  imageItem: {
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  imageName: {
    fontSize: 14,
    color: AppColors.text,
    marginBottom: 8,
  },
  imageActions: {
    flexDirection: 'row',
    gap: 10,
  },
  imageActionBtn: {
    flex: 1,
  },
});

export default damageFormStyle;
