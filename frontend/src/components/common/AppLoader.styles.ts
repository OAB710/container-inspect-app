import {StyleSheet} from 'react-native';
import colors from '../../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default styles;