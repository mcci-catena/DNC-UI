// Module: Background
//
// Function:
//    Display the backcground image
//
// Version:
//    V1.0.0  Mon Feb 08 2021 10:15:00 muthup   Edit level 1
//
// Copyright notice:
//   This file copyright (C) 2020-2021 by
//
//       MCCI Corporation
//       3520 Krums Corners Road
//        Ithaca, NY  14850
//
//   An unpublished work.  All rights reserved.
//
//   This file is proprietary information, and may not be disclosed or
//   copied without the prior permission of MCCI Corporation
//
// Author:
//   Muthupandi Pandiyaraj, MCCI Corporation March 2021
//


import React from 'react'
import {
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native'
import { theme } from '../core/theme'

const Background = ({ children }) => (
  
  <ImageBackground
  source={require('../assets/background.jpg')}
    //resizeMode="repeat"
    style={styles.background}
  >
    <KeyboardAvoidingView
      keyboardVerticalOffset={-500}
      style={styles.container}
      behavior="padding"
    >
     
      {children}
      
    </KeyboardAvoidingView>
    
  </ImageBackground>
  
)

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.colors.surface,
  },
  container: {
    flex: 1,
   
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default Background
