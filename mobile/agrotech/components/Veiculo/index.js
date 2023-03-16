import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useFonts, Kanit_200ExtraLight, Kanit_400Regular, Kanit_700Bold} from '@expo-google-fonts/kanit';

import { MaterialIcons } from '@expo/vector-icons';

const Veiculo = (props) => {
  const {v, onPress} = props

  let [fontsLoaded] = useFonts({
    Kanit_400Regular,
    Kanit_200ExtraLight,
    Kanit_700Bold
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ marginBottom: 5, shadowColor: "rgb(0,0,0)"}}>
      <Swipeable
        renderRightActions={() => (
          <TouchableOpacity style={styles.swipeableAction}>
            <Text>
            <MaterialIcons name="edit" size={24} color="white" onPress={() => onPress(v)} />
            </Text>
          </TouchableOpacity>
        )}
      >
        <View style={styles.swipeableItem}>
          <View style={{width: '20%'}}>
            <Text style={{textAlign: 'center', fontFamily: 'Kanit_400Regular'}}>{v.placa}</Text>
          </View>
          <View style={{width: '25%'}}>
            <Text style={{textAlign: 'center', fontFamily: 'Kanit_400Regular'}}>{v.modelo}</Text>
          </View>
          <View style={{width: '24%'}}>
            <Text style={{textAlign: 'center', fontFamily: 'Kanit_400Regular'}}>{v.marca}</Text>
          </View>
          <View style={{width: '18%'}}>
            <Text style={{textAlign: 'center', fontFamily: 'Kanit_400Regular'}}>{v.tipo.slice(0,1).toUpperCase() + v.tipo.slice(1)}</Text>
          </View>
          <View style={{width: '15%'}}>
            <Text style={{textAlign: 'center', fontFamily: 'Kanit_400Regular'}}>
              {v.disponivel && <MaterialIcons name="check-circle" size={24} color="green" />}
              {!v.disponivel && <MaterialIcons name="cancel" size={24} color="red" />}
            </Text>
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
    height: 50,
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

export default Veiculo;
