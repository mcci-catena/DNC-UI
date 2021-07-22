import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View, Alert ,Modal, ActivityIndicator} from 'react-native'
import Header from'../components/Header'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import AsyncStorage from '@react-native-async-storage/async-storage'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { nameValidator } from '../helpers/nameValidator'
import { passwordValidator } from '../helpers/passwordValidator'

const LoginScreen = ({ navigation }) => {
  let [email, setEmail] = useState({ value: '', error: '' })
  let [password, setPassword] = useState({ value: '', error: '' })
  const [modalVisible , setmodalVisible ] = useState(false)

  const onLoginPressed = () => {
    setmodalVisible(true);
    const emailError = nameValidator(email.value)
    const passwordError = passwordValidator(password.value)

    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    console.log(email.value)
    console.log(password.value)
    var data = {
      uname: email.value,
      pwd: password.value,
    }

    const storeData = async (taken, uname, usertype) => {
      try {
        const tokenValue = JSON.stringify(taken)
        const unameValue = JSON.stringify(uname)
        //const type=JSON.stringify(usertype);
        // alert(JSON.stringify(type));
        await AsyncStorage.setItem('token', tokenValue)
        await AsyncStorage.setItem('uname', unameValue)
        await AsyncStorage.setItem('usertype', usertype)
      } catch (e) {
        console.log(e)
      }
    }
   
    const url = 'https://staging-analytics.weradiate.com/apidbm/dlogin'
    const postMethod= {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
    console.log(postMethod);
    fetch(url,postMethod)
      .then(response => {
        const statusCode = response.status
        
        if (statusCode == 403) {
          alert('inavalid token/token expired')
        }
        response.json().then(responseJson => {
          console.log(responseJson)
          let usertype = ''
          const result = 'User ID and Password is not valid'
          if (responseJson.message == result) {
            navigation.reset({
              index: 0,
              routes: [{ name: 'LoginScreen' }],
            })
            alert(result)
          } else {
            const token = responseJson['token']
            const uname = email.value
            const clients = responseJson['clients']
            if (clients == undefined) {
              usertype = 'Client'
              navigation.reset({
                index: 0,
                routes: [{ name: 'Dashboard' }],
              })
            } else {
              usertype = 'Admin'
              setmodalVisible(false);
              navigation.reset({
                index: 0,
                routes: [{ name: 'Dashboard' }],
              })
            }

            storeData(token, uname, usertype)
          }
        })
      })
      .catch(error => {
        console.error(error)
      })
      
  }
  const onSignupPressed = () => {
   
    const url = 'https://staging-Userscreenchange.mcci.mobi/dncserver/signup'
    fetch(url, {
      method: 'POST',
      headers: {
       
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson)
        

        const result = 'Welcome Admin'

        if (responseJson.message == result) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'RegisterScreen' }],
          })
        } else {
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
      
    


    
      <Logo />
      
      <TextInput
        label="User name"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
     <TextInput
        
        
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={text => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry={true}
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={onLoginPressed}>
        Login
      </Button>
      <View style={styles.row}>
        <Text style={{color:'white'}}>Don’t have an account? </Text>
        <TouchableOpacity onPress={onSignupPressed}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    
     
    </Background>
	
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width:'100%',
    alignItems: 'flex-end',
    marginBottom: 24,
    
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.third,
  },

  link: {
    fontWeight: 'bold',
    color: theme.colors.third,
  },
})

export default LoginScreen