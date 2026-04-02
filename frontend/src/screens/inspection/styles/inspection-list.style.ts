import {StyleSheet} from 'react-native';
import AppColors from '../../../constants/app-colors';

const inspectionListStyle = StyleSheet.create({
  headerAvatarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primaryLight,
    marginRight: 2,
  },
  headerAvatarText: {
    fontSize: 13,
    fontWeight: '800',
    color: AppColors.primary,
  },
  createButtonWrap: {
    marginTop: 16,
    marginBottom: 12,
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
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-start',
    padding: 16,
  },
  menuCard: {
    marginTop: 64,
    backgroundColor: AppColors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 2,
  },
  menuAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primaryLight,
  },
  menuAvatarText: {
    fontSize: 15,
    fontWeight: '800',
    color: AppColors.primary,
  },
  menuInfo: {
    flex: 1,
  },
  menuName: {
    fontSize: 16,
    fontWeight: '800',
    color: AppColors.text,
    marginBottom: 4,
  },
  menuMeta: {
    fontSize: 13,
    color: AppColors.textSecondary,
    lineHeight: 18,
  },
  menuActions: {
    marginTop: 14,
  },
  logoutButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: AppColors.danger,
  },
});

export default inspectionListStyle;
