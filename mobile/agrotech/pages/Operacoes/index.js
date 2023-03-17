import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import Operacao from "../../components/Operacao";
import {Picker} from '@react-native-picker/picker';
import { AntDesign } from '@expo/vector-icons';
import { useFonts, Kanit_200ExtraLight, Kanit_400Regular, Kanit_700Bold} from '@expo-google-fonts/kanit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Operacoes = () => {
  const [opO, setManO] = React.useState([])
  const [op, setMan] = React.useState([])
  const [modalOn, setModalOn] = React.useState(false)
  const [placa, setPlaca] = React.useState("")
  const [modelo, setModelo] = React.useState("")
  const [marca, setMarca] = React.useState("")
  const [tipo, setTipo] = React.useState('carga')
  const [selectedId, setSelectedId] = React.useState()
  const [isLoading, setIsLoading] = React.useState(false)
  const [u, setU] = React.useState({})

  React.useEffect(() => {
    getData().then(aux => setU(aux))
  }, [])

  React.useEffect(() => {
    carregar()
  }, [u])

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@uinfo')
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      console.log(e);
    }
  }

  const carregar = () => {
    const options = {method: 'GET', headers: {'Bypass-Tunnel-Reminder': 1}};

    fetch('http://localhost:3000/agrotech/operacoes', options)
    .then(response => response.json())
    .then(response => {
      let aux = []
      let auxO = []
      response.forEach(o => {
        if (o.data_retorno) {
          aux.push(o)
        } else {
          auxO.push(o)
        }
      })
      setMan(aux)
      setManO(auxO)
    })
    .catch(err => console.log(err))
  }

  const finalizar = (id, v, m) => {
    setIsLoading(true);
    
    const options = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json','Bypass-Tunnel-Reminder': 1},
      body: `{"id":${id}, "id_veiculo":${v}, "id_motorista":${m}}`
    };
    
    fetch('http://localhost:3000/agrotech/operacoes/finalizar', options)
      .then(response => response.json())
      .then(response => {
        carregar()
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
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
    <View style={{flex: 1, backgroundColor: "#c9d8e6", padding: 10 ,position: 'relative'}}>
      <View style={{height: '100%', backgroundColor: "rgba(0,0,0,.5)", width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 5, display: isLoading ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator size="large" color="white" />
      </View>
      <ScrollView style={{flex: 1}}>
        <View style={{alignItems: 'flex-start', marginBottom: 10}}>
          <Text style={{fontSize: 20, fontFamily: 'Kanit_400Regular'}}>Em Aberto</Text>
        </View>
        {opO.length == 0 && 
          <Text style={{color: "#555", fontFamily: 'Kanit_400Regular'}}>Nenhuma Operação em Aberto</Text>
        }
        {opO.map((o, index) => {
          return(
            <Operacao u={u} key={index} o={o} onPress={finalizar}/>
          )
        })}
        <View style={{width: '100%', height: 1, backgroundColor: "#002647", marginVertical: 10}}></View>
        {op.map((o, index) => {
          return(
            <Operacao u={u} key={index} o={o} onPress={() => {}}/>
          )
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  selectedItemTextStyle: {
    color: "white",
    fontWeight: "bold",
  },
  itemStyle: {
    backgroundColor: "black",
    color: "black",
  },
});

export default Operacoes;
