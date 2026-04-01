import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import InspectionListScreen from '../screens/inspection/InspectionListScreen';
import InspectionDetailScreen from '../screens/inspection/InspectionDetailScreen';

export type RootStackParamList = {
  InspectionList: undefined;
  InspectionDetail: {inspectionId?: number} | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="InspectionList"
        screenOptions={{
          headerShadowVisible: false,
          headerTitleAlign: 'center',
        }}>
        <Stack.Screen
          name="InspectionList"
          component={InspectionListScreen}
          options={{title: 'Danh sách giám định'}}
        />
        <Stack.Screen
          name="InspectionDetail"
          component={InspectionDetailScreen}
          options={{title: 'Chi tiết giám định'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
