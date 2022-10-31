/*###############################################################################
// Module: Dashboard.js
// 
// Function:
//      Function to Forgot password screen
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

import React, { useState,useEffect } from 'react'
import Background from '../components/Background'
import BackButton from '../components/BackButton'
import Logo from '../components/Logo'
import Header from '../components/Header'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import { emailValidator } from '../helpers/emailValidator'
import {  View,Text } from 'react-native'
import AwesomeAlert from 'react-native-awesome-alerts';
import getEnvVars from './environment';
const { uiversion } = getEnvVars();
const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [otpshow, setotpshow] = useState(false);
  const [otpalert, setotpalert] = useState(false);
  const [alertmessage, setalertmessage] = useState('');
  const [otpvalue, setotpvalue] = useState('');
  const [password, setpassword] = useState('');
  const [version,setversion]=useState('');
  const [apiUrl,setapiUrl]=useState('');

  //This function is used to fetch and update the values before execute other function
  useEffect(() => {
    let sampleurl=JSON.stringify(window.location.href)
    let geturl=sampleurl.split('/')
    setapiUrl("https://"+geturl[2]+"/dncserver");
    getApiversion("https://"+geturl[2]+"/dncserver");
   
  }, [])

  //To get the api token
  const getApiversion = (apiUrl) => {
    const url = apiUrl+'/version'
    const postMethod= {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      
    }
    fetch(url,postMethod)
    .then(response => {
      const statusCode = response.status
      if (statusCode == 502) {
          alert('Please turn on server')
      }
      response.json().then(responseJson => {
        if(responseJson!=null){
          let versionarray=responseJson.split(' ');
          setversion(versionarray[4])
        }
      })
    })
    .catch(error => {
      console.error(error)
    })
  }

  //To reset the password
  const ResetPassword = () => {
    var emaildata={};
    emaildata['email']=email.value;
    emaildata['new_pwd']=password;
    emaildata['otpnum']=otpvalue;
    emaildata['mode']='fpwd';
    emaildata['status']='non-verified';
    const url = apiUrl+'/update-pwd'
    fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emaildata),
    })
    .then(response => response.json())
    .then(responseJson => {
      setalertmessage(JSON.stringify(responseJson.message));
      setotpalert(true);
      if(responseJson.message=="Password updated successfully!")
      {
        alert("Password updated successfully!")
        setotpshow(false);
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        })
      }
       
    })
    .catch(error => {
      console.error(error)
    })
  }

  //To send otp
  const ResetPasswordotp = () => {
    var emaildata={};
    emaildata['email']=email.value;
    emaildata['mode']='fpwd';
    emaildata['status']='non-verified';
    const url = apiUrl+'/fp-send-otp'
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emaildata),
    })
    .then(response => response.json())
    .then(responseJson => {
      if(responseJson.message!="Email Id not exist. Please sign up")
      {
        setotpshow(true);
      }
      setalertmessage(JSON.stringify(responseJson.message));
      setotpalert(true);
    })
    .catch(error => {
      console.error(error)
    })
  }

  //This function executed while send bytton pressed
  const sendPressed = () => {
    const emailError = emailValidator(email.value)
    if (emailError) {
      setEmail({ ...email, error: emailError })
      return
    }
    if(otpshow)
    {
      ResetPassword();
    }
    else
    {
      ResetPasswordotp();
    }
  }

  return (
    <Background>
      <headers style={{fontFamily:'Helvetica', color:'grey'}}> RESTORE PASSWORD</headers>
      
      
      <TextInput
        label="E-mail address"
        returnKeyType="done"
        fontFamily="Helvetica"
        value={email.value}
        onChangeText={text => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
       
      />
      {otpshow && (  <TextInput
      label="Type here your otp"
      returnKeyType="next"
      value={otpvalue}
      onChangeText={text => setotpvalue(text)}
      />)}
      {otpshow && ( <TextInput
      label="Enter new password"
      returnKeyType="next"
      value={password}
      onChangeText={text => setpassword(text)}
      />)}
      <Button
        mode="contained"
        color = "#53A0FE"

        onPress={sendPressed}

        style={{ marginTop: 16 }}
      >
        Submit
      </Button>
      <AwesomeAlert
        show={otpalert}
        showProgress={false}
        title="Alert"
        message={alertmessage}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        confirmText="ok "
        confirmButtonColor="#DD6B55"
        onConfirmPressed={() =>setotpalert(false)}
      />
      <View style={{position: 'absolute', bottom: 10, marginHorizontal: 'auto'}}>
      <Text style={{ color: 'black', fontSize: 11, fontWeight: 'bold',fontFamily:'Helvetica' }}>DNC {uiversion} | Server{version} </Text>
      </View>
 
      <Button mode="contained"color = "#53A0FE"  onPress={() => navigation.navigate('LoginScreen')}
       style={{ marginTop: 15}}> Back </Button>
    </Background>
  )
}

export default ForgotPasswordScreen
