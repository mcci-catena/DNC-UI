/*###############################################################################
// Module: App.js
// 
// Function:
//      Function to export app module
// 
// Version:
//    V1.02  Tue Dec 01 2021 10:30:00  muthup   Edit level 2
// 
//  Copyright notice:
//       This file copyright (C) 2021 by
//       MCCI Corporation
//       3520 Krums Corners Road
//       Ithaca, NY 14850
//       An unpublished work. All rights reserved.
// 
//       This file is proprietary information, and may not be disclosed or
//       copied without the prior permission of MCCI Corporation.
// 
//  Author:
//       muthup, MCCI July 2021
// 
//  Revision history:
//       1.01 Wed July 12 2021 10:30:00 muthup
//       Module created.
//       1.02 Tue Dec 01 2021 10:30:00 muthup
//       Fixed issues #2 #3 #4 #5 #6 #7
###############################################################################*/

import React, { useState, useEffect } from 'react'
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from './src/core/theme'
import {LoginScreen,AdminSignup,ForgotPasswordScreen,Dashboard,UserSignup,UserScreen,ClientScreen,
  RegisterDevice,Configuredevice,
} from './src/screens'
import {createDrawerNavigator} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthContext } from "./src/screens/context";

// Create stack navigator for each screen 
const Homestack = createStackNavigator()
const Configuredevicestack = createStackNavigator()
const Clientscreenstack = createStackNavigator()
const UserScreenstack = createStackNavigator()
const Registerdevicestack = createStackNavigator()
const Drawer = createDrawerNavigator();

// stack navivigation for before authentication
const Homestackscreen=({navigation}) =>(
  <Homestack.Navigator initialRouteName="LoginScreen" screenOptions={{headerShown: false}}>
    <Homestack.Screen name="LoginScreen" component={LoginScreen} />
    <Homestack.Screen name="Dashboard" component={Dashboard} />
    <Homestack.Screen name="AdminSignup" component={AdminSignup} />
    <Homestack.Screen name="UserSignup" component={UserSignup} />
    <Homestack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
  </Homestack.Navigator>
)

// stack navigation for configure device page
const ConfigureDevicestackScreen=({navigation}) =>(
  <Configuredevicestack.Navigator  screenOptions={{headerShown: false}}>
    <Configuredevicestack.Screen name="Configuredevice" component={Configuredevice} />
  </Configuredevicestack.Navigator>
  )

//stack navigation for client screen
const ClientstackScreen=({navigation}) =>(
  <Clientscreenstack.Navigator  screenOptions={{headerShown: false}}>
    <Clientscreenstack.Screen name="ClientScreen" component={ClientScreen} />
  </Clientscreenstack.Navigator>
)

//stack navigation for user screen
const UserstackScreen=({navigation}) =>(
  <UserScreenstack.Navigator screenOptions={{headerShown: false}}>
    <UserScreenstack.Screen name="UserScreen" component={UserScreen} />
  </UserScreenstack.Navigator>
)
//stack navigation for register device screen
const RegisterDevicestackScreen=({navigation}) =>(
  <Registerdevicestack.Navigator screenOptions={{headerShown: false}}>
      <Registerdevicestack.Screen name="RegisterDevice" component={RegisterDevice} />  
  </Registerdevicestack.Navigator>
)


// All stack screen assign to drawer and export the function
export default  ()=> {
  const[user,setuser]=useState(true)
  
  const authContext = React.useMemo(() => {
    return {
      checkusertype: () => {
        setuser(false)
      },
      initializeusertype:()=>
      {
        setuser(true)
      }
  };
  }, []);

  return (
    <AuthContext.Provider value={authContext} >
      <Provider theme={theme}>
        <NavigationContainer >
          <Drawer.Navigator >
            <Drawer.Screen name="Home" component={Homestackscreen} />
            {user &&<Drawer.Screen name="User Management" component={UserstackScreen}/>}
            {user && <Drawer.Screen name="Client Mangement" component={ClientstackScreen} />}
            {user &&  <Drawer.Screen name="Register Device" component={RegisterDevicestackScreen} />}
            <Drawer.Screen name="Configure Device" component={ConfigureDevicestackScreen} />
          </Drawer.Navigator>
        </NavigationContainer>
      </Provider>
    </AuthContext.Provider>
  )
  
}