import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { FontAwesome5 } from "@expo/vector-icons";

const Veiculo = (props) => {
  console.log(props);
  return (
    <View style={{ marginBottom: 5 }}>
      <Swipeable
        renderRightActions={() => (
          <TouchableOpacity style={styles.swipeableAction}>
            <Text>
              <FontAwesome5 name="trash" size={24} color="white" />
            </Text>
          </TouchableOpacity>
        )}
      >
        <View style={styles.swipeableItem}>
          <Text>OLDRICANDALAHAI</Text>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    height: 50,
  },
  swipeableAction: {
    backgroundColor: "#d00",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    display: "flex",
  },
});

export default Veiculo;
