// In App.js in a new project

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import LoginScreen from './pages/Login';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator screenOptions={{headerStyle: {backgroundColor: '#002647', borderBottomColor: '#002647'}}}>
        {/* <Stack.Screen options={{headerTitleStyle: {color: '#ffffff'}, headerShown: false}} name="Home" component={Home}  /> */}
        <Stack.Screen options={{headerTitleStyle: {color: '#ffffff'}}} name="Login" component={LoginScreen}  />
        {/* <Stack.Screen options={{headerTitleStyle: {color: '#ffffff'}}} name="Cadastro" component={SignUpScreen}  />
        <Stack.Screen options={{headerTitleStyle: {color: '#ffffff'}}} name="Post" component={PostScreen}  /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}