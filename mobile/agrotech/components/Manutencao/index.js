import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useFonts, Kanit_200ExtraLight, Kanit_400Regular, Kanit_700Bold} from '@expo-google-fonts/kanit';

import { MaterialIcons } from '@expo/vector-icons';

const Manutencao = (props) => {
  const {u, m, onPress} = props
  console.log(props)

  let [fontsLoaded] = useFonts({
    Kanit_400Regular,
    Kanit_200ExtraLight,
    Kanit_700Bold
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ marginBottom: 5, shadowColor: "rgb(0,0,0)", opacity: m.data_fim ? .5 : 1}}>
      <Swipeable
        renderRightActions={() => {
          if (m.data_fim) {
            return(null)
          } else {
            if (u.tipo == 'gerente') {
              return(
                <TouchableOpacity style={{...styles.swipeableAction,}}>
                  <Text>
                  <MaterialIcons name="check" size={24} color="white" onPress={() => onPress(m.id, m.veiculo.id)} />
                  </Text>
                </TouchableOpacity>
              )
            } else {
              return(null)
            }
            
          }
          }}
      >
        <View style={styles.swipeableItem}>
          <View>
            <Text style={{color: "#002647", fontWeight: 'bold', fontFamily: 'Kanit_400Regular'}}>Placa: <Text style={{color: "#555", fontWeight: '400'}}>{m.veiculo.placa}</Text></Text>
            <Text style={{color: "#002647", fontWeight: 'bold', fontFamily: 'Kanit_400Regular'}}>Descrição: <Text style={{color: "#555", fontWeight: '400'}}>{m.descricao}</Text></Text>
            <Text style={{color: "#002647", fontWeight: 'bold', fontFamily: 'Kanit_400Regular'}}>Data Início: <Text style={{color: "#555", fontWeight: '400'}}>{new Date(m.data_inicio).toLocaleString('pt-br')}</Text></Text>
            <Text style={{color: "#002647", fontWeight: 'bold', fontFamily: 'Kanit_400Regular'}}>Data Fim: <Text style={{color: "#555", fontWeight: '400'}}>{m.data_fim ? new Date(m.data_fim).toLocaleString('pt-br') : "-"}</Text></Text>
            <Text style={{color: "#002647", fontWeight: 'bold', fontFamily: 'Kanit_400Regular'}}>Valor: <Text style={{color: "#555", fontWeight: '400'}}>R$ {parseFloat(m.valor).toFixed(2).replace('.',',')}</Text></Text>
          </View>
        </View>
      </Swipeable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  swipeableItem: {
    backgroundColor: "#fff",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    // height: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  swipeableAction: {
    backgroundColor: "#002647",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    display: "flex",
  },
});

export default Manutencao;
