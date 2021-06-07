import React from 'react'
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from './src/core/theme'
import {
  LoginScreen,
  AdminSignup,
  ForgotPasswordScreen,
  Dashboard,
  UserSignup,
  UserScreen,
  ClientScreen,
  RegisterDevice,
  Configuredevice,
  Configurefield,Changepassword,
} from './src/screens'

import {
  createDrawerNavigator,
 
} from '@react-navigation/drawer';
const Homestack = createStackNavigator()
const Configuredevicestack = createStackNavigator()
const Configuredfieldstack = createStackNavigator()
const Clientscreenstack = createStackNavigator()
const UserScreenstack = createStackNavigator()
const Registerdevicestack = createStackNavigator()
// const Configuredevicestack = createStackNavigator()
const Drawer = createDrawerNavigator();
const Homestackscreen=({navigation}) =>(
  <Homestack.Navigator 
  initialRouteName="LoginScreen"
  screenOptions={{
    headerShown: false
  }}>
    
  <Homestack.Screen name="LoginScreen" component={LoginScreen} />
  <Homestack.Screen name="Dashboard" component={Dashboard} />
  <Homestack.Screen name="UserScreen" component={UserScreen} />
  <Homestack.Screen name="AdminSignup" component={AdminSignup} />
  <Homestack.Screen name="RegisterDevice" component={RegisterDevice} />    
  <Homestack.Screen name="UserSignup" component={UserSignup} />
  <Homestack.Screen name="ClientScreen" component={ClientScreen} />
  <Homestack.Screen name="Configuredevice" component={Configuredevice} />
  <Homestack.Screen name="Configurefield" component={Configurefield} />
  <Homestack.Screen name="Changepassword" component={Changepassword} />
  <Homestack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />   
  
  </Homestack.Navigator>
)


const ConfigureDevicestackScreen=({navigation}) =>(
  <Configuredevicestack.Navigator 
 
  screenOptions={{
    headerShown: false
  }}>
  <Configuredevicestack.Screen name="Configuredevice" component={Configuredevice} />
  <Configuredevicestack.Screen name="Configurefield" component={Configurefield} />
  <Configuredevicestack.Screen name="Dashboard" component={Dashboard} />
  <Configuredevicestack.Screen name="Changepassword" component={Changepassword} />
  <Configuredevicestack.Screen name="ClientScreen" component={ClientScreen} />
  <Configuredevicestack.Screen name="UserScreen" component={UserScreen} />
  <Configuredevicestack.Screen name="RegisterDevice" component={RegisterDevice} />  
  </Configuredevicestack.Navigator>
)

const ConfigureFieldstackScreen=({navigation}) =>(
  <Configuredfieldstack.Navigator 
 
  screenOptions={{
    headerShown: false
  }}>
  
  <Configuredfieldstack.Screen name="Configurefield" component={Configurefield} />
  <Configuredfieldstack.Screen name="Dashboard" component={Dashboard} />
  <Configuredfieldstack.Screen name="Changepassword" component={Changepassword} />
  <Configuredfieldstack.Screen name="ClientScreen" component={ClientScreen} />
  <Configuredfieldstack.Screen name="Configuredevice" component={Configuredevice} />
  <Configuredfieldstack.Screen name="UserScreen" component={UserScreen} />
  <Configuredfieldstack.Screen name="RegisterDevice" component={RegisterDevice} />  
  </Configuredfieldstack.Navigator>
)

const ClientstackScreen=({navigation}) =>(
  <Clientscreenstack.Navigator 
 
  screenOptions={{
    headerShown: false
  }}>
    <Clientscreenstack.Screen name="ClientScreen" component={ClientScreen} />
  <Clientscreenstack.Screen name="Configurefield" component={Configurefield} />
  <Clientscreenstack.Screen name="Dashboard" component={Dashboard} />
  <Clientscreenstack.Screen name="Changepassword" component={Changepassword} />
 <Clientscreenstack.Screen name="Configuredevice" component={Configuredevice} />
  <Clientscreenstack.Screen name="UserScreen" component={UserScreen} />
  <Clientscreenstack.Screen name="RegisterDevice" component={RegisterDevice} />  
  </Clientscreenstack.Navigator>
)

const UserstackScreen=({navigation}) =>(
  <UserScreenstack.Navigator 
 
  screenOptions={{
    headerShown: false
  }}>
    <UserScreenstack.Screen name="UserScreen" component={UserScreen} />
    <UserScreenstack.Screen name="ClientScreen" component={ClientScreen} />
  <UserScreenstack.Screen name="Configurefield" component={Configurefield} />
  <UserScreenstack.Screen name="Dashboard" component={Dashboard} />
  <UserScreenstack.Screen name="Changepassword" component={Changepassword} />
 <UserScreenstack.Screen name="Configuredevice" component={Configuredevice} />
<UserScreenstack.Screen name="RegisterDevice" component={RegisterDevice} />  
</UserScreenstack.Navigator>
)

const RegisterDevicestackScreen=({navigation}) =>(
  <Registerdevicestack.Navigator 
 
  screenOptions={{
    headerShown: false
  }}>
    <Registerdevicestack.Screen name="RegisterDevice" component={RegisterDevice} />  
    <Registerdevicestack.Screen name="UserScreen" component={UserScreen} />
    <Registerdevicestack.Screen name="ClientScreen" component={ClientScreen} />
  <Registerdevicestack.Screen name="Configurefield" component={Configurefield} />
  <Registerdevicestack.Screen name="Dashboard" component={Dashboard} />
  <Registerdevicestack.Screen name="Changepassword" component={Changepassword} />
 <Registerdevicestack.Screen name="Configuredevice" component={Configuredevice} />

</Registerdevicestack.Navigator>
)

export default class App extends React.Component {
  render() {
    return (
      <Provider theme={theme}>
        <NavigationContainer >
         
    <Drawer.Navigator >
      <Drawer.Screen name="Home" component={Homestackscreen} />
      <Drawer.Screen name="User Management" component={UserstackScreen} />
     <Drawer.Screen name="Client Mangement" component={ClientstackScreen} />
     <Drawer.Screen name="Field Configure" component={RegisterDevicestackScreen} />
     <Drawer.Screen name="Register Device" component={RegisterDevicestackScreen} />
     <Drawer.Screen name="Configure Device" component={ConfigureDevicestackScreen} />
     <Drawer.Screen name="Configure Field" component={ConfigureFieldstackScreen} /> 
   
    
    </Drawer.Navigator>
 

        </NavigationContainer>
      </Provider>
    )
  }
}
