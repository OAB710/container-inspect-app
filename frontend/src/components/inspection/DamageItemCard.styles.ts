import {StyleSheet} from 'react-native';
import colors from '../../constants/colors';

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    backgroundColor: '#F7FBFE',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#D9E8F0',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  removeText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '700',
  },
  imageItem: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 10,
    backgroundColor: colors.white,
  },
  imageName: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  imageUrl: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  addImageWrap: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EAF0F5',
  },
});

export default styles;
