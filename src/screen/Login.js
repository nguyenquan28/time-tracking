import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckBox from "@react-native-community/checkbox";
import React, { Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userToken: null,
      data: [],
      userName: "",
      password: "",
      checked: true,
      errUserName: "",
      errPassword: "",
      errInput: "",
      errLogin: "",
      userTokenPer: "",
      rememberPassPer: "",
      responseJson: ""
    };
  }
  //  auto input from
  async componentDidMount() {
    const user = await AsyncStorage.getItem("@userToken");
    this.setState({ userToken: user });
    // console.log(this.state.userToken);
  }
  //

  //Function set AsyncStorege
  setStoreUser = async (namePers, data) => {
    try {
      await AsyncStorage.setItem(namePers, data);
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };
  //
  handleUserName = (text) => {
    this.setState({ userName: text });
  };

  handlePassword = (text) => {
    this.setState({ password: text });
  };

  async onChangeCheck() {
    await this.setState({ checked: !this.state.checked });
    console.log(this.state.checked);
    if (this.state.checked === true) {
      console.log(this.state.checked);
      // save status check
      try {
        await AsyncStorage.setItem("@isCheckRemember", this.state.checked.toString());
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        await AsyncStorage.removeItem("@isCheckRemember");
      } catch (e) {
        console.log(e);
      }
    }

  }

  onLogin = (navigation) => {
    if (this.state.userName === "" || this.state.password === "") {
      if (this.state.userName === "" && this.state.password === "") {
        this.setState({ errInput: "Username and Password is not empty" });
        this.setState({ errPassword: "" });
        this.setState({ errUserName: "" });
        // console.log("hello")
      } else {
        if (this.state.userName === "") {
          this.setState({ errInput: "" });
          this.setState({ errUserName: "Username is not empty" });
          this.setState({ errPassword: "" });
          // console.log("hello")
        }
        if (this.state.password === "") {
          this.setState({ errInput: "" });
          this.setState({ errUserName: "" });
          this.setState({ errPassword: "Password is not empty" });
          // console.log("hello")
        }
      }
    } else {
      this.setState({ errInput: "" });
      this.setState({ errPassword: "" });
      this.setState({ errUserName: "" });
      // API
      fetch('https://time-tracking.dev.lekhanhtech.org/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: this.state.userName,
          password: this.state.password
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
      })
        .then((response) => response.json())
        .then((responseJson) => {
          //Hide Loader
          // setLoading(false);
          this.setState(responseJson);
          // // If server response message same as Data Matched
          if (responseJson.status === 'success') {
            AsyncStorage.setItem("@userToken", responseJson.access_token);
            AsyncStorage.setItem("@permission", responseJson.leader.toString());
            this.setState({ errLogin: '' });
            console.log(responseJson.access_token);
            this.props.navigation.reset({
              index: 0,
              routes: [{ name: "CheckIn" }],
            });
            this.props.navigation.replace("CheckIn");
          } else {
            this.setState({ errLogin: 'Please check your email or password' });
          }
        })
        .catch((error) => {
          //Hide Loader
          // setLoading(false);
          console.error(error);
        });

      console.log(this.state.userName, this.state.password);
    }
  }
  handleForgot = ({ navigation }) => (
    <TouchableOpacity
      onPress={() => this.props.navigation.navigate("ForgotPassword")}>
      <Text style={styles.labelForgotPass}>Forgot password?</Text>
    </TouchableOpacity>
  );

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginArea}>
          {/* Input */}
          <Text style={styles.label}>Username</Text>
          <TextInput
            onChangeText={this.handleUserName}
            autoCapitalize="none"
            style={styles.inputStyle}
            placeholder="Type your user name"
            placeholderTextColor="#E2E2E2"
            underlineColorAndroid="#f000"
            blurOnSubmit={false}
            borderColor={
              this.state.errInput
                ? "red"
                : !this.state.errUserName
                  ? "#707070"
                  : "red"
            }
          // value={this.state.userPer}
          />

          {/* Input */}
          <Text style={styles.label}>Password</Text>
          <TextInput
            onChangeText={this.handlePassword}
            autoCapitalize="none"
            keyboardType="default"
            style={styles.inputStyle}
            secureTextEntry={true}
            blurOnSubmit={false}
            placeholder="*******"
            placeholderTextColor="#E2E2E2"
            borderColor={
              this.state.errInput
                ? "red"
                : !this.state.errPassword
                  ? "#707070"
                  : "red"
            }
          // value={this.state.passPer}
          />

          {/* Error */}
          <Text style={styles.errors}>
            {this.state.errInput}
            {this.state.errUserName}
            {this.state.errPassword}
            {this.state.errLogin}
          </Text>

          {/* Forgot password */}
          <this.handleForgot />

          <View style={styles.checkBox}>
            <CheckBox
              tintColors={{ true: "#FF89C0" }}
              value={this.state.checked}
              // onPress={() => this.onChangeCheck()}
              onValueChange={() => this.onChangeCheck()}
            />
            <Text style={styles.rememberPass}>Remember Password</Text>
          </View>

          {/* Login button */}
          <TouchableOpacity
            style={styles.loginBtnStyle}
            onPress={() => this.onLogin()}
          >
            <Text style={styles.textBtn}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },

  loginArea: {
    marginTop: 53,
  },

  label: {
    fontSize: 14,
    // fontFamily: 'inherit',
    fontWeight: "bold",
    marginHorizontal: 10,
    marginBottom: 8,
    color: "#404040",
  },

  inputStyle: {
    marginHorizontal: 10,
    fontSize: 16,
    height: 55,
    paddingLeft: 16,
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius: 6,
    // fontFamily: 'inherit',
    borderStyle: "solid",
    borderColor: "#707070",
    borderWidth: 1,
    marginBottom: 30,
  },

  errors: {
    marginHorizontal: 10,
    marginTop: -20,
    fontSize: 14,
    fontStyle: "italic",
    color: "red",
  },

  labelForgotPass: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    color: "#767676",
    textDecorationLine: "underline",
    // fontFamily: 'times-new-roman',
    marginTop: 7,
    marginBottom: 19,
  },

  rememberPass: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#404040",
    marginTop: 5,
  },

  checkBox: {
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 37,
  },

  loginBtnStyle: {
    height: 60,
    borderRadius: 40,
    marginHorizontal: 50,
    backgroundColor: "#FF89C0",
    alignItems: "center",
    justifyContent: "center",
  },

  textBtn: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
export default Login;
