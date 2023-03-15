import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Veiculo from "../../components/Veiculo";

const Veiculos = () => {
  return (
    <View style={{flex: 1, backgroundColor: "#c9d8e6"}}>
      <View style={{display: 'flex', width: '100%', flexDirection: 'row'}}>
        <View style={{width: '10%'}}>
          <Text>Placa</Text>
        </View>
        <View style={{width: '10%'}}>
          <Text>Modelo</Text>
        </View>
        <View style={{width: '10%'}}>
          <Text>Marca</Text>
        </View>
        <View style={{width: '10%'}}>
          <Text>Tipo</Text>
        </View>
        <View style={{width: '10%'}}>
          <Text>Disponibilidade</Text>
        </View>
      </View>
      <ScrollView style={{flex: 1, padding: 10}}>
        <Veiculo />
        <Veiculo />
        <Veiculo />
        <Veiculo />
        <Veiculo /><Veiculo />

        <Veiculo /><Veiculo />
        <Veiculo />

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({

});

export default Veiculos;
