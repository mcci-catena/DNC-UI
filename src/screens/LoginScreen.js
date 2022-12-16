/*###############################################################################
// Module: LoginScreen.js
// 
// Function:
//      Function to export login screen
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
//       1.01 Wed July 16 2021 10:30:00 muthup
//       Module created.
//       1.02 Tue Dec 01 2021 10:30:00 muthup
//       Fixed issues #2 #3 #4 #5 #6 #7
###############################################################################*/

import React, { useState, useEffect } from 'react'
import { Header } from 'react-native-elements'
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { theme } from '../core/theme'
import { nameValidator } from '../helpers/nameValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import getEnvVars from './environment'
const { uiversion } = getEnvVars()
import { AuthContext } from './context'
import { Constants } from 'expo-constants'
const LoginScreen = ({ navigation }) => {
  let [email, setEmail] = useState({ value: '', error: '' })
  let [password, setPassword] = useState({ value: '', error: '' })
  const [version, setversion] = useState('')
  const [apiUrl, setapiUrl] = useState('')
  const { checkusertype, initializeusertype } = React.useContext(AuthContext)

  //This function is used to fetch and update the values before execute other function
  useEffect(() => {
    console.log('Logscreen  Use Effect')
    let sampleurl = JSON.stringify(window.location.href)
    let geturl = sampleurl.split('/')
    // setapiUrl('https://' + geturl[2] + '/dncserver')
    // getApiversion('https://' + geturl[2] + '/dncserver')

    const dncurl = "https://"+geturl[2]+"/dncserver"
    setapiUrl(dncurl)
    getApiversion(dncurl)
    initializeusertype()
  }, [])

  //To get the api token
  const getApiversion = (apiUrl) => {
    console.log('Get Token')
    console.log(apiUrl)
    const url = apiUrl + '/version'
    const postMethod = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
    fetch(url, postMethod)
      .then((response) => {
        const statusCode = response.status
        if (statusCode == 502) {
          alert('Please turn on server')
        }
        response.json().then((responseJson) => {
          if (responseJson != null) {
            let versionarray = responseJson.split(' ')
            setversion(versionarray[4])
          }
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }

  //To verify the login authentication
  const onLoginPressed = () => {
    const emailError = nameValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    var data = {
      uname: email.value,
      pwd: password.value,
    }
    const storeData = async (taken, uname, usertype) => {
      try {
        const tokenValue = JSON.stringify(taken)
        const unameValue = JSON.stringify(uname)

        await AsyncStorage.setItem('token', tokenValue)
        await AsyncStorage.setItem('uname', unameValue)
        await AsyncStorage.setItem('usertype', usertype)
        await AsyncStorage.setItem('apiUrl', apiUrl)
      } catch (e) {
        console.log(e)
      }
    }
    const url = apiUrl + '/login'
    const postMethod = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }

    fetch(url, postMethod)
      .then((response) => {
        const statusCode = response.status
        if (statusCode == 403) {
          alert('inavalid token/token expired')
        }
        if (statusCode == 502) {
          alert('Please turn on server')
        }
        response.json().then((responseJson) => {
          let usertype = ''
          const result = 'Invalid username/password'
          if (
            responseJson.message == result ||
            responseJson.message == 'User not exists'
          ) {
            navigation.reset({
              index: 0,
              routes: [{ name: 'LoginScreen' }],
            })
            alert(result)
          } else {
            const token = responseJson['token']
            const uname = email.value
            const level = responseJson['level']
            if (level == '1') {
              usertype = 'Client'
              navigation.reset({
                index: 0,
                routes: [{ name: 'Dashboard' }],
              })
              checkusertype()
            } else {
              usertype = 'Admin'

              navigation.reset({
                index: 0,
                routes: [{ name: 'Dashboard' }],
              })
            }

            storeData(token, uname, usertype)
          }
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }

  //To get type user need to signup
  const onSignupPressed = () => {
    console.log('Entering into Signup page')
    navigation.reset({
      index: 0,
      routes: [{ name: 'UserSignup' }],
    })
  }
  const handleKeyDown = (e) => {
    if (e.nativeEvent.key == 'Enter') {
      onLoginPressed()
    }
  }

  return (
    <Background>
      <view style={styles}>
        <Text style={styles.header}>DATA NORMALIZATION CONSOLE</Text>
      </view>

      {/* <View style={styles}>
      <TouchableOpacity onPress={() => navigation.navigate('DataDownload')}>
        <Text style={styles.DataDownload}>Data Download</Text>
      </TouchableOpacity>
    </View> */}

      <headers style={{ fontFamily: 'Helvetica', color: 'grey' }}>
        {' '}
        USER LOGIN{' '}
      </headers>

      <TextInput
        label="User name"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        s
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry={true}
        onKeyPress={(e) => handleKeyDown(e)}
      />

      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPasswordScreen')}
        >
          <Text
            style={{ color: 'blue', fontFamily: 'Helvetica ', fontSize: 15 }}
          >
            Forgot your password?
          </Text>
        </TouchableOpacity>
      </View>

      <Button mode="contained" color="#53A0FE" onPress={onLoginPressed}>
        Login
      </Button>

      <View style={styles.row}>
        <Text style={{ color: 'black' }}>Don’t have an account? </Text>
        <TouchableOpacity onPress={onSignupPressed}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{ position: 'absolute', bottom: 10, marginHorizontal: 'auto' }}
      >
        <Text
          style={{
            color: 'black',
            fontSize: 11,
            fontWeight: 'bold',
            fontFamily: 'Helvetica',
          }}
        >
          DNC {uiversion} | Server{version}{' '}
        </Text>
      </View>

      {}
    </Background>
  )
}

// http://192.168.1.169:8891/download/Arnot_03-01-2022_to_04-30-2022_16-3-22.csv

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  // DataDownload: {
  // paddingR :1,
  // textAlign :'right',
  // color: 'blue',
  // width:250,
  // fontSize: 5,
  // fontFamily:'Helvetica',
  // marginTop:-200,
  // marginLeft:950,
  // fontWeight: 'bold',
  // fontSize:15,
  // textDecorationLine: 'underline'
  // },
  row: {
    flexDirection: 'column',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    fontWeight: 'bold',

    color: theme.colors.third,
  },
  link: {
    color: 'blue',
    marginLeft: 180,
    marginTop: -20,
  },
  header: {
    fontSize: 22,
    marginLeft: -160,
    marginTop: -150,
    width: 500,
    position: 'Absolute',
    textAlign: 'Top',
    fontFamily: 'Helvetica',
    color: 'Black',
  },
})
export default LoginScreen
