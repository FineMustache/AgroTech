// In App.js in a new project

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

import LoginScreen from './pages/Login';
import Motoristas from './pages/Veiculos';
import Manutencoes from './pages/Manutencoes';

const Tab = createBottomTabNavigator();

function Home() {
  return (
      <Tab.Navigator initialRouteName='Manutenções' screenOptions={{headerStyle: {backgroundColor: '#002647', borderBottomColor: '#002647'}, tabBarStyle:{backgroundColor: '#002647'}, tabBarActiveTintColor:'white', tabBarInactiveTintColor:'rgba(255,255,255,.5)', tabBarLabel:""}}>
        <Tab.Screen options={{headerTitleStyle: {color: '#ffffff'}, tabBarIcon: ({focused, color, size}) => <MaterialCommunityIcons name="account-hard-hat" size={focused ? size+4 : size+2} color={color} />}} name="Manutenções" component={Manutencoes} />
        <Tab.Screen options={{headerTitleStyle: {color: '#ffffff'}, tabBarIcon: ({focused, color, size}) => <FontAwesome5 name="car-alt" size={focused ? size+2 : size} color={color} />}} name="Veículos" component={Motoristas} />
        <Tab.Screen options={{headerTitleStyle: {color: '#ffffff'}, tabBarIcon: ({focused, color, size}) => <FontAwesome5 name="tools" size={focused ? size-1 : size-3} color={color} />}} name="Operações" component={Motoristas} />
        {/* <Drawer.Screen options={{headerTitleStyle: {color: '#ffffff'}, drawerLabelStyle: {color: "#ffffff"}, drawerStyle: {backgroundColor: '#161614'}, drawerActiveBackgroundColor: '#c4a000', drawerActiveTintColor: '#000000'}} name="Perfil" component={ProfileScreen} /> */}
      </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator screenOptions={{headerStyle: {backgroundColor: '#002647', borderBottomColor: '#002647'}}}>
        <Stack.Screen options={{headerTitleStyle: {color: '#ffffff'}, headerShown: false}} name="Home" component={Home}  />
        <Stack.Screen options={{headerTitleStyle: {color: '#ffffff'}}} name="Login" component={LoginScreen}  />
        {/* <Stack.Screen options={{headerTitleStyle: {color: '#ffffff'}}} name="Cadastro" component={SignUpScreen}  />
        <Stack.Screen options={{headerTitleStyle: {color: '#ffffff'}}} name="Post" component={PostScreen}  /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}