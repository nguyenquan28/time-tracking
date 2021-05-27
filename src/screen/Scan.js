import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Animated,
  Image,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import Icon from "react-native-vector-icons/dist/FontAwesome";
import { RSA } from "react-native-rsa-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Scan() {
  const image =
    "https://cdn.dribbble.com/users/2364329/screenshots/4809566/dribbble-21.jpg?compress=1&resize=400x300";
  const axios = require("axios");
  const [UserToken, setUserToken] = useState();
  const [Content, setContent] = useState("");
  const [TimeChecked, setTimeChecked] = useState();
  const [IsShowCam, setIsShowCam] = useState(false);
  const tickAnim = useRef(new Animated.Value(0)).current;
  const scanAnim = useRef(new Animated.Value(0)).current; //
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const fadeCamAnim = useRef(new Animated.Value(1)).current; //
  const fadeBoxAnim = useRef(new Animated.Value(150)).current;
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  useEffect(async () => {
    const token = await AsyncStorage.getItem("@userToken");
    const content = await AsyncStorage.getItem("@isCheck");
    const timechecked = await AsyncStorage.getItem("@timeChecked");
    setUserToken(token);
    setContent(content);
    setTimeChecked(timechecked);
  }, []);

  // set store checkIn checkOut
  const setStoreChecked = async (content, time) => {
    try {
      await AsyncStorage.setItem("@isCheck", content);
      await AsyncStorage.setItem("@timeChecked", time);
    } catch (e) {
      console.log(e);
    }
  };

  // api save time
  const apiSaveTime = (timeParam) => {
    axios({
      method: "POST",
      url: "https://time-tracking.dev.lekhanhtech.org/api/auth/save-time-tracking-qr",
      data: { time: timeParam },
      headers: {
        Authorization: `Bearer ${UserToken}`,
      },
    })
      .then((response) => {
        setContent(response.data.message);
        setTimeChecked(timeParam);
        setStoreChecked(response.data.message, timeParam);
        //animation camera check ok
        compareAnim();
        setTimeout(hiddenCam, 2000);
        setTimeout(() => {
          Animated.timing(tickAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: false,
          }).start();
          Animated.timing(fadeBoxAnim, {
            toValue: 150,
            duration: 500,
            useNativeDriver: false,
          }).start();
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 50,
            useNativeDriver: false,
          }).start();
        }, 3000);
      })
      .catch((error) => {
        console.log("error");
        Alert.alert("Warning", "Invalid QR, please try again!", [
          { text: "OK", onPress: () => setTimeout(hiddenCam, 200) },
        ]);
      });
  };
  // decryption
  const decryption = (dataQr, key) => {
    RSA.decrypt(dataQr, key).then((decryptedMessage) => {
      if (decryptedMessage !== undefined) {
        apiSaveTime(decryptedMessage);
      } else {
        alert("Invalid QR, please try again!");
      }
    });
  };

  const apiKey = (dataQr) => {
    if (dataQr === "" || dataQr === null) {
      Alert.alert("Warning", "Invalid QR, please try again!", [
        { text: "OK", onPress: () => setTimeout(hiddenCam, 200) },
      ]);
    } else {
      //cut string to get data and device name
      const qrString = dataQr.split(/[|]+/)[0];
      const deviceName = dataQr.split(/[|]+/)[1];
      const form = new FormData();
      //api get key by device name
      form.append("namedevice", deviceName);
      axios({
        method: "post",
        url: "https://time-tracking.dev.lekhanhtech.org/api/auth/get-key-byname",
        data: form,
        headers: {
          Authorization: `Bearer ${UserToken}`,
        },
      })
        .then(function (response) {
          // console.log(response.data[0].publickey);
          decryption(qrString, response.data[0].publickey);
        })
        .catch(function (response) {
          console.log(response);
          Alert.alert("Warning", "Invalid QR, please try again!", [
            { text: "OK", onPress: () => setTimeout(hiddenCam, 200) },
          ]);
        });
    }
  };
  // scan ok
  const onSuccess = (dataQr) => {
    apiKey(dataQr.data);
  };
  // animation
  const compareAnim = () => {
    fadeBox();
    fadeBoxScan();
    setTimeout(zoomTick, 500);
  };
  const handleBut = () => {
    animCam();
  };
  const animCam = () => {
    if (IsShowCam) {
      hiddenCam();
    } else {
      showCam();
    }
  };
  const showCam = () => {
    setIsShowCam(true);
    Animated.timing(fadeCamAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };
  const hiddenCam = () => {
    Animated.timing(fadeCamAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
    setTimeout(() => {
      setIsShowCam(false);
    }, 600);
  };
  const fadeBox = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 50,
      useNativeDriver: false,
    }).start();
  };
  const fadeBoxScan = () => {
    Animated.timing(fadeBoxAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };
  const zoomTick = () => {
    Animated.timing(tickAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
      // Easing: Easing.linear,
    }).start();
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 285,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ]),
      {}
    ).start();
  }, [IsShowCam]);

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Image
          style={styles.userImage}
          source={{
            uri: image,
          }}
        />
        <Text>{Content}</Text>
        <Text>{TimeChecked}</Text>
      </View>

      {IsShowCam && (
        <Animated.View style={[styles.filter, { opacity: fadeCamAnim }]}>
          <View style={styles.tick}>
            <LottieView
              ref={(animation) => {
                animation = animation;
              }}
              source={require("../assets/animation/9613-tick.json")}
              progress={tickAnim}
            />
          </View>
          {/* </Animated.View> */}
          <Animated.View
            style={[styles.boxScan, { padding: fadeBoxAnim }]}
          ></Animated.View>
          <Animated.View style={[styles.boxBar, { opacity: fadeAnim }]}>
            <Animated.View
              style={[
                styles.bar,
                {
                  top: scanAnim,
                },
              ]}
            ></Animated.View>
          </Animated.View>
          <QRCodeScanner
            onRead={onSuccess}
            flashMode={RNCamera.Constants.FlashMode.off}
            cameraStyle={{ height: windowHeight }}
          />
        </Animated.View>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          handleBut();
        }}
      >
        <Icon name="plus" size={20} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1,
  },
  info: {
    position: "absolute",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  filter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  boxScan: {
    position: "absolute",
    zIndex: 10,
    borderColor: "rgba(0, 0, 0 , 0.5)",
    borderWidth: 400,
  },
  boxBar: {
    width: 300,
    height: 300,
    position: "absolute",
    zIndex: 10,
  },
  bar: {
    opacity: 0.7,
    zIndex: 20,
    width: "100%",
    height: 15,
    borderRadius: 10,
    backgroundColor: "#58D9FD",
    shadowColor: "#58D9FD",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.9,
    shadowRadius: 7,
  },
  tick: {
    width: 100,
    height: 100,
    position: "absolute",
    zIndex: 30,
  },
  button: {
    backgroundColor: "#70c1ff",
    position: "absolute",
    paddingVertical: 20,
    paddingHorizontal: 22,
    borderRadius: 60,
    bottom: 30,
    right: 30,
    zIndex: 100,
  },
  userImage: {
    alignSelf: "center",
    // position: "relative",
    borderColor: "#fff",
    borderRadius: 85,
    borderWidth: 3,
    height: 170,
    marginBottom: 15,
    width: 170,
  },
});
