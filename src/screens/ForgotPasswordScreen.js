// Module: LoginScreen
// 
// Function:
//      Function to forgot password module
// 
// Version:
//    V1.0.0  Thu Jul 25 2021 10:30:00  muthup   Edit level 1
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
const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [otpshow, setotpshow] = useState(false);
  const [otpalert, setotpalert] = useState(false);
  const [alertmessage, setalertmessage] = useState('');
  const [otpvalue, setotpvalue] = useState('');
  const [password, setpassword] = useState('');
  const [version,setversion]=useState('');

  useEffect(() => {
    getApiversion();
  }, [])
  
  const getApiversion = () => {
    
    const url = 'https://staging-dashboard.mouserat.io/dncserver/version'
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
  const ResetPassword = () => {
    var emaildata={};
    
    emaildata['email']=email.value;
    emaildata['new_pwd']=password;
    emaildata['otpnum']=otpvalue;
    emaildata['mode']='fpwd';
    emaildata['status']='non-verified';
    const url = 'https://staging-dashboard.mouserat.io/dncserver/update-pwd'
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
        console.log(responseJson)
        setotpshow(false);
        setalertmessage(JSON.stringify(responseJson.message));
        setotpalert(true);
        if(responseJson.message=="Password updated successfully!")
        {
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
  const ResetPasswordotp = () => {
    var emaildata={};
    
    emaildata['email']=email.value;
    emaildata['mode']='fpwd';
    emaildata['status']='non-verified';
    const url = 'https://staging-dashboard.mouserat.io/dncserver/fp-send-otp'
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
        console.log(responseJson)
        
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
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Restore Password</Header>
  
      <TextInput
      label="E-mail address"
        
        returnKeyType="done"
        value={email.value}
        onChangeText={text => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        description="You will receive email with password reset otp."
      />
     
         {otpshow && (  <TextInput
       
       label="Type here your otp"
       returnKeyType="next"
       value={otpvalue}
       onChangeText={text => setotpvalue(text)}
       
     />
     
     )}
    {otpshow && ( <TextInput
       
       label="Enter new password"
       returnKeyType="next"
       value={password}
       onChangeText={text => setpassword(text)}
       
     />
     )}
      <Button
        mode="contained"
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
      <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' }}>DNC | UI V1.0.0 | Server {version}</Text>
    </View>
 
    </Background>
  )
}

export default ForgotPasswordScreen
