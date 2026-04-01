import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InspectionListScreen from '../screens/inspection/InspectionListScreen';
import InspectionDetailScreen from '../screens/inspection/InspectionDetailScreen';
import DamageFormScreen from '../screens/inspection/DamageFormScreen';
import { InspectionStackParamList } from '../types/navigations/inspection-navigation';

const Stack = createNativeStackNavigator<InspectionStackParamList>();

const InspectionNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="InspectionListScreen"
        component={InspectionListScreen}
        options={{ title: 'Danh sách giám định' }}
      />
      <Stack.Screen
        name="InspectionDetailScreen"
        component={InspectionDetailScreen}
        options={{ title: 'Chi tiết giám định' }}
      />
      <Stack.Screen
        name="DamageFormScreen"
        component={DamageFormScreen}
        options={{ title: 'Hư hỏng' }}
      />
    </Stack.Navigator>
  );
};

export default InspectionNavigation;