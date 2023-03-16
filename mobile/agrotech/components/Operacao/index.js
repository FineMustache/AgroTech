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

const Operacao = (props) => {
  const {o, onPress} = props

  let [fontsLoaded] = useFonts({
    Kanit_400Regular,
    Kanit_200ExtraLight,
    Kanit_700Bold
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ marginBottom: 5, shadowColor: "rgb(0,0,0)", opacity: o.data_retorno ? .5 : 1}}>
      <Swipeable
        renderRightActions={() => {
          if (o.data_retorno) {
            return(null)
          } else {
            return(
              <TouchableOpacity style={{...styles.swipeableAction,}}>
                <Text>
                <MaterialIcons name="check" size={24} color="white" onPress={() => onPress(o.id, o.veiculo.id, o.motorista.id)} />
                </Text>
              </TouchableOpacity>
            )
          }
          }}
      >
        <View style={styles.swipeableItem}>
          <View>
            <Text style={{color: "#002647", fontWeight: 'bold', fontFamily: 'Kanit_400Regular'}}>Placa: <Text style={{color: "#555", fontWeight: '400'}}>{o.veiculo.placa}</Text></Text>
            <Text style={{color: "#002647", fontWeight: 'bold', fontFamily: 'Kanit_400Regular'}}>Valor: <Text style={{color: "#555", fontWeight: '400'}}>{o.motorista.nome}</Text></Text>
            <Text style={{color: "#002647", fontWeight: 'bold', fontFamily: 'Kanit_400Regular'}}>Descrição: <Text style={{color: "#555", fontWeight: '400'}}>{o.descricao}</Text></Text>
            <Text style={{color: "#002647", fontWeight: 'bold', fontFamily: 'Kanit_400Regular'}}>Data Início: <Text style={{color: "#555", fontWeight: '400'}}>{new Date(o.data_saida).toLocaleString('pt-br')}</Text></Text>
            <Text style={{color: "#002647", fontWeight: 'bold', fontFamily: 'Kanit_400Regular'}}>Data Fim: <Text style={{color: "#555", fontWeight: '400'}}>{o.data_retorno ? new Date(o.data_retorno).toLocaleString('pt-br') : "-"}</Text></Text>
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

export default Operacao;
