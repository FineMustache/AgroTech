import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";

import { MaterialIcons } from '@expo/vector-icons';

const Manutencao = (props) => {
  const {m, onPress} = props

  return (
    <View style={{ marginBottom: 5, shadowColor: "rgb(0,0,0)", opacity: m.data_fim ? .5 : 1}}>
      <Swipeable
        renderRightActions={() => {
          if (m.data_fim) {
            return(null)
          } else {
            return(
              <TouchableOpacity disabled={m.data_fim ? true : false} style={{...styles.swipeableAction,}}>
                <Text>
                <MaterialIcons name="check" size={24} color="white" onPress={() => onPress(true)} />
                </Text>
              </TouchableOpacity>
            )
          }
          }}
      >
        <View style={styles.swipeableItem}>
          <View>
            <Text>Placa: <Text>{m.veiculo.placa}</Text></Text>
            <Text>Descrição: <Text>{m.descricao}</Text></Text>
            <Text>Data Início: <Text>{new Date(m.data_inicio).toLocaleString('pt-br')}</Text></Text>
            <Text>Data Fim: <Text>{m.data_fim ? new Date(m.data_fim).toLocaleString('pt-br') : "-"}</Text></Text>
            <Text>Valor: <Text>R$ {parseFloat(m.valor).toFixed(2).replace('.',',')}</Text></Text>
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
