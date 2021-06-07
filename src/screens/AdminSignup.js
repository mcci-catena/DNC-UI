import React, { useState,useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity,Modal,ActivityIndicator } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { nameValidator } from '../helpers/nameValidator'
import AwesomeAlert from 'react-native-awesome-alerts';

const RegisterScreen = ({ navigation }) => {
  console.log('register')
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



useEffect(() => {
    setTimeout(() => {
        setIsLoading(false);
    }, 500);
}, []);

if(isLoading){
    return(
      <View style={{
        flex: 1,
       
        justifyContent: 'center',
        alignItems: 'center'
    }}>
        
      <ActivityIndicator size="large"  />
      <Text >Loading</Text>
    </View>
   
    );
}

  const otpvalidation=(text)  =>

  {
         
            if(text.length==6)
            {
              const url = 'https://staging-iseechange.mcci.mobi/dncserver/chkmoa'
              fetch(url, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({email:email.value,oauth:text}),
              })
                .then(response => response.json())
                .then(responseJson => {
                  console.log(responseJson)
                  setalertmessage(JSON.stringify(responseJson.message));
                  setshowAlert(true);
                  if(responseJson.message="Auth Success")
                  {
                    setShouldShow(false);
                  }
                  
                })
                .catch(error => {
                  console.error(error)
                })

            }
            
     // setShouldShow(false)
  }
  const onverifyPressed = () => {
    
     
    const emailError = emailValidator(email.value)
    if (emailError) {
     
      setEmail({ ...email, error: emailError })
       
      return
    }
    setspinner(true);
    const url = 'https://staging-iseechange.mcci.mobi/dncserver/samail'
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email:email.value}),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson)
        setShouldShow(true);
        setalertmessage(JSON.stringify(responseJson.message));
      setshowAlert(true);
     
        //setspinner(false);
      })
      .catch(error => {
        console.error(error)
      })
      setTimeout(() => {setspinner(false)}, 500);
  }
  const onSignUpPressed = () => {
    // setspinner(true);
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
    console.log(Username.value)
    console.log(password.value)
    console.log(email.value)
    console.log(Orgname.value)
   // const proxyurl = 'https://cors-anywhere.herokuapp.com/'
    const url = 'https://staging-iseechange.mcci.mobi/dncserver/asignup'
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oname: Orgname.value,
        uname: Username.value,
        pwd: password.value,
        email: email.value,
       
      }),
    })
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson)
      setalertmessage(JSON.stringify(responseJson.message));
      setshowAlert(true);
      // setspinner(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      })
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
          <Text style={styles.link}>Verify</Text>
        </TouchableOpacity>
    {shouldShow && (  <TextInput
       
       label="Type here your otp"
       returnKeyType="next"
       value={otp.value}
       onChangeText={text => otpvalidation(text)}
       
     />)}
       <Modal
      presentationStyle="overFullScreen"
      transparent={true}
      visible={spinner}
     
    >
         <View style={{
            flex: 1,
           
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <View style={{
                backgroundColor: "#F7F6E7",
                width: 300,
                height: 150,justifyContent: 'center',
                alignItems: 'center',
                backgroundColor:"#F7F6E7"
           }}>
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
   
      <Button
        mode="contained"
        onPress={onSignUpPressed}
        style={{ marginTop: 24 }}
      >
        Sign Up
      </Button>
      <View style={styles.row}>
        <Text style={{ color: 'white' }}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

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
