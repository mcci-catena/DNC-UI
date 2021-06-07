import React, { useState } from 'react'
import { View, Text } from 'react-native';
import AppBar from '../components/AppBar'





const Dashboard=({navigation})=> {

  
  return (
    <View >
   
 
  <AppBar navigation={navigation} title={"DNC"}></AppBar>
  <View style={{flex: 1,width: '85%',maxWidth: 340,alignSelf: 'center',alignItems: 'center',justifyContent: 'center',borderWidth: 10, borderColor: 'red',}}>
             <Text style={{alignItems:'center',justifyContent:"center",fontSize:30,color:'blue'}}>Welcome to DNC</Text>
  </View>

  
</View>
  );
}

export default Dashboard
