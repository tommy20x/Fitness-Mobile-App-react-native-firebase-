import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Signup from './Screens/Signup';

import UserInputName from './Screens/UserInputName';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Acerca de ti (Nombre)" component={UserInputName} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}