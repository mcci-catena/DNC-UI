import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, Alert, ScrollView,Image,Platform,TouchableOpacity,Modal} from 'react-native'
import TextInput from '../components/TextInput'
import AppBar from '../components/AppBar'

const Changepassword =({navigation}) =>
{
   let [oldpassword, setoldpassword] = useState({ value: '', error: '' })
   let [newpassword, setnewpassword] = useState({ value: '', error: '' })
   let [confirmpassword, setconfirmpassword] = useState({ value: '', error: '' })
   return(
      <View>
    <AppBar navigation={navigation} title={"Change password"}></AppBar>
    <View style={{flex:1,justifyContent:'center',alignItems:'center',width:'40%',marginLeft:"30%"}}>
     <TextInput
        
        
        label="Enter Old Password"
        returnKeyType="done"
        value={oldpassword.value}
        onChangeText={text => setoldpassword({ value: text, error: '' })}
      //   error={!!password.error}
      //   errorText={password.error}
        secureTextEntry={true}
      />
      <TextInput
        
        
        label="Enter New Password"
        returnKeyType="done"
        value={newpassword.value}
        onChangeText={text => setnewpassword({ value: text, error: '' })}
      //   error={!!password.error}
      //   errorText={password.error}
        secureTextEntry={true}
      />
      <TextInput
        
        
        label="Confirm New Password"
        returnKeyType="done"
        value={confirmpassword.value}
        onChangeText={text => setconfirmpassword({ value: text, error: '' })}
      //   error={!!password.error}
      //   errorText={password.error}
        secureTextEntry={true}
      />
</View>
</View>
   )
}

export default Changepassword;