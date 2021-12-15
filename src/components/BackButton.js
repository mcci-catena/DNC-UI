/*###############################################################################
// Module: BackButton.js
// 
// Function:
//      Function to export app bar
// 
// Version:
//    V1.01  Thu July 13 2021 10:30:00  muthup   Edit level 1
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
//       1.01 Wed Thu July 13 2021 10:30:00 muthup
//       Module created.
###############################################################################*/

import React from 'react'
import { TouchableOpacity, Image, StyleSheet } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'

//Declare back button function
const BackButton = ({ goBack }) => (
  <TouchableOpacity onPress={goBack} style={styles.container}>
    <Image style={styles.image} source={require('../assets/arrow_back.png')} />
  </TouchableOpacity>
)

//Initialize the style sheet
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10 + getStatusBarHeight(),
    left: 4,
  },
  image: {
    width: 24,
    height: 24,
    
  },
})

export default BackButton
