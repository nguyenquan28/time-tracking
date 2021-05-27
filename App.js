// AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  Image, Text
} from "react-native";
//navigation
import "react-native-gesture-handler";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Analytics from "./src/screen/Analytics";
import ForgotPassword from "./src/screen/ForgotPassword";
import History from "./src/screen/History";
import Login from "./src/screen/Login";
import Profile from "./src/screen/Profile";
import ResetPassword from "./src/screen/ResetPassword";
import Scan from "./src/screen/Scan";
// store
import { persistor, store } from './src/store';




const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {

  const [tokenPer, setTokenPer] = useState()

  // Get auth
  const getAuthen = async () => {
    const user = await AsyncStorage.getItem("@userToken");
    setTokenPer(user)
  }

  // useEffect(() => { console.log(tokenPer) }, [tokenPer])
  useEffect(() => {
    getAuthen()
    // console.log(tokenPer);
  }, [])

  // Navagation bottom tab
  const tabScreen = () => (
    <Tab.Navigator
      initialRouteName="Scan"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Scan') {
            iconName = focused
              ? require('./src/assets/icon-highlight/checkin-checkout.png')
              : require('./src/assets/icon/checkin-checkout.png')
          } else if (route.name === 'History') {
            iconName = focused ? require('./src/assets/icon-highlight/history.png')
              : require('./src/assets/icon/history.png')
          } else if (route.name === 'Analytics') {
            iconName = focused ? require('./src/assets/icon-highlight/analytics.png')
              : require('./src/assets/icon/analytics.png')
          } else if (route.name === 'Profile') {
            iconName = focused ? require('./src/assets/icon-highlight/user.png')
              : require('./src/assets/icon/user.png')
          }

          // You can return any component that you like here!
          return <Image
            source={iconName}
            style={{
              width: size,
              height: size,
            }}
          />;
        },


      })}
    >

      {/* Screen Menu */}
      < Tab.Screen
        name="Scan"
        component={Scan}
        options={{
          unmountOnBlur: true,
          title: 'Scan',
          headerStyle: {
            backgroundColor: '#FF89C0',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
        }} />
      < Tab.Screen
        name="History"
        component={History}
        options={{
          unmountOnBlur: true,
          title: 'History',
          headerStyle: {
            backgroundColor: '#FF89C0',

          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
        }} />
      < Tab.Screen
        name="Analytics"
        component={Analytics}
        options={{
          unmountOnBlur: true,
          title: 'Analytics',
          headerStyle: {
            backgroundColor: '#FF89C0',

          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
        }} />
      < Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          unmountOnBlur: true,
          title: 'Profile',
          headerStyle: {
            backgroundColor: '#FF89C0',

          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
        }} />

    </Tab.Navigator >
  );

  return (
    // <Analytics />
    <Provider store={store}>
      <PersistGate loading={(<Text>Loading</Text>)} persistor={persistor}>
        <NavigationContainer>
          {

            // Check auth
            tokenPer ?
              (
                <Stack.Navigator>
                  <Stack.Screen
                    options={{ headerShown: false }}
                    name="Menu"
                    component={tabScreen}
                  />
                </Stack.Navigator>
              ) : (
                <Stack.Navigator>
                  <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{
                      title: 'Login',
                      headerStyle: {
                        backgroundColor: '#FF89C0',

                      },
                      headerTintColor: '#fff',
                      headerTitleAlign: 'center'
                    }} />
                  <Stack.Screen
                    name="ForgotPassword"
                    component={ForgotPassword}
                    options={{
                      title: 'ForgotPassword',
                      headerStyle: {
                        backgroundColor: '#FF89C0',

                      },
                      headerTintColor: '#fff',
                      headerTitleAlign: 'center',
                    }} />
                  <Stack.Screen
                    name="ResetPassword"
                    component={ResetPassword}
                    options={{
                      title: 'ResetPassword',
                      headerStyle: {
                        backgroundColor: '#FF89C0',

                      },
                      headerTintColor: '#fff',
                      headerTitleAlign: 'center',
                    }} />
                  <Stack.Screen
                    options={{ headerShown: false }}
                    name="CheckIn"
                    component={tabScreen}
                  />
                </Stack.Navigator>
              )
          }

        </NavigationContainer >
      </PersistGate>
    </Provider>

  );
};

export default App;
