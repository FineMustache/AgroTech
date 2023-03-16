import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import Veiculo from "../../components/Veiculo";
import {Picker} from '@react-native-picker/picker';
import { AntDesign } from '@expo/vector-icons';
import { useFonts, Kanit_200ExtraLight, Kanit_400Regular, Kanit_700Bold} from '@expo-google-fonts/kanit';

const Veiculos = () => {
  const [veic, setVeic] = React.useState([])
  const [modalOn, setModalOn] = React.useState(false)
  const [placa, setPlaca] = React.useState("")
  const [modelo, setModelo] = React.useState("")
  const [marca, setMarca] = React.useState("")
  const [tipo, setTipo] = React.useState('carga')
  const [selectedId, setSelectedId] = React.useState()
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    carregar()
  }, [])

  const carregar = () => {
    const options = {method: 'GET', headers: {'Bypass-Tunnel-Reminder': 1}};

    fetch('http://localhost:3000/agrotech/veiculos', options)
    .then(response => response.json())
    .then(response => setVeic(response))
    .catch(err => console.log(err))
  }

  const showEdit = (v) => {
    setPlaca(v.placa)
    setModelo(v.modelo)
    setMarca(v.marca)
    setTipo(v.tipo)
    setSelectedId(v.id)
    setModalOn(true)
  }

  const excluir = (id) => {
    setIsLoading(true);
    
    const options = {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json', 'Bypass-Tunnel-Reminder': 1},
      body: `{"id":${id}}`
    };
    
    fetch('http://localhost:3000:3000/agrotech/veiculos', options)
      .then(response => response.json())
      .then(response => {
        setModalOn(false)
        carregar()
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }

  const editar = (id) => {
    setIsLoading(true);
    
    const options = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json', 'Bypass-Tunnel-Reminder': 1},
      body: `{"id":${id},"placa":"${placa}","modelo":"${modelo}", "marca": "${marca}","tipo":"${tipo}"}`
    };
    
    fetch('http://localhost:3000/agrotech/veiculos', options)
      .then(response => response.json())
      .then(response => {
        setModalOn(false)
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
      <View style={{height: '100%', backgroundColor: "rgba(0,0,0,.5)", width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 5, display: modalOn ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center'}}>
      {isLoading && <ActivityIndicator size="large" color="white" />}
      {!isLoading &&
        <View style={{backgroundColor: 'white', padding: 10, paddingTop: 40, position: 'relative', width: '75%'}}>
          <View style={{position: 'absolute', width: '100%', height: 30, backgroundColor: '#002647',top: 0, left: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingHorizontal: 5}}>
            <TouchableOpacity onPress={() => setModalOn(false)}>
              <AntDesign name="close" size={18} color="white" />
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', marginBottom: 10, alignItems: 'center', width: '100%', display: 'flex', justifyContent: 'center'}}>
            <Text style={{marginRight: 5, fontFamily: 'Kanit_400Regular'}}>PLACA:</Text>
            <TextInput onChangeText={(value) => setPlaca(value)} value={placa} style={{borderBottomWidth: 1, borderBottomColor: 'black', width: '75%', padding: 5, fontFamily: 'Kanit_400Regular'}} />
          </View>
          <View style={{flexDirection: 'row', marginBottom: 10, alignItems: 'center', width: '100%', display: 'flex', justifyContent: 'center'}}>
            <Text style={{marginRight: 5, fontFamily: 'Kanit_400Regular'}}>MODELO:</Text>
            <TextInput onChangeText={(value) => setModelo(value)} value={modelo} style={{borderBottomWidth: 1, borderBottomColor: 'black', width: '68%', padding: 5, fontFamily: 'Kanit_400Regular'}} />
          </View>
          <View style={{flexDirection: 'row', marginBottom: 10, alignItems: 'center', width: '100%', display: 'flex', justifyContent: 'center'}}>
            <Text style={{marginRight: 5, fontFamily: 'Kanit_400Regular'}}>MARCA:</Text>
            <TextInput onChangeText={(value) => setMarca(value)} value={marca} style={{borderBottomWidth: 1, borderBottomColor: 'black', width: '72%', padding: 5, fontFamily: 'Kanit_400Regular'}} />
          </View>
          <Picker style={{padding: 5}}
            selectedValue={tipo}
            onValueChange={(itemValue, itemIndex) =>
              setTipo(itemValue)
            }
          >
            <Picker.Item style={{fontFamily: 'Kanit_400Regular'}} label="Carga" value="carga" />
            <Picker.Item style={{fontFamily: 'Kanit_400Regular'}} label="Vendas" value="vendas" />
            <Picker.Item style={{fontFamily: 'Kanit_400Regular'}} label="Visita" value="visita" />
          </Picker>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
            <TouchableOpacity onPress={() => setModalOn(false)} style={{borderColor: '#002647', borderWidth: 1, paddingVertical: 5, paddingHorizontal: 10}}>
              <Text style={{color: "#002647", fontSize: 15, fontFamily: 'Kanit_400Regular'}}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => excluir(selectedId)} style={{borderColor: 'rgb(165, 0, 0)', backgroundColor: 'rgb(165, 0, 0)', borderWidth: 1, paddingVertical: 5, paddingHorizontal: 10}}>
              <Text style={{color: 'white', fontSize: 15, fontFamily: 'Kanit_400Regular'}}>Excluir</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => editar(selectedId)} style={{borderColor: '#002647', borderWidth: 1, backgroundColor: '#002647', paddingVertical: 5, paddingHorizontal: 10}}>
              <Text style={{color: 'white', fontSize: 15, fontFamily: 'Kanit_400Regular'}}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
        
      </View>
      <View style={{display: 'flex', width: '100%', flexDirection: 'row', padding: 10, backgroundColor: "#002647"}}>
        <View style={{width: '20%'}}>
          <Text style={{color: 'white', textAlign: 'center', fontFamily: 'Kanit_400Regular'}}>Placa</Text>
        </View>
        <View style={{width: '25%'}}>
          <Text style={{color: 'white', textAlign: 'center', fontFamily: 'Kanit_400Regular'}}>Modelo</Text>
        </View>
        <View style={{width: '24%'}}>
          <Text style={{color: 'white', textAlign: 'center', fontFamily: 'Kanit_400Regular'}}>Marca</Text>
        </View>
        <View style={{width: '18%'}}>
          <Text style={{color: 'white', textAlign: 'center', fontFamily: 'Kanit_400Regular'}}>Tipo</Text>
        </View>
        <View style={{width: '15%'}}>
          <Text style={{color: 'white', textAlign: 'center', fontFamily: 'Kanit_400Regular'}}>Disp.</Text>
        </View>
      </View>
      <ScrollView style={{flex: 1}}>
        {veic.map((v, index) => {
          return(
            <Veiculo key={index} v={v} onPress={showEdit}/>
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

export default Veiculos;
