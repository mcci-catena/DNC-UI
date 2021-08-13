import React, { useState,useEffect } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,Modal,ActivityIndicator
} from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Header from'../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { nameValidator } from '../helpers/nameValidator'
import AwesomeAlert from 'react-native-awesome-alerts';
const UserScreen = ({ navigation }) => {
  console.log('user')
  const [Username, setUsername] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [Clientname, setClientname] = useState({ value: '', error: '' })
  const [shouldShow, setShouldShow] = useState(false);
  const [alertmessage, setalertmessage] = useState('');
  const [spinner, setspinner] = useState(false);
  const [showAlert, setshowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [otp, setotp] = useState('');
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
  emaildata['mode']='usignup';
  emaildata['status']='non-verified';
  const url = 'https://staging-dashboard.mouserat.io/dncserver/send-otp'
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
    const ClientnameError = nameValidator(Clientname.value)
    let passlen = password.value
    alert(passlen.length)
    if (passlen.length < 8) {
      setPassword({ ...email, error: 'Password should be 8 characters' })
      return
    }
    if (emailError || passwordError || UsernameError || ClientnameError) {
      setUsername({ ...Username, error: UsernameError })
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      setClientname({ ...Clientname, error: ClientnameError })
      return
    }

    console.log(Username.value)
    console.log(password.value)
    console.log(email.value)
    console.log(Clientname.value)
    var data = {
      cname: Clientname.value,
      uname: Username.value,
      pwd: password.value,
      email: email.value,
      otpnum:otp,
      mode: "usignup"
    }
 
    //const proxyurl = 'https://cors-anywhere.herokuapp.com/'
    const url = 'https://staging-dashboard.mouserat.io/dncserver/usignup'
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson)
        alert(JSON.stringify(responseJson['message']));
        setalertmessage(JSON.stringify(responseJson.message));
        setshowAlert(true);
        
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        })
      })
      
      .catch(error => {
        console.error(error)
      })
  }

  return (
    <Background>
     
      <Header>Create User Account</Header>
      <TextInput
        label="Client name"
        placeholder="Client Name" 
        placeholderTextColor="white"
        returnKeyType="next"
        value={Clientname.value}
        onChangeText={text => setClientname({ value: text, error: '' })}
        error={!!Clientname.error}
        errorText={Clientname.error}
      />
      <TextInput
        label="User name"
        
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
       onChangeText={text => setotp(text)}
       
     />)}

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

      <Button mode="contained"  onPress={onSignUpPressed}>
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
    marginTop: 30,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.third,
  },
})

export default UserScreen