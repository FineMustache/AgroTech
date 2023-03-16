import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import Manutencao from "../../components/Manutencao";
import {Picker} from '@react-native-picker/picker';
import { AntDesign } from '@expo/vector-icons';

const Manutencoes = () => {
  const [manO, setManO] = React.useState([])
  const [man, setMan] = React.useState([])
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
    const options = {method: 'GET'};

    fetch('http://localhost:3000/agrotech/manutencoes', options)
    .then(response => response.json())
    .then(response => {
      let aux = []
      let auxO = []
      response.forEach(m => {
        if (m.data_fim) {
          aux.push(m)
        } else {
          auxO.push(m)
        }
      })
      setMan(aux)
      setManO(auxO)
    })
    .catch(err => console.log(err))
  }

  const excluir = (id) => {
    setIsLoading(true);
    
    const options = {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: `{"id":${id}}`
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

  const cadastrar = (id) => {
    setIsLoading(true);
    
    const options = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
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
            <Text style={{marginRight: 5}}>MODELO:</Text>
            <TextInput onChangeText={(value) => setModelo(value)} value={modelo} style={{borderBottomWidth: 1, borderBottomColor: 'black', width: '68%', padding: 5}} />
          </View>
          <View style={{flexDirection: 'row', marginBottom: 10, alignItems: 'center', width: '100%', display: 'flex', justifyContent: 'center'}}>
            <Text style={{marginRight: 5}}>MARCA:</Text>
            <TextInput onChangeText={(value) => setMarca(value)} value={marca} style={{borderBottomWidth: 1, borderBottomColor: 'black', width: '72%', padding: 5}} />
          </View>
          <Picker style={{padding: 5}}
            selectedValue={tipo}
            onValueChange={(itemValue, itemIndex) =>
              setTipo(itemValue)
            }
          >
            <Picker.Item label="Carga" value="carga" />
            <Picker.Item label="Vendas" value="vendas" />
            <Picker.Item label="Visita" value="visita" />
          </Picker>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
            <TouchableOpacity onPress={() => setModalOn(false)} style={{borderColor: '#002647', borderWidth: 1, paddingVertical: 5, paddingHorizontal: 10}}>
              <Text style={{color: "#002647", fontSize: 15}}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => excluir(selectedId)} style={{borderColor: 'rgb(165, 0, 0)', backgroundColor: 'rgb(165, 0, 0)', borderWidth: 1, paddingVertical: 5, paddingHorizontal: 10}}>
              <Text style={{color: 'white', fontSize: 15}}>Excluir</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => editar(selectedId)} style={{borderColor: '#002647', borderWidth: 1, backgroundColor: '#002647', paddingVertical: 5, paddingHorizontal: 10}}>
              <Text style={{color: 'white', fontSize: 15}}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
        
      </View>
      <ScrollView style={{flex: 1}}>
        <View style={{alignItems: 'flex-start', marginBottom: 10}}>
          <Text style={{fontSize: 20}}>Em Aberto</Text>
        </View>
        {manO.map((m, index) => {
          return(
            <Manutencao key={index} m={m} onPress={setModalOn}/>
          )
        })}
        <View style={{width: '100%', height: 1, backgroundColor: "#002647", marginVertical: 10}}></View>
        {man.map((m, index) => {
          return(
            <Manutencao key={index} m={m} onPress={setModalOn}/>
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

export default Manutencoes;
