import React, {useState} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MainLayout from '../../components/MainLayout';
import MButton from '../../components/MButton';
import authApi from '../../api/auth';
import {useAuthStore} from '../../stores/authStore';
import AppColors from '../../constants/app-colors';
import {APP_NAME} from '../../constants/app';

type LoginForm = {
  username: string;
  password: string;
  fullName: string;
  email: string;
  confirmPassword: string;
};

const EMPTY_FORM: LoginForm = {
  username: '',
  password: '',
  fullName: '',
  email: '',
  confirmPassword: '',
};

const LoginScreen: React.FC = () => {
  const [form, setForm] = useState<LoginForm>(EMPTY_FORM);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore(state => state.setAuth);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleToggleMode = () => {
    setIsRegisterMode(prev => !prev);
    setForm(EMPTY_FORM);
  };

  const onLogin = async () => {
    if (!form.username.trim() || !form.password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tài khoản và mật khẩu');
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.login({
        username: form.username.trim(),
        password: form.password,
      });

      await setAuth(res.access_token, res.user);
    } catch (error: any) {
      Alert.alert('Đăng nhập thất bại', error.message || 'Không thể đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async () => {
    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.username.trim() ||
      !form.password.trim()
    ) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin đăng ký');
      return;
    }

    if (!emailRegex.test(form.email.trim())) {
      Alert.alert('Lỗi', 'Email không đúng định dạng');
      return;
    }

    if (form.password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.register({
        username: form.username.trim(),
        password: form.password,
        full_name: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
      });

      await setAuth(res.access_token, res.user);
      Alert.alert('Thành công', 'Đăng ký và đăng nhập thành công');
    } catch (error: any) {
      Alert.alert('Đăng ký thất bại', error.message || 'Không thể đăng ký');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout scrollable={false}>
      <View style={styles.container}>
        <Text style={styles.title}>
          {isRegisterMode ? 'Đăng ký' : 'Đăng nhập'}
        </Text>
        <Text style={styles.subtitle}>{APP_NAME}</Text>

        <View style={styles.formWrap}>
          {isRegisterMode && (
            <>
              <Text style={styles.label}>Họ tên</Text>
              <TextInput
                style={styles.input}
                value={form.fullName}
                onChangeText={text =>
                  setForm(prev => ({...prev, fullName: text}))
                }
                placeholder="Nhập họ tên"
                placeholderTextColor={AppColors.textSecondary}
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={form.email}
                onChangeText={text => setForm(prev => ({...prev, email: text}))}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
                spellCheck={false}
                placeholder="Nhập email"
                placeholderTextColor={AppColors.textSecondary}
              />
            </>
          )}

          <Text style={styles.label}>Tài khoản</Text>
          <TextInput
            style={styles.input}
            value={form.username}
            onChangeText={text => setForm(prev => ({...prev, username: text}))}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            placeholder="Nhập tài khoản"
            placeholderTextColor={AppColors.textSecondary}
          />

          <Text style={styles.label}>Mật khẩu</Text>
          <TextInput
            style={styles.input}
            value={form.password}
            onChangeText={text => setForm(prev => ({...prev, password: text}))}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            placeholder="Nhập mật khẩu"
            placeholderTextColor={AppColors.textSecondary}
          />

          {isRegisterMode && (
            <>
              <Text style={styles.label}>Xác nhận mật khẩu</Text>
              <TextInput
                style={styles.input}
                value={form.confirmPassword}
                onChangeText={text =>
                  setForm(prev => ({...prev, confirmPassword: text}))
                }
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                placeholder="Nhập lại mật khẩu"
                placeholderTextColor={AppColors.textSecondary}
              />
            </>
          )}

          <MButton
            title={isRegisterMode ? 'Đăng ký' : 'Đăng nhập'}
            onPress={isRegisterMode ? onRegister : onLogin}
            loading={loading}
          />

          <TouchableOpacity
            onPress={handleToggleMode}
            disabled={loading}>
            <Text style={styles.switchText}>
              {isRegisterMode
                ? 'Đã có tài khoản? Đăng nhập'
                : 'Chưa có tài khoản? Đăng ký'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: AppColors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: AppColors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 24,
  },
  formWrap: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.text,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: AppColors.white,
    fontSize: 15,
    color: AppColors.text,
  },
  switchText: {
    marginTop: 8,
    textAlign: 'center',
    color: AppColors.primary,
    fontWeight: '600',
  },
});

export default LoginScreen;
