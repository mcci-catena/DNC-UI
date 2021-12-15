/*###############################################################################
// Module: Background.js
// 
// Function:
//      Function to export app bar
// 
// Version:
//    V1.01  Thu July 13 2021 14:30:00  muthup   Edit level 1
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
// 
//  Revision history:
//       1.01 Thu July 13 2021 14:30:00 muthup
//       Module created.
###############################################################################*/

import React from 'react'
import { ImageBackground,StyleSheet,KeyboardAvoidingView} from 'react-native'
import { theme } from '../core/theme'

//Define the background image function
const Background = ({ children }) => (
  <ImageBackground source={require('../assets/background.jpg')} style={styles.background}>
    <KeyboardAvoidingView keyboardVerticalOffset={-500} style={styles.container} behavior="padding">
     {children}
    </KeyboardAvoidingView>
  </ImageBackground>
)

//initialize the style sheet
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
