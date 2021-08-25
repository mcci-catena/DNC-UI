// Module: Dashboard
// 
// Function:
//      Function to home screen
// 
// Version:
//    V1.0.0  Thu Jul 15 2021 10:30:00  muthup   Edit level 1
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

import React, { useState,useEffect } from 'react'
import { View, Text } from 'react-native';
import AppBar from '../components/AppBar'

const Dashboard=({navigation})=> {
  const [version,setversion]=useState('');
  useEffect(() => {
    getApiversion();
  }, [])
  const getApiversion = () => {
    const url = 'https://staging-dashboard.mouserat.io/dncserver/version'
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
      if(responseJson!=null){
         let versionarray=responseJson.split(' ');
         setversion(versionarray[4])
         
      }
        
      })
    })
    .catch(error => {
      console.error(error)
    })
    
  }

  return (
  <View style={{ flex: 1 }}>
    <AppBar navigation={navigation} title={"DNC"}></AppBar>
    <View style={{flex:1, width: '85%',alignSelf: 'center',maxWidth:400,alignItems: 'center',justifyContent: 'center'}}>
      <Text style={{alignItems:'center',justifyContent:"center",fontSize:30,color:'blue'}}>Welcome to DNC</Text>
    </View>
    <View style={{ bottom:0, alignItems: 'center' }}>
      <Text style={{ color: '#560CCE', fontSize: 11, fontWeight: 'bold' }}>DNC | UI V1.0.0 | Server {version}</Text>
    </View>
  </View>

  );
}

export default Dashboard
