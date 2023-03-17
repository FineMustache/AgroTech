// In App.js in a new project

import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5, MaterialCommunityIcons, Entypo, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, Kanit_200ExtraLight, Kanit_400Regular, Kanit_700Bold} from '@expo-google-fonts/kanit';
import LoginScreen from './pages/Login';
import Motoristas from './pages/Veiculos';
import Manutencoes from './pages/Manutencoes';
import Operacoes from './pages/Operacoes';

const Tab = createBottomTabNavigator();

function Home({navigation}) {
  const [mhOn, setMhOn] = React.useState(false)
  const [uinfo, setUinfo] = React.useState({})
  
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@uinfo')
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      console.log(e);
    }
  }


  React.useEffect(() => {
    getData().then(u => setUinfo(u))
  }, [])

  let [fontsLoaded] = useFonts({
    Kanit_400Regular,
    Kanit_200ExtraLight,
    Kanit_700Bold
  });

  if (!fontsLoaded) {
    return null;
  }

  
  const deslogar = async () =>{
    try {
      await AsyncStorage.removeItem('@uinfo')
      setMhOn(false)
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } catch (e) {
      console.log(e);
      setMhOn(true)
    }
  }
  return (
      <Tab.Navigator initialRouteName='Veículos' screenOptions={{headerStyle: {backgroundColor: '#002647', borderBottomColor: '#002647'}, headerTitleStyle:{fontFamily: 'Kanit_400Regular'}, tabBarStyle:{backgroundColor: '#002647'}, tabBarActiveTintColor:'white', tabBarInactiveTintColor:'rgba(255,255,255,.5)', tabBarLabel:"", headerRight: ({tintColor, pressColor, pressOpacity}) =>{
        return(
          <View style={{position: 'relative', marginRight: 10}}>
            <TouchableOpacity onPress={() => setMhOn(!mhOn)}><Entypo name="menu" size={24} color="white" /></TouchableOpacity>
            <View style={{display: mhOn ? 'flex' : 'none', position: 'absolute', top: '100%', right: 0, padding:10, backgroundColor: 'white', shadowColor: 'black', shadowOffset: 0, shadowOpacity: .5, shadowRadius: 10, alignItems:'center'}}>
              <Text numberOfLines={1} style={{fontFamily: 'Kanit_400Regular', fontSize: 20}}>{uinfo.uname}</Text>
              <Text numberOfLines={1} style={{fontFamily: 'Kanit_400Regular', fontSize: 14, color: '#555'}}>{uinfo.tipo.slice(0,1).toUpperCase() + uinfo.tipo.slice(1)}</Text>
              <TouchableOpacity onPress={() => deslogar()} style={{paddingHorizontal: 15, paddingVertical: 10, backgroundColor: "#a00", flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 10}}>
                <Text style={{fontSize: 20, color: "white", fontFamily: 'Kanit_400Regular'}}>Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
          
        )
      }}}>
        <Tab.Screen options={{headerTitleStyle: {color: '#ffffff'}, tabBarIcon: ({focused, color, size}) => <FontAwesome5 name="tools" size={focused ? size-1 : size-3} color={color} />}} name="Manutenções" component={Manutencoes} />
        <Tab.Screen options={{headerTitleStyle: {color: '#ffffff'}, tabBarIcon: ({focused, color, size}) => <FontAwesome5 name="car-alt" size={focused ? size+2 : size} color={color} />}} name="Veículos" component={Motoristas} />
        <Tab.Screen options={{headerTitleStyle: {color: '#ffffff'}, tabBarIcon: ({focused, color, size}) => <MaterialCommunityIcons name="account-hard-hat" size={focused ? size+4 : size+2} color={color} />}} name="Operações" component={Operacoes} />
        {/* <Drawer.Screen options={{headerTitleStyle: {color: '#ffffff'}, drawerLabelStyle: {color: "#ffffff"}, drawerStyle: {backgroundColor: '#161614'}, drawerActiveBackgroundColor: '#c4a000', drawerActiveTintColor: '#000000'}} name="Perfil" component={ProfileScreen} /> */}
      </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName='Login' screenOptions={{headerStyle: {backgroundColor: '#002647', borderBottomColor: '#002647'}, headerBackVisible: false, headerBackButtonMenuEnabled: false}}>
        <Stack.Screen options={{headerTitleStyle: {color: '#ffffff'}, headerShown: false}} name="Home" component={Home}  />
        <Stack.Screen options={{headerTitleStyle: {color: '#ffffff'}, headerShown: false}} name="Login" component={LoginScreen}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}