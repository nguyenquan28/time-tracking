import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function perssit() {
  const [Data, setData] = useState("...");

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem("@storage_Key", value);
      setData(value);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(async () => {
    try {
      const data = await AsyncStorage.getItem("@storage_Key");
      if (data !== null) {
        setData(data);
        console.log(data);
      }
    } catch (e) {
      console.log(e);
    }
  }, [Data]);

  return (
    <View>
      <Text> {Data}</Text>

      <TouchableOpacity
        style={styles.but}
        onPress={() => {
          storeData(" thoong chot");
        }}
      >
        <Text>set storage</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.but}
        onPress={() => {
          getData();
        }}
      >
        <Text>get storage</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  but: {
    padding: 30,
    backgroundColor: "#4234",
  },
});
