import React, { useState } from 'react'
import { View, Text } from 'react-native';
import AppBar from '../components/AppBar'





const Dashboard=({navigation})=> {

  return (
    <View style={{ flex: 1 }}>
   
 
  <AppBar navigation={navigation} title={"DNC"}></AppBar>
  <View style={{flex:1, width: '85%',alignSelf: 'center',maxWidth:400,alignItems: 'center',justifyContent: 'center'}}>
             <Text style={{alignItems:'center',justifyContent:"center",fontSize:30,color:'blue'}}>Welcome to DNC</Text>
  </View>

  <View style={{ bottom:0, alignItems: 'center' }}>
      <Text style={{ color: '#560CCE', fontSize: 11, fontWeight: 'bold' }}>DNC | UI V1.0.0-1 | Server V1.0.0-1</Text>
    </View>
</View>

  );
}

export default Dashboard
