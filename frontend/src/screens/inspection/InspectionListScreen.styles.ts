import {StyleSheet} from 'react-native';
import colors from '../../constants/colors';

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    marginBottom: 16,
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  addButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 24,
  },
});

export default styles;
