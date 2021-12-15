/*###############################################################################
// Module: AdminSignup.js
// 
// Function:
//      Function to export AdminSignup page 
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
//       1.01 Fri July 14 2021 10:30:00 muthup
//       Module created.
//       1.02 Tue Dec 01 2021 10:30:00 muthup
//       Fixed issues #2 #3 #4 #5 #6 #7
###############################################################################*/

import React, { useState,useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity,Modal,ActivityIndicator } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { nameValidator } from '../helpers/nameValidator'
import AwesomeAlert from 'react-native-awesome-alerts';
import getEnvVars from './environment';
const { uiversion } = getEnvVars();

const RegisterScreen = ({ navigation }) => {
  //Declare the use state variable
  const [Username, setUsername] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [Orgname, setOrgname] = useState({ value: '', error: '' })
  const [otp, setotp] = useState('');
  const [alertmessage, setalertmessage] = useState('');
  const [shouldShow, setShouldShow] = useState(false);
  const [spinner, setspinner] = useState(false);
  const [showAlert, setshowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [version,setversion]=useState('');
  const [apiUrl,setapiUrl]=useState('');
  
  //Function for get apiserver version
  const getApiversion = (apiUrl) => {
    const url =apiUrl+ '/version'
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
        
         if(responseJson!=null||responseJson!=undefined){
         let versionarray=responseJson.split(' ');
         setversion(versionarray[4])
        }
        
        })
      })
      .catch(error => {
        console.error(error)
      })
    
  }

  //UseEffect used to execute first this function then only other function works
  useEffect(() => {
    let sampleurl=JSON.stringify(window.location.href)
    let geturl=sampleurl.split('/')
    setapiUrl("https://"+geturl[2]+"/dncserver");
    getApiversion("https://"+geturl[2]+"/dncserver");
    setTimeout(() => {
        setIsLoading(false);
    }, 500);
  }, []);

  //This part for showing load spinner
  if(isLoading){
    return(
      <View style={{flex: 1,justifyContent: 'center',alignItems: 'center'}}>
        <ActivityIndicator size="large"  />
        <Text >Loading</Text>
      </View>
   
    );
  }

  //Sent otp to user mail id
  const onverifyPressed = () => {
    const emailError = emailValidator(email.value)
    if (emailError) {
     
      setEmail({ ...email, error: emailError })
       
      return
    }
    setspinner(true);
    var emaildata={};
    emaildata['uname']=Username.value;
    emaildata['email']=email.value;
    emaildata['mode']='asignup';
    emaildata['status']='non-verified';
    const url = apiUrl+'/send-otp'
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
        setShouldShow(true);
        setalertmessage(JSON.stringify(responseJson.message));
      setshowAlert(true);
     
       
      })
      .catch(error => {
        console.error(error)
      })
      setTimeout(() => {setspinner(false)}, 500);
  }

  //Send signup data to server
  const onSignUpPressed = () => {
    if(shouldShow!=true)
    {
      setalertmessage("Please verify your email");
      setshowAlert(true);
      stop;
    }
    const UsernameError = nameValidator(Username.value)
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    const OrgnameError = nameValidator(Orgname.value)
    if (emailError || passwordError || UsernameError || OrgnameError) {
      setUsername({ ...Username, error: UsernameError })
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      setOrgname({ ...Orgname, error: OrgnameError })
      return
    }
    const url = apiUrl+'/asignup'
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cname: Orgname.value,
        uname: Username.value,
        pwd: password.value,
        email: email.value,
        otpnum:otp,
        mode: "asignup"
      }),
    })
    .then(response => {
      const statusCode = response.status;
      if (statusCode == 200) {
        alert("Successfully Adminuser Created");
        navigation.navigate('LoginScreen')
      }
      response.json().then(responseJson => {
         alert(JSON.stringify(responseJson['message']));
        
      })
    })
    .catch(error => {
      console.error(error)
    })
   
  }

  return (
    <Background>
      <Header>Create Admin Account</Header>
        <TextInput
        label="Organization Name"
        returnKeyType="next"
        value={Orgname.value}
        onChangeText={text => setOrgname({ value: text, error: '' })}
        error={!!Orgname.error}
        errorText={Orgname.error}
        />
        <TextInput
        label="User Name"
        returnKeyType="next"
        value={Username.value}
        onChangeText={text => setUsername({ value: text, error: '' })}
        error={!!Username.error}
        errorText={Username.error}
        />
        <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={text => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
        />
        <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={text => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        />
        <TouchableOpacity style={{backgroundColor:'#0000FF',alignItems: "center", padding: 10,borderRadius:25}} onPress={onverifyPressed}>
          <Text style={styles.link}>Verify Email</Text>
        </TouchableOpacity>
        {shouldShow && (  <TextInput label="Type here your otp" returnKeyType="next"  value={otp.value} onChangeText={text => setotp(text)}/>)}
        <Modal presentationStyle="overFullScreen" transparent={true} visible={spinner}>
          <View style={{flex: 1,justifyContent: 'center',alignItems: 'center'}}>
            <View style={{backgroundColor: "#F7F6E7",width: 300,height: 150,justifyContent: 'center',alignItems: 'center',backgroundColor:"#F7F6E7"}}>
              <ActivityIndicator size="large" color="#00ff00" />
              <Text style={{color:"#00ff00"}}>Loading</Text>
            </View>
          </View>
        </Modal>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Alert"
          message={alertmessage}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          confirmText="ok "
          confirmButtonColor="#DD6B55"
          onConfirmPressed={() =>setshowAlert(false)}
        />
        <Button mode="contained" onPress={onSignUpPressed} style={{ marginTop: 24 }}>Sign Up</Button>
        <View style={styles.row}>
          <Text style={{ color: 'white' }}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
            <Text style={styles.link}>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={{position: 'absolute', bottom: 10, marginHorizontal: 'auto'}}>
        <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' }}>DNC |{uiversion}| Server {version}</Text>
      </View>
    </Background>
  )
}
//Defined style sheet for admin signup screen
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.third,
    
  },

})

export default RegisterScreen
