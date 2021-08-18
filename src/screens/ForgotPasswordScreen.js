import React, { useState } from 'react'
import Background from '../components/Background'
import BackButton from '../components/BackButton'
import Logo from '../components/Logo'
import Header from '../components/Header'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import { emailValidator } from '../helpers/emailValidator'
import {  View } from 'react-native'
import AwesomeAlert from 'react-native-awesome-alerts';
const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [otpshow, setotpshow] = useState(false);
  const [otpalert, setotpalert] = useState(false);
  const [alertmessage, setalertmessage] = useState('');
  const [otpvalue, setotpvalue] = useState('');
  const [password, setpassword] = useState('');
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
        setotpshow(true);
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
      <View>
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
      </View>
    </Background>
  )
}

export default ForgotPasswordScreen
