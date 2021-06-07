import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from'../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { nameValidator } from '../helpers/nameValidator'

const UserScreen = ({ navigation }) => {
  console.log('user')
  const [Username, setUsername] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [Clientname, setClientname] = useState({ value: '', error: '' })
  const [shouldShow, setShouldShow] = useState(false);
  const onverifyPressed = () => {
    setShouldShow(true);
    const url = 'https://staging-iseechange.mcci.mobi/dncserver/samail'
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
        alert(responseJson['cid'])
        if (responseJson['cid'] !== undefined) {
          alert('Successfully created')
          navigation.reset({
            index: 0,
            routes: [{ name: 'LoginScreen' }],
          })
        } else {
          alert(JSON.stringify(responseJson))
          navigation.reset({
            index: 0,
            routes: [{ name: 'UserScreen' }],
          })
        }
      })
      .catch(error => {
        console.error(error)
      })
 
  }
  const onSignUpPressed = () => {
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
    }
 
    const proxyurl = 'https://cors-anywhere.herokuapp.com/'
    const url = 'https://staging-iseechange.mcci.mobi/dncserver/usignup'
    fetch(proxyurl + url, {
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
        alert(responseJson['cid'])
        if (responseJson['cid'] !== undefined) {
          alert('Successfully created')
          navigation.reset({
            index: 0,
            routes: [{ name: 'LoginScreen' }],
          })
        } else {
          alert(JSON.stringify(responseJson))
          navigation.reset({
            index: 0,
            routes: [{ name: 'UserScreen' }],
          })
        }
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
       value={Username.value}
       onChangeText={text => setUsername({ value: text, error: '' })}
       error={!!Username.error}
       errorText={Username.error}
     />)}



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
