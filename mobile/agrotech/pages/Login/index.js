import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFonts, Kanit_200ExtraLight, Kanit_400Regular, Kanit_700Bold} from '@expo-google-fonts/kanit';
import { TextInput } from 'react-native';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';

const colors = {
    "gray": "#201f1d",
    "darkGray": "#161614",
    "lightGray": '#868686',
    "yellow": '#c4a000',
    "white": '#ffffff'
}

function TextOS(props) {
    const { texto, style } = props
    return(
        <Text style={{...style, color: '#ffffff', fontFamily: 'Kanit_400Regular'}}>{texto}</Text>
    )
}

const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('@uinfo', jsonValue)
  } catch (e) {
    console.log(e);
  }
}

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@uinfo')
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    console.log(e);
  }
}

export default function LoginScreen({navigation}) {
    const [errOn, setErrOn] = React.useState(false)
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(false);

    // This function will be triggered when the button is pressed

      const logar = () => {
        if (username.length > 0 && password.length > 0) {
            setIsLoading(true);
            const options = {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'Bypass-Tunnel-Reminder': 1},
                body: `{"email":"${username}","senha":"${password}"}`
            };
            
            fetch('http://localhost:3000/agrotech/login', options)
                .then(response => response.json())
                .then(response => {
                    if (response.validation) {
                        storeData(response).then(
                            navigation.navigate('Home')
                        )
                    }else{
                        setErrOn(true)
                    }
                    
                })
                .catch(err => console.log(err))
                .finally(() => setIsLoading(false));
        }
        
    }
      
    let [fontsLoaded] = useFonts({
      Kanit_400Regular,
      Kanit_200ExtraLight,
      Kanit_700Bold
    });
  
    if (!fontsLoaded) {
      return null;
    }

    return (
      <View style={styles.container}>
        <View style={{alignItems: 'center', paddingVertical: 20, flexDirection: 'row', width: "100%", justifyContent: 'center', backgroundColor: '#002647'}}>
          <Text><FontAwesome5 name="seedling" size={34} color="white" /></Text>
          <Text style={{fontSize: 25, marginLeft: 10, color: 'white', fontFamily: 'Kanit_400Regular'}}>AgroTech</Text>
        </View>
        <View style={styles.login}>
            <TextInput placeholder={"Usuário"} style={styles.input} placeholderTextColor={"#758594"} onChangeText={(val) => { setUsername(val)}}/>
            <TextInput secureTextEntry={true} placeholder={"Senha"} style={styles.input} placeholderTextColor={"#758594"} onChangeText={(val) => {setPassword(val)}}/>
            <Text style={{...styles.font, color: '#a00', marginTop: 20, display: errOn ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', width: '100%'}}>Credenciais Inválidas</Text>
            <TouchableOpacity onPress={() => logar()} style={styles.cta}>
            <View>
              {isLoading && <ActivityIndicator size="small" color="white" />}
              {!isLoading && <TextOS texto="Entrar" style={{textAlign: 'center'}} />}
            </View>
                
            </TouchableOpacity>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
    'container': {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#c9d8e6",
        padding: 50
    },
    'login': {
        display: 'flex',
        alignContent: 'center',
        backgroundColor: 'white',
        width: '100%',
        padding: 25
    },
    'input':{
        padding: 10,
        color: 'black',
        width: '100%',
        borderColor: "#002647",
        borderWidth: 1,
        borderStyle: 'solid',
        marginBottom: 10,
        fontFamily: 'Kanit_400Regular'
    },
    'cta':{
        padding: 10,
        width: "100%",
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        borderColor: "#002647",
        backgroundColor: "#002647",
        borderWidth: 1,
        marginTop: 25
    },
    'white':{
        color: '#ffffff'
    },
    'font': {
        fontFamily: 'Kanit_400Regular'
    }
})