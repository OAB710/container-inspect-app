import {StyleSheet} from 'react-native';
import colors from '../../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 12,
    paddingBottom: 32,
  },
  headerCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  status: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryLight,
  },
  rowButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  rowButtonItem: {
    flex: 1,
  },
  messageBox: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#F5FAFD',
    padding: 12,
    marginBottom: 14,
  },
  messageText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  footerGap: {
    height: 12,
  },
});

export default styles;
