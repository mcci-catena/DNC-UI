import React, { useState } from 'react'
import { View, Text } from 'react-native';
import AppBar from '../components/AppBar'





const Dashboard=({navigation})=> {

  
  return (
    <View >
   
 
  <AppBar navigation={navigation} title={"DNC"}></AppBar>
  <View style={{width: '85%',alignSelf: 'center',maxWidth:400,alignItems: 'center',justifyContent: 'center',borderWidth: 10, borderColor: 'red',marginTop:'5%'}}>
             <Text style={{alignItems:'center',justifyContent:"center",fontSize:30,color:'blue'}}>Welcome to DNC</Text>
  </View>

  {/* <Text style={{marginTop:'95%',marginLeft:'50%'}}>Version 1.0.0</Text> */}
</View>
  );
}

export default Dashboard
