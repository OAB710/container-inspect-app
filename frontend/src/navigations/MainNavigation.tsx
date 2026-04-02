import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import InspectionNavigation from './InspectionNavigation';
import LoginScreen from '../screens/auth/LoginScreen';
import {useAuthStore} from '../stores/authStore';
import MLoading from '../components/MLoading';
import authApi from '../api/auth';

type RootStackParamList = {
  LoginScreen: undefined;
  InspectionNavigation: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainNavigation = () => {
  const token = useAuthStore(state => state.token);
  const hydrated = useAuthStore(state => state.hydrated);
  const hydrate = useAuthStore(state => state.hydrate);
  const setAuth = useAuthStore(state => state.setAuth);
  const setUser = useAuthStore(state => state.setUser);
  const logout = useAuthStore(state => state.logout);
  const [booting, setBooting] = React.useState(true);

  React.useEffect(() => {
    const bootstrap = async () => {
      await hydrate();

      try {
        const currentToken = useAuthStore.getState().token;
        if (!currentToken) {
          setBooting(false);
          return;
        }

        const me = await authApi.me();
        await setAuth(currentToken, me);
      } catch {
        await logout();
        await setUser(null);
      } finally {
        setBooting(false);
      }
    };

    bootstrap();
  }, [hydrate, logout, setAuth, setUser]);

  if (!hydrated || booting) {
    return <MLoading />;
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {token ? (
        <Stack.Screen
          name="InspectionNavigation"
          component={InspectionNavigation}
        />
      ) : (
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

export default MainNavigation;
